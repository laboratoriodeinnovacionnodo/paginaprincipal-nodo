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
