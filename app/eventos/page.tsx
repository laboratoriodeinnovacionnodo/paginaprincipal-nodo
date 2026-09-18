import type { Metadata }  from 'next'
import Link               from 'next/link'
import { Calendar, Clock, ChevronRight, CalendarX } from 'lucide-react'
import { getEventosCiudadanos }  from '@/lib/eventos/api'
import { TIPO_EVENTO_LABEL, TIPO_EVENTO_COLOR, type TipoEvento } from '@/lib/eventos/types'
import { PcbBackground }         from '@/components/shared/pcb-background'

export const metadata: Metadata = {
  title:       'Eventos | NODO Tecnológico',
  description: 'Agenda de eventos, talleres y actividades abiertas a la comunidad del Nodo Tecnológico de Catamarca.',
  openGraph: {
    title:       'Eventos | NODO Tecnológico',
    description: 'Agenda de eventos y actividades abiertas a la comunidad.',
    images: [{ url: '/og-eventos.jpg', width: 1200, height: 630, alt: 'Eventos — Nodo Tecnológico' }],
  },
}

export const revalidate = 60

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDia(iso: string)    { return new Date(iso).getUTCDate() }
function getMes(iso: string)    { return new Date(iso).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '') }
function getDiaSem(iso: string) { return new Date(iso).toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '') }

const TIPO_DATE_COLOR: Record<TipoEvento, { bg: string; text: string }> = {
  PENDIENTE:  { bg: 'rgba(38,167,252,0.10)',  text: '#1c8fe0' },
  EN_CURSO:   { bg: 'rgba(22,163,74,0.10)',   text: '#15803d' },
  FINALIZADO: { bg: 'rgba(148,163,184,0.12)', text: '#64748b' },
  CANCELADO:  { bg: 'rgba(239,68,68,0.10)',   text: '#dc2626' },
  MASIVO:     { bg: 'rgba(124,58,237,0.10)',  text: '#7C3AED' },
  ESCOLAR:    { bg: 'rgba(245,158,11,0.10)',  text: '#d97706' },
}

// ── EventoCard ────────────────────────────────────────────────────────────────

