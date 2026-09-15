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
    const lista = (Array.isArray(json) ? json : json?.data ?? []) as EventoCiudadano[]
    return lista.filter(e => e.mostrarEnCiudadanos === true)
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
