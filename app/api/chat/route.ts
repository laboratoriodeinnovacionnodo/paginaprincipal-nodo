import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.NEXT_GROQ_API_KEY || "BUILD_TIME_PLACEHOLDER",
})

const SYSTEM_PROMPT = `Eres el asistente virtual del Nodo Tecnológico, un centro de innovación y educación digital en Argentina. 
Tu rol es ayudar a los usuarios con información sobre cursos, talleres, capacitaciones en programación, inteligencia artificial y tecnologías emergentes.
Respondé siempre en español argentino, de manera amigable, clara y concisa.
Si no sabés algo específico sobre el Nodo, ofrecé orientar al usuario para que contacte directamente al centro.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensajes inválidos" }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: process.env.NEXT_GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: "Sin respuesta del modelo" }, { status: 500 })
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Groq API error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
