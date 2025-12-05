"use client"

import { useState, useCallback } from "react"

export function useTooltip() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  const showTooltip = useCallback((id: string) => {
    setActiveTooltip(id)
  }, [])

  const hideTooltip = useCallback(() => {
    setActiveTooltip(null)
  }, [])

  return {
    activeTooltip,
    showTooltip,
    hideTooltip,
  }
}
