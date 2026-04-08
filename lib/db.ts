import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "study.db");

// Ensure data dir exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id              TEXT PRIMARY KEY,
      guia_id         TEXT NOT NULL,
      exercise_number INTEGER,
      status          TEXT DEFAULT 'pendiente',
      my_answer       TEXT,
      attempts        INTEGER DEFAULT 0,
      last_attempt_at TEXT,
      ai_feedback     TEXT
    );
  `);
}

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Queries ──────────────────────────────────────────────────────────────────

export function getExercise(id: string): ExerciseRow | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM exercises WHERE id = ?")
    .get(id) as ExerciseRow | undefined;
}

export function getExercisesByGuia(guiaId: string): ExerciseRow[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT * FROM exercises WHERE guia_id = ? ORDER BY exercise_number ASC"
    )
    .all(guiaId) as ExerciseRow[];
}

export function getAllExercises(): ExerciseRow[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM exercises ORDER BY guia_id, exercise_number ASC")
    .all() as ExerciseRow[];
}

export function upsertExercise(row: Partial<ExerciseRow> & { id: string; guia_id: string }): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO exercises (id, guia_id, exercise_number, status, my_answer, attempts, last_attempt_at, ai_feedback)
    VALUES (@id, @guia_id, @exercise_number, @status, @my_answer, @attempts, @last_attempt_at, @ai_feedback)
    ON CONFLICT(id) DO UPDATE SET
      status          = COALESCE(excluded.status, status),
      my_answer       = COALESCE(excluded.my_answer, my_answer),
      attempts        = COALESCE(excluded.attempts, attempts),
      last_attempt_at = COALESCE(excluded.last_attempt_at, last_attempt_at),
      ai_feedback     = COALESCE(excluded.ai_feedback, ai_feedback)
  `).run({
    id: row.id,
    guia_id: row.guia_id,
    exercise_number: row.exercise_number ?? null,
    status: row.status ?? "pendiente",
    my_answer: row.my_answer ?? null,
    attempts: row.attempts ?? 0,
    last_attempt_at: row.last_attempt_at ?? null,
    ai_feedback: row.ai_feedback ?? null,
  });
}

export function updateExerciseStatus(
  id: string,
  status: ExerciseRow["status"],
  answer?: string,
  aiFeedback?: string
): void {
  const db = getDb();
  db.prepare(`
    UPDATE exercises
    SET status          = @status,
        my_answer       = COALESCE(@answer, my_answer),
        attempts        = attempts + 1,
        last_attempt_at = @now,
        ai_feedback     = COALESCE(@aiFeedback, ai_feedback)
    WHERE id = @id
  `).run({
    id,
    status,
    answer: answer ?? null,
    aiFeedback: aiFeedback ?? null,
    now: new Date().toISOString(),
  });
}

export function ensureExerciseExists(
  id: string,
  guiaId: string,
  exerciseNumber: number
): void {
  const db = getDb();
  db.prepare(`
    INSERT OR IGNORE INTO exercises (id, guia_id, exercise_number)
    VALUES (?, ?, ?)
  `).run(id, guiaId, exerciseNumber);
}
