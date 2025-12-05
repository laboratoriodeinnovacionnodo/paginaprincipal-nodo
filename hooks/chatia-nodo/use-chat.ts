"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Message } from "@/lib/chatia-nodo/types"
import { createMessage } from "@/lib/chatia-nodo/utils"

export function useChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage = createMessage(content, "user")
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/llm/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: content,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.response) {
        const assistantMessage = createMessage(data.response, "assistant")
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = createMessage(
        "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        "assistant",
      )
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
  }, [])

  const shareMessage = useCallback((content: string) => {
    if (navigator.share) {
      navigator.share({
        text: content,
      })
    }
  }, [])

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }, [])

  return {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    copyMessage,
    shareMessage,
    deleteMessage,
    messagesEndRef,
  }
}
