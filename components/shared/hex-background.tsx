"use client"

import { useEffect, useRef } from "react"

interface HexBackgroundProps {
  /** Opacidad global del canvas (0-1). Default 0.9 */
  opacity?:      number
  /** Color primario de los hexágonos. Default #26a7fc */
  color?:        string
  /** Tamaño de cada hexágono en px. Default 28 */
  hexSize?:      number
  /** Opacidad máxima del relleno al iluminarse. Default 0.18 */
  fillOpacity?:  number
  /** Opacidad del borde de los hexágonos. Default 0.2 */
  strokeOpacity?: number
  /** Opacidad del borde al iluminarse. Default 0.7 */
  strokeBright?:  number
  className?:    string
}

export function HexBackground({
  opacity       = 0.9,
  color         = "#26a7fc",
  hexSize       = 28,
  fillOpacity   = 0.18,
  strokeOpacity = 0.18,
  strokeBright  = 0.65,
  className,
}: HexBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rand  = (a: number, b: number) => a + Math.random() * (b - a)
    const randI = (a: number, b: number) => Math.floor(rand(a, b))

    // Parsear color hex a rgb
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    interface Hex {
      x:      number
      y:      number
      bright: number   // brillo actual (0-1)
      target: number   // brillo objetivo
      timer:  number   // frames hasta el próximo cambio
      speed:  number   // velocidad de interpolación
    }

    let W = 0, H = 0
    let hexes: Hex[] = []

    // Dibuja un hexágono flat-top centrado en (cx, cy)
    function drawHex(cx: number, cy: number, size: number) {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30)
        const px = cx + size * Math.cos(angle)
        const py = cy + size * Math.sin(angle)
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    function build() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      if (W === 0 || H === 0) return

      const hexH   = hexSize * Math.sqrt(3)         // alto de cada hex
      const hexW   = hexSize * 2                    // ancho de cada hex
      const colW   = hexW * 0.75                    // paso horizontal
      const rowH   = hexH                           // paso vertical

      hexes = []
      for (let row = 0; row * rowH * 0.5 < H + hexSize * 2; row++) {
        for (let col = 0; col * colW < W + hexSize * 2; col++) {
          const x = col * colW - hexSize
          const y = row * rowH * 0.5 + (col % 2 === 0 ? 0 : rowH * 0.25) - hexSize
          hexes.push({
            x, y,
            bright: 0,
            target: 0,
            timer:  randI(0, 220),
            speed:  rand(0.025, 0.055),
          })
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      hexes.forEach((h) => {
        // Contar frames y cambiar objetivo
        h.timer--
        if (h.timer <= 0) {
          h.target = Math.random() > 0.75 ? rand(0.3, 1) : 0
          h.timer  = randI(60, 320)
        }

        // Interpolar suavemente hacia el objetivo
        h.bright += (h.target - h.bright) * h.speed

        if (h.bright > 0.008) {
          drawHex(h.x, h.y, hexSize * 0.47)

          // Relleno suave
          ctx.fillStyle = `rgba(${r},${g},${b},${h.bright * fillOpacity})`
          ctx.fill()

          // Borde
          const sAlpha = strokeOpacity + h.bright * (strokeBright - strokeOpacity)
          ctx.strokeStyle = `rgba(${r},${g},${b},${sAlpha})`
          ctx.lineWidth   = 0.8
          ctx.stroke()
        } else {
          // Hexágono base (casi invisible, solo estructura)
          drawHex(h.x, h.y, hexSize * 0.47)
          ctx.strokeStyle = `rgba(${r},${g},${b},${strokeOpacity * 0.4})`
          ctx.lineWidth   = 0.5
          ctx.stroke()
        }
      })

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
  }, [color, hexSize, fillOpacity, strokeOpacity, strokeBright])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity, display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
