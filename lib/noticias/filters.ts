import type { Noticia } from "./types"

export const filterNoticias = (noticias: Noticia[], tags: string[], busqueda: string): Noticia[] => {
  return noticias.filter((noticia) => {
    const matchTags = tags.length === 0 || tags.some((tag) => noticia.tags.includes(tag))
    const matchBusqueda =
      busqueda === "" ||
      noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      noticia.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      noticia.tags.some((tag) => tag.toLowerCase().includes(busqueda.toLowerCase()))
    return matchTags && matchBusqueda
  })
}

export const getCategoriaColor = (categoria: string) => {
  switch (categoria) {
    case "eventos":
      return "border-blue-300 bg-blue-50 text-blue-700"
    case "tecnologia":
      return "border-purple-300 bg-purple-50 text-purple-700"
    case "comunidad":
      return "border-green-300 bg-green-50 text-green-700"
    default:
      return "border-gray-300 bg-gray-50 text-gray-700"
  }
}

export const getTagsByCategoria = (noticias: Noticia[], categoria: string): string[] => {
  const noticiasFiltradas = categoria === "todas" ? noticias : noticias.filter((n) => n.categoria === categoria)

  const tagsSet = new Set<string>()
  noticiasFiltradas.forEach((noticia) => {
    noticia.tags.forEach((tag) => tagsSet.add(tag))
  })

  return Array.from(tagsSet).sort()
}
