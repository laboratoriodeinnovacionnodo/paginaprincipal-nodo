"use client"

/**
 * <SiriFrame>
 *
 * Marco de colores de marca pegado a los bordes de la pantalla:
 * - Glow de fondo (radial vignette)
 * - Anillo inset animado (orbit + pulse), controlado 100% por CSS variables
 *   inyectadas desde JS — sin @keyframes dinámicos (evita errores de styled-jsx).
 *
 * Estados:
 *  - idle      → reposo suave, azul NODO
 *  - thinking  → más intenso, orbit rápido (mientras espera la API)
 *  - speaking  → pulso corto y rápido, distinto de "thinking" (streaming de texto)
 *  - error     → mismo anillo pero en --destructive, pulsos rápidos y vuelve a idle
 *  - greeting  → pulso breve e intenso al abrir (400ms) y cae a idle
 */

export type SiriFrameState = "idle" | "thinking" | "speaking" | "error" | "greeting"

const BRAND_GRADIENT =
  "conic-gradient(from 0deg at 50% 50%, var(--primary), var(--accent), var(--primary), var(--accent), var(--primary))"

interface Props {
  state?: SiriFrameState
}

type RingConfig = {
  color: string
  spread: number
  blurMid: number
  spreadMid: number
  blurOuter: number
  spreadOuter: number
  orbitDur: string
  pulseDur: string
  pulseMin: number
  pulseMax: number
  opacity: number
  iterations: string
}

type RingConfigMap = Record<SiriFrameState, RingConfig>

const RING_CONFIG: RingConfigMap = {
  idle: {
    color: "var(--primary)",
    spread: 5, blurMid: 36, spreadMid: 14, blurOuter: 65, spreadOuter: 24,
    orbitDur: "12s", pulseDur: "5s", pulseMin: 0.85, pulseMax: 1.15,
    opacity: 0.85, iterations: "infinite",
  },
  thinking: {
    color: "var(--primary)",
    spread: 10, blurMid: 50, spreadMid: 20, blurOuter: 85, spreadOuter: 34,
    orbitDur: "6s", pulseDur: "3s", pulseMin: 0.85, pulseMax: 1.25,
    opacity: 1, iterations: "infinite",
  },
  speaking: {
    color: "var(--primary)",
    spread: 8, blurMid: 40, spreadMid: 16, blurOuter: 70, spreadOuter: 26,
    orbitDur: "9s", pulseDur: "0.9s", pulseMin: 0.9, pulseMax: 1.35,
    opacity: 1, iterations: "infinite",
  },
  error: {
    color: "var(--destructive)",
    spread: 10, blurMid: 50, spreadMid: 20, blurOuter: 85, spreadOuter: 34,
    orbitDur: "3s", pulseDur: "0.6s", pulseMin: 0.7, pulseMax: 1.3,
    opacity: 1, iterations: "3",
  },
  greeting: {
    color: "var(--primary)",
    spread: 14, blurMid: 60, spreadMid: 26, blurOuter: 100, spreadOuter: 40,
    orbitDur: "4s", pulseDur: "0.4s", pulseMin: 1, pulseMax: 1.4,
    opacity: 1, iterations: "1",
  },
}

