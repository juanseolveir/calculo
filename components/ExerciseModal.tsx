"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MathContent from "@/components/MathContent";
import { StatusBadge, type Status } from "@/components/StatusDot";
import { updateExerciseAction, markDoneAction } from "@/app/actions";
import type { ParsedExercise } from "@/lib/parser";
import type { ExerciseRow } from "@/lib/db";
import {
  CheckCircle2,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";

interface Props {
  exercise: ParsedExercise;
  row: ExerciseRow | undefined;
  html: string;
}

export default function ExerciseModal({ exercise, row, html }: Props) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(row?.my_answer ?? "");
  const [status, setStatus] = useState<Status>(
    (row?.status as Status) ?? "pendiente"
  );
  const [feedback, setFeedback] = useState(row?.ai_feedback ?? "");
  const [attempts, setAttempts] = useState(row?.attempts ?? 0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isMarkingDone, startMarkDone] = useTransition();

  const isDesarrollo = exercise.meta.tipo === "desarrollo";

  function handleVerify() {
    startTransition(async () => {
      const result = await updateExerciseAction(
        exercise.id,
        exercise.guiaId,
        exercise.meta.tipo,
        exercise.meta.respuesta,
        answer
      );
      setStatus(result.status as Status);
      setFeedback(result.feedback ?? "");
      setAttempts((a) => a + 1);
    });
  }

  function handleMarkDone() {
    startMarkDone(async () => {
      await markDoneAction(exercise.id, exercise.guiaId);
      setStatus("hecho");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:border-blue-300 hover:text-blue-600 transition-colors">
        <BookOpen className="w-3.5 h-3.5" />
        Abrir
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Ejercicio {exercise.number}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-1 rounded-full">
                {exercise.meta.tipo}
              </span>
              <StatusBadge status={status} />
            </div>
          </div>
        </DialogHeader>

        {/* Enunciado */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 my-2">
          <MathContent html={html} className="text-slate-800 [&_p]:my-2 [&_.katex-display]:my-3" />
        </div>

        {/* Answer input */}
        <div className="space-y-3">
          {isDesarrollo ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tu respuesta
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                placeholder="Escribí tu desarrollo aquí..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tu respuesta
              </label>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Escribí el valor numérico..."
                className="rounded-xl border-slate-200 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              onClick={handleVerify}
              disabled={isPending || !answer.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verificar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleMarkDone}
              disabled={isMarkingDone || status === "hecho"}
              className="rounded-xl border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
            >
              {isMarkingDone ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Marcar hecho
            </Button>

            {attempts > 0 && (
              <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                {attempts} {attempts === 1 ? "intento" : "intentos"}
              </span>
            )}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <FeedbackBox feedback={feedback} status={status} />
        )}

        {/* Show answer toggle */}
        <div className="border-t border-slate-100 pt-4 mt-2">
          <button
            onClick={() => setShowAnswer((v) => !v)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showAnswer ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {showAnswer ? "Ocultar respuesta" : "Ver respuesta modelo"}
          </button>

          {showAnswer && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <span className="font-medium block mb-1">Respuesta modelo:</span>
              {exercise.meta.respuesta}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Feedback box ──────────────────────────────────────────────────────────────

function FeedbackBox({
  feedback,
  status,
}: {
  feedback: string;
  status: Status;
}) {
  const styles: Record<Status, string> = {
    hecho: "bg-emerald-50 border-emerald-200 text-emerald-800",
    revision: "bg-yellow-50 border-yellow-200 text-yellow-800",
    pendiente: "bg-slate-50 border-slate-200 text-slate-700",
  };

  const titles: Record<Status, string> = {
    hecho: "✅ ¡Correcto!",
    revision: "🟡 Respuesta parcial",
    pendiente: "💬 Feedback",
  };

  return (
    <div className={`rounded-xl border p-4 text-sm ${styles[status]}`}>
      <p className="font-semibold mb-1">{titles[status]}</p>
      <p className="leading-relaxed whitespace-pre-wrap">{feedback}</p>
    </div>
  );
}
