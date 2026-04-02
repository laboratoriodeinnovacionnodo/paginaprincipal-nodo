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