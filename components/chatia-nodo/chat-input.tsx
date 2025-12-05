"use client"

import type React from "react"

import { Send } from "lucide-react"
import { useTooltip } from "@/hooks/chatia-nodo/use-tooltip"
import { Tooltip } from "./tooltip"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ value, onChange, onSend, disabled, placeholder }: ChatInputProps) {
  const { activeTooltip, showTooltip, hideTooltip } = useTooltip()

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || "Ask Anything"}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-white border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="relative">
          <button
            onClick={onSend}
            onMouseEnter={() => showTooltip("send-btn")}
            onMouseLeave={hideTooltip}
            disabled={disabled || !value.trim()}
            className="p-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Enviar mensaje"
          >
            <Send className="w-5 h-5" />
          </button>
          <Tooltip content="Enviar" show={activeTooltip === "send-btn"} />
        </div>
      </div>
  )
}
