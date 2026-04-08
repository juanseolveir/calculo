"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MathContent from "@/components/MathContent";
import { Search, ChevronDown, ChevronUp, Library } from "lucide-react";

const TEMA_LABELS: Record<string, string> = {
  limites: "Límites",
  continuidad: "Continuidad",
  derivadas: "Derivadas",
  integrales: "Integrales",
};

interface RenderedTeorema {
  id: string;
  tema: string;
  titulo: string;
  tituloArchivo: string;
  html: string;
  tags: string[];
}

interface Props {
  teoremas: RenderedTeorema[];
  temas: string[];
}

export default function TeoremasClient({ teoremas, temas }: Props) {
  const [search, setSearch] = useState("");
  const [activeTema, setActiveTema] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return teoremas.filter((t) => {
      const matchTema = !activeTema || t.tema === activeTema;
      const matchSearch =
        !q ||
        t.titulo.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q)) ||
        t.html.toLowerCase().includes(q);
      return matchTema && matchSearch;
    });
  }, [teoremas, search, activeTema]);

  // Group filtered teoremas by tituloArchivo
  const grouped = useMemo(() => {
    const map = new Map<string, RenderedTeorema[]>();
    for (const t of filtered) {
      if (!map.has(t.tituloArchivo)) map.set(t.tituloArchivo, []);
      map.get(t.tituloArchivo)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Teoremas</h1>
        <p className="text-slate-500">
          {teoremas.length} teoremas · expandí cada uno para ver la
          demostración.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar teorema..."
            className="pl-9 rounded-xl border-slate-200"
          />
        </div>

        {/* Tema filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTema(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeTema
                ? "bg-blue-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
            }`}
          >
            Todos
          </button>
          {temas.map((tema) => (
            <button
              key={tema}
              onClick={() => setActiveTema(activeTema === tema ? null : tema)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTema === tema
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              {TEMA_LABELS[tema] ?? tema}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Library className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No se encontraron teoremas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([grupo, items]) => (
            <div key={grupo}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                  {grupo}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-2">
                {items.map((teorema) => {
                  const isOpen = expanded.has(teorema.id);
                  return (
                    <div
                      key={teorema.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all"
                    >
                      {/* Card header (clickable) */}
                      <button
                        onClick={() => toggleExpand(teorema.id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                          <span className="font-medium text-slate-800 text-sm truncate">
                            {teorema.titulo}
                          </span>
                          <div className="hidden sm:flex gap-1.5 flex-wrap">
                            {teorema.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-2 py-0 bg-slate-100 text-slate-500 border-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                        )}
                      </button>

                      {/* Expanded body */}
                      {isOpen && (
                        <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/50">
                          <MathContent
                            html={teorema.html}
                            className="text-slate-700 [&_strong]:text-slate-900 [&_p]:my-2 [&_.katex-display]:my-4 [&_hr]:my-4 [&_hr]:border-slate-200"
                          />
                          {teorema.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-200">
                              {teorema.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-blue-50 text-blue-600 border border-blue-100"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
