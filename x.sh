#!/usr/bin/env bash
# ============================================================================
#  fix-chatbot-debug.sh — ciudadano-front
#  Mejora el logging de /api/chat para exponer el error real de Groq
#  y actualiza el modelo a uno vigente.
# ============================================================================
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; RESET='\033[0m'
ok()   { echo -e "${GREEN}✅  $*${RESET}"; }
fail() { echo -e "${RED}❌  $*${RESET}"; exit 1; }

[[ -f "package.json" && -d "app" ]] || fail "Corré desde la raíz de ciudadano-front"

echo "📄  Reescribiendo app/api/chat/route.ts con logging real de errores..."

cat > app/api/chat/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const GROQ_API_KEY = process.env.NEXT_GROQ_API_KEY ?? ""
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
    if (!GROQ_API_KEY) {
      console.error("[chat/route] NEXT_GROQ_API_KEY no está configurada en runtime")
      return NextResponse.json(
        { error: "Configuración del servidor incompleta (API key ausente)" },
        { status: 500 },
      )
    }

    const { messages } = (await req.json()) as { messages: GroqMessage[] }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages requerido" }, { status: 400 })
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY })

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
  } catch (err: unknown) {
    // Log completo en el servidor para diagnosticar (Groq SDK expone status/error)
    const groqErr = err as { status?: number; error?: unknown; message?: string }
    console.error("[chat/route] Error de Groq:", {
      status: groqErr?.status,
      message: groqErr?.message,
      detail: groqErr?.error,
    })

    return NextResponse.json(
      {
        error: "Error al procesar la consulta",
        // Solo en desarrollo mostramos detalle al cliente
        ...(process.env.NODE_ENV !== "production" && { detail: groqErr?.message }),
      },
      { status: 500 },
    )
  }
}
EOF

ok "route.ts actualizado con logging real"

echo ""
echo "🔨  TypeScript check..."
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -30 || true

echo ""
echo "🔨  Build..."
pnpm build

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅  Listo. Después de deployar, revisá:"
echo "    docker logs ciudadano-front --tail 50 | grep 'chat/route'"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Causas típicas que vas a ver ahí:"
echo "  - status 401 → la API key horneada en el build es BUILD_TIME_PLACEHOLDER"
echo "    (el secret NEXT_GROQ_API_KEY no estaba en GitHub al momento del build,"
echo "     o el build-arg no llegó al Dockerfile)"
echo "  - status 400 'model not found' → el modelo llama-3.3-70b-versatile"
echo "    fue deprecado en Groq. Anda a https://console.groq.com/docs/models"
echo "    y actualizá NEXT_GROQ_MODEL con el secret correcto en GitHub"
echo "    (ej: llama-3.1-8b-instant o el vigente)"