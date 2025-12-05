"use client"

import type React from "react"

import { useTooltip } from "@/hooks/chatia-nodo/use-tooltip"
import { Tooltip } from "./tooltip"

interface ActionButtonProps {
  icon: React.ReactNode
  onClick: () => void
  tooltip: string
  id: string
}

export function ActionButton({ icon, onClick, tooltip, id }: ActionButtonProps) {
  const { activeTooltip, showTooltip, hideTooltip } = useTooltip()

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => showTooltip(id)}
        onMouseLeave={hideTooltip}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        aria-label={tooltip}
      >
        {icon}
      </button>
      <Tooltip content={tooltip} show={activeTooltip === id} />
    </div>
  )
}
