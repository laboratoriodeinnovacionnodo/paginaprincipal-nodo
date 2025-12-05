"use client"

import type React from "react"

import type { Message } from "@/lib/chatia-nodo/types"
import { MessageItem } from "./message-item"
import { LoadingIndicator } from "./loading-indicator"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  onCopyMessage: (content: string) => void
  onShareMessage: (content: string) => void
  onDeleteMessage: (messageId: string) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function ChatMessages({
  messages,
  isLoading,
  onCopyMessage,
  onShareMessage,
  onDeleteMessage,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onCopy={() => onCopyMessage(message.content)}
            onShare={() => onShareMessage(message.content)}
            onDelete={() => onDeleteMessage(message.id)}
          />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
    </div>
  )
}
