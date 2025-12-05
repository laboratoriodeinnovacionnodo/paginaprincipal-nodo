"use client"

import { useState } from "react"

export const useNoticiasFilter = () => {
  const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)

  const toggleTag = (tag: string) => {
    setTagsSeleccionados((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setPaginaActual(1)
  }

  const limpiarFiltros = () => {
    setTagsSeleccionados([])
    setBusqueda("")
    setPaginaActual(1)
  }

  return {
    tagsSeleccionados,
    busqueda,
    paginaActual,
    toggleTag,
    setBusqueda,
    setPaginaActual,
    limpiarFiltros,
  }
}