function EventoCard({ evento, pasado = false }: {
  evento: Awaited<ReturnType<typeof getEventosCiudadanos>>[number]
  pasado?: boolean
}) {
  const mismaFecha = evento.fechaDesde.slice(0, 10) === evento.fechaHasta.slice(0, 10)
  const badgeClass = TIPO_EVENTO_COLOR[evento.tipoEvento as TipoEvento] ?? 'bg-slate-100 text-slate-500 border-slate-200'
  const label      = TIPO_EVENTO_LABEL[evento.tipoEvento as TipoEvento] ?? evento.tipoEvento
  const dc         = TIPO_DATE_COLOR[evento.tipoEvento as TipoEvento]   ?? TIPO_DATE_COLOR.PENDIENTE

  return (
    <Link
      href={`/eventos/${evento.id}`}
      className="group flex items-stretch bg-white/85 backdrop-blur-sm border border-slate-200
                 rounded-2xl overflow-hidden transition-all duration-200 ease-out
                 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(38,167,252,0.10)]
                 hover:border-[#26a7fc]/30"
      aria-label={`Ver detalle del evento: ${evento.titulo}`}
    >
      {/* Bloque de fecha */}
      <div
        className="hidden sm:flex flex-col items-center justify-center w-20 shrink-0
                   px-3 text-center border-r border-slate-100"
        style={{ backgroundColor: dc.bg }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: dc.text }}>
          {getDiaSem(evento.fechaDesde)}
        </span>
        <span className="text-3xl font-black leading-none my-0.5" style={{ color: dc.text }}>
          {getDia(evento.fechaDesde)}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: dc.text }}>
          {getMes(evento.fechaDesde)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 px-5 py-4 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {label}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {evento.horaDesde} – {evento.horaHasta} hs
          </span>
          {!mismaFecha && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              hasta {getDia(evento.fechaHasta)} {getMes(evento.fechaHasta)}
            </span>
          )}
          <span className="sm:hidden text-[10px] font-semibold text-slate-400 ml-auto">
            {getDia(evento.fechaDesde)} {getMes(evento.fechaDesde)}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 truncate leading-snug
                      group-hover:text-[#26a7fc] transition-colors duration-200">
          {evento.titulo}
        </p>
        {evento.descripcion && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{evento.descripcion}</p>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2 pr-4 shrink-0">
        {evento.linkInscripcion && !pasado && (
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold
                           text-[#26a7fc] border border-[#26a7fc]/30 rounded-lg px-2.5 py-1
                           bg-[#26a7fc]/5 group-hover:bg-[#26a7fc]/10 transition-colors">
            Inscribirse
          </span>
        )}
        <ChevronRight
          className="h-4 w-4 text-slate-300 group-hover:text-[#26a7fc] transition-colors"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────

export default async function EventosPage() {
  const eventos  = await getEventosCiudadanos()
  const hoy      = new Date().toISOString().slice(0, 10)
  const proximos = eventos.filter((e) => e.fechaHasta.slice(0, 10) >= hoy && e.tipoEvento !== 'CANCELADO')
  const pasados  = eventos.filter((e) => e.fechaHasta.slice(0, 10) < hoy  || e.tipoEvento === 'CANCELADO')

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* ── PcbBackground — cubre toda la página ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <PcbBackground
          opacity={0.9}
          color="#26a7fc"
          gridGap={24}
          nodeRadius={2.2}
          traceOpacity={0.22}
          nodeOpacity={0.75}
          pulseSpeed={0.022}
        />
      </div>

      {/* Contenido sobre el canvas */}
      <main className="relative z-10">

        {/* ── Hero centrado ─────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-12 overflow-hidden">
          <div className="container mx-auto px-4 max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 bg-[#26a7fc]/8 border border-[#26a7fc]/20
                            rounded-full px-4 py-1.5 text-xs font-semibold text-[#1c8fe0] mb-6">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Agenda del Nodo
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900
                           leading-[1.05] tracking-tight mb-5">
              Eventos del{" "}
              <span className="text-[#26a7fc]">Nodo</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-8">
              Actividades, talleres y jornadas abiertas a la comunidad.
              Hacé clic en cada evento para ver el detalle e inscribirte.
            </p>

            {proximos.length > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-sm
                              border border-slate-200 rounded-full px-5 py-2 shadow-sm
                              text-sm text-slate-500">
                <span className="font-black text-[#26a7fc] text-base">{proximos.length}</span>
                {proximos.length === 1 ? 'evento próximo' : 'eventos próximos'}
              </div>
            )}
          </div>
        </section>

        {/* ── Listado ───────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 max-w-3xl pb-24">

          {/* Empty state */}
          {eventos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 text-center
                            bg-white/85 backdrop-blur-sm border border-slate-200 rounded-2xl">
              <div className="h-16 w-16 rounded-2xl bg-[#26a7fc]/8 flex items-center justify-center mb-5">
                <CalendarX className="h-8 w-8 text-[#26a7fc]/40" aria-hidden="true" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-slate-700 mb-2">Sin eventos por ahora</h2>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Volvé pronto para ver la agenda actualizada.
              </p>
            </div>
          )}

          {/* Próximos */}
          {proximos.length > 0 && (
            <section className="mb-12" aria-label="Próximos eventos">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Próximos y en curso
                </h2>
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-3">
                {proximos.map((evento) => (
                  <EventoCard key={evento.id} evento={evento} />
                ))}
              </div>
            </section>
          )}

          {/* Pasados */}
          {pasados.length > 0 && (
            <section aria-label="Eventos realizados">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px flex-1 bg-slate-100" aria-hidden="true" />
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
                  Realizados
                </h2>
                <span className="h-px flex-1 bg-slate-100" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-3 opacity-60">
                {pasados.map((evento) => (
                  <EventoCard key={evento.id} evento={evento} pasado />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
