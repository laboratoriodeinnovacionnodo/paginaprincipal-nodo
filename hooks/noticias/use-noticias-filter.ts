"use client"

import { useState } from "react"

export const useNoticiasFilter = () => {
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas")
  const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)

  const setCategoria = (slug: string) => {
    setCategoriaActiva(slug)
    setTagsSeleccionados([])   // resetear tags al cambiar categoría
    setPaginaActual(1)
  }

  const toggleTag = (tag: string) => {
    setTagsSeleccionados((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
    setPaginaActual(1)
  }

  const limpiarFiltros = () => {
    setCategoriaActiva("todas")
    setTagsSeleccionados([])
    setBusqueda("")
    setPaginaActual(1)
  }

  return {
    categoriaActiva,
    tagsSeleccionados,
    busqueda,
    paginaActual,
    setCategoria,
    toggleTag,
    setBusqueda,
    setPaginaActual,
    limpiarFiltros,
  }
}
