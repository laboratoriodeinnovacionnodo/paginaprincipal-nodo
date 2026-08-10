import type { Noticia } from './types'

export function filterNoticias(
  noticias: Noticia[],
  tags: string[],
  busqueda: string,
): Noticia[] {
  return noticias.filter((n) => {
    const matchTags =
      tags.length === 0 ||
      n.tags.some((t) => tags.includes(t.nombre))

    const q = busqueda.toLowerCase()
    const matchBusqueda =
      busqueda === '' ||
      n.titulo.toLowerCase().includes(q) ||
      (n.resumen ?? '').toLowerCase().includes(q) ||
      n.tags.some((t) => t.nombre.toLowerCase().includes(q))

    return matchTags && matchBusqueda
  })
}

export function getCategoriaColor(color?: string): string {
  if (color) return color
  return '#26a7fc'
}
