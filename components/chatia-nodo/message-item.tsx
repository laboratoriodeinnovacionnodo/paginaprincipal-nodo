"use client"

import type { Message } from "@/lib/chatia-nodo/types"
import { MessageActions } from "./message-actions"

interface MessageItemProps {
  message: Message
  onCopy: () => void
  onShare: () => void
  onDelete: () => void
}

export function MessageItem({ message, onCopy, onShare, onDelete }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser ? "bg-cyan-400 text-white rounded-br-sm" : "text-gray-700 rounded-bl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {!isUser && (
          <MessageActions
            messageId={message.id}
            content={message.content}
            onCopy={onCopy}
            onShare={onShare}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  )
}
