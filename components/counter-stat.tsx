"use client"

import { useEffect, useRef, useState } from "react"

interface CounterStatProps {
  /** Valor final del contador. Acepta "end" o "value" indistintamente. */
  end?:      number
  value?:    number
  label:     string
  suffix?:   string
  duration?: number
}

export function CounterStat({
  end,
  value,
  label,
  suffix = "+",
  duration = 2000,
}: CounterStatProps) {
  // Acepta end o value; si ninguno llega usa 0 como fallback seguro
  const target = end ?? value ?? 0

  const [count, setCount]         = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref                       = useRef<HTMLDivElement>(null)

  // IntersectionObserver — arranca la animación cuando entra en pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) setIsVisible(true)
      },
      { threshold: 0.3 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [isVisible])

  // Animación de conteo
  useEffect(() => {
    if (!isVisible || target === 0) return

    const startTime = Date.now()
    const endTime   = startTime + duration

    const updateCount = () => {
      const now      = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      // Ease out quart
      const eased    = 1 - Math.pow(1 - progress, 4)

      setCount(Math.floor(eased * target))

      if (now < endTime) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isVisible, target, duration])

  return (
    <div ref={ref}>
      <div className="text-4xl md:text-5xl font-bold text-primary">
        {count.toLocaleString("es-AR")}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1 text-white/75">{label}</div>
    </div>
  )
}
