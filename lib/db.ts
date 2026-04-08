/**
 * DB layer — uses Turso's HTTP pipeline API directly in production,
 * and @libsql/client with a local file in development.
 *
 * This avoids the resp.body?.cancel bug in @libsql/hrana-client.
 */

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

type SqlArg = string | number | null;

// ── Turso HTTP client ─────────────────────────────────────────────────────────

interface TursoResult {
  cols: { name: string }[];
  rows: (string | number | null)[][];
  affected_row_count: number;
}

async function tursoQuery(
  sql: string,
  args: SqlArg[] = []
): Promise<TursoResult> {
  const url = process.env.TURSO_DATABASE_URL!.replace(/^libsql:\/\//, "https://");
  const token = process.env.TURSO_AUTH_TOKEN!;

  const body = {
    requests: [
      {
        type: "execute",
        stmt: {
          sql,
          args: args.map((a) =>
            a === null
              ? { type: "null" }
              : typeof a === "number"
              ? { type: "integer", value: String(a) }
              : { type: "text", value: String(a) }
          ),
        },
      },
      { type: "close" },
    ],
  };

  const res = await fetch(`${url}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  const first = data.results?.[0];
  if (first?.type === "error") {
    throw new Error(`Turso error: ${first.error?.message}`);
  }

  return first?.response?.result ?? { cols: [], rows: [], affected_row_count: 0 };
}

function rowsToObjects(result: TursoResult): Record<string, SqlArg>[] {
  return result.rows.map((row) =>
    Object.fromEntries(result.cols.map((col, i) => [col.name, row[i]]))
  );
}

// ── Local SQLite fallback (dev) ───────────────────────────────────────────────

import { createClient, type Client } from "@libsql/client";

let _localClient: Client | null = null;

function getLocalClient(): Client {
  if (_localClient) return _localClient;
  _localClient = createClient({ url: "file:data/study.db" });
  return _localClient;
}

async function localQuery(sql: string, args: SqlArg[] = []): Promise<TursoResult> {
  const db = getLocalClient();
  const res = await db.execute({ sql, args });
  return {
    cols: res.columns.map((name) => ({ name })),
    rows: res.rows.map((r) => Array.from(r) as SqlArg[]),
    affected_row_count: res.rowsAffected,
  };
}

// ── Unified query function ────────────────────────────────────────────────────

function isCloud(): boolean {
  const url = process.env.TURSO_DATABASE_URL ?? "";
  const token = process.env.TURSO_AUTH_TOKEN ?? "";
  return !!url && !!token && !url.includes("your-db-name");
}

async function query(sql: string, args: SqlArg[] = []): Promise<TursoResult> {
  if (isCloud()) return tursoQuery(sql, args);
  return localQuery(sql, args);
}

// ── Schema init ───────────────────────────────────────────────────────────────

let schemaReady = false;

async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  await query(`
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
  schemaReady = true;
}

// ── Safe wrapper ──────────────────────────────────────────────────────────────

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[DB]", err instanceof Error ? err.message : err);
    return fallback;
  }
}

// ── Public queries ────────────────────────────────────────────────────────────

export async function getExercisesByGuia(guiaId: string): Promise<ExerciseRow[]> {
  return safe(async () => {
    await ensureSchema();
    const res = await query(
      "SELECT * FROM exercises WHERE guia_id = ? ORDER BY exercise_number ASC",
      [guiaId]
    );
    return rowsToObjects(res) as unknown as ExerciseRow[];
  }, []);
}

export async function getAllExercises(): Promise<ExerciseRow[]> {
  return safe(async () => {
    await ensureSchema();
    const res = await query(
      "SELECT * FROM exercises ORDER BY guia_id, exercise_number ASC"
    );
    return rowsToObjects(res) as unknown as ExerciseRow[];
  }, []);
}

export async function ensureExerciseExists(
  id: string,
  guiaId: string,
  exerciseNumber: number
): Promise<void> {
  return safe(async () => {
    await ensureSchema();
    await query(
      "INSERT OR IGNORE INTO exercises (id, guia_id, exercise_number) VALUES (?, ?, ?)",
      [id, guiaId, exerciseNumber]
    );
  }, undefined);
}

export async function updateExerciseStatus(
  id: string,
  status: ExerciseRow["status"],
  answer?: string,
  aiFeedback?: string
): Promise<void> {
  return safe(async () => {
    await ensureSchema();
    await query(
      `UPDATE exercises
       SET status          = ?,
           my_answer       = COALESCE(?, my_answer),
           attempts        = attempts + 1,
           last_attempt_at = ?,
           ai_feedback     = COALESCE(?, ai_feedback)
       WHERE id = ?`,
      [status, answer ?? null, new Date().toISOString(), aiFeedback ?? null, id]
    );
  }, undefined);
}

export async function upsertExercise(
  row: Partial<ExerciseRow> & { id: string; guia_id: string }
): Promise<void> {
  return safe(async () => {
    await ensureSchema();
    await query(
      `INSERT INTO exercises (id, guia_id, exercise_number, status, my_answer, attempts, last_attempt_at, ai_feedback)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         status          = COALESCE(excluded.status, status),
         my_answer       = COALESCE(excluded.my_answer, my_answer),
         attempts        = COALESCE(excluded.attempts, attempts),
         last_attempt_at = COALESCE(excluded.last_attempt_at, last_attempt_at),
         ai_feedback     = COALESCE(excluded.ai_feedback, ai_feedback)`,
      [
        row.id, row.guia_id, row.exercise_number ?? null,
        row.status ?? "pendiente", row.my_answer ?? null,
        row.attempts ?? 0, row.last_attempt_at ?? null, row.ai_feedback ?? null,
      ]
    );
  }, undefined);
}
