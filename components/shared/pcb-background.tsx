"use client"

import { useEffect, useRef } from "react"

interface PcbBackgroundProps {
  opacity?:        number
  color?:          string
  gridGap?:        number
  nodeRadius?:     number
  traceOpacity?:   number
  nodeOpacity?:    number
  pulseSpeed?:     number
  className?:      string
}

export function PcbBackground({
  opacity       = 0.9,
  color         = "#26a7fc",
  gridGap       = 24,
  nodeRadius    = 2.2,
  traceOpacity  = 0.18,
  nodeOpacity   = 0.70,
  pulseSpeed    = 0.025,
  className,
}: PcbBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rand  = (a: number, b: number) => a + Math.random() * (b - a)
    const randI = (a: number, b: number) => Math.floor(rand(a, b))

    const cr = parseInt(color.slice(1, 3), 16)
    const cg = parseInt(color.slice(3, 5), 16)
    const cb = parseInt(color.slice(5, 7), 16)

    interface Node {
      x: number; y: number
      phase: number   // fase para el seno
      speed: number   // velocidad individual
      base:  number   // brillo base (0.2–0.6)
    }

    interface Trace {
      x1: number; y1: number
      x2: number; y2: number
      horiz: boolean
    }

    let W = 0, H = 0
    let nodes:  Node[]  = []
    let traces: Trace[] = []

    function build() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      if (W === 0 || H === 0) return

      const cols = Math.ceil(W / gridGap) + 2
      const rows = Math.ceil(H / gridGap) + 2

      // Nodos en cada intersección de la cuadrícula
      nodes = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          nodes.push({
            x:     col * gridGap,
            y:     row * gridGap,
            phase: rand(0, Math.PI * 2),
            speed: rand(pulseSpeed * 0.5, pulseSpeed * 1.8),
            base:  rand(0.2, 0.55),
          })
        }
      }

      // Trazos horizontales — segmentos aleatorios entre nodos contiguos
      traces = []
      const traceCountH = Math.floor((W * H) / 4000)
      for (let i = 0; i < traceCountH; i++) {
        const row = randI(0, rows)
        const c1  = randI(0, cols - 2)
        const c2  = c1 + randI(1, 5)
        traces.push({
          x1: c1 * gridGap, y1: row * gridGap,
          x2: Math.min(c2 * gridGap, (cols - 1) * gridGap), y2: row * gridGap,
          horiz: true,
        })
      }

      // Trazos verticales
      const traceCountV = Math.floor((W * H) / 5000)
      for (let i = 0; i < traceCountV; i++) {
        const col = randI(0, cols)
        const r1  = randI(0, rows - 2)
        const r2  = r1 + randI(1, 4)
        traces.push({
          x1: col * gridGap, y1: r1 * gridGap,
          x2: col * gridGap, y2: Math.min(r2 * gridGap, (rows - 1) * gridGap),
          horiz: false,
        })
      }
    }

    let t = 0

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Trazos de circuito — estáticos, muy sutiles
      ctx.lineWidth = 0.8
      traces.forEach((tr) => {
        ctx.beginPath()
        ctx.moveTo(tr.x1, tr.y1)
        ctx.lineTo(tr.x2, tr.y2)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${traceOpacity})`
        ctx.stroke()
      })

      // Nodos pulsantes asincrónicos
      nodes.forEach((n) => {
        const pulse = (Math.sin(t * n.speed + n.phase) + 1) / 2  // 0–1
        const a     = n.base * pulse * nodeOpacity
        if (a < 0.02) return
        ctx.beginPath()
        ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`
        ctx.fill()
      })

      t++
      rafRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => { build() })
    ro.observe(canvas.parentElement ?? canvas)

    build()
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [color, gridGap, nodeRadius, traceOpacity, nodeOpacity, pulseSpeed])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity, display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
