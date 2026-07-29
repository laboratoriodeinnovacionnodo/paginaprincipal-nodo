// lib/cursos/api.ts
// Cliente público para cursos-nodo-back.
// GET /courses y GET /courses/by-slug/:slug son @Public() — sin API key.
// Variable: NEXT_PUBLIC_CURSOS_API_URL

import type { CursosListResponse, CursoBack } from './types'

const BASE = (process.env.NEXT_PUBLIC_CURSOS_API_URL ?? '').replace(/\/$/, '')

function url(path: string) {
  if (!BASE) throw new Error('[cursos-api] NEXT_PUBLIC_CURSOS_API_URL no configurada')
  return `${BASE}/api/v1${path}`
}

export async function getCursos(params?: {
  page?: number; limit?: number; search?: string
}): Promise<CursosListResponse> {
  const qs = new URLSearchParams()
  if (params?.page)   qs.set('page',   String(params.page))
  if (params?.limit)  qs.set('limit',  String(params.limit))
  if (params?.search) qs.set('search', params.search)
  const res = await fetch(url(`/courses${qs.size ? `?${qs}` : ''}`), {
    next: { revalidate: 60 },
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`[cursos-api] GET /courses → ${res.status}`)
  const json = await res.json()
  return (json?.data ?? json) as CursosListResponse
}

export async function getCursoBySlug(slug: string): Promise<CursoBack | null> {
  try {
    const res = await fetch(url(`/courses/by-slug/${slug}`), {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`${res.status}`)
    const json = await res.json()
    return (json?.data ?? json) as CursoBack
  } catch { return null }
}
