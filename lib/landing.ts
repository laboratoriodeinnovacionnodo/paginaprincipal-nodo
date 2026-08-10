/**
 * lib/landing.ts
 * Server Component — fetch siempre fresco (no ISR).
 *
 * NOTICIAS_API_URL es una variable de entorno de SERVIDOR (sin NEXT_PUBLIC_),
 * disponible solo en runtime dentro del contenedor Docker (red_interna).
 * Valor esperado: http://noticias-back:3000
 */

const API_URL = (
  process.env.NOTICIAS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ''
).replace(/\/$/, '')

export interface LandingConfig {
  titulo:      string
  descripcion: string
  videoUrl:    string
}

const FALLBACK: LandingConfig = {
  titulo:      'Conecta, Innova y Crea el Futuro',
  descripcion: 'El Nodo Tecnológico de Catamarca conecta innovación y Tecnología, impulsando a los jóvenes hacia las habilidades del futuro a través de cursos especializados.',
  videoUrl:    'https://www.pexels.com/download/video/14994578/',
}

export async function getLandingConfig(): Promise<LandingConfig> {
  if (!API_URL) {
    console.warn('[landing] NOTICIAS_API_URL no definida — usando fallback')
    return FALLBACK
  }

  try {
    const url = `${API_URL}/api/v1/landing`
    const res = await fetch(url, {
      cache: 'no-store', // siempre fresco, sin ISR que se rompe en standalone
    })

    if (!res.ok) {
      console.error(`[landing] GET ${url} → ${res.status}`)
      return FALLBACK
    }

    const json = await res.json() as { data?: LandingConfig } & LandingConfig
    const data = (json.data ?? json) as LandingConfig

    return {
      titulo:      data.titulo      || FALLBACK.titulo,
      descripcion: data.descripcion || FALLBACK.descripcion,
      videoUrl:    data.videoUrl    || FALLBACK.videoUrl,
    }
  } catch (err) {
    console.error('[landing] Error al obtener config:', err)
    return FALLBACK
  }
}
