"use server";

import { revalidatePath } from "next/cache";
import { updateExerciseStatus, ensureExerciseExists } from "@/lib/db";

// ── Numeric validator ─────────────────────────────────────────────────────────

function normalizeNum(s: string): string {
  return s.trim().toLowerCase().replace(/,/g, ".").replace(/\s/g, "");
}

function numericCheck(expected: string, given: string): boolean {
  const a = normalizeNum(expected);
  const b = normalizeNum(given);
  if (a === b) return true;
  // Float comparison with tolerance
  const fa = parseFloat(a);
  const fb = parseFloat(b);
  if (!isNaN(fa) && !isNaN(fb)) {
    return Math.abs(fa - fb) < 1e-4;
  }
  return false;
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function updateExerciseAction(
  id: string,
  guiaId: string,
  tipo: "numerico" | "desarrollo",
  respuestaModelo: string,
  myAnswer: string
): Promise<{ status: string; feedback: string }> {
  ensureExerciseExists(id, guiaId, 0);

  if (tipo === "numerico") {
    const correct = numericCheck(respuestaModelo, myAnswer);
    const status = correct ? "hecho" : "revision";
    const feedback = correct
      ? `¡Correcto! La respuesta es ${respuestaModelo}.`
      : `Incorrecto. Revisá tu cálculo. Respuesta esperada: ${respuestaModelo}.`;

    updateExerciseStatus(id, status, myAnswer, feedback);
    revalidatePath("/calculo");
    revalidatePath(`/calculo/guias/${guiaId}`);
    return { status, feedback };
  }

  // Desarrollo → call Gemini
  try {
    const result = await callGemini(respuestaModelo, myAnswer);
    updateExerciseStatus(id, result.status as "pendiente" | "revision" | "hecho", myAnswer, result.feedback);
    revalidatePath("/calculo");
    revalidatePath(`/calculo/guias/${guiaId}`);
    return result;
  } catch (err) {
    console.error("Gemini API error:", err);
    // Fallback: mark as revision
    const fallback = {
      status: "revision",
      feedback:
        "No se pudo conectar con el evaluador automático. Revisá tu respuesta manualmente.",
    };
    updateExerciseStatus(id, "revision", myAnswer, fallback.feedback);
    revalidatePath("/calculo");
    revalidatePath(`/calculo/guias/${guiaId}`);
    return fallback;
  }
}

export async function markDoneAction(id: string, guiaId: string): Promise<void> {
  ensureExerciseExists(id, guiaId, 0);
  updateExerciseStatus(id, "hecho", undefined, undefined);
  revalidatePath("/calculo");
  revalidatePath(`/calculo/guias/${guiaId}`);
}

// ── Gemini call ───────────────────────────────────────────────────────────────

async function callGemini(
  modelAnswer: string,
  studentAnswer: string
): Promise<{ status: string; feedback: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const prompt = `Sos un profesor de Cálculo I evaluando la respuesta de un estudiante.

RESPUESTA MODELO:
${modelAnswer}

RESPUESTA DEL ESTUDIANTE:
${studentAnswer}

Tu tarea:
1. Evaluar si la respuesta es CORRECTA, PARCIALMENTE CORRECTA o INCORRECTA comparada con la respuesta modelo.
2. Dar feedback constructivo en 2-4 oraciones en español.
3. Responder SOLO con este JSON (sin markdown, sin bloques de código):
{"calificacion": "correcto" | "parcial" | "incorrecto", "feedback": "..."}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid Gemini response format");

  const parsed = JSON.parse(jsonMatch[0]);
  const cal: string = parsed.calificacion ?? "incorrecto";
  const statusMap: Record<string, string> = {
    correcto: "hecho",
    parcial: "revision",
    incorrecto: "revision",
  };

  return {
    status: statusMap[cal] ?? "revision",
    feedback: parsed.feedback ?? "Sin feedback.",
  };
}
