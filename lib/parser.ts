import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ExerciseMeta {
  tipo: "numerico" | "desarrollo";
  respuesta: string;
}

export interface ParsedExercise {
  id: string;          // e.g. "guia-01-ex-1"
  guiaId: string;
  number: number;
  rawMarkdown: string; // markdown of the exercise body (without meta comment)
  meta: ExerciseMeta;
}

export interface ParsedGuia {
  id: string;
  titulo: string;
  tema: string;
  exercises: ParsedExercise[];
}

export interface ParsedTeoremaSectionTag {
  tags: string[];
}

export interface ParsedTeorema {
  id: string;          // slug from filename + section title
  fileId: string;      // filename without extension
  tema: string;
  titulo: string;      // section heading
  tituloArchivo: string; // frontmatter titulo
  rawMarkdown: string;
  tags: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const META_COMMENT_RE = /<!--\s*meta:\s*(\{[\s\S]*?\})\s*-->/;
const TAGS_RE = /\*\*Tags:\*\*\s*([^\n]+)/i;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Guías parser ─────────────────────────────────────────────────────────────

export function parseGuia(filePath: string): ParsedGuia {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const guiaId: string = data.id;
  const titulo: string = data.titulo;
  const tema: string = data.tema;

  // Split by "## Ejercicio N"
  const exerciseRegex = /^## Ejercicio (\d+)/gm;
  const splits: { number: number; start: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = exerciseRegex.exec(content)) !== null) {
    splits.push({ number: parseInt(match[1], 10), start: match.index });
  }

  const exercises: ParsedExercise[] = [];

  for (let i = 0; i < splits.length; i++) {
    const { number, start } = splits[i];
    const end = i + 1 < splits.length ? splits[i + 1].start : content.length;
    const block = content.slice(start, end).trim();

    // Extract and remove meta comment
    const metaMatch = block.match(META_COMMENT_RE);
    if (!metaMatch) continue;

    let meta: ExerciseMeta;
    try {
      meta = JSON.parse(metaMatch[1]);
    } catch {
      continue;
    }

    // Remove heading line and meta comment, keep the body
    const bodyLines = block
      .split("\n")
      .slice(1) // remove "## Ejercicio N" heading
      .join("\n")
      .replace(META_COMMENT_RE, "")
      .trim();

    exercises.push({
      id: `${guiaId}-ex-${number}`,
      guiaId,
      number,
      rawMarkdown: bodyLines,
      meta,
    });
  }

  return { id: guiaId, titulo, tema, exercises };
}

export function loadAllGuias(): ParsedGuia[] {
  const dir = path.join(process.cwd(), "data", "guias");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => parseGuia(path.join(dir, f)));
}

export function loadGuiaById(id: string): ParsedGuia | null {
  const guias = loadAllGuias();
  return guias.find((g) => g.id === id) ?? null;
}

// ── Teoremas parser ──────────────────────────────────────────────────────────

export function parseTeoremFile(filePath: string): ParsedTeorema[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const tema: string = data.tema;
  const tituloArchivo: string = data.titulo;
  const fileId = path.basename(filePath, ".md");

  // Split by "## " headings
  const sections = content.split(/^## /m).filter(Boolean);
  const result: ParsedTeorema[] = [];

  for (const section of sections) {
    const lines = section.trim().split("\n");
    const sectionTitle = lines[0].trim();
    const body = lines.slice(1).join("\n").trim();

    // Extract tags
    const tagsMatch = body.match(TAGS_RE);
    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((t) => t.trim().toLowerCase())
      : [];

    // Remove the tags line from body
    const cleanBody = body.replace(/^\*\*Tags:\*\*[^\n]*\n?/im, "").trim();

    result.push({
      id: `${fileId}-${slugify(sectionTitle)}`,
      fileId,
      tema,
      titulo: sectionTitle,
      tituloArchivo,
      rawMarkdown: cleanBody,
      tags,
    });
  }

  return result;
}

export function loadAllTeoremas(): ParsedTeorema[] {
  const dir = path.join(process.cwd(), "data", "teoremas");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .flatMap((f) => parseTeoremFile(path.join(dir, f)));
}
