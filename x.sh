#!/usr/bin/env bash
# =============================================================================
#  feat-eventos-ciudadano.sh
#  Feature: sección /eventos en ciudadano-front
#
#  Crea:
#    lib/eventos/types.ts           → tipos públicos del evento
#    lib/eventos/api.ts             → fetcher GET /events/ciudadanos
#    app/eventos/loading.tsx        → skeleton
#    app/eventos/page.tsx           → tabla de eventos + navegación
#    app/eventos/[id]/page.tsx      → detalle del evento
#    app/eventos/[id]/loading.tsx   → skeleton detalle
#
#  Modifica:
#    Dockerfile                     → agrega NEXT_PUBLIC_CALENDARIO_API_URL
#    .github/workflows/deploy.yml   → agrega secret al build y al run
#
#  Requiere en GitHub Secrets:
#    NEXT_PUBLIC_CALENDARIO_API_URL → URL pública del calendario-back
#                                     Ej: https://calendario.nodo.cc.gob.ar
#
#  Uso:
#    chmod +x feat-eventos-ciudadano.sh
#    ./feat-eventos-ciudadano.sh
# =============================================================================

set -euo pipefail

BOLD="\033[1m"
GREEN="\033[0;32m"
CYAN="\033[0;36m"
YELLOW="\033[1;33m"
RESET="\033[0m"

log()  { echo -e "${CYAN}▶ $*${RESET}"; }
ok()   { echo -e "${GREEN}✅ $*${RESET}"; }
warn() { echo -e "${YELLOW}⚠️  $*${RESET}"; }

if [[ ! -f "package.json" ]]; then
  echo "❌  Ejecutá este script desde la raíz del proyecto ciudadano-front"
  exit 1
fi

echo ""
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${CYAN}  feat: sección eventos → ciudadano-front            ${RESET}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# 1. lib/eventos/types.ts
# ─────────────────────────────────────────────────────────────────────────────
log "Creando lib/eventos/types.ts..."
mkdir -p lib/eventos

cat > lib/eventos/types.ts << 'TS'
/**
 * lib/eventos/types.ts
 * Tipos públicos del calendario-back para ciudadano-front.
 * Solo expone campos relevantes para el ciudadano — sin datos internos.
 */

export type TipoEvento =
  | 'PENDIENTE'
  | 'EN_CURSO'
  | 'FINALIZADO'
  | 'CANCELADO'
  | 'MASIVO'
  | 'ESCOLAR'

export interface EventoCiudadano {
  id:                  string
  titulo:              string
  descripcion?:        string
  informacion:         string
  fechaDesde:          string   // ISO 8601
  fechaHasta:          string   // ISO 8601
  horaDesde:           string   // HH:mm
  horaHasta:           string   // HH:mm
  tipoEvento:          TipoEvento
  contactoCiudadano?:  string
  linkInscripcion?:    string
  mostrarEnCiudadanos: boolean
}

export const TIPO_EVENTO_LABEL: Record<TipoEvento, string> = {
  PENDIENTE:  'Próximo',
  EN_CURSO:   'En curso',
  FINALIZADO: 'Finalizado',
  CANCELADO:  'Cancelado',
  MASIVO:     'Masivo',
  ESCOLAR:    'Escolar',
}

export const TIPO_EVENTO_COLOR: Record<TipoEvento, string> = {
  PENDIENTE:  'bg-blue-100 text-blue-700 border-blue-200',
  EN_CURSO:   'bg-green-100 text-green-700 border-green-200',
  FINALIZADO: 'bg-slate-100 text-slate-500 border-slate-200',
  CANCELADO:  'bg-red-100 text-red-600 border-red-200',
  MASIVO:     'bg-purple-100 text-purple-700 border-purple-200',
  ESCOLAR:    'bg-amber-100 text-amber-700 border-amber-200',
}
TS
ok "lib/eventos/types.ts creado"

# ─────────────────────────────────────────────────────────────────────────────
# 2. lib/eventos/api.ts
# ─────────────────────────────────────────────────────────────────────────────
log "Creando lib/eventos/api.ts..."

cat > lib/eventos/api.ts << 'TS'
/**
 * lib/eventos/api.ts
 * Fetcher para GET /events/ciudadanos del calendario-back.
 * Endpoint público — no requiere autenticación.
 * Base URL: NEXT_PUBLIC_CALENDARIO_API_URL
 */
