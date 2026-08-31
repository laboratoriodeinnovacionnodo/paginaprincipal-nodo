import type { Noticia } from './types'

export function filterNoticias(
  noticias: Noticia[],
  categoriaActiva: string,
  tags: string[],
  busqueda: string,
): Noticia[] {
  return noticias.filter((n) => {
    const matchCategoria =
      categoriaActiva === "todas" ||
      n.categoria?.slug === categoriaActiva

    const matchTags =
      tags.length === 0 ||
      n.tags.some((t) => tags.includes(t.nombre))

    const q = busqueda.toLowerCase()
    const matchBusqueda =
      busqueda === '' ||
      n.titulo.toLowerCase().includes(q) ||
      (n.resumen ?? '').toLowerCase().includes(q) ||
      n.categoria?.nombre.toLowerCase().includes(q) ||
      n.tags.some((t) => t.nombre.toLowerCase().includes(q))

    return matchCategoria && matchTags && matchBusqueda
  })
}

export function getTagsParaCategoria(
  noticias: Noticia[],
  categoriaActiva: string,
): string[] {
  const base = categoriaActiva === "todas"
    ? noticias
    : noticias.filter((n) => n.categoria?.slug === categoriaActiva)

  return Array.from(
    new Set(base.flatMap((n) => n.tags?.map((t) => t.nombre) ?? []))
  ).sort()
}

export function getCategoriaColor(color?: string): string {
  return color ?? '#26a7fc'
}
