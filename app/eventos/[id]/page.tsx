import type { Metadata }  from 'next'
import Link               from 'next/link'
import { notFound }       from 'next/navigation'
import {
  ArrowLeft, Calendar, Clock, Phone,
  Mail, ExternalLink, Info, MapPin,
} from 'lucide-react'
import { getEventoCiudadano } from '@/lib/eventos/api'
import { TIPO_EVENTO_LABEL, TIPO_EVENTO_COLOR, type TipoEvento } from '@/lib/eventos/types'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id }   = await params
  const evento   = await getEventoCiudadano(id)
  if (!evento) return { title: 'Evento no encontrado | NODO' }
  return {
    title:       `${evento.titulo} | NODO Tecnológico`,
    description: evento.descripcion ?? evento.informacion.slice(0, 160),
    openGraph: {
      title:       `${evento.titulo} | NODO Tecnológico`,
      description: evento.descripcion ?? evento.informacion.slice(0, 160),
    },
  }
}

export const revalidate = 60

// Color del bloque de fecha por tipo
const TIPO_DATE_BG: Record<TipoEvento, string> = {
  PENDIENTE:  'rgba(38,167,252,0.08)',
  EN_CURSO:   'rgba(22,163,74,0.08)',
  FINALIZADO: 'rgba(148,163,184,0.08)',
  CANCELADO:  'rgba(239,68,68,0.08)',
  MASIVO:     'rgba(124,58,237,0.08)',
  ESCOLAR:    'rgba(245,158,11,0.08)',
}
const TIPO_DATE_TEXT: Record<TipoEvento, string> = {
  PENDIENTE:  '#1c8fe0',
  EN_CURSO:   '#15803d',
  FINALIZADO: '#64748b',
  CANCELADO:  '#dc2626',
  MASIVO:     '#7C3AED',
  ESCOLAR:    '#d97706',
}

