#!/usr/bin/env bash
# ============================================================================
#  v31-ciudadano-evento-activo-banner.sh  — ciudadano-front
#  Muestra el banner de evento activo en /coworking igual que coworking-front.
#
#  Crea:
#    hooks/coworking/use-evento-activo-coworking.ts  → polling del calendario
#    components/coworking/evento-activo-banner.tsx   → banner naranja
#  Modifica:
#    app/coworking/page.tsx  → agrega el banner y marca zonas bloqueadas
#
#  Variable de entorno requerida (ya existente en el Dockerfile):
#    NEXT_PUBLIC_EVENTOS_API_URL
# ============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; RESET='\033[0m'
ok()   { echo -e "${GREEN}✅  $*${RESET}"; }
warn() { echo -e "${YELLOW}⚠️   $*${RESET}"; }
fail() { echo -e "${RED}❌  $*${RESET}"; exit 1; }

[[ -f "package.json" && -d "app" ]] || fail "Corré desde la raíz de ciudadano-front"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  v31 · ciudadano-front · banner evento activo en /coworking"
echo "════════════════════════════════════════════════════════════"
echo ""

mkdir -p hooks/coworking
mkdir -p components/coworking

# ── hooks/coworking/use-evento-activo-coworking.ts ───────────────────────
echo "📄  hooks/coworking/use-evento-activo-coworking.ts"
cat > hooks/coworking/use-evento-activo-coworking.ts << 'TSEOF'
"use client"

/**
 * hooks/coworking/use-evento-activo-coworking.ts
 *
 * Detecta si hay un evento del calendario-back activo AHORA en el área
 * COWORKING (horario Argentina UTC-3). Polling cada 60s con AbortController.
 *
 * Misma lógica que coworking-front/hooks/use-evento-activo.ts.
 * Variable requerida: NEXT_PUBLIC_EVENTOS_API_URL
 */

import { useState, useEffect, useRef } from "react"

const EVENTOS_BASE      = process.env.NEXT_PUBLIC_EVENTOS_API_URL ?? ""
const INTERVALO_MS      = 60_000
const ESTADOS_INACTIVOS = new Set(["CANCELADO", "FINALIZADO"])

