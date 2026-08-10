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
