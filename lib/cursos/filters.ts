import type { Curso, Modalidad } from "./types"

export const filterCursos = (cursos: Curso[], modalidad: Modalidad, tags: string[], busqueda: string): Curso[] => {
  return cursos.filter((curso) => {
    const matchModalidad = modalidad === "todos" || curso.modalidad === modalidad
    const matchTags = tags.length === 0 || tags.some((tag) => curso.tags.includes(tag))
    const matchBusqueda =
      busqueda === "" ||
      curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.tags.some((tag) => tag.toLowerCase().includes(busqueda.toLowerCase()))
    return matchModalidad && matchTags && matchBusqueda
  })
}

export const getTagsByModalidad = (
  todosCursos: Curso[],
  cursosPresenciales: Curso[],
  cursosVirtuales: Curso[],
  modalidad: Modalidad,
): string[] => {
  let cursosParaTags: Curso[] = []

  switch (modalidad) {
    case "todos":
      cursosParaTags = todosCursos
      break
    case "presencial":
      cursosParaTags = cursosPresenciales
      break
    case "virtual":
      cursosParaTags = cursosVirtuales
      break
  }

  const tagsSet = new Set<string>()
  cursosParaTags.forEach((curso) => {
    curso.tags.forEach((tag) => tagsSet.add(tag))
  })

  return Array.from(tagsSet).sort()
}
