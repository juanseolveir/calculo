/**
 * Seed script: populates the DB with exercise rows from markdown files.
 *
 * Local dev (no env vars needed):
 *   npm run seed
 *
 * Turso cloud (set env vars first):
 *   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npm run seed
 */
import { loadAllGuias } from "../lib/parser";
import { ensureExerciseExists } from "../lib/db";
import { createClient } from "@libsql/client";

async function seed() {
  const guias = loadAllGuias();
  console.log(`Found ${guias.length} guías.\n`);

  for (const guia of guias) {
    console.log(`  📖 ${guia.id} — "${guia.titulo}" (${guia.exercises.length} exercises)`);
    for (const ex of guia.exercises) {
      await ensureExerciseExists(ex.id, ex.guiaId, ex.number);
    }
  }

  // Count
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = url && authToken
    ? createClient({ url, authToken })
    : createClient({ url: "file:data/study.db" });

  const res = await client.execute("SELECT COUNT(*) as count FROM exercises");
  const count = res.rows[0]?.count ?? 0;
  console.log(`\n✅ Seed complete. Total exercises in DB: ${count}`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
