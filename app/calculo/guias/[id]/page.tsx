import { notFound } from "next/navigation";
import Link from "next/link";
import { loadGuiaById } from "@/lib/parser";
import { ensureExerciseExists, getExercisesByGuia } from "@/lib/db";
import { mdToHtml } from "@/lib/markdown";
import { ChevronLeft } from "lucide-react";
import { StatusBadge } from "@/components/StatusDot";
import ExerciseModal from "@/components/ExerciseModal";
import type { ExerciseRow } from "@/lib/db";
import type { ParsedExercise } from "@/lib/parser";

interface Props {
  params: { id: string };
}

export default async function GuiaPage({ params }: Props) {
  const guia = loadGuiaById(params.id);
  if (!guia) notFound();

  // Ensure all exercises exist in DB
  for (const ex of guia.exercises) {
    ensureExerciseExists(ex.id, ex.guiaId, ex.number);
  }

  const rows = getExercisesByGuia(guia.id);
  const rowMap = new Map(rows.map((r) => [r.id, r]));

  // Pre-render all exercise markdown
  const htmlMap = new Map<string, string>();
  for (const ex of guia.exercises) {
    htmlMap.set(ex.id, await mdToHtml(ex.rawMarkdown));
  }

  const total = guia.exercises.length;
  const hechos = rows.filter((r) => r.status === "hecho").length;
  const pct = total > 0 ? Math.round((hechos / total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/calculo/guias"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Guías
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{guia.titulo}</h1>
            <p className="text-slate-500 mt-1">
              {total} ejercicios · {hechos} completados
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-blue-500">{pct}%</div>
            <div className="text-xs text-slate-400">completado</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {guia.exercises.map((ex) => {
          const row = rowMap.get(ex.id);
          const status = row?.status ?? "pendiente";
          const html = htmlMap.get(ex.id) ?? "";

          return (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              row={row}
              status={status as "pendiente" | "revision" | "hecho"}
              html={html}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Exercise card ─────────────────────────────────────────────────────────────

function ExerciseCard({
  exercise,
  row,
  status,
  html,
}: {
  exercise: ParsedExercise;
  row: ExerciseRow | undefined;
  status: "pendiente" | "revision" | "hecho";
  html: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
            {exercise.number}
          </div>
          <div>
            <span className="text-sm font-medium text-slate-700">
              Ejercicio {exercise.number}
            </span>
            <span className="ml-2 text-xs text-slate-400 capitalize">
              {exercise.meta.tipo}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <ExerciseModal
            exercise={exercise}
            row={row}
            html={html}
          />
        </div>
      </div>
    </div>
  );
}