import type { EventoCiudadano } from './types'

const BASE = (process.env.NEXT_PUBLIC_CALENDARIO_API_URL ?? '').replace(/\/$/, '')

function url(path: string) {
  if (!BASE) throw new Error('[eventos-api] NEXT_PUBLIC_CALENDARIO_API_URL no configurada')
  return `${BASE}${path}`
}

/**
 * Trae todos los eventos con mostrarEnCiudadanos=true.
 * Se puede filtrar por fechaDesde / fechaHasta / tipoEvento.
 */
export async function getEventosCiudadanos(params?: {
  fechaDesde?: string
  fechaHasta?: string
  tipoEvento?: string
}): Promise<EventoCiudadano[]> {
  try {
    const qs = new URLSearchParams({ mostrarEnCiudadanos: 'true' })
    if (params?.fechaDesde) qs.set('fechaDesde', params.fechaDesde)
    if (params?.fechaHasta) qs.set('fechaHasta', params.fechaHasta)
    if (params?.tipoEvento) qs.set('tipoEvento', params.tipoEvento)

    const res = await fetch(url(`/events?${qs}`), {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      console.error(`[eventos-api] GET /events → ${res.status}`)
      return []
    }

    const json = await res.json()
    // El back puede devolver array directo o { data: [...] }
    return (Array.isArray(json) ? json : json?.data ?? []) as EventoCiudadano[]
  } catch (err) {
    console.error('[eventos-api] Error:', err)
    return []
  }
}

/**
 * Trae un evento por ID (verificando que sea público).
 */
export async function getEventoCiudadano(id: string): Promise<EventoCiudadano | null> {
  try {
    const res = await fetch(url(`/events/ciudadanos`), {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    const json = await res.json()
    const lista = (Array.isArray(json) ? json : json?.data ?? []) as EventoCiudadano[]
    return lista.find((e) => e.id === id) ?? null
  } catch {
    return null
  }
}
TS
ok "lib/eventos/api.ts creado"

# ─────────────────────────────────────────────────────────────────────────────
# 3. app/eventos/loading.tsx
# ─────────────────────────────────────────────────────────────────────────────
log "Creando app/eventos/loading.tsx..."
mkdir -p "app/eventos"

cat > "app/eventos/loading.tsx" << 'TSX'
import { Skeleton } from '@/components/ui/skeleton'

export default function EventosLoading() {
  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="space-y-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  )
}
TSX
ok "app/eventos/loading.tsx creado"

# ─────────────────────────────────────────────────────────────────────────────
# 4. app/eventos/page.tsx  ── lista principal con tabla y filtros
# ─────────────────────────────────────────────────────────────────────────────
log "Creando app/eventos/page.tsx..."

cat > "app/eventos/page.tsx" << 'TSX'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ChevronRight, Phone, ExternalLink, Search } from 'lucide-react'
import { getEventosCiudadanos } from '@/lib/eventos/api'
import { TIPO_EVENTO_LABEL, TIPO_EVENTO_COLOR, type TipoEvento } from '@/lib/eventos/types'

export const metadata: Metadata = {
  title: 'Eventos | NODO Tecnológico',
  description: 'Agenda de eventos públicos del Nodo Tecnológico de Catamarca.',
}

// Revalidar cada 60 segundos (ISR)
export const revalidate = 60

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatFechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}

function esMismaFecha(desde: string, hasta: string) {
  return desde.slice(0, 10) === hasta.slice(0, 10)
}

export default async function EventosPage() {
  const eventos = await getEventosCiudadanos()

  // Separar próximos/en curso de pasados
  const hoy = new Date().toISOString().slice(0, 10)
  const proximos  = eventos.filter((e) => e.fechaHasta.slice(0, 10) >= hoy && e.tipoEvento !== 'CANCELADO')
  const pasados   = eventos.filter((e) => e.fechaHasta.slice(0, 10) < hoy  || e.tipoEvento === 'CANCELADO')

  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#26a7fc] uppercase tracking-widest mb-3">
            <span className="h-px w-6 bg-[#26a7fc]" />
            Agenda
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Eventos del Nodo
          </h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Actividades, talleres y jornadas abiertas a la comunidad. Hacé clic en cada evento para ver el detalle e inscribirte.
          </p>
        </div>

        {/* ── Sin eventos ─────────────────────────────────────────────────── */}
        {eventos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Calendar className="h-12 w-12 text-[#26a7fc]/30 mb-4" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-slate-700 mb-1">Sin eventos por ahora</h2>
            <p className="text-sm text-slate-400">Volvé pronto para ver la agenda actualizada.</p>
          </div>
        )}

        {/* ── Próximos eventos ────────────────────────────────────────────── */}
        {proximos.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-slate-200" />
              Próximos y en curso
              <span className="h-px flex-1 bg-slate-200" />
            </h2>
            <div className="space-y-3">
              {proximos.map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))}
            </div>
          </section>
        )}

        {/* ── Pasados ─────────────────────────────────────────────────────── */}
        {pasados.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-slate-100" />
              Realizados
              <span className="h-px flex-1 bg-slate-100" />
            </h2>
            <div className="space-y-3 opacity-70">
              {pasados.map((evento) => (
                <EventoCard key={evento.id} evento={evento} pasado />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

// ── Card de evento ─────────────────────────────────────────────────────────────
function EventoCard({
  evento,
  pasado = false,
}: {
  evento: Awaited<ReturnType<typeof getEventosCiudadanos>>[number]
  pasado?: boolean
}) {
  const hoy  = new Date().toISOString().slice(0, 10)
  const mismaFecha = evento.fechaDesde.slice(0, 10) === evento.fechaHasta.slice(0, 10)
  const badge = TIPO_EVENTO_COLOR[evento.tipoEvento as TipoEvento] ??
    'bg-slate-100 text-slate-500 border-slate-200'
  const label = TIPO_EVENTO_LABEL[evento.tipoEvento as TipoEvento] ?? evento.tipoEvento

  return (
    <Link
      href={`/eventos/${evento.id}`}
      className="group flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-4 hover:border-[#26a7fc]/40 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {/* Fecha */}
      <div className="hidden sm:flex flex-col items-center justify-center w-14 shrink-0 text-center">
        <span className="text-2xl font-bold text-slate-800 leading-none">
          {new Date(evento.fechaDesde).getUTCDate()}
        </span>
        <span className="text-xs text-slate-400 uppercase mt-0.5">
          {new Date(evento.fechaDesde).toLocaleDateString('es-AR', { month: 'short' })}
        </span>
      </div>

      <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge}`}>
            {label}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {evento.horaDesde} – {evento.horaHasta}
          </span>
          {!mismaFecha && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              hasta {new Date(evento.fechaHasta).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-[#26a7fc] transition-colors">
          {evento.titulo}
        </p>
        {evento.descripcion && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{evento.descripcion}</p>
        )}
      </div>

      {/* Acciones rápidas */}
      <div className="flex items-center gap-2 shrink-0">
        {evento.linkInscripcion && !pasado && (
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-[#26a7fc] font-medium border border-[#26a7fc]/30 rounded-lg px-2.5 py-1 bg-[#26a7fc]/5">
            Inscribirse
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#26a7fc] transition-colors" />
      </div>
    </Link>
  )
}
TSX
ok "app/eventos/page.tsx creado"

# ─────────────────────────────────────────────────────────────────────────────
# 5. app/eventos/[id]/loading.tsx
# ─────────────────────────────────────────────────────────────────────────────
log "Creando app/eventos/[id]/loading.tsx..."
mkdir -p "app/eventos/[id]"

cat > "app/eventos/[id]/loading.tsx" << 'TSX'
import { Skeleton } from '@/components/ui/skeleton'

export default function EventoDetalleLoading() {
  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
    </main>
  )
}
TSX
ok "app/eventos/[id]/loading.tsx creado"

# ─────────────────────────────────────────────────────────────────────────────
# 6. app/eventos/[id]/page.tsx  ── detalle del evento
# ─────────────────────────────────────────────────────────────────────────────
log "Creando app/eventos/[id]/page.tsx..."

cat > "app/eventos/[id]/page.tsx" << 'TSX'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Calendar, Clock, Phone, Mail, ExternalLink, Info,
} from 'lucide-react'
import { getEventoCiudadano, getEventosCiudadanos } from '@/lib/eventos/api'
import { TIPO_EVENTO_LABEL, TIPO_EVENTO_COLOR, type TipoEvento } from '@/lib/eventos/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const evento = await getEventoCiudadano(id)
  if (!evento) return { title: 'Evento no encontrado | NODO' }
  return {
    title: `${evento.titulo} | NODO Tecnológico`,
    description: evento.descripcion ?? evento.informacion.slice(0, 160),
  }
}

export const revalidate = 60

export default async function EventoDetallePage({ params }: Props) {
  const { id } = await params
  const evento = await getEventoCiudadano(id)

  if (!evento) notFound()

  const mismaFecha   = evento.fechaDesde.slice(0, 10) === evento.fechaHasta.slice(0, 10)
  const badge        = TIPO_EVENTO_COLOR[evento.tipoEvento as TipoEvento] ?? 'bg-slate-100 text-slate-500 border-slate-200'
  const label        = TIPO_EVENTO_LABEL[evento.tipoEvento as TipoEvento] ?? evento.tipoEvento
  const hoy          = new Date().toISOString().slice(0, 10)
  const esPasado     = evento.fechaHasta.slice(0, 10) < hoy
  const tieneContacto = evento.contactoCiudadano || evento.linkInscripcion

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  // Detectar si el contacto es email o teléfono
  const esEmail = evento.contactoCiudadano?.includes('@')

  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <Link
          href="/eventos"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#26a7fc] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>

        {/* ── Badge estado ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full border ${badge}`}>
            {label}
          </span>
          {esPasado && (
            <span className="text-xs text-slate-400 font-medium">Este evento ya finalizó</span>
          )}
        </div>

        {/* ── Título ───────────────────────────────────────────────────────── */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-snug">
          {evento.titulo}
        </h1>
        {evento.descripcion && (
          <p className="text-slate-500 text-base mb-8">{evento.descripcion}</p>
        )}

        {/* ── Fecha y hora ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 flex-1">
            <Calendar className="h-5 w-5 text-[#26a7fc] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Fecha</p>
              <p className="text-sm font-semibold text-slate-800 capitalize">
                {formatFecha(evento.fechaDesde)}
              </p>
              {!mismaFecha && (
                <p className="text-xs text-slate-400 mt-0.5">
                  hasta el {formatFecha(evento.fechaHasta)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 flex-1">
            <Clock className="h-5 w-5 text-[#26a7fc] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Horario</p>
              <p className="text-sm font-semibold text-slate-800">
                {evento.horaDesde} – {evento.horaHasta} hs
              </p>
            </div>
          </div>
        </div>

        {/* ── Información ──────────────────────────────────────────────────── */}
        {evento.informacion && (
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-[#26a7fc]" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold text-slate-700">Información</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {evento.informacion}
            </p>
          </div>
        )}

        {/* ── Contacto e inscripción ────────────────────────────────────────── */}
        {tieneContacto && !esPasado && (
          <div className="bg-[#26a7fc]/5 border border-[#26a7fc]/20 rounded-2xl px-6 py-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#26a7fc]">Participar</h2>

            {evento.contactoCiudadano && (
              <div className="flex items-center gap-3">
                {esEmail
                  ? <Mail className="h-4 w-4 text-[#26a7fc] shrink-0" strokeWidth={1.5} />
                  : <Phone className="h-4 w-4 text-[#26a7fc] shrink-0" strokeWidth={1.5} />
                }
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">
                    {esEmail ? 'Email de contacto' : 'Teléfono de contacto'}
                  </p>
                  {esEmail ? (
                    <a
                      href={`mailto:${evento.contactoCiudadano}`}
                      className="text-sm font-medium text-[#26a7fc] hover:underline"
                    >
                      {evento.contactoCiudadano}
                    </a>
                  ) : (
                    <a
                      href={`tel:${evento.contactoCiudadano}`}
                      className="text-sm font-medium text-[#26a7fc] hover:underline"
                    >
                      {evento.contactoCiudadano}
                    </a>
                  )}
                </div>
              </div>
            )}

            {evento.linkInscripcion && (
              <a
                href={evento.linkInscripcion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#26a7fc] hover:bg-[#1c8fe0] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm shadow-[#26a7fc]/30"
              >
                Inscribirse
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

        {/* Mensaje si es pasado pero tiene contacto */}
        {tieneContacto && esPasado && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-400 text-center">
            Este evento ya finalizó. Seguí la agenda para próximas ediciones.
          </div>
        )}

      </div>
    </main>
  )
}
TSX
ok "app/eventos/[id]/page.tsx creado"

# ─────────────────────────────────────────────────────────────────────────────
# 7. Actualizar Dockerfile  ── agregar NEXT_PUBLIC_CALENDARIO_API_URL
# ─────────────────────────────────────────────────────────────────────────────
log "Actualizando Dockerfile..."

if [[ ! -f "Dockerfile" ]]; then
  warn "Dockerfile no encontrado — omitido"
else
  cp Dockerfile Dockerfile.bak.$(date +%Y%m%d_%H%M%S)

  node << 'JSEOF'
const fs  = require('fs')
const src = fs.readFileSync('Dockerfile', 'utf8')

// ── 1. Agregar mount en el bloque RUN --mount ─────────────────────────────
const mountAnchor = '--mount=type=secret,id=NEXT_PUBLIC_COWORKING_URL \\'
const mountNew    = '--mount=type=secret,id=NEXT_PUBLIC_COWORKING_URL \\\n    --mount=type=secret,id=NEXT_PUBLIC_CALENDARIO_API_URL \\'

// ── 2. Agregar la variable de entorno en el bloque ENV del RUN ────────────
const envAnchor = 'NEXT_PUBLIC_COWORKING_URL=$(cat /run/secrets/NEXT_PUBLIC_COWORKING_URL) \\'
const envNew    = 'NEXT_PUBLIC_COWORKING_URL=$(cat /run/secrets/NEXT_PUBLIC_COWORKING_URL) \\\n    NEXT_PUBLIC_CALENDARIO_API_URL=$(cat /run/secrets/NEXT_PUBLIC_CALENDARIO_API_URL) \\'

let out = src
let changed = false

if (!src.includes('NEXT_PUBLIC_CALENDARIO_API_URL')) {
  if (src.includes(mountAnchor)) {
    out = out.replace(mountAnchor, mountNew)
    changed = true
    console.log('✅ Mount agregado al Dockerfile')
  } else {
    console.log('⚠️  No se encontró anchor de mount en Dockerfile — revisá manualmente')
  }

  if (out.includes(envAnchor)) {
    out = out.replace(envAnchor, envNew)
    changed = true
    console.log('✅ ENV NEXT_PUBLIC_CALENDARIO_API_URL agregado al Dockerfile')
  } else {
    console.log('⚠️  No se encontró anchor de ENV en Dockerfile — revisá manualmente')
  }

  if (changed) fs.writeFileSync('Dockerfile', out)
} else {
  console.log('ℹ️  Dockerfile ya tiene NEXT_PUBLIC_CALENDARIO_API_URL')
}
JSEOF
  ok "Dockerfile actualizado"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 8. Actualizar .github/workflows/deploy.yml
# ─────────────────────────────────────────────────────────────────────────────
log "Actualizando .github/workflows/deploy.yml..."

DEPLOY_YML=".github/workflows/deploy.yml"
if [[ ! -f "$DEPLOY_YML" ]]; then
  warn "$DEPLOY_YML no encontrado — omitido"
else
  cp "$DEPLOY_YML" "${DEPLOY_YML}.bak.$(date +%Y%m%d_%H%M%S)"

  node << 'JSEOF'
const fs   = require('fs')
const path = '.github/workflows/deploy.yml'
let src    = fs.readFileSync(path, 'utf8')

if (src.includes('NEXT_PUBLIC_CALENDARIO_API_URL')) {
  console.log('ℹ️  deploy.yml ya tiene NEXT_PUBLIC_CALENDARIO_API_URL')
  process.exit(0)
}

// Agregar en la sección secrets del build step
const secretsAnchor = 'NEXT_PUBLIC_COWORKING_URL=${{ secrets.NEXT_PUBLIC_COWORKING_URL }}'
const secretsNew    = `NEXT_PUBLIC_COWORKING_URL=\${{ secrets.NEXT_PUBLIC_COWORKING_URL }}
            NEXT_PUBLIC_CALENDARIO_API_URL=\${{ secrets.NEXT_PUBLIC_CALENDARIO_API_URL }}`

if (src.includes(secretsAnchor)) {
  src = src.replace(secretsAnchor, secretsNew)
  console.log('✅ Secret NEXT_PUBLIC_CALENDARIO_API_URL agregado a deploy.yml (build secrets)')
} else {
  console.log('⚠️  No se encontró anchor en deploy.yml — agregá manualmente:')
  console.log('    NEXT_PUBLIC_CALENDARIO_API_URL=${{ secrets.NEXT_PUBLIC_CALENDARIO_API_URL }}')
  console.log('    bajo la sección secrets del step "Build y push imagen"')
}

fs.writeFileSync(path, src)
JSEOF
  ok "deploy.yml actualizado"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 9. Agregar /eventos al header de navegación si existe lib/header.ts
# ─────────────────────────────────────────────────────────────────────────────
log "Verificando lib/header.ts para agregar /eventos..."

if [[ -f "lib/header.ts" ]]; then
  node << 'JSEOF'
const fs  = require('fs')
const src = fs.readFileSync('lib/header.ts', 'utf8')

if (src.includes('/eventos')) {
  console.log('ℹ️  /eventos ya está en header.ts')
  process.exit(0)
}

// Intentar insertar después de /noticias o antes del cierre del array de nav
const anchor1 = `{ href: '/noticias',`
const anchor2 = `href: '/noticias'`

if (src.includes(anchor1)) {
  // Buscar el cierre de ese objeto y agregar /eventos después
  const newEntry = `{ href: '/eventos', label: 'Eventos' },\n  `
  // Insertar antes de la línea de noticias para que quede en orden
  const noticiaIdx = src.indexOf(anchor1)
  const lineStart = src.lastIndexOf('\n', noticiaIdx) + 1
  const newSrc = src.slice(0, lineStart) + newEntry + src.slice(lineStart)
  fs.writeFileSync('lib/header.ts', newSrc)
  console.log('✅ /eventos agregado al nav en header.ts')
} else {
  console.log('⚠️  No se pudo agregar /eventos automáticamente a header.ts — agregá manualmente:')
  console.log('    { href: "/eventos", label: "Eventos" }')
}
JSEOF
else
  warn "lib/header.ts no encontrado — agregá /eventos al nav manualmente"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 10. Verificar TypeScript
# ─────────────────────────────────────────────────────────────────────────────
echo ""
log "Verificando TypeScript..."
if command -v pnpm &>/dev/null; then
  pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -30 || true
else
  warn "pnpm no encontrado — omitiendo verificación TypeScript"
fi

# ─────────────────────────────────────────────────────────────────────────────
# Resumen
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  ✅  ciudadano-front: sección /eventos lista        ${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════════════════${RESET}"
echo ""
echo "  Archivos creados:"
echo "    lib/eventos/types.ts"
echo "    lib/eventos/api.ts"
echo "    app/eventos/page.tsx"
echo "    app/eventos/loading.tsx"
echo "    app/eventos/[id]/page.tsx"
echo "    app/eventos/[id]/loading.tsx"
echo ""
echo "  Archivos modificados:"
echo "    Dockerfile"
echo "    .github/workflows/deploy.yml"
echo "    lib/header.ts  (si existía)"
echo ""
echo -e "${YELLOW}  ⚠️  ACCIÓN MANUAL requerida:${RESET}"
echo ""
echo "  Agregar en GitHub Secrets del repo ciudadano-front:"
echo "    NEXT_PUBLIC_CALENDARIO_API_URL = https://TU_URL_CALENDARIO_BACK"
echo ""
echo "  Ejemplo: https://calendario.nodo.cc.gob.ar"
echo "           (la misma URL que tiene NEXT_PUBLIC_API_URL en calendario-front)"
echo ""
echo "  Rutas disponibles:"
echo "    /eventos          → lista de todos los eventos públicos"
echo "    /eventos/[id]     → detalle con contacto e inscripción"
echo ""
echo -e "${BOLD}  Git commit:${RESET}"
echo ""
echo "  git add . && git commit -m \"feat(eventos): sección eventos públicos en ciudadano-front\" && git push origin main"
echo ""