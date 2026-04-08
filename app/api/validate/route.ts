import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/validate
 * Body: { modelAnswer: string, studentAnswer: string }
 * Returns: { calificacion: "correcto"|"parcial"|"incorrecto", feedback: string }
 */
export async function POST(req: NextRequest) {
  const { modelAnswer, studentAnswer } = await req.json();

  if (!modelAnswer || !studentAnswer) {
    return NextResponse.json(
      { error: "modelAnswer and studentAnswer are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const prompt = `Sos un profesor de Cálculo I evaluando la respuesta de un estudiante.

RESPUESTA MODELO:
${modelAnswer}

RESPUESTA DEL ESTUDIANTE:
${studentAnswer}

Tu tarea:
1. Evaluar si la respuesta es CORRECTA, PARCIALMENTE CORRECTA o INCORRECTA.
2. Dar feedback constructivo en 2-4 oraciones en español.
3. Responder SOLO con este JSON (sin bloques de código):
{"calificacion": "correcto" | "parcial" | "incorrecto", "feedback": "..."}`;

  try {
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
      return NextResponse.json({ error: `Gemini error: ${err}` }, { status: 502 });
    }

    const data = await response.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid Gemini response" }, { status: 502 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
