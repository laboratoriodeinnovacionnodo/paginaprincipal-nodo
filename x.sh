#!/usr/bin/env bash
# =============================================================================
# ciudadano-coworking-view.sh
# Agrega vista pública de disponibilidad de áreas de coworking
# en ciudadano-front — el ciudadano SOLO ve el estado, sin interacción.
#
# Archivos creados/modificados:
#   app/coworking/page.tsx          → página principal (grilla de áreas)
#   lib/coworking/api.ts            → cliente hacia coworking-back (sin cambios si ya existe)
#   lib/coworking/types.ts          → tipos (sin cambios si ya existe)
#   lib/coworking/utils.ts          → helpers de color/texto (sin cambios si ya existe)
#   hooks/coworking/use-coworking.ts → hook de polling (sin cambios si ya existe)
# =============================================================================
set -euo pipefail

echo "🔧 [ciudadano-front] Configurando vista de coworking (solo lectura)..."

# ---------------------------------------------------------------------------
# 1. lib/coworking/types.ts — tipos base
# ---------------------------------------------------------------------------
mkdir -p lib/coworking

cat > lib/coworking/types.ts << 'EOF'
export type EstadoAsiento =
  | "LIBRE"
  | "OCUPADO"
  | "LIMPIANDO"
  | "FUERA_DE_SERVICIO"
  | "PARA_COMPARTIR"
  | "COMPARTIDO"

export type AreaBackendResponse = {
  id: number
  nombre: string
  descripcion: string | null
  estado: EstadoAsiento
  createdAt: string
}
EOF
echo "✅ lib/coworking/types.ts"

# ---------------------------------------------------------------------------
# 2. lib/coworking/utils.ts — helpers de color y texto
# ---------------------------------------------------------------------------
cat > lib/coworking/utils.ts << 'EOF'
import type { EstadoAsiento } from "./types"

export const obtenerColorBadge = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":            return "bg-green-500"
    case "OCUPADO":          return "bg-red-500"
    case "FUERA_DE_SERVICIO":return "bg-gray-400"
    case "LIMPIANDO":        return "bg-blue-500"
    case "PARA_COMPARTIR":   return "bg-orange-400"
    case "COMPARTIDO":       return "bg-orange-500"
    default:                 return "bg-gray-300"
  }
}

export const obtenerTextoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":            return "Libre"
    case "OCUPADO":          return "Ocupado"
    case "FUERA_DE_SERVICIO":return "Fuera de servicio"
    case "LIMPIANDO":        return "Limpiando"
    case "PARA_COMPARTIR":   return "Para compartir"
    case "COMPARTIDO":       return "Compartido"
    default:                 return "Desconocido"
  }
}

export const obtenerIconoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":            return "✅"
    case "OCUPADO":          return "🔴"
    case "FUERA_DE_SERVICIO":return "⚫"
    case "LIMPIANDO":        return "🔵"
    case "PARA_COMPARTIR":   return "🟠"
    case "COMPARTIDO":       return "🟠"
    default:                 return "⚪"
  }
}

export const contarPorEstado = (
  areas: { estado: EstadoAsiento }[],
  estado: EstadoAsiento,
): number => areas.filter((a) => a.estado === estado).length
EOF
echo "✅ lib/coworking/utils.ts"

# ---------------------------------------------------------------------------
# 3. lib/coworking/api.ts — fetch hacia coworking-back
# ---------------------------------------------------------------------------
cat > lib/coworking/api.ts << 'EOF'
import type { AreaBackendResponse } from "./types"

const BASE = (
  process.env.NEXT_PUBLIC_COWORKING_URL ?? "http://localhost:3550"
).replace(/\/$/, "")

