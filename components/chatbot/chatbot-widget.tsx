"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, X } from "lucide-react"
import Image from "next/image"
import { SiriFrame, type SiriFrameState } from "@/components/chatbot/siri-frame"

// interface Message {
//   id: string
//   text: string
//   sender: "user" | "bot"
//   timestamp: Date
// }

// interface GroqMessage {
//   role: "user" | "assistant"
//   content: string
// }

// const SUGGESTIONS = [
//   "¿Qué cursos tienen disponibles?",
//   "Contame sobre el Nodo Tecnológico",
//   "¿Cómo me inscribo a un curso?",
// ]

// function WelcomeIntro({ onPick }: { onPick: (text: string) => void }) {
//   return (
//     <div className="flex h-full flex-col items-center justify-center gap-6 px-2 text-center animate-in fade-in zoom-in-95 duration-500">
//       <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 shadow-lg backdrop-blur-md">
//         <Bot className="h-8 w-8 text-primary" />
//       </div>

//       <div className="space-y-2">
//         <h3 className="text-xl font-semibold text-balance text-white">
//           ¡Hola! Soy el asistente virtual del Nodo Tecnológico
//         </h3>
//         <p className="text-sm text-white/70">¿En qué puedo ayudarte hoy?</p>
//       </div>

//       <div className="flex w-full max-w-xs flex-col gap-2">
//         {SUGGESTIONS.map((suggestion) => (
//           <button
//             key={suggestion}
//             type="button"
//             onClick={() => onPick(suggestion)}
//             className="rounded-full bg-card px-4 py-2.5 text-sm font-medium text-card-foreground shadow-lg transition-colors hover:bg-card/90"
//           >
//             {suggestion}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// ── Botonera de prueba — dispara cada estado del SiriFrame manualmente ──────
const STATE_OPTIONS: { key: SiriFrameState; label: string }[] = [
  { key: "idle", label: "Idle" },
  { key: "thinking", label: "Pensando" },
  { key: "speaking", label: "Hablando" },
  { key: "error", label: "Error" },
  { key: "greeting", label: "Saludo" },
]