export interface EventoActivoCoworking {
  id:         string
  titulo:     string
  fechaDesde: string
  fechaHasta: string
  horaDesde:  string
  horaHasta:  string
  tipoEvento: string
  areas?:     string[]
  organizadorSolicitante?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function ahoraArgentina(): { fecha: string; minutos: number } {
  const ar      = new Date(Date.now() - 3 * 60 * 60 * 1000)
  const fecha   = ar.toISOString().split("T")[0]
  const minutos = ar.getUTCHours() * 60 + ar.getUTCMinutes()
  return { fecha, minutos }
}

function estaActivoAhora(ev: EventoActivoCoworking): boolean {
  if (ESTADOS_INACTIVOS.has(ev.tipoEvento)) return false
  if (!Array.isArray(ev.areas) || !ev.areas.includes("COWORKING")) return false

  const { fecha, minutos } = ahoraArgentina()
  const evDesde = ev.fechaDesde.split("T")[0]
  const evHasta = ev.fechaHasta.split("T")[0]

  if (fecha < evDesde || fecha > evHasta) return false

  const inicioMin = timeToMinutes(ev.horaDesde)
  const finMin    = timeToMinutes(ev.horaHasta)

  if (evDesde === evHasta) return minutos >= inicioMin && minutos < finMin
  if (fecha === evDesde)   return minutos >= inicioMin
  if (fecha === evHasta)   return minutos < finMin
  return true
}

async function fetchEventoActivo(
  signal: AbortSignal,
): Promise<EventoActivoCoworking | null> {
  if (!EVENTOS_BASE) return null

  try {
    const { fecha } = ahoraArgentina()
    const [y, m]    = fecha.split("-").map(Number)

    // Consultar mes actual y el siguiente si estamos al final del mes
    const meses: { y: number; m: number }[] = [{ y, m }]
    const diasEnMes = new Date(y, m, 0).getDate()
    const diaActual = Number(fecha.split("-")[2])
    if (diasEnMes - diaActual <= 3) {
      meses.push(m === 12 ? { y: y + 1, m: 1 } : { y, m: m + 1 })
    }

    const resultados = await Promise.all(
      meses.map(async ({ y, m }) => {
        try {
          const res = await fetch(
            `${EVENTOS_BASE}/calendar?year=${y}&month=${m}`,
            { cache: "no-store", signal },
          )
          if (!res.ok) return []
          const data = await res.json()
          return (data.events ?? []) as EventoActivoCoworking[]
        } catch {
          return []
        }
      }),
    )

    const todos = resultados.flat()

    // Deduplicar
    const vistos = new Set<string>()
    const unicos = todos.filter((e) => {
      if (vistos.has(e.id)) return false
      vistos.add(e.id)
      return true
    })

    return unicos.find(estaActivoAhora) ?? null
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null
    return null
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useEventoActivoCoworking() {
  const [eventoActivo, setEventoActivo] = useState<EventoActivoCoworking | null>(null)
  const [cargando,     setCargando]     = useState(true)

  const abortRef    = useRef<AbortController | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let montado = true

    const ejecutar = async () => {
      if (abortRef.current) abortRef.current.abort()
      abortRef.current = new AbortController()

      const activo = await fetchEventoActivo(abortRef.current.signal)

      if (montado) {
        setEventoActivo(activo)
        setCargando(false)
      }
    }

    ejecutar()
    intervalRef.current = setInterval(ejecutar, INTERVALO_MS)

    return () => {
      montado = false
      if (abortRef.current) { abortRef.current.abort(); abortRef.current = null }
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    }
  }, [])

  return { eventoActivo, cargando }
}
TSEOF
ok "hooks/coworking/use-evento-activo-coworking.ts"

# ── components/coworking/evento-activo-banner.tsx ─────────────────────────
echo "📄  components/coworking/evento-activo-banner.tsx"
cat > components/coworking/evento-activo-banner.tsx << 'TSEOF'
"use client"

/**
 * components/coworking/evento-activo-banner.tsx
 * Banner naranja que avisa al ciudadano que el coworking está bloqueado
 * por un evento en curso. Misma estética que coworking-front.
 */

import type { EventoActivoCoworking } from "@/hooks/coworking/use-evento-activo-coworking"
import { AlertTriangle, CalendarDays, Clock } from "lucide-react"

const TIPO_LABEL: Record<string, string> = {
  PENDIENTE:  "Pendiente",
  EN_CURSO:   "En curso",
  FINALIZADO: "Finalizado",
  CANCELADO:  "Cancelado",
  MASIVO:     "Masivo",
  ESCOLAR:    "Escolar",
}

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    weekday: "short", day: "numeric", month: "short",
  })
}

interface EventoActivoBannerProps {
  evento: EventoActivoCoworking
}

export function EventoActivoBannerCoworking({ evento }: EventoActivoBannerProps) {
  const mismaFecha =
    evento.fechaDesde.split("T")[0] === evento.fechaHasta.split("T")[0]

  return (
    <div
      role="alert"
      className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3.5 flex items-start gap-3"
    >
      {/* Ícono */}
      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />

      {/* Contenido */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Título + badge tipo */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-orange-900">
            Coworking no disponible — evento en curso
          </p>
          <span className="text-[10px] font-semibold border border-orange-300 text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded-full">
            {TIPO_LABEL[evento.tipoEvento] ?? evento.tipoEvento}
          </span>
        </div>

        {/* Nombre del evento */}
        <p className="text-sm font-medium text-orange-800 truncate">
          {evento.titulo}
        </p>

        {/* Fecha y horario */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-orange-700">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {mismaFecha
              ? formatFecha(evento.fechaDesde)
              : `${formatFecha(evento.fechaDesde)} → ${formatFecha(evento.fechaHasta)}`}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {evento.horaDesde} – {evento.horaHasta}
          </span>
          {evento.organizadorSolicitante && (
            <span className="text-orange-600 truncate max-w-[180px]">
              {evento.organizadorSolicitante}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
TSEOF
ok "components/coworking/evento-activo-banner.tsx"

# ── app/coworking/page.tsx — integrar hook + banner ──────────────────────
echo "📄  app/coworking/page.tsx"
cat > app/coworking/page.tsx << 'TSEOF'
"use client"

import { useState } from "react"
import Image        from "next/image"
import { Badge }    from "@/components/ui/badge"
import { Button }   from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCoworking }   from "@/hooks/coworking/use-coworking"
import { useEventoActivoCoworking } from "@/hooks/coworking/use-evento-activo-coworking"
import { EventoActivoBannerCoworking } from "@/components/coworking/evento-activo-banner"
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

interface ZonaInfo {
  letra:       string
  label:       string
  imagen:      string | null
  descripcion: string | null
  areas:       AreaBackendResponse[]
}

// ─── Modal de zona ─────────────────────────────────────────────────────────
function ZonaModal({ zona, open, onClose, bloqueada }: {
  zona:      ZonaInfo | null
  open:      boolean
  onClose:   () => void
  bloqueada: boolean
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

          {/* Aviso si está bloqueada por evento */}
          {bloqueada && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              Esta zona está bloqueada por un evento en curso
            </div>
          )}

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
                  bloqueada ? "bg-orange-400"
                    : pct === 100 ? "bg-red-400"
                    : pct > 50 ? "bg-yellow-400"
                    : "bg-green-400"
                )}
                style={{ width: bloqueada ? "100%" : `${pct}%` }}
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
  const { eventoActivo, cargando: cargandoEvento }              = useEventoActivoCoworking()
  const [zonaModal, setZonaModal] = useState<ZonaInfo | null>(null)

  const hayEventoActivo = eventoActivo !== null

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

        {/* ── Banner evento activo ──────────────────────────────────────── */}
        {eventoActivo && (
          <div className="mb-6">
            <EventoActivoBannerCoworking evento={eventoActivo} />
          </div>
        )}

        {/* ── Resumen global ─────────────────────────────────────────────*/}
        {!loading && total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total</p>
            </div>
            <div className={cn(
              "rounded-2xl border shadow-sm p-4 text-center",
              hayEventoActivo
                ? "bg-orange-50 border-orange-100"
                : "bg-green-50 border-green-100"
            )}>
              <p className={cn("text-2xl font-bold", hayEventoActivo ? "text-orange-500" : "text-green-600")}>
                {hayEventoActivo ? 0 : totalLibres}
              </p>
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
            {zonas.map((zona) => {
              const libres   = zona.areas.filter((a) => a.estado === "LIBRE").length
              const ocupados = zona.areas.filter((a) => a.estado === "OCUPADO").length
              const total    = zona.areas.length
              const pct      = total > 0 ? Math.round((ocupados / total) * 100) : 0

              return (
                <section key={zona.letra}>
                  {/* Cabecera de zona */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest pl-1">
                        {zona.label}
                      </h2>
                      {/* Indicador de bloqueada por evento */}
                      {hayEventoActivo && (
                        <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded-full">
                          No disponible
                        </span>
                      )}
                    </div>
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

                  {/* Grid de cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {zona.areas
                      .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }))
                      .map((area) => (
                        <div
                          key={area.id}
                          className={cn(
                            "bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow",
                            hayEventoActivo && "opacity-50",
                          )}
                        >
                          <span className={cn(
                            "w-3 h-3 rounded-full flex-shrink-0",
                            hayEventoActivo ? "bg-orange-400" : obtenerColorPunto(area.estado),
                          )} />
                          <span className="text-sm font-bold text-gray-800 tracking-wide">
                            {area.nombre}
                          </span>
                          <Badge
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full border-0 font-medium",
                              hayEventoActivo
                                ? "bg-orange-100 text-orange-600"
                                : obtenerColorBadge(area.estado),
                            )}
                          >
                            {hayEventoActivo ? "No disponible" : obtenerTextoEstado(area.estado)}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {/* ── Leyenda ────────────────────────────────────────────────────*/}
        {!loading && total > 0 && !hayEventoActivo && (
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
            . Para reservar acercate a recepción.
          </p>
        )}

      </main>

      {/* Modal de zona */}
      <ZonaModal
        zona={zonaModal}
        open={zonaModal !== null}
        onClose={() => setZonaModal(null)}
        bloqueada={hayEventoActivo}
      />
    </div>
  )
}
TSEOF
ok "app/coworking/page.tsx"

# ── TypeScript check ──────────────────────────────────────────────────────
echo ""
echo "🔨  TypeScript check..."
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -40 || true

echo ""
echo "🔨  Build..."
pnpm build

echo ""
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo -e "\033[0;32m  ✅  v31 completado\033[0m"
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo ""
echo "  Archivos creados:"
echo "    hooks/coworking/use-evento-activo-coworking.ts"
echo "    components/coworking/evento-activo-banner.tsx"
echo ""
echo "  Archivos modificados:"
echo "    app/coworking/page.tsx → banner + zonas con badge 'No disponible'"
echo ""
echo -e "\033[1;33m  ⚠️  Variable requerida (ya en Dockerfile):\033[0m"
echo "    NEXT_PUBLIC_EVENTOS_API_URL"
echo ""