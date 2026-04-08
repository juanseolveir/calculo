export const dynamic = "force-dynamic";

import Link from "next/link";
import { loadAllGuias } from "@/lib/parser";
import { getAllExercises, getExercisesByGuia } from "@/lib/db";
import { StatusDot } from "@/components/StatusDot";
import { ChevronRight, Target, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const TEMA_LABELS: Record<string, string> = {
  limites: "Límites",
  continuidad: "Continuidad",
  derivadas: "Derivadas",
  integrales: "Integrales",
};

export default async function DashboardPage() {
  const guias = loadAllGuias();
  const allRows = await getAllExercises();

  const totalExercises = allRows.length;
  const hechos = allRows.filter((r) => r.status === "hecho").length;
  const revision = allRows.filter((r) => r.status === "revision").length;
  const pendientes = allRows.filter((r) => r.status === "pendiente").length;
  const globalPct = totalExercises > 0 ? Math.round((hechos / totalExercises) * 100) : 0;

  // Fetch per-guía rows concurrently
  const guiaData = await Promise.all(
    guias.map(async (guia) => {
      const rows = await getExercisesByGuia(guia.id);
      return { guia, rows };
    })
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-500">Tu progreso en Cálculo I</p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard value={`${globalPct}%`} label="Completado" color="text-blue-500" icon={<TrendingUp className="w-5 h-5" />} bg="bg-blue-50 border-blue-100" />
        <StatCard value={hechos} label="Completados" color="text-emerald-600" icon={<CheckCircle2 className="w-5 h-5" />} bg="bg-emerald-50 border-emerald-100" />
        <StatCard value={revision} label="En revisión" color="text-yellow-600" icon={<Clock className="w-5 h-5" />} bg="bg-yellow-50 border-yellow-100" />
        <StatCard value={pendientes} label="Pendientes" color="text-red-500" icon={<Target className="w-5 h-5" />} bg="bg-red-50 border-red-100" />
      </div>

      {/* Global progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Progreso global</span>
          <span className="text-sm font-bold text-blue-500">{globalPct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all bg-blue-500"
            style={{ width: `${globalPct}%` }}
          />
        </div>
        <div className="flex gap-5 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><StatusDot status="hecho" size="sm" /> {hechos} hechos</span>
          <span className="flex items-center gap-1.5"><StatusDot status="revision" size="sm" /> {revision} en revisión</span>
          <span className="flex items-center gap-1.5"><StatusDot status="pendiente" size="sm" /> {pendientes} pendientes</span>
        </div>
      </div>

      {/* Per-guía breakdown */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 mb-4">Progreso por guía</h2>
        <div className="space-y-3">
          {guiaData.map(({ guia, rows }) => {
            const total = guia.exercises.length;
            const done = rows.filter((r) => r.status === "hecho").length;
            const rev = rows.filter((r) => r.status === "revision").length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                key={guia.id}
                href={`/calculo/guias/${guia.id}`}
                className="group flex items-center gap-5 bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-slate-800 text-sm">{guia.titulo}</span>
                      <span className="ml-2 text-xs text-slate-400">{TEMA_LABELS[guia.tema] ?? guia.tema}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{done}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><StatusDot status="hecho" size="sm" /> {done}</span>
                    <span className="flex items-center gap-1"><StatusDot status="revision" size="sm" /> {rev}</span>
                    <span className="flex items-center gap-1"><StatusDot status="pendiente" size="sm" /> {total - done - rev}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-lg font-bold text-blue-500">{pct}%</div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color, icon, bg }: { value: number | string; label: string; color: string; icon: React.ReactNode; bg: string }) {
  return (
    <div className={`bg-white rounded-xl border p-5 flex flex-col gap-3 ${bg}`}>
      <div className={color}>{icon}</div>
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
