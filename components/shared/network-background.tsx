"use client"

import { useEffect, useRef } from "react"

interface NetworkBackgroundProps {
  opacity?:        number
  colorPrimary?:   string
  colorSecondary?: string
  colorTertiary?:  string
  nodeCount?:      number
  maxDist?:        number
  speed?:          number
  lineOpacity?:    number
  lineWidth?:     number
  className?:      string
}

export function NetworkBackground({
  opacity        = 0.05,
  colorPrimary   = "#26a7fc",
  colorSecondary = "#0682bb",
  colorTertiary  = "#0ea5e9",
  nodeCount,
  maxDist      = 130,
  speed        = 0.22,
  lineOpacity  = 0.05,
  lineWidth    = 0.05,
  className,
}: NetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rand  = (a: number, b: number) => a + Math.random() * (b - a)
    const randI = (a: number, b: number) => Math.floor(rand(a, b))

    function hexToRgb(hex: string): [number, number, number] {
      return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ]
    }

    const PALETTE = [colorPrimary, colorSecondary, colorTertiary]
    const RGB     = PALETTE.map(hexToRgb)
    // Color de línea = primary
    const [lr, lg, lb] = hexToRgb(colorPrimary)

    interface Node {
      x: number; y: number
      vx: number; vy: number
      r: number; ci: number; a: number
    }

    let W = 0, H = 0, nodes: Node[] = []

    function build() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      if (W === 0 || H === 0) return
      const count = nodeCount ?? Math.max(45, Math.floor((W * H) / 9000))
      nodes = Array.from({ length: count }, () => ({
        x:  rand(0, W),
        y:  rand(0, H),
        vx: rand(-speed, speed),
        vy: rand(-speed, speed),
        r:  rand(2, 3.8),
        ci: randI(0, PALETTE.length),
        a:  rand(0.35, 0.75),
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1

        for (let j = i + 1; j < nodes.length; j++) {
          const m  = nodes[j]
          const dx = n.x - m.x
          const dy = n.y - m.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < maxDist) {
            const a = (1 - d / maxDist) * lineOpacity
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = `rgba(${lr},${lg},${lb},${a})`
            ctx.lineWidth   = lineWidth
            ctx.stroke()
          }
        }

        const [r, g, b] = RGB[n.ci] ?? RGB[0]
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${n.a})`
        ctx.fill()
      }

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
  }, [colorPrimary, colorSecondary, colorTertiary, maxDist, nodeCount, speed, lineOpacity, lineWidth])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity, display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
