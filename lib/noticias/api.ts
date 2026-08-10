/**
 * lib/noticias/api.ts
 * Fetcher robusto que maneja todos los shapes de respuesta del back.
 */
import type { Noticia, NoticiasResponse } from './types'

const API_URL = (
  process.env.NOTICIAS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ''
).replace(/\/$/, '')

const EMPTY: NoticiasResponse = { items: [], total: 0, page: 1, limit: 9, pages: 0 }

/** Extrae el array de items de cualquier shape que devuelva el back */
function extractItems(json: unknown): Noticia[] {
  if (!json || typeof json !== 'object') return []
  const j = json as Record<string, unknown>

  // { data: { items: [] } }
  if (j.data && typeof j.data === 'object') {
    const d = j.data as Record<string, unknown>
    if (Array.isArray(d.items)) return d.items as Noticia[]
    if (Array.isArray(d.data))  return d.data  as Noticia[]
    if (Array.isArray(d))       return d        as Noticia[]
  }

  // { items: [] }
  if (Array.isArray(j.items)) return j.items as Noticia[]

  // { data: [] }
  if (Array.isArray(j.data)) return j.data as Noticia[]

  // respuesta directa []
  if (Array.isArray(json)) return json as Noticia[]

  return []
}

function extractMeta(json: unknown, items: Noticia[]): Omit<NoticiasResponse, 'items'> {
  const j = (json && typeof json === 'object' ? json : {}) as Record<string, unknown>
  const d = (j.data && typeof j.data === 'object' ? j.data : j) as Record<string, unknown>
  return {
    total: Number(d.total ?? items.length),
    page:  Number(d.page  ?? 1),
    limit: Number(d.limit ?? 9),
    pages: Number(d.pages ?? Math.ceil(items.length / 9)),
  }
}

export async function getNoticias(
  params: { page?: number; limit?: number; search?: string; categoriaId?: string; tagId?: string } = {},
): Promise<NoticiasResponse> {
  if (!API_URL) {
    console.warn('[noticias-api] NOTICIAS_API_URL no definida')
    return EMPTY
  }

  try {
    const qs = new URLSearchParams()
    qs.set('estado', 'PUBLICADA')
    qs.set('page',   String(params.page  ?? 1))
    qs.set('limit',  String(params.limit ?? 9))
    if (params.search)      qs.set('search',      params.search)
    if (params.categoriaId) qs.set('categoriaId', params.categoriaId)
    if (params.tagId)       qs.set('tagId',       params.tagId)

    const res = await fetch(`${API_URL}/api/v1/noticias?${qs}`, { cache: 'no-store' })

    if (!res.ok) {
      console.error(`[noticias-api] GET /noticias → ${res.status}`)
      return EMPTY
    }

    const json: unknown = await res.json()
    const items = extractItems(json)
    const meta  = extractMeta(json, items)
    return { items, ...meta }
  } catch (err) {
    console.error('[noticias-api] Error:', err)
    return EMPTY
  }
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/noticias/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json() as { data?: Noticia } & Noticia
    return (json.data ?? json) as Noticia
  } catch {
    return null
  }
}
