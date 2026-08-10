"use client"

import { useEffect, useRef, useState } from "react"

interface CounterStatProps {
  end: number
  label: string
  suffix?: string
  duration?: number
}

export function CounterStat({ end, label, suffix = "+", duration = 2000 }: CounterStatProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const endTime = startTime + duration

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)

      setCount(currentCount)

      if (now < endTime) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isVisible, end, duration])

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
