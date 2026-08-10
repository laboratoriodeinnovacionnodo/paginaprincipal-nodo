#!/usr/bin/env bash
# =============================================================================
# 04_ciudadano-front_fix-runtime.sh
# Corrige 2 errores de runtime en ciudadano-front:
#
#   ERROR 1 — /_vercel/insights/script.js 404
#     @vercel/analytics solo funciona en Vercel. En Docker/self-hosted
#     el script nunca existe → error en consola en cada visita.
#     Fix: eliminar el componente <Analytics /> de layout.tsx
#
#   ERROR 2 — Cannot read properties of undefined (reading 'toLocaleString')
#     CounterStat espera prop "end" pero hero-section.tsx la llama con "value".
#     Fix: unificar la prop → CounterStat acepta ambas (value | end) con fallback 0
# =============================================================================
set -euo pipefail

echo "🔧 [ciudadano-front] Corrigiendo errores de runtime..."

# ─── ERROR 1: eliminar @vercel/analytics de layout.tsx ───────────────────────
echo ""
echo "📌 Fix 1: Removiendo Vercel Analytics de layout.tsx..."

LAYOUT="app/layout.tsx"

if [ ! -f "$LAYOUT" ]; then
  echo "❌ No se encontró $LAYOUT"
  exit 1
fi

cp "$LAYOUT" "${LAYOUT}.bak"

# Eliminar el import de Analytics
sed -i 's/^import { Analytics } from "@vercel\/analytics\/next".*$//' "$LAYOUT"
sed -i 's/^import { Analytics } from "@vercel\/analytics\/react".*$//' "$LAYOUT"

# Eliminar el tag <Analytics /> (con o sin espacios/props)
sed -i 's/[[:space:]]*<Analytics[^>]*\/>[[:space:]]*//' "$LAYOUT"
sed -i 's/[[:space:]]*<Analytics[^>]*>[^<]*<\/Analytics>[[:space:]]*//' "$LAYOUT"

echo "✅ Analytics removido"

# ─── ERROR 2: CounterStat — unificar prop end/value ──────────────────────────
echo ""
echo "📌 Fix 2: Corrigiendo CounterStat para aceptar prop 'value' y 'end'..."

COUNTER="components/counter-stat.tsx"

if [ ! -f "$COUNTER" ]; then
  echo "❌ No se encontró $COUNTER"
  exit 1
fi

cp "$COUNTER" "${COUNTER}.bak"

cat > "$COUNTER" << 'ENDOFFILE'
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
ENDOFFILE

echo "✅ CounterStat corregido (acepta 'end' y 'value')"

# ─── Verificar build ──────────────────────────────────────────────────────────
echo ""
echo "🔨 Verificando build..."
pnpm build

echo ""
echo "✅ [ciudadano-front] Errores de runtime corregidos."
echo ""
echo "📋 Archivos modificados:"
echo "   app/layout.tsx               ← Analytics removido"
echo "   components/counter-stat.tsx  ← prop end|value con fallback 0"
EOF