"use client"

/**
 * <SiriFrame>
 *
 * Glow de colores de marca pegado a los bordes de la pantalla que se va
 * perdiendo/disolviendo hacia el centro (vignette invertida), como el
 * efecto de Siri al escuchar. Cubre buena parte de la pantalla — el
 * centro queda limpio para leer, los bordes se funden en color.
 *
 * - CSS puro (conic-gradient + radial mask), sin WebGL ni dependencias
 * - `active` agranda la zona de color, sube opacidad y acelera el giro
 *   (ej: mientras el bot "piensa")
 * - Respeta prefers-reduced-motion (deja el color fijo, sin girar)
 */

// Usa los tokens de marca definidos en :root (globals.css) en vez de
// colores hardcodeados — primary (azul NODO) + chart-4/2/5 como
// secundario/terciario/acento, así el glow siempre matchea el theme.
// Las variables ya vienen con oklch(...) completo en :root, por eso se
// usan directo con var() sin volver a envolver en oklch().
const BRAND_GRADIENT =
  "conic-gradient(from 0deg at 50% 50%, var(--primary), var(--accent), var(--primary), var(--accent), var(--primary))";  "conic-gradient(from 0deg at 50% 50%, var(--primary), var(--chart-4), var(--chart-2), var(--chart-5), var(--primary))"

interface Props {
  active?: boolean
}

export function SiriFrame({ active = false }: Props) {
  // Radio (en % del gradiente) donde arranca transparente y donde ya
  // está 100% coloreado. Más chico el primero = más pantalla cubierta.
  const innerStop = active ? "14%" : "22%"
  const outerStop = active ? "72%" : "88%"

  const maskImage = `radial-gradient(transparent ${innerStop}, black ${outerStop})`

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Capa base — tinte muy leve, da profundidad detrás del glow principal */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: active ? 0.06 : 0.03 }}
      >
        <div
          className="siri-frame-spin absolute -inset-1/2 h-[200%] w-[200%]"
          style={{
            background: BRAND_GRADIENT,
            filter: "blur(140px)",
            animationDuration: active ? "12s" : "24s",
          }}
        />
      </div>

      {/* Glow principal — pierde color hacia el centro (efecto Siri) */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: active ? 0.95 : 0.6,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        <div
          className="siri-frame-spin absolute -inset-1/2 h-[200%] w-[200%]"
          style={{
            background: BRAND_GRADIENT,
            filter: `blur(${active ? 46 : 34}px)`,
            animationDuration: active ? "6s" : "15s",
          }}
        />
      </div>

      <style jsx>{`
        .siri-frame-spin {
          animation-name: siri-frame-rotate;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes siri-frame-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .siri-frame-spin {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
