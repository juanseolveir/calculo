import { loadAllTeoremas } from "@/lib/parser";
import { mdToHtml } from "@/lib/markdown";
import TeoremasClient from "@/components/TeoremasClient";

export default async function TeoremasPage() {
  const teoremas = loadAllTeoremas();

  // Pre-render markdown for all teoremas
  const rendered = await Promise.all(
    teoremas.map(async (t) => ({
      ...t,
      html: await mdToHtml(t.rawMarkdown),
    }))
  );

  // Collect all unique temas
  const temas = Array.from(new Set(teoremas.map((t) => t.tema))).sort();

  return <TeoremasClient teoremas={rendered} temas={temas} />;
}
