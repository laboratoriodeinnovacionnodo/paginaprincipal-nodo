#!/usr/bin/env bash
# =============================================================================
# restore-chatbot-widget.sh — ciudadano-front
# Regenera el widget flotante de chat con IA (botón abajo a la derecha + modal)
# tal como estaba: componente, endpoint API, import en layout y botón en home.
# Ejecutar desde la raíz del repo ciudadano-front: bash restore-chatbot-widget.sh
# =============================================================================
set -euo pipefail

mkdir -p components/chatbot
mkdir -p app/api/chat

# -----------------------------------------------------------------------------
# components/chatbot/chatbot-widget.tsx
# -----------------------------------------------------------------------------
echo "♻️  Restaurando components/chatbot/chatbot-widget.tsx..."

cat > components/chatbot/chatbot-widget.tsx << 'EOF'
"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface GroqMessage {
  role: "user" | "assistant"
  content: string
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy el asistente virtual del Nodo Tecnológico. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [conversationHistory, setConversationHistory] = useState<GroqMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true)
    window.addEventListener("open-chatbot", handleOpenChatbot)
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userText = inputValue.trim()

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
      timestamp: new Date(),
    }

    const newHistory: GroqMessage[] = [
      ...conversationHistory,
      { role: "user", content: userText },
    ]

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()

      if (data.response) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        setConversationHistory([
          ...newHistory,
          { role: "assistant", content: data.response },
        ])
      } else {
        throw new Error("Respuesta inválida")
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intentá nuevamente.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-xl bg-cyan-500 shadow-lg hover:shadow-xl hover:bg-cyan-700 transition-all duration-300 z-50 cursor-pointer"
        size="icon"
      >
        <Bot className="text-white" style={{ width: "75%", height: "75%" }} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px] h-[600px] max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden bg-gradient-to-b from-cyan-50 via-white to-blue-50">
          <DialogTitle className="sr-only">Asistente Virtual del Nodo Tecnológico</DialogTitle>

          <div className="px-4 pt-2 pb-1 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-cyan-100 flex items-center justify-center rounded-full">
                <Bot className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Asistente Virtual</h2>
                <p className="text-xs text-gray-500">Nodo Tecnológico</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4 py-4" ref={scrollAreaRef}>
              <div className="space-y-4 pb-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-cyan-400 text-white rounded-br-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 rounded-bl-sm">
                      <div className="flex items-center gap-1">
                        {[0, 150, 300].map((delay) => (
                          <span
                            key={delay}
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          <div className="border-t border-cyan-100 p-4 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-3"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu mensaje..."}
                disabled={isLoading}
                className="flex-1 bg-white border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl disabled:opacity-50 h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
EOF

# -----------------------------------------------------------------------------
# app/api/chat/route.ts
# -----------------------------------------------------------------------------
echo "♻️  Restaurando app/api/chat/route.ts..."

cat > app/api/chat/route.ts << 'EOF'
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
EOF

# -----------------------------------------------------------------------------
# app/layout.tsx — asegurar import + render de <ChatbotWidget />
# -----------------------------------------------------------------------------
echo "♻️  Verificando app/layout.tsx..."

if ! grep -q 'components/chatbot/chatbot-widget' app/layout.tsx; then
  perl -0777 -pi -e 's/(import \{ StructuredData \} from "\@\/components\/seo\/structured-data"\n)/$1import { ChatbotWidget } from "\@\/components\/chatbot\/chatbot-widget"\n/' app/layout.tsx
  echo "   → import agregado"
else
  echo "   → import ya presente"
fi

if ! grep -q '<ChatbotWidget />' app/layout.tsx; then
  perl -0777 -pi -e 's/(<\/AuthProvider>)/  <ChatbotWidget \/>\n        $1/' app/layout.tsx
  echo "   → render agregado antes de </AuthProvider>"
else
  echo "   → render ya presente"
fi

# -----------------------------------------------------------------------------
# components/home/contacto-section.tsx — asegurar botón "Consultarle a la IA"
# -----------------------------------------------------------------------------
echo "♻️  Verificando components/home/contacto-section.tsx..."

if ! grep -q 'handleOpenChatbot' components/home/contacto-section.tsx; then
  echo "   ⚠️  No se encontró handleOpenChatbot. Restaurando archivo completo..."
  cat > components/home/contacto-section.tsx << 'EOF'
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export function ContactoSection() {
  const handleOpenChatbot = () => {
    const event = new CustomEvent("open-chatbot")
    window.dispatchEvent(event)
  }

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-28.47661266945215,-65.78625572883533"
  const whatsappUrl = "https://wa.me/5493834567890" // Reemplazar con el número real
  const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=info@nodotecnologico.edu.ar"

  return (
    <section id="contacto" className="pt-20 relative">
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Listo para <span className="text-primary">empezar?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Contáctanos para más información sobre nuestros cursos y programas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Dirección</h3>
                  <p className="text-sm text-muted-foreground">
                    Nodo Tecnológico
                    <br />
                    Catamarca, Argentina
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">info@nodotecnologico.edu.ar</p>
                </CardContent>
              </Card>
            </a>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Teléfono</h3>
                  <p className="text-sm text-muted-foreground">+54 (383) 123-4567</p>
                </CardContent>
              </Card>
            </a>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" onClick={handleOpenChatbot}>
              Consultarle a la IA
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" />
    </section>
  )
}
EOF
else
  echo "   → ya tiene handleOpenChatbot, no se toca"
fi

echo ""
echo "✅ ChatbotWidget restaurado (componente + endpoint + layout + botón home)."
echo ""
echo "⚠️  Revisar que estén seteadas las env vars (build-time):"
echo "   NEXT_GROQ_API_KEY"
echo "   NEXT_GROQ_MODEL"
echo ""
echo "▶️  Corré 'pnpm build' para confirmar que compila limpio."