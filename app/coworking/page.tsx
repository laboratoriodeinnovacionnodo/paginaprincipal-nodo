"use client"

import { useState } from "react"
import Image        from "next/image"
import { Badge }           from "@/components/ui/badge"
import { Button }          from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCoworking } from "@/hooks/coworking/use-coworking"
import {
  obtenerColorBadge,
  obtenerColorPunto,
  obtenerTextoEstado,
  contarPorEstado,
} from "@/lib/coworking/utils"
import {
  getZonaLetra,
  getZonaImage,
  getZonaLabel,
} from "@/lib/coworking/area-images"
import type { EstadoAsiento, AreaBackendResponse } from "@/lib/coworking/types"
import {
  Armchair,
  RefreshCw,
  Clock,
  WifiOff,
  Loader2,
  ImageIcon,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Leyenda de estados ────────────────────────────────────────────────────
const ESTADOS: { estado: EstadoAsiento; label: string }[] = [
  { estado: "LIBRE",             label: "Libre"             },
  { estado: "OCUPADO",           label: "Ocupado"           },
  { estado: "PARA_COMPARTIR",    label: "Para compartir"    },
  { estado: "COMPARTIDO",        label: "Compartido"        },
  { estado: "LIMPIANDO",         label: "Limpiando"         },
  { estado: "FUERA_DE_SERVICIO", label: "Fuera de servicio" },
]

// ─── Tipo interno ──────────────────────────────────────────────────────────
interface ZonaInfo {
  letra:       string
  label:       string
  imagen:      string | null
  descripcion: string | null
  areas:       AreaBackendResponse[]
}

// ─── Modal de zona ─────────────────────────────────────────────────────────
function ZonaModal({ zona, open, onClose }: {
  zona:    ZonaInfo | null
  open:    boolean
  onClose: () => void
}) {
  if (!zona) return null
  const libres   = zona.areas.filter((a) => a.estado === "LIBRE").length
  const ocupados = zona.areas.filter((a) => a.estado === "OCUPADO").length
  const total    = zona.areas.length
  const pct      = total > 0 ? Math.round((ocupados / total) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl">

        {/* Imagen */}
        <div className="relative w-full h-52 bg-slate-100">
          {zona.imagen ? (
            <Image
              src={zona.imagen}
              alt={zona.label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
              <ImageIcon className="w-10 h-10" />
              <span className="text-xs">Sin imagen</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="text-2xl font-bold text-white drop-shadow">{zona.label}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">{zona.label}</DialogTitle>
            <DialogDescription className="sr-only">Información de {zona.label}</DialogDescription>
          </DialogHeader>

          {zona.descripcion && (
            <p className="text-sm text-slate-600 leading-relaxed">{zona.descripcion}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-slate-800">{total}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Puestos</p>
            </div>
            <div className="bg-green-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-green-600">{libres}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Libres</p>
            </div>
            <div className="bg-red-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-red-400">{ocupados}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Ocupados</p>
            </div>
          </div>

          {/* Barra */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Ocupación</span>
              <span>{pct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  pct === 100 ? "bg-red-400" : pct > 50 ? "bg-yellow-400" : "bg-green-400"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Página ────────────────────────────────────────────────────────────────
export default function CoworkingPage() {
  const { areas, loading, error, ultimaActualizacion, refetch } = useCoworking()
  const [zonaModal, setZonaModal] = useState<ZonaInfo | null>(null)

  // Agrupar por zona (letra del nombre: A1→"A")
  const zonaMap = areas.reduce<Record<string, AreaBackendResponse[]>>((acc, area) => {
    const letra = getZonaLetra(area.nombre)
    if (!acc[letra]) acc[letra] = []
    acc[letra].push(area)
    return acc
  }, {})

  const zonas: ZonaInfo[] = Object.entries(zonaMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letra, areasZona]) => ({
      letra,
      label:       getZonaLabel(letra),
      imagen:      getZonaImage(letra),
      descripcion: areasZona[0]?.descripcion ?? null,
      areas:       areasZona,
    }))

  const total         = areas.length
  const totalLibres   = areas.filter((a) => a.estado === "LIBRE").length
  const totalOcupados = areas.filter((a) => a.estado === "OCUPADO").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <main className="pt-28 pb-20 container mx-auto px-4 max-w-4xl">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#26a7fc] uppercase tracking-widest mb-3">
              <span className="h-px w-6 bg-[#26a7fc]" />
              Espacio de trabajo
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
              Coworking <span className="text-[#26a7fc]">NODO</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Disponibilidad en tiempo real · {total} puestos en total
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="gap-1.5 shrink-0 mt-1"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Actualizar
          </Button>
        </div>

        {/* ── Resumen global ─────────────────────────────────────────────*/}
        {!loading && total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total</p>
            </div>
            <div className="bg-green-50 rounded-2xl border border-green-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{totalLibres}</p>
              <p className="text-xs text-gray-400 mt-0.5">Libres</p>
            </div>
            <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{totalOcupados}</p>
              <p className="text-xs text-gray-400 mt-0.5">Ocupados</p>
            </div>
          </div>
        )}

        {/* ── Loading ────────────────────────────────────────────────────*/}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#26a7fc]" />
            <span className="text-sm">Cargando disponibilidad...</span>
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────────*/}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <WifiOff className="w-8 h-8 opacity-40" />
            <p className="text-sm text-center max-w-xs">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="gap-1.5 mt-2">
              <RefreshCw className="w-4 h-4" /> Reintentar
            </Button>
          </div>
        )}

        {/* ── Zonas ──────────────────────────────────────────────────────*/}
        {!loading && !error && (
          <div className="space-y-10">
            {zonas.map((zona) => (
              <section key={zona.letra}>

                {/* Cabecera de zona */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest pl-1">
                    {zona.label}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs h-7 px-2.5 text-[#26a7fc] hover:bg-[#26a7fc]/8"
                    onClick={() => setZonaModal(zona)}
                  >
                    <Info className="w-3.5 h-3.5" />
                    Ver zona
                  </Button>
                </div>

                {/* Grid de cards — estilo original */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {zona.areas
                    .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }))
                    .map((area) => (
                      <div
                        key={area.id}
                        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                      >
                        {/* Punto de color */}
                        <span
                          className={cn(
                            "w-3 h-3 rounded-full flex-shrink-0",
                            obtenerColorPunto(area.estado),
                          )}
                        />
                        {/* Nombre del área */}
                        <span className="text-sm font-bold text-gray-800 tracking-wide">
                          {area.nombre}
                        </span>
                        {/* Badge suave */}
                        <Badge
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border-0 font-medium",
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

        {/* ── Leyenda ────────────────────────────────────────────────────*/}
        {!loading && total > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-3 justify-center">
            {ESTADOS.map(({ estado, label }) => {
              const count = contarPorEstado(areas, estado)
              if (count === 0) return null
              return (
                <div key={estado} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className={cn("w-2.5 h-2.5 rounded-full", obtenerColorPunto(estado))} />
                  {label} ({count})
                </div>
              )
            })}
          </div>
        )}

        {/* ── Pie ────────────────────────────────────────────────────────*/}
        {!loading && !error && total > 0 && (
          <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            {ultimaActualizacion
              ? `Actualizado ${ultimaActualizacion}`
              : "Se actualiza automáticamente cada 30 segundos"}
            . Para reservar un espacio acercate a recepción.
          </p>
        )}

      </main>

      {/* Modal de zona */}
      <ZonaModal
        zona={zonaModal}
        open={zonaModal !== null}
        onClose={() => setZonaModal(null)}
      />
    </div>
  )
}