export async function getAreas(): Promise<AreaBackendResponse[]> {
  const res = await fetch(`${BASE}/area`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error(`[coworking-api] GET /area → ${res.status}`)
  return res.json()
}
EOF
echo "✅ lib/coworking/api.ts"

# ---------------------------------------------------------------------------
# 4. hooks/coworking/use-coworking.ts — polling cada 30 segundos
# ---------------------------------------------------------------------------
mkdir -p hooks/coworking

cat > hooks/coworking/use-coworking.ts << 'EOF'
"use client"

import { useState, useEffect, useCallback } from "react"
import type { AreaBackendResponse } from "@/lib/coworking/types"
import { getAreas } from "@/lib/coworking/api"

const POLL_INTERVAL = 30_000 // 30 segundos

export function useCoworking() {
  const [areas, setAreas]               = useState<AreaBackendResponse[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [ultimaActualizacion, setUltima]= useState<string>("")

  const cargar = useCallback(async () => {
    try {
      const data = await getAreas()
      setAreas(data)
      setError(null)
    } catch (e) {
      setError("No se pudo conectar con el servidor de coworking.")
      console.error(e)
    } finally {
      setLoading(false)
      setUltima(
        new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }
  }, [])

  useEffect(() => {
    cargar()
    const id = setInterval(cargar, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [cargar])

  return { areas, loading, error, ultimaActualizacion, refetch: cargar }
}
EOF
echo "✅ hooks/coworking/use-coworking.ts"

# ---------------------------------------------------------------------------
# 5. app/coworking/page.tsx — vista pública, solo lectura
# ---------------------------------------------------------------------------
mkdir -p app/coworking

cat > app/coworking/page.tsx << 'EOF'
"use client"

import { Badge }  from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCoworking }       from "@/hooks/coworking/use-coworking"
import {
  obtenerColorBadge,
  obtenerTextoEstado,
  contarPorEstado,
} from "@/lib/coworking/utils"
import type { EstadoAsiento } from "@/lib/coworking/types"
import {
  Armchair,
  RefreshCw,
  Clock,
  WifiOff,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── leyenda de estados ────────────────────────────────────────────────────
const ESTADOS: { estado: EstadoAsiento; label: string; color: string }[] = [
  { estado: "LIBRE",             label: "Libre",             color: "bg-green-500" },
  { estado: "OCUPADO",           label: "Ocupado",           color: "bg-red-500"   },
  { estado: "PARA_COMPARTIR",    label: "Para compartir",    color: "bg-orange-400"},
  { estado: "COMPARTIDO",        label: "Compartido",        color: "bg-orange-500"},
  { estado: "LIMPIANDO",         label: "Limpiando",         color: "bg-blue-500"  },
  { estado: "FUERA_DE_SERVICIO", label: "Fuera de servicio", color: "bg-gray-400"  },
]

export default function CoworkingPage() {
  const { areas, loading, error, ultimaActualizacion, refetch } = useCoworking()

  // Agrupar por zona (primera palabra de la descripción o "General")
  const zonas = areas.reduce<Record<string, typeof areas>>((acc, area) => {
    const zona = area.descripcion
      ? area.descripcion.split(" - ")[0]
      : "General"
    if (!acc[zona]) acc[zona] = []
    acc[zona].push(area)
    return acc
  }, {})

  const libres = contarPorEstado(areas, "LIBRE")
  const total  = areas.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-12 max-w-5xl">

        {/* ── Encabezado ─────────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#26a7fc]/10 mb-4">
            <Armchair className="w-7 h-7 text-[#26a7fc]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Disponibilidad de Áreas
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Consultá en tiempo real el estado de cada espacio antes de acercarte
            al Nodo Tecnológico.
          </p>

          {/* última actualización */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            {ultimaActualizacion
              ? <span>Actualizado a las {ultimaActualizacion}</span>
              : <span>Cargando...</span>
            }
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-[#26a7fc]/10"
              onClick={refetch}
              aria-label="Actualizar"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#26a7fc]" />
            </Button>
          </div>
        </div>

        {/* ── Resumen numérico ────────────────────────────────────────── */}
        {!loading && !error && total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <Card className="text-center py-4 border-green-200 bg-green-50/60">
              <p className="text-2xl font-bold text-green-600">{libres}</p>
              <p className="text-xs text-green-700 font-medium mt-0.5">Disponibles</p>
            </Card>
            <Card className="text-center py-4 border-red-200 bg-red-50/60">
              <p className="text-2xl font-bold text-red-500">
                {contarPorEstado(areas, "OCUPADO")}
              </p>
              <p className="text-xs text-red-600 font-medium mt-0.5">Ocupados</p>
            </Card>
            <Card className="text-center py-4 col-span-2 sm:col-span-1 border-gray-200 bg-gray-50/60">
              <p className="text-2xl font-bold text-gray-700">{total}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Total de áreas</p>
            </Card>
          </div>
        )}

        {/* ── Leyenda de estados ─────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {ESTADOS.map(({ estado, label, color }) => (
            <span
              key={estado}
              className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
            >
              <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", color)} />
              {label}
            </span>
          ))}
        </div>

        {/* ── Estados de carga / error / vacío ───────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#26a7fc]" />
            <p className="text-sm">Cargando áreas...</p>
          </div>
        )}

        {!loading && error && (
          <Card className="border-red-200 bg-red-50/50 py-10">
            <CardContent className="flex flex-col items-center gap-3 text-center">
              <WifiOff className="w-10 h-10 text-red-400" />
              <p className="text-red-600 font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={refetch} className="mt-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && total === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Armchair className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No hay áreas registradas en este momento.</p>
          </div>
        )}

        {/* ── Grilla de áreas agrupadas por zona ─────────────────────── */}
        {!loading && !error && total > 0 && (
          <div className="space-y-8">
            {Object.entries(zonas).map(([zona, areasDeZona]) => (
              <section key={zona}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 pl-1">
                  {zona}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {areasDeZona.map((area) => (
                    <div
                      key={area.id}
                      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                    >
                      {/* punto de color */}
                      <span
                        className={cn(
                          "w-3 h-3 rounded-full flex-shrink-0",
                          obtenerColorBadge(area.estado),
                        )}
                      />
                      {/* nombre del área */}
                      <span className="text-sm font-bold text-gray-800 tracking-wide">
                        {area.nombre}
                      </span>
                      {/* badge de estado */}
                      <Badge
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full text-white border-0 font-medium",
                          obtenerColorBadge(area.estado),
                        )}
                      >
                        {obtenerTextoEstado(area.estado)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ── Pie informativo ─────────────────────────────────────────── */}
        {!loading && !error && total > 0 && (
          <p className="text-center text-xs text-gray-400 mt-12">
            Se actualiza automáticamente cada 30 segundos. Para reservar un
            espacio acercate a recepción.
          </p>
        )}

      </main>
    </div>
  )
}
EOF
echo "✅ app/coworking/page.tsx"

# ---------------------------------------------------------------------------
# 6. Recordatorio variable de entorno
# ---------------------------------------------------------------------------
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  VARIABLE DE ENTORNO requerida en ciudadano-front:"
echo ""
echo "   NEXT_PUBLIC_COWORKING_URL=https://tu-coworking-back.dominio.com"
echo ""
echo "   → Agregar en GitHub Secrets como NEXT_PUBLIC_COWORKING_URL"
echo "   → El deploy.yml del ciudadano-front debe pasarla al build y al run"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Listo. Todos los archivos de coworking (solo lectura) generados."