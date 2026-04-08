import { createClient, type Client } from "@libsql/client";

// ── Client singleton ──────────────────────────────────────────────────────────
// - Production (Vercel): uses TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
// - Development (local): uses a local file via libsql file: protocol

let _client: Client | null = null;

function getClient(): Client {
  if (_client) return _client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && authToken && !url.includes("your-db-name")) {
    // Turso cloud — use https:// protocol for better serverless compatibility
    const httpUrl = url.replace(/^libsql:\/\//, "https://");
    _client = createClient({ url: httpUrl, authToken });
  } else {
    // Local file fallback for development
    _client = createClient({ url: "file:data/study.db" });
  }

  return _client;
}

// ── Schema init ───────────────────────────────────────────────────────────────

let schemaInitialized = false;

async function ensureSchema(): Promise<void> {
  if (schemaInitialized) return;
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS exercises (
      id              TEXT PRIMARY KEY,
      guia_id         TEXT NOT NULL,
      exercise_number INTEGER,
      status          TEXT DEFAULT 'pendiente',
      my_answer       TEXT,
      attempts        INTEGER DEFAULT 0,
      last_attempt_at TEXT,
      ai_feedback     TEXT
    )
  `);
  schemaInitialized = true;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ExerciseRow {
  id: string;
  guia_id: string;
  exercise_number: number;
  status: "pendiente" | "revision" | "hecho";
  my_answer: string | null;
  attempts: number;
  last_attempt_at: string | null;
  ai_feedback: string | null;
}

// ── Safe wrapper ──────────────────────────────────────────────────────────────
// Returns a fallback value instead of crashing if DB is unreachable.

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[DB] Query failed:", err instanceof Error ? err.message : err);
    return fallback;
  }
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getExercise(id: string): Promise<ExerciseRow | undefined> {
  return safeQuery(async () => {
    await ensureSchema();
    const db = getClient();
    const res = await db.execute({ sql: "SELECT * FROM exercises WHERE id = ?", args: [id] });
    return res.rows[0] as unknown as ExerciseRow | undefined;
  }, undefined);
}

export async function getExercisesByGuia(guiaId: string): Promise<ExerciseRow[]> {
  return safeQuery(async () => {
    await ensureSchema();
    const db = getClient();
    const res = await db.execute({
      sql: "SELECT * FROM exercises WHERE guia_id = ? ORDER BY exercise_number ASC",
      args: [guiaId],
    });
    return res.rows as unknown as ExerciseRow[];
  }, []);
}

export async function getAllExercises(): Promise<ExerciseRow[]> {
  return safeQuery(async () => {
    await ensureSchema();
    const db = getClient();
    const res = await db.execute(
      "SELECT * FROM exercises ORDER BY guia_id, exercise_number ASC"
    );
    return res.rows as unknown as ExerciseRow[];
  }, []);
}

export async function ensureExerciseExists(
  id: string,
  guiaId: string,
  exerciseNumber: number
): Promise<void> {
  return safeQuery(async () => {
    await ensureSchema();
    const db = getClient();
    await db.execute({
      sql: "INSERT OR IGNORE INTO exercises (id, guia_id, exercise_number) VALUES (?, ?, ?)",
      args: [id, guiaId, exerciseNumber],
    });
  }, undefined);
}

export async function updateExerciseStatus(
  id: string,
  status: ExerciseRow["status"],
  answer?: string,
  aiFeedback?: string
): Promise<void> {
  return safeQuery(async () => {
    await ensureSchema();
    const db = getClient();
    await db.execute({
      sql: `
        UPDATE exercises
        SET status          = ?,
            my_answer       = COALESCE(?, my_answer),
            attempts        = attempts + 1,
            last_attempt_at = ?,
            ai_feedback     = COALESCE(?, ai_feedback)
        WHERE id = ?
      `,
      args: [status, answer ?? null, new Date().toISOString(), aiFeedback ?? null, id],
    });
  }, undefined);
}

export async function upsertExercise(
  row: Partial<ExerciseRow> & { id: string; guia_id: string }
): Promise<void> {
  return safeQuery(async () => {
    await ensureSchema();
    const db = getClient();
    await db.execute({
      sql: `
        INSERT INTO exercises (id, guia_id, exercise_number, status, my_answer, attempts, last_attempt_at, ai_feedback)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          status          = COALESCE(excluded.status, status),
          my_answer       = COALESCE(excluded.my_answer, my_answer),
          attempts        = COALESCE(excluded.attempts, attempts),
          last_attempt_at = COALESCE(excluded.last_attempt_at, last_attempt_at),
          ai_feedback     = COALESCE(excluded.ai_feedback, ai_feedback)
      `,
      args: [
        row.id, row.guia_id, row.exercise_number ?? null,
        row.status ?? "pendiente", row.my_answer ?? null,
        row.attempts ?? 0, row.last_attempt_at ?? null, row.ai_feedback ?? null,
      ],
    });
  }, undefined);
}
