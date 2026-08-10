/**
 * lib/noticias/api.ts
 * Fetcher server-side para noticias-back.
 * Usa NOTICIAS_API_URL (variable de servidor, red_interna Docker).
 */
import type { Noticia, NoticiasResponse } from './types'

const API_URL = (
  process.env.NOTICIAS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ''
).replace(/\/$/, '')

interface FetchNoticiasParams {
  page?:       number
  limit?:      number
  search?:     string
  categoriaId?: string
  tagId?:      string
}

export async function getNoticias(
  params: FetchNoticiasParams = {},
): Promise<NoticiasResponse> {
  const EMPTY: NoticiasResponse = { items: [], total: 0, page: 1, limit: 9, pages: 0 }

  if (!API_URL) {
    console.warn('[noticias-api] NOTICIAS_API_URL no definida')
    return EMPTY
  }

  try {
    const qs = new URLSearchParams()
    qs.set('estado', 'PUBLICADA')                          // solo publicadas
    qs.set('page',   String(params.page  ?? 1))
    qs.set('limit',  String(params.limit ?? 9))
    if (params.search)      qs.set('search',      params.search)
    if (params.categoriaId) qs.set('categoriaId', params.categoriaId)
    if (params.tagId)       qs.set('tagId',       params.tagId)

    const res = await fetch(`${API_URL}/api/v1/noticias?${qs}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error(`[noticias-api] GET /noticias → ${res.status}`)
      return EMPTY
    }

    const json = await res.json() as { data?: NoticiasResponse } & NoticiasResponse
    const data = (json.data ?? json) as NoticiasResponse
    return data
  } catch (err) {
    console.error('[noticias-api] Error:', err)
    return EMPTY
  }
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/noticias/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = await res.json() as { data?: Noticia } & Noticia
    return (json.data ?? json) as Noticia
  } catch {
    return null
  }
}