export function SiriFrame({ state = "idle" }: Props) {
  const isThinking = state === "thinking"
  const isGreeting = state === "greeting"
  const innerStop = isThinking ? "14%" : "22%"
  const outerStop = isThinking ? "72%" : "88%"
  const maskImage = `radial-gradient(transparent ${innerStop}, black ${outerStop})`

  const c = RING_CONFIG[state]
  const blur = isThinking || isGreeting ? 24 : 20
  const orbitOffset = isThinking || isGreeting ? 14 : 8
  const orbitOffsetMid = isThinking || isGreeting ? 30 : 18
  const orbitOffsetOuter = isThinking || isGreeting ? 50 : 30

  const ringVars = {
    "--ring-color": c.color,
    "--ring-blur": `${blur}px`,
    "--ring-spread": `${c.spread}px`,
    "--ring-blur-mid": `${c.blurMid}px`,
    "--ring-spread-mid": `${c.spreadMid}px`,
    "--ring-blur-outer": `${c.blurOuter}px`,
    "--ring-spread-outer": `${c.spreadOuter}px`,
    "--ring-orbit-offset": `${orbitOffset}px`,
    "--ring-orbit-offset-mid": `${orbitOffsetMid}px`,
    "--ring-orbit-offset-outer": `${orbitOffsetOuter}px`,
    "--ring-orbit-dur": c.orbitDur,
    "--ring-pulse-dur": c.pulseDur,
    "--ring-pulse-min": c.pulseMin,
    "--ring-pulse-max": c.pulseMax,
    "--ring-opacity": c.opacity,
    "--ring-iterations": c.iterations,
  } as React.CSSProperties

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Capa base */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: isThinking ? 0.06 : 0.03 }}
      >
        <div
          className="siri-frame-spin absolute -inset-1/2 h-[200%] w-[200%]"
          style={{
            background: BRAND_GRADIENT,
            filter: "blur(140px)",
            animationDuration: isThinking ? "12s" : "24s",
          }}
        />
      </div>

      {/* Glow principal */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: isThinking ? 0.95 : 0.6,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        <div
          className="siri-frame-spin absolute -inset-1/2 h-[200%] w-[200%]"
          style={{
            background: BRAND_GRADIENT,
            filter: `blur(${isThinking ? 46 : 34}px)`,
            animationDuration: isThinking ? "6s" : "15s",
          }}
        />
      </div>

      {/* Anillo inset — todos los valores vienen de CSS variables */}
      <div className="siri-frame-ring absolute inset-0" style={ringVars} />

      <style jsx>{`
        .siri-frame-spin {
          animation-name: siri-frame-rotate;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .siri-frame-ring {
          opacity: var(--ring-opacity);
          animation-name: siri-frame-orbit, siri-frame-pulse;
          animation-timing-function: ease-in-out, ease-in-out;
          animation-duration: var(--ring-orbit-dur), var(--ring-pulse-dur);
          animation-iteration-count: var(--ring-iterations), var(--ring-iterations);
          transition: opacity 0.5s ease-out;
        }
        @keyframes siri-frame-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes siri-frame-pulse {
          0%, 100% { filter: brightness(var(--ring-pulse-min)) saturate(1); }
          50% { filter: brightness(var(--ring-pulse-max)) saturate(1.3); }
        }
        @keyframes siri-frame-orbit {
          0% {
            box-shadow:
              inset 0 calc(var(--ring-orbit-offset) * -1) var(--ring-blur) var(--ring-spread) var(--ring-color),
              inset 0 calc(var(--ring-orbit-offset-mid) * -1) var(--ring-blur-mid) var(--ring-spread-mid) color-mix(in oklch, var(--ring-color), black 20%),
              inset 0 calc(var(--ring-orbit-offset-outer) * -1) var(--ring-blur-outer) var(--ring-spread-outer) color-mix(in oklch, var(--ring-color), black 40%);
          }
          25% {
            box-shadow:
              inset calc(var(--ring-orbit-offset) * -1) 0 var(--ring-blur) var(--ring-spread) var(--ring-color),
              inset calc(var(--ring-orbit-offset-mid) * -1) 0 var(--ring-blur-mid) var(--ring-spread-mid) color-mix(in oklch, var(--ring-color), black 20%),
              inset calc(var(--ring-orbit-offset-outer) * -1) 0 var(--ring-blur-outer) var(--ring-spread-outer) color-mix(in oklch, var(--ring-color), black 40%);
          }
          50% {
            box-shadow:
              inset 0 var(--ring-orbit-offset) var(--ring-blur) var(--ring-spread) var(--ring-color),
              inset 0 var(--ring-orbit-offset-mid) var(--ring-blur-mid) var(--ring-spread-mid) color-mix(in oklch, var(--ring-color), black 20%),
              inset 0 var(--ring-orbit-offset-outer) var(--ring-blur-outer) var(--ring-spread-outer) color-mix(in oklch, var(--ring-color), black 40%);
          }
          75% {
            box-shadow:
              inset var(--ring-orbit-offset) 0 var(--ring-blur) var(--ring-spread) var(--ring-color),
              inset var(--ring-orbit-offset-mid) 0 var(--ring-blur-mid) var(--ring-spread-mid) color-mix(in oklch, var(--ring-color), black 20%),
              inset var(--ring-orbit-offset-outer) 0 var(--ring-blur-outer) var(--ring-spread-outer) color-mix(in oklch, var(--ring-color), black 40%);
          }
          100% {
            box-shadow:
              inset 0 calc(var(--ring-orbit-offset) * -1) var(--ring-blur) var(--ring-spread) var(--ring-color),
              inset 0 calc(var(--ring-orbit-offset-mid) * -1) var(--ring-blur-mid) var(--ring-spread-mid) color-mix(in oklch, var(--ring-color), black 20%),
              inset 0 calc(var(--ring-orbit-offset-outer) * -1) var(--ring-blur-outer) var(--ring-spread-outer) color-mix(in oklch, var(--ring-color), black 40%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .siri-frame-spin, .siri-frame-ring {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}