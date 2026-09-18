"use client"

import { useState }  from "react"
import Image         from "next/image"
import { Button }    from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { useCoworking }             from "@/hooks/coworking/use-coworking"
import { useEventoActivoCoworking } from "@/hooks/coworking/use-evento-activo-coworking"
import { EventoActivoBannerCoworking } from "@/components/coworking/evento-activo-banner"
import {
  obtenerColorBadge, obtenerColorPunto,
  obtenerTextoEstado, contarPorEstado,
} from "@/lib/coworking/utils"
import { getZonaLetra, getZonaImage, getZonaLabel } from "@/lib/coworking/area-images"
import type { EstadoAsiento, AreaBackendResponse } from "@/lib/coworking/types"
import {
  RefreshCw, Clock, WifiOff,
  Loader2, ImageIcon, Info, Wifi,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HexBackground } from "@/components/shared/hex-background"

// ── Constantes ────────────────────────────────────────────────────────────────

const ESTADOS: { estado: EstadoAsiento; label: string }[] = [
  { estado: "LIBRE",             label: "Libre"             },
  { estado: "OCUPADO",           label: "Ocupado"           },
  { estado: "PARA_COMPARTIR",    label: "Para compartir"    },
  { estado: "COMPARTIDO",        label: "Compartido"        },
  { estado: "LIMPIANDO",         label: "Limpiando"         },
  { estado: "FUERA_DE_SERVICIO", label: "Fuera de servicio" },
]

interface ZonaInfo {
  letra: string; label: string; imagen: string | null
  descripcion: string | null; areas: AreaBackendResponse[]
}

// ── Modal de zona ─────────────────────────────────────────────────────────────
function ZonaModal({ zona, open, onClose, bloqueada }: {
  zona: ZonaInfo | null; open: boolean; onClose: () => void; bloqueada: boolean
}) {
  if (!zona) return null
  const libres   = zona.areas.filter((a) => a.estado === "LIBRE").length
  const ocupados = zona.areas.filter((a) => a.estado === "OCUPADO").length
  const total    = zona.areas.length
  const pct      = total > 0 ? Math.round((ocupados / total) * 100) : 0
  const pctColor = bloqueada ? "#f97316" : pct === 100 ? "#f87171" : pct > 50 ? "#fbbf24" : "#4ade80"

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl border-0 shadow-xl">
        <div className="relative w-full h-52 bg-slate-100 shrink-0">
          {zona.imagen ? (
            <Image src={zona.imagen} alt={zona.label} fill className="object-cover" sizes="448px" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
              <ImageIcon className="w-10 h-10" aria-hidden="true" />
              <span className="text-xs">Sin imagen</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="text-2xl font-bold text-white leading-tight">{zona.label}</p>
            <p className="text-white/60 text-xs mt-0.5">{total} puestos en total</p>
          </div>
        </div>
        <div className="p-5 space-y-4 bg-white">
          <DialogHeader className="p-0 sr-only">
            <DialogTitle>{zona.label}</DialogTitle>
            <DialogDescription>Información de ocupación de {zona.label}</DialogDescription>
          </DialogHeader>
          {bloqueada && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" aria-hidden="true" />
              Esta zona está bloqueada por un evento en curso
            </div>
          )}
          {zona.descripcion && <p className="text-sm text-slate-500 leading-relaxed">{zona.descripcion}</p>}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-center">
              <p className="text-2xl font-bold text-slate-700 leading-none mb-1">{total}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Total</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-3 text-center">
              <p className="text-2xl font-bold text-green-600 leading-none mb-1">{bloqueada ? 0 : libres}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Libres</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-3 text-center">
              <p className="text-2xl font-bold text-red-400 leading-none mb-1">{ocupados}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Ocupados</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Ocupación actual</span>
              <span className="font-bold text-slate-600">{bloqueada ? 100 : pct}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${bloqueada ? 100 : pct}%`, backgroundColor: pctColor }}
                role="progressbar" aria-valuenow={bloqueada ? 100 : pct}
                aria-valuemin={0} aria-valuemax={100} />
            </div>
          </div>
          <Button variant="outline"
            className="w-full rounded-xl h-10 text-sm border-slate-200 hover:bg-slate-50"
            onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Card de puesto ─────────────────────────────────────────────────────────────
function PuestoCard({ area, bloqueada }: { area: AreaBackendResponse; bloqueada: boolean }) {
  return (
    <div className={cn(
      "bg-white/85 backdrop-blur-sm border rounded-2xl p-3.5",
      "flex flex-col items-center gap-2 text-center transition-all duration-150",
      bloqueada        ? "opacity-50 border-slate-100"
        : area.estado === "LIBRE"   ? "border-green-200 hover:border-green-300 hover:shadow-sm"
        : area.estado === "OCUPADO" ? "border-red-100 hover:border-red-200"
        : "border-slate-100 hover:border-slate-200 hover:shadow-sm",
    )}>
      <span className={cn("w-2.5 h-2.5 rounded-full shrink-0",
        bloqueada ? "bg-orange-400" : obtenerColorPunto(area.estado))}
        aria-hidden="true" />
      <span className="text-sm font-bold text-slate-800 tracking-wide leading-none">
        {area.nombre}
      </span>
      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full",
        bloqueada ? "bg-orange-100 text-orange-600" : obtenerColorBadge(area.estado))}>
        {bloqueada ? "No disp." : obtenerTextoEstado(area.estado)}
      </span>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function CoworkingPage() {
  const { areas, loading, error, ultimaActualizacion, refetch } = useCoworking()
  const { eventoActivo } = useEventoActivoCoworking()
  const [zonaModal, setZonaModal] = useState<ZonaInfo | null>(null)
  const hayEventoActivo = eventoActivo !== null

  const zonaMap = areas.reduce<Record<string, AreaBackendResponse[]>>((acc, area) => {
    const letra = getZonaLetra(area.nombre)
    if (!acc[letra]) acc[letra] = []
    acc[letra].push(area)
    return acc
  }, {})

  const zonas: ZonaInfo[] = Object.entries(zonaMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letra, areasZona]) => ({
      letra, label: getZonaLabel(letra), imagen: getZonaImage(letra),
      descripcion: areasZona[0]?.descripcion ?? null, areas: areasZona,
    }))

  const total         = areas.length
  const totalLibres   = areas.filter((a) => a.estado === "LIBRE").length
  const totalOcupados = areas.filter((a) => a.estado === "OCUPADO").length
  const pctGlobal     = total > 0 ? Math.round((totalOcupados / total) * 100) : 0

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* ── HexBackground — cubre toda la página ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <HexBackground
          opacity={0.9}
          color="#26a7fc"
          hexSize={28}
          fillOpacity={0.18}
          strokeOpacity={0.22}
          strokeBright={0.70}
        />
      </div>

      {/* Contenido sobre el canvas */}
      <main className="relative z-10 pb-24">

        {/* ── Hero centrado ─────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-12 overflow-hidden">
          <div className="container mx-auto px-4 max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 bg-[#26a7fc]/8 border border-[#26a7fc]/20
                            rounded-full px-4 py-1.5 text-xs font-semibold text-[#1c8fe0] mb-6">
              <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
              Disponibilidad en tiempo real
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900
                           leading-[1.05] tracking-tight mb-5">
              Coworking{" "}
              <span className="text-[#26a7fc]">NODO</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-8">
              Espacio de trabajo colaborativo abierto a la comunidad.
              {total > 0 && ` ${total} puestos disponibles.`}
            </p>

            {/* Stats + botón actualizar */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!loading && total > 0 && (
                <>
                  <div className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold",
                    "bg-white/85 backdrop-blur-sm",
                    hayEventoActivo
                      ? "border-orange-200 text-orange-600"
                      : "border-green-200 text-green-700",
                  )}>
                    <span className={cn("w-2 h-2 rounded-full",
                      hayEventoActivo ? "bg-orange-400" : "bg-green-500")}
                      aria-hidden="true" />
                    <span className="text-xl font-black">
                      {hayEventoActivo ? 0 : totalLibres}
                    </span>
                    libres
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold
                                  bg-white/85 backdrop-blur-sm border-red-200 text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-400" aria-hidden="true" />
                    <span className="text-xl font-black">{totalOcupados}</span>
                    ocupados
                  </div>
                </>
              )}
              <button
                onClick={refetch} disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium
                           border border-slate-200 bg-white/85 backdrop-blur-sm text-slate-600
                           hover:bg-white hover:border-slate-300 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Actualizar disponibilidad"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} aria-hidden="true" />
                Actualizar
              </button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl">

          {/* Barra global */}
          {!loading && total > 0 && (
            <div className="bg-white/85 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500 font-medium">Ocupación global del espacio</span>
                <span className="font-bold text-slate-700">{hayEventoActivo ? 100 : pctGlobal}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${hayEventoActivo ? 100 : pctGlobal}%`,
                    backgroundColor: hayEventoActivo ? "#f97316"
                      : pctGlobal > 80 ? "#f87171"
                      : pctGlobal > 50 ? "#fbbf24"
                      : "#4ade80",
                  }}
                  role="progressbar" aria-valuenow={hayEventoActivo ? 100 : pctGlobal}
                  aria-valuemin={0} aria-valuemax={100} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                <span>{totalLibres} libres · {totalOcupados} ocupados · {total} total</span>
                {ultimaActualizacion && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {ultimaActualizacion}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Banner evento */}
          {eventoActivo && (
            <div className="mb-8"><EventoActivoBannerCoworking evento={eventoActivo} /></div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#26a7fc]/8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#26a7fc]" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-400">Cargando disponibilidad...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4
                            bg-white/85 backdrop-blur-sm border border-slate-200 rounded-2xl text-center px-8">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <WifiOff className="w-8 h-8 text-slate-300" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-700 mb-1">Sin conexión</h2>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{error}</p>
              </div>
              <button onClick={refetch}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium
                           border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all">
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          )}

          {/* Zonas */}
          {!loading && !error && (
            <div className="space-y-10">
              {zonas.map((zona) => {
                const libresZona   = zona.areas.filter((a) => a.estado === "LIBRE").length
                const ocupadosZona = zona.areas.filter((a) => a.estado === "OCUPADO").length
                const totalZona    = zona.areas.length
                const pctZona      = totalZona > 0 ? Math.round((ocupadosZona / totalZona) * 100) : 0

                return (
                  <section key={zona.letra} aria-label={`Zona ${zona.label}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-slate-700">{zona.label}</h2>
                        {!hayEventoActivo ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold bg-green-100 text-green-700
                                             border border-green-200 px-2 py-0.5 rounded-full">
                              {libresZona} libres
                            </span>
                            {ocupadosZona > 0 && (
                              <span className="text-[10px] font-semibold bg-red-100 text-red-600
                                               border border-red-200 px-2 py-0.5 rounded-full">
                                {ocupadosZona} ocupados
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold bg-orange-100 text-orange-600
                                           border border-orange-200 px-2 py-0.5 rounded-full">
                            No disponible
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {!hayEventoActivo && (
                          <div className="hidden sm:flex items-center gap-2">
                            <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full"
                                style={{
                                  width: `${pctZona}%`,
                                  backgroundColor: pctZona > 80 ? "#f87171" : pctZona > 50 ? "#fbbf24" : "#4ade80",
                                }} />
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium w-6">{pctZona}%</span>
                          </div>
                        )}
                        <button onClick={() => setZonaModal(zona)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium
                                     text-[#26a7fc] hover:text-[#1c8fe0] px-2.5 py-1 rounded-lg
                                     hover:bg-[#26a7fc]/8 transition-all"
                          aria-label={`Ver información de ${zona.label}`}>
                          <Info className="w-3.5 h-3.5" aria-hidden="true" />
                          Ver zona
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 mb-4" aria-hidden="true" />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {zona.areas
                        .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }))
                        .map((area) => (
                          <PuestoCard key={area.id} area={area} bloqueada={hayEventoActivo} />
                        ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}

          {/* Leyenda */}
          {!loading && total > 0 && !hayEventoActivo && (
            <div className="mt-10 bg-white/85 backdrop-blur-sm border border-slate-200 rounded-2xl p-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Referencia de estados
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {ESTADOS.map(({ estado, label }) => {
                  const count = contarPorEstado(areas, estado)
                  if (count === 0) return null
                  return (
                    <div key={estado} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className={cn("w-2.5 h-2.5 rounded-full shrink-0",
                        obtenerColorPunto(estado))} aria-hidden="true" />
                      <span>{label}</span>
                      <span className="text-slate-400">({count})</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pie */}
          {!loading && !error && total > 0 && (
            <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {ultimaActualizacion
                ? `Actualizado ${ultimaActualizacion}`
                : "Se actualiza automáticamente cada 30 segundos"}
              <span aria-hidden="true">·</span>
              Para reservar, acercate a recepción
            </p>
          )}
        </div>
      </main>

      <ZonaModal
        zona={zonaModal}
        open={zonaModal !== null}
        onClose={() => setZonaModal(null)}
        bloqueada={hayEventoActivo}
      />
    </div>
  )
}
