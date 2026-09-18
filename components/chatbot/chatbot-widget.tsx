"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bot, X, Send, Loader2 } from "lucide-react"
import { SiriFrame, type SiriFrameState } from "@/components/chatbot/siri-frame"

interface Message {
  id:        string
  text:      string
  sender:    "user" | "bot"
  timestamp: Date
}

interface GroqMessage {
  role:    "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "¿Qué cursos tienen disponibles?",
  "¿Cómo funciona el coworking?",
  "¿Cuándo son los próximos eventos?",
  "¿Qué es el Laboratorio de Innovación?",
]

const GREETING = "¡Hola! Soy el asistente virtual del Nodo Tecnológico. ¿En qué puedo ayudarte hoy?"

function uid() {
  return Math.random().toString(36).slice(2)
}

export function ChatbotWidget() {
  const [isOpen,      setIsOpen]      = useState(false)
  const [messages,    setMessages]    = useState<Message[]>([])
  const [history,     setHistory]     = useState<GroqMessage[]>([])
  const [inputValue,  setInputValue]  = useState("")
  const [isLoading,   setIsLoading]   = useState(false)
  const [hasStarted,  setHasStarted]  = useState(false)
  const [frameState,  setFrameState]  = useState<SiriFrameState>("idle")

  const inputRef      = useRef<HTMLInputElement>(null)
  const messagesRef   = useRef<HTMLDivElement>(null)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setFrameState("greeting")
    const t = setTimeout(() => setFrameState("idle"), 800)
    return () => clearTimeout(t)
  }, [isOpen])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && hasStarted) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, hasStarted])

  const startChat = useCallback(() => {
    setHasStarted(true)
    setMessages([{
      id:        uid(),
      text:      GREETING,
      sender:    "bot",
      timestamp: new Date(),
    }])
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = { id: uid(), text: trimmed, sender: "user", timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")

    const newHistory: GroqMessage[] = [...history, { role: "user", content: trimmed }]
    setHistory(newHistory)

    setIsLoading(true)
    setFrameState("thinking")

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: newHistory }),
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

      const data = await res.json()
      const replyText = data.reply ?? "No pude generar una respuesta."

      const botMsg: Message = { id: uid(), text: replyText, sender: "bot", timestamp: new Date() }
      setMessages((prev) => [...prev, botMsg])
      setHistory((prev) => [...prev, { role: "assistant", content: replyText }])
      setFrameState("speaking")
      setTimeout(() => setFrameState("idle"), 1500)
    } catch {
      const errMsg: Message = {
        id:        uid(),
        text:      "Ocurrió un error. Por favor, intentá nuevamente.",
        sender:    "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
      setFrameState("error")

      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
      errorTimerRef.current = setTimeout(() => {
        setFrameState((cur) => cur === "error" ? "idle" : cur)
      }, 1800)
    } finally {
      setIsLoading(false)
    }
  }, [history, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setHasStarted(false)
    setMessages([])
    setHistory([])
    setFrameState("idle")
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir asistente virtual"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 cursor-pointer flex items-center justify-center border-0"
        style={{ backgroundImage: "linear-gradient(to bottom right, #26a7fc, #1c8fe0)" }}
      >
        <Bot className="h-6 w-6 text-white" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Asistente Virtual del Nodo Tecnológico"
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* SiriFrame — fondo animado con colores de marca */}
          <div className="absolute inset-0">
            <SiriFrame state={frameState} />
          </div>

          {/* Vidrio esmerilado mínimo — solo para suavizar, sin tapar el glow */}
          <div className="pointer-events-none absolute inset-0 bg-white/8 backdrop-blur-[2px]" />

          {/* Botón cerrar */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar asistente"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Header */}
          <div className="relative z-10 flex items-center gap-3 px-6 pt-6 sm:px-10 sm:pt-8 shrink-0 pointer-events-none animate-in fade-in duration-500">
            <div className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-white text-base font-semibold leading-tight">
                Asistente NODO
              </h2>
              <p className="text-xs text-white/60 leading-tight flex items-center gap-1.5">
                {frameState === "thinking" && (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                )}
                {frameState === "thinking" ? "Pensando..." : "En línea"}
              </p>
            </div>
          </div>

          {/* Pantalla de bienvenida */}
          {!hasStarted && (
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 gap-6 animate-in fade-in duration-500">
              <div className="text-center space-y-3 max-w-sm">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white text-xl font-bold">¿En qué puedo ayudarte?</h3>
                <p className="text-white/60 text-sm">
                  Soy el asistente del Nodo Tecnológico. Puedo ayudarte con cursos, eventos, coworking y más.
                </p>
              </div>

              {/* Sugerencias */}
              <div className="flex flex-col gap-2 w-full max-w-sm">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { startChat(); setTimeout(() => sendMessage(s), 100) }}
                    className="text-left px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white/90 text-sm transition-all duration-200 hover:border-white/30"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={startChat}
                className="px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all duration-200"
              >
                Iniciar conversación
              </button>
            </div>
          )}

          {/* Chat activo */}
          {hasStarted && (
            <div className="relative z-10 flex-1 flex flex-col min-h-0 px-4 sm:px-6 pb-4 pt-4 max-w-2xl w-full mx-auto">

              {/* Mensajes */}
              <div
                ref={messagesRef}
                className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    {msg.sender === "bot" && (
                      <div className="h-7 w-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mr-2 mt-1">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed backdrop-blur-md ${
                        msg.sender === "user"
                          ? "bg-[#26a7fc]/80 text-white rounded-br-sm border border-[#26a7fc]/40"
                          : "bg-white/12 text-white/90 rounded-bl-sm border border-white/15"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing */}
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in duration-300">
                    <div className="h-7 w-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mr-2 mt-1">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/12 border border-white/15 backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="mt-3 flex gap-2 shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribí tu consulta..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/15 backdrop-blur-md border border-white/20 focus:border-white/35 text-white placeholder-white/40 text-sm outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => sendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  aria-label="Enviar mensaje"
                  className="h-12 w-12 rounded-2xl bg-[#26a7fc]/70 hover:bg-[#26a7fc]/90 backdrop-blur-md border border-[#26a7fc]/40 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {isLoading
                    ? <Loader2 className="h-4 w-4 text-white animate-spin" />
                    : <Send className="h-4 w-4 text-white" />
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
