export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export interface ChatModuleProps {
  onSendMessage?: (message: string) => Promise<void>
  initialMessages?: Message[]
  placeholder?: string
}
