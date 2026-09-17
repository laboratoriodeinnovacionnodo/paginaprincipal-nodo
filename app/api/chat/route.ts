import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.NEXT_GROQ_API_KEY || "BUILD_TIME_PLACEHOLDER",
})

const MODEL = process.env.NEXT_GROQ_MODEL || "llama-3.3-70b-versatile"

const SYSTEM_PROMPT = `Sos el asistente virtual del Nodo Tecnológico de Catamarca, un centro de innovación y educación digital de Argentina.
Tu rol es ayudar a los ciudadanos con información sobre:
- Cursos y talleres de tecnología, programación e inteligencia artificial
- El espacio de coworking y sus zonas disponibles
- El laboratorio de innovación y sus proyectos
- Eventos y actividades públicas del Nodo
- Cómo inscribirse o contactarse

Reglas:
- Respondé siempre en español argentino, de manera amigable, clara y concisa
- Si no sabés algo específico, decí que el ciudadano puede consultar en recepción o en el sitio web
- No inventes información. Sé honesto cuando no tenés datos
- Mantené las respuestas cortas (máximo 3-4 oraciones salvo que te pidan más detalle)
- No uses markdown con asteriscos — solo texto plano`

interface GroqMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: GroqMessage[] }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages requerido" }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 512,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content ?? "No pude generar una respuesta."

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("[chat/route]", err)
    return NextResponse.json(
      { error: "Error al procesar la consulta" },
      { status: 500 },
    )
  }
}
