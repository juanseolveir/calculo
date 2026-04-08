/**
 * Seed script: populates the DB with exercise rows from markdown files.
 * Run with: npx tsx scripts/seed.ts
 */
import { loadAllGuias } from "../lib/parser";
import { ensureExerciseExists, getDb } from "../lib/db";

function seed() {
  const db = getDb();
  const guias = loadAllGuias();

  console.log(`Found ${guias.length} guías.`);

  for (const guia of guias) {
    console.log(
      `  📖 ${guia.id} — "${guia.titulo}" (${guia.exercises.length} exercises)`
    );
    for (const ex of guia.exercises) {
      ensureExerciseExists(ex.id, ex.guiaId, ex.number);
    }
  }

  const total = db
    .prepare("SELECT COUNT(*) as count FROM exercises")
    .get() as { count: number };

  console.log(`\n✅ Seed complete. Total exercises in DB: ${total.count}`);
}

seed();
