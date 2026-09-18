"use client"

import { useEffect, useRef } from "react"

interface MatrixBackgroundProps {
  /** Opacidad global del canvas. Default 0.9 */
  opacity?:       number
  /** Color de la cabeza (carácter más nuevo). Default #26a7fc */
  colorHead?:     string
  /** Color de la estela (caracteres viejos). Default #94a3b8 */
  colorTrail?:    string
  /** Tamaño de fuente en px. Default 13 */
  fontSize?:      number
  /** Velocidad de caída — fracción de fila por frame. Default 0.22 */
  speed?:         number
  /** Opacidad de la cabeza. Default 0.7 */
  headOpacity?:   number
  /** Opacidad máxima de la estela (la más reciente). Default 0.18 */
  trailOpacity?:  number
  /** Longitud de la estela en caracteres. Default 5 */
  trailLength?:   number
  className?:     string
}

export function MatrixBackground({
  opacity      = 0.9,
  colorHead    = "#26a7fc",
  colorTrail   = "#94a3b8",
  fontSize     = 13,
  speed        = 0.22,
  headOpacity  = 0.65,
  trailOpacity = 0.16,
  trailLength  = 5,
  className,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rand  = (a: number, b: number) => a + Math.random() * (b - a)
    const randI = (a: number, b: number) => Math.floor(rand(a, b))

    // Caracteres del alfabeto — mezcla de letras, números y símbolos
    // Sutil: sin kanji, sin símbolos agresivos — sólo ASCII editorial
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789→←·•◦▸▹"

    // Parsear colores
    function hexRgb(hex: string): [number, number, number] {
      return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ]
    }
    const [hr, hg, hb] = hexRgb(colorHead)
    const [tr, tg, tb] = hexRgb(colorTrail)

    interface Column {
      x:       number   // posición x fija
      y:       number   // posición y actual (en filas, decimal)
      speed:   number   // velocidad individual
      gap:     number   // pausa antes de reiniciar (en filas)
      waiting: number   // contador de pausa
      chars:   string[] // buffer de caracteres de la estela
    }

    let W = 0, H = 0
    let rowH    = 0     // altura de una fila en px
    let cols: Column[] = []

    function build() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      if (W === 0 || H === 0) return

      rowH = fontSize * 1.5
      const numCols = Math.floor(W / (fontSize * 1.1))

      cols = Array.from({ length: numCols }, (_, i) => {
        const x = i * (fontSize * 1.1) + fontSize * 0.55
        return {
          x,
          y:       rand(0, H / rowH),          // arrancar en posición aleatoria
          speed:   rand(speed * 0.5, speed * 1.6),
          gap:     rand(8, 30),                // pausa en filas tras salir de pantalla
          waiting: randI(0, 40),               // delay inicial escalonado
          chars:   Array.from({ length: trailLength + 1 }, () =>
            CHARS[randI(0, CHARS.length)]
          ),
        }
      })
    }

    function draw() {
      // Fade suave — sin clearRect para mantener ghost de estela
      ctx.fillStyle = "rgba(248,250,252,0.18)"
      ctx.fillRect(0, 0, W, H)

      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = "center"

      cols.forEach((col) => {
        // Si está esperando, contar y saltar
        if (col.waiting > 0) {
          col.waiting -= col.speed
          return
        }

        const headRow = col.y
        const headY   = headRow * rowH

        // Estela — de más vieja a más nueva
        for (let k = trailLength; k >= 1; k--) {
          const ky = headY - k * rowH
          if (ky < 0 || ky > H) continue
          const a = (trailOpacity / trailLength) * (trailLength - k + 1)
          ctx.fillStyle = `rgba(${tr},${tg},${tb},${a})`
          ctx.fillText(col.chars[k] ?? CHARS[0], col.x, ky)
        }

        // Cabeza — carácter más brillante en el color de marca
        if (headY >= 0 && headY <= H) {
          ctx.fillStyle = `rgba(${hr},${hg},${hb},${headOpacity})`
          ctx.fillText(col.chars[0], col.x, headY)
        }

        // Avanzar
        col.y += col.speed

        // Actualizar caracteres: rotar array y meter uno nuevo al frente
        if (Math.random() > 0.88) {
          col.chars.unshift(CHARS[randI(0, CHARS.length)])
          col.chars.length = trailLength + 1
        }

        // Reiniciar cuando sale de pantalla + pausa
        if (headY > H + rowH * trailLength) {
          col.y       = -trailLength
          col.waiting = col.gap
          col.speed   = rand(speed * 0.5, speed * 1.6)
          col.gap     = rand(8, 30)
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
  }, [colorHead, colorTrail, fontSize, speed, headOpacity, trailOpacity, trailLength])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity, display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
