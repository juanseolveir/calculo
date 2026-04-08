import Link from "next/link";
import { BookOpen, TrendingUp, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-lg tracking-tight">
            Estudio
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center mb-12 max-w-xl">
          <p className="text-blue-500 font-medium text-sm uppercase tracking-widest mb-3">
            Plataforma de estudio
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Organizá tu{" "}
            <span className="text-blue-500">aprendizaje</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Seguí tu progreso, practicá ejercicios y revisá teoremas con
            feedback automático.
          </p>
        </div>

        {/* Subject cards */}
        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Cálculo I */}
          <Link
            href="/calculo"
            className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col gap-5"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Cálculo I
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Límites, continuidad, derivadas e integrales. Ejercicios con
                corrección automática y teoremas con KaTeX.
              </p>
            </div>

            <div className="flex items-center gap-2 text-blue-500 font-medium text-sm">
              Ir al módulo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Economía I */}
          <a
            href="/economia/index.html"
            className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col gap-5"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Economía I
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Clases magistrales y material de estudio con resúmenes y
                apuntes organizados.
              </p>
            </div>

            <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm">
              Ir al módulo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-5 text-center">
        <p className="text-slate-400 text-sm">Plataforma de estudio personal</p>
      </footer>
    </main>
  );
}
