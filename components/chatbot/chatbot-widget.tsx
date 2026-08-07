"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SiriFrame } from "@/components/chatbot/siri-frame"

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

const SUGGESTIONS = [
  "¿Qué cursos tienen disponibles?",
  "Contame sobre el Nodo Tecnológico",
  "¿Cómo me inscribo a un curso?",
]

function WelcomeIntro({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-2 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 shadow-lg backdrop-blur-md">
        <Bot className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-balance text-white">
          ¡Hola! Soy el asistente virtual del Nodo Tecnológico
        </h3>
        <p className="text-sm text-white/70">¿En qué puedo ayudarte hoy?</p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className="rounded-full bg-card px-4 py-2.5 text-sm font-medium text-card-foreground shadow-lg transition-colors hover:bg-card/90"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationHistory, setConversationHistory] = useState<GroqMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasStarted = messages.length > 0

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true)
    window.addEventListener("open-chatbot", handleOpenChatbot)
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Bloquear scroll del body mientras el overlay está abierto
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const id = setTimeout(() => inputRef.current?.focus(), 350)
    return () => {
      document.body.style.overflow = original
      clearTimeout(id)
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

  const sendMessage = async (rawText: string) => {
    const userText = rawText.trim()
    if (!userText || isLoading) return

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

  const handleSendMessage = () => sendMessage(inputValue)

  return (
    <>
      {/* Botón original — comentado para probar excited.png
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-xl bg-[#26a7fc] shadow-lg hover:shadow-xl hover:bg-[#1c8fe0] transition-all duration-300 z-50 cursor-pointer"
        size="icon"
      >
        <Bot className="text-white" style={{ width: "75%", height: "75%" }} />
      </Button>
      */}

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
          aria-label="Asistente Virtual del Nodo Tecnológico"
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* Fondo 100% transparente — se ve la página de atrás sin blur.
              El único color viene del glow tipo Siri. */}
          <div className="absolute inset-0">
            <SiriFrame active={isLoading} />
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

          {/* Título flotante — solo una vez que arrancó la conversación */}
          {hasStarted && (
            <div className="relative z-10 flex items-center gap-3 px-6 pt-6 sm:px-10 sm:pt-8 shrink-0 pointer-events-none animate-in fade-in duration-500">
              <div className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Bot className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h2 className="text-white text-base font-semibold leading-tight">Asistente Virtual</h2>
                <p className="text-xs text-white/60 leading-tight">Nodo Tecnológico</p>
              </div>
            </div>
          )}

          {/* Contenido central: presentación (antes del primer mensaje) o mensajes */}
          <div className="relative z-10 flex-1 min-h-0 mx-auto w-full max-w-xl px-4 sm:px-6">
            {!hasStarted ? (
              <WelcomeIntro onPick={(text) => sendMessage(text)} />
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-4 py-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card text-card-foreground border border-black/5 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
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
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-card border border-black/5 rounded-bl-sm">
                        <div className="flex items-center gap-1">
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"
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
            )}
          </div>

          {/* Input — pill flotante, sin card, pegado abajo */}
          <div className="relative z-10 mx-auto w-full max-w-xl px-4 sm:px-6 pb-6 sm:pb-10 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-3"
            >
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu mensaje..."}
                disabled={isLoading}
                className="flex-1 h-12 bg-white border border-black/10 text-foreground placeholder:text-muted-foreground rounded-full px-5 shadow-lg focus-visible:ring-2 focus-visible:ring-primary transition-all disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                className="h-12 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full disabled:opacity-50 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
