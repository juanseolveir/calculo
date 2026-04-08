import Link from "next/link";
import { loadAllGuias } from "@/lib/parser";
import { getExercisesByGuia } from "@/lib/db";
import { FileText, ChevronRight } from "lucide-react";
import { StatusDot } from "@/components/StatusDot";

const TEMA_LABELS: Record<string, string> = {
  limites: "Límites",
  continuidad: "Continuidad",
  derivadas: "Derivadas",
  integrales: "Integrales",
};

export default function GuiasPage() {
  const guias = loadAllGuias();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Guías de ejercicios</h1>
        <p className="text-slate-500">Seleccioná una guía para ver y resolver sus ejercicios.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {guias.map((guia) => {
          const rows = getExercisesByGuia(guia.id);
          const total = guia.exercises.length;
          const hechos = rows.filter((r) => r.status === "hecho").length;
          const revision = rows.filter((r) => r.status === "revision").length;
          const pct = total > 0 ? Math.round((hechos / total) * 100) : 0;

          return (
            <Link
              key={guia.id}
              href={`/calculo/guias/${guia.id}`}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{guia.titulo}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {TEMA_LABELS[guia.tema] ?? guia.tema}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors mt-1" />
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>{hechos} / {total} completados</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Status summary */}
              <div className="flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <StatusDot status="hecho" size="sm" />
                  {hechos} hechos
                </span>
                <span className="flex items-center gap-1">
                  <StatusDot status="revision" size="sm" />
                  {revision} en revisión
                </span>
                <span className="flex items-center gap-1">
                  <StatusDot status="pendiente" size="sm" />
                  {total - hechos - revision} pendientes
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
