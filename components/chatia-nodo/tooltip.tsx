"use client"

interface TooltipProps {
  content: string
  show: boolean
}

export function Tooltip({ content, show }: TooltipProps) {
  if (!show) return null

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-blue-400 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10">
      {content}
    </div>
  )
}
