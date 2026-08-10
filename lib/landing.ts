/**
 * lib/landing.ts
 * Obtiene la configuración del hero desde noticias-back.
 * Usado como Server Component — no ejecuta en el cliente.
 */

const API_URL = process.env.NOTICIAS_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ''

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
  if (!API_URL) return FALLBACK

  try {
    const res = await fetch(`${API_URL}/api/v1/landing`, {
      next: { revalidate: 60 }, // ISR: refresca cada 60 segundos
    })

    if (!res.ok) return FALLBACK

    const json = await res.json() as { data?: LandingConfig } & LandingConfig
    const data = (json.data ?? json) as LandingConfig

    return {
      titulo:      data.titulo      || FALLBACK.titulo,
      descripcion: data.descripcion || FALLBACK.descripcion,
      videoUrl:    data.videoUrl    || FALLBACK.videoUrl,
    }
  } catch {
    // API no disponible → usa fallback sin romper el build
    return FALLBACK
  }
}
