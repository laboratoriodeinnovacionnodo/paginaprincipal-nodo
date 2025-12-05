"use client"

import { useChat } from "@/hooks/chatia-nodo/use-chat"
import type { ChatModuleProps } from "@/lib/chatia-nodo/types"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"

export function ChatModule({ onSendMessage, initialMessages, placeholder }: ChatModuleProps) {
  const {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    copyMessage,
    shareMessage,
    deleteMessage,
    messagesEndRef,
  } = useChat(initialMessages)

  const handleSend = async () => {
    if (onSendMessage) {
      await onSendMessage(inputValue)
    } else {
      await sendMessage(inputValue)
    }
  }

  return (
      <div className="relative flex flex-col h-[calc(100vh)] mx-auto w-full">
        <div className="flex-1 overflow-y-auto min-h-0">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            onCopyMessage={copyMessage}
            onShareMessage={shareMessage}
            onDeleteMessage={deleteMessage}
            messagesEndRef={messagesEndRef}
          />
        </div>

        <div className="flex-shrink-0 justify-center w-full absolute bottom-[10px]">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={isLoading}
            placeholder={placeholder}
          />
        </div>
      </div>
  )
}
