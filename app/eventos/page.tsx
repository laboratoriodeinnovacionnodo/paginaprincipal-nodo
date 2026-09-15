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