function formatFechaLarga(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function getDia(iso: string) { return new Date(iso).getUTCDate() }
function getMes(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
}

export default async function EventoDetallePage({ params }: Props) {
  const { id }    = await params
  const evento    = await getEventoCiudadano(id)
  if (!evento) notFound()

  const mismaFecha    = evento.fechaDesde.slice(0, 10) === evento.fechaHasta.slice(0, 10)
  const badgeClass    = TIPO_EVENTO_COLOR[evento.tipoEvento as TipoEvento] ?? 'bg-slate-100 text-slate-500 border-slate-200'
  const label         = TIPO_EVENTO_LABEL[evento.tipoEvento as TipoEvento] ?? evento.tipoEvento
  const hoy           = new Date().toISOString().slice(0, 10)
  const esPasado      = evento.fechaHasta.slice(0, 10) < hoy
  const tieneContacto = evento.contactoCiudadano || evento.linkInscripcion
  const esEmail       = evento.contactoCiudadano?.includes('@')
  const dateBg        = TIPO_DATE_BG[evento.tipoEvento as TipoEvento]  ?? TIPO_DATE_BG.PENDIENTE
  const dateText      = TIPO_DATE_TEXT[evento.tipoEvento as TipoEvento] ?? TIPO_DATE_TEXT.PENDIENTE

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Breadcrumb */}
        <Link
          href="/eventos"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#26a7fc]
                     transition-colors mb-8 group"
          aria-label="Volver al listado de eventos"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Volver a eventos
        </Link>

        {/* ── Hero del evento ──────────────────────────────────────────── */}
        <div className="flex items-start gap-5 mb-8">

          {/* Bloque de fecha visual */}
          <div
            className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl shrink-0 text-center"
            style={{ backgroundColor: dateBg }}
            aria-label={`Fecha: ${formatFechaLarga(evento.fechaDesde)}`}
          >
            <span className="text-3xl font-black leading-none" style={{ color: dateText }}>
              {getDia(evento.fechaDesde)}
            </span>
            <span className="text-xs font-bold uppercase tracking-wide mt-0.5" style={{ color: dateText }}>
              {getMes(evento.fechaDesde)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Badge tipo */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`inline-flex text-xs font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
                {label}
              </span>
              {esPasado && (
                <span className="text-xs text-slate-400 font-medium">Este evento ya finalizó</span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-snug text-balance mb-2">
              {evento.titulo}
            </h1>

            {/* Descripción */}
            {evento.descripcion && (
              <p className="text-slate-500 text-base leading-relaxed">
                {evento.descripcion}
              </p>
            )}
          </div>
        </div>

        {/* ── Cards de fecha y hora ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

          {/* Fecha */}
          <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4">
            <div className="h-9 w-9 rounded-xl bg-[#26a7fc]/8 flex items-center justify-center shrink-0">
              <Calendar className="h-4.5 w-4.5 text-[#26a7fc]" aria-hidden="true" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Fecha</p>
              <p className="text-sm font-semibold text-slate-800 capitalize leading-snug">
                {formatFechaLarga(evento.fechaDesde)}
              </p>
              {!mismaFecha && (
                <p className="text-xs text-slate-400 mt-0.5">
                  hasta el {formatFechaLarga(evento.fechaHasta)}
                </p>
              )}
            </div>
          </div>

          {/* Horario */}
          <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4">
            <div className="h-9 w-9 rounded-xl bg-[#26a7fc]/8 flex items-center justify-center shrink-0">
              <Clock className="h-4.5 w-4.5 text-[#26a7fc]" aria-hidden="true" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Horario</p>
              <p className="text-sm font-semibold text-slate-800">
                {evento.horaDesde} – {evento.horaHasta} hs
              </p>
            </div>
          </div>
        </div>

        {/* ── Información ──────────────────────────────────────────────── */}
        {evento.informacion && (
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-[#26a7fc]/8 flex items-center justify-center">
                <Info className="h-3.5 w-3.5 text-[#26a7fc]" aria-hidden="true" strokeWidth={1.5} />
              </div>
              <h2 className="text-sm font-bold text-slate-700">Información</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {evento.informacion}
            </p>
          </div>
        )}

        {/* ── Participar ───────────────────────────────────────────────── */}
        {tieneContacto && !esPasado && (
          <div className="bg-[#26a7fc]/5 border border-[#26a7fc]/20 rounded-2xl px-6 py-5 space-y-4">
            <h2 className="text-sm font-bold text-[#26a7fc] flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#26a7fc] animate-pulse" aria-hidden="true" />
              Participar
            </h2>

            {evento.contactoCiudadano && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[#26a7fc]/10 flex items-center justify-center shrink-0">
                  {esEmail
                    ? <Mail  className="h-4 w-4 text-[#26a7fc]" aria-hidden="true" strokeWidth={1.5} />
                    : <Phone className="h-4 w-4 text-[#26a7fc]" aria-hidden="true" strokeWidth={1.5} />
                  }
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium mb-0.5">
                    {esEmail ? 'Email de contacto' : 'Teléfono de contacto'}
                  </p>
                  <a
                    href={esEmail ? `mailto:${evento.contactoCiudadano}` : `tel:${evento.contactoCiudadano}`}
                    className="text-sm font-semibold text-[#26a7fc] hover:text-[#1c8fe0] hover:underline transition-colors"
                  >
                    {evento.contactoCiudadano}
                  </a>
                </div>
              </div>
            )}

            {evento.linkInscripcion && (
              <a
                href={evento.linkInscripcion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl
                           transition-all hover:opacity-90 hover:scale-[1.02] shadow-md shadow-[#26a7fc]/25"
                style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
                aria-label={`Inscribirse al evento: ${evento.titulo}`}
              >
                Inscribirse
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        )}

        {/* Evento pasado */}
        {esPasado && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4
                          text-sm text-slate-400 text-center leading-relaxed">
            Este evento ya finalizó. Seguí la agenda para próximas ediciones.
          </div>
        )}

      </div>
    </main>
  )
}