function StateDebugPanel({
  current,
  onSelect,
}: {
  current: SiriFrameState
  onSelect: (state: SiriFrameState) => void
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs uppercase tracking-widest text-white/50">
        Estado actual: <span className="text-white font-semibold">{current}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STATE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect(opt.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              current === opt.key
                ? "bg-white text-slate-900"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  // const [messages, setMessages] = useState<Message[]>([])
  // const [conversationHistory, setConversationHistory] = useState<GroqMessage[]>([])
  // const [inputValue, setInputValue] = useState("")
  // const [isLoading, setIsLoading] = useState(false)
  const [frameState, setFrameState] = useState<SiriFrameState>("idle")
  // const messagesEndRef = useRef<HTMLDivElement>(null)
  // const inputRef = useRef<HTMLInputElement>(null)
  // const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // const greetingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // const hasStarted = messages.length > 0

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true)
    window.addEventListener("open-chatbot", handleOpenChatbot)
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot)
  }, [])

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }, [messages])

  // Bloquear scroll del body mientras el overlay está abierto
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // ── Lógica real del chatbot — comentada mientras probamos los estados ──
  // useEffect(() => {
  //   if (!isOpen) return
  //   setFrameState("greeting")
  //   greetingTimeoutRef.current = setTimeout(() => {
  //     setFrameState((current) => (current === "greeting" ? "idle" : current))
  //   }, 400)
  //   return () => {
  //     if (greetingTimeoutRef.current) clearTimeout(greetingTimeoutRef.current)
  //   }
  // }, [isOpen])

  // useEffect(() => {
  //   if (isLoading) {
  //     setFrameState("thinking")
  //   } else {
  //     setFrameState((current) => (current === "thinking" ? "idle" : current))
  //   }
  // }, [isLoading])

  // useEffect(() => {
  //   return () => {
  //     if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
  //     if (greetingTimeoutRef.current) clearTimeout(greetingTimeoutRef.current)
  //   }
  // }, [])

  // const sendMessage = async (rawText: string) => {
  //   const userText = rawText.trim()
  //   if (!userText || isLoading) return

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     text: userText,
  //     sender: "user",
  //     timestamp: new Date(),
  //   }

  //   const newHistory: GroqMessage[] = [
  //     ...conversationHistory,
  //     { role: "user", content: userText },
  //   ]

  //   setMessages((prev) => [...prev, userMessage])
  //   setInputValue("")
  //   setIsLoading(true)

  //   try {
  //     const res = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ messages: newHistory }),
  //     })

  //     if (!res.ok) throw new Error(`HTTP ${res.status}`)

  //     const data = await res.json()

  //     if (data.response) {
  //       const botMessage: Message = {
  //         id: (Date.now() + 1).toString(),
  //         text: data.response,
  //         sender: "bot",
  //         timestamp: new Date(),
  //       }

  //       setMessages((prev) => [...prev, botMessage])
  //       setConversationHistory([
  //         ...newHistory,
  //         { role: "assistant", content: data.response },
  //       ])
  //     } else {
  //       throw new Error("Respuesta inválida")
  //     }
  //   } catch (error) {
  //     console.error("Error:", error)
  //     const errorMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intentá nuevamente.",
  //       sender: "bot",
  //       timestamp: new Date(),
  //     }
  //     setMessages((prev) => [...prev, errorMessage])

  //     setFrameState("error")
  //     errorTimeoutRef.current = setTimeout(() => {
  //       setFrameState((current) => (current === "error" ? "idle" : current))
  //     }, 1800)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleSendMessage = () => sendMessage(inputValue)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir asistente virtual"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 cursor-pointer overflow-hidden bg-transparent border-0 p-0"
      >
        <Image
          src="/excited.png"
          alt="Asistente virtual"
          width={64}
          height={64}
          className="h-full w-full object-contain"
          priority
        />
      </button>

      {/* Overlay full-screen — fondo Siri de pared a pared, chat flotando SIN card */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Asistente Virtual del Nodo Tecnológico — modo prueba de estados"
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* Fondo 100% transparente — se ve la página de atrás sin blur.
              El único color viene del glow tipo Siri. */}
          <div className="absolute inset-0">
            <SiriFrame state={frameState} />
          </div>

          {/* Vidrio esmerilado — cubre TODA la pantalla parejo, un
              blur/tinte leve sobre la página y el glow de Siri */}
          <div className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-sm" />

          {/* Click afuera del área de contenido para cerrar */}
          <button
            type="button"
            aria-label="Cerrar asistente virtual"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 cursor-default"
          />

          {/* Botón cerrar — esquina superior derecha */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Título flotante */}
          <div className="relative z-10 flex items-center gap-3 px-6 pt-6 sm:px-10 sm:pt-8 shrink-0 pointer-events-none animate-in fade-in duration-500">
            <div className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Bot className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-white text-base font-semibold leading-tight">Modo prueba — SiriFrame</h2>
              <p className="text-xs text-white/60 leading-tight">Tocá un botón para cambiar de estado</p>
            </div>
          </div>

          {/* ── Solo la botonera de estados, sin chat ── */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-4">
            <StateDebugPanel current={frameState} onSelect={setFrameState} />
          </div>

          {/* ── Contenido real del chat — comentado ──
          <div className="relative z-10 flex-1 min-h-0 mx-auto w-full max-w-xl px-4 sm:px-6">
            {!hasStarted ? (
              <WelcomeIntro onPick={(text) => sendMessage(text)} />
            ) : (
              <ScrollArea className="h-full">
                ...
              </ScrollArea>
            )}
          </div>

          <div className="relative z-10 mx-auto w-full max-w-xl px-4 sm:px-6 pb-6 sm:pb-10 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage() }} className="flex gap-3">
              <Input ... />
              <Button ... />
            </form>
          </div>
          */}
        </div>
      )}
    </>
  )
}