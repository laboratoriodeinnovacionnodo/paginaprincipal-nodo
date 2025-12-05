import type { Message } from "./types"

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function createMessage(content: string, role: "user" | "assistant"): Message {
  return {
    id: generateMessageId(),
    content,
    role,
    timestamp: new Date(),
  }
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
