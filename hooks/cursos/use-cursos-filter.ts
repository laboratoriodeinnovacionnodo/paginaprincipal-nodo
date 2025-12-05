"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { Modalidad } from "@/lib/cursos/types"

export const useCursosFilter = () => {
  const searchParams = useSearchParams()

  const modalidadFromUrl = searchParams.get("modalidad")
  const initialModalidad: Modalidad =
    modalidadFromUrl === "presencial" || modalidadFromUrl === "virtual" ? modalidadFromUrl : "todos"

  const [modalidadActiva, setModalidadActiva] = useState<Modalidad>(initialModalidad)
  const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)

  useEffect(() => {
    if (modalidadFromUrl === "presencial" || modalidadFromUrl === "virtual") {
      setModalidadActiva(modalidadFromUrl)
    }
  }, [modalidadFromUrl])

  const toggleTag = (tag: string) => {
    setTagsSeleccionados((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const cambiarModalidad = (modalidad: Modalidad) => {
    setModalidadActiva(modalidad)
    setTagsSeleccionados([])
    setPaginaActual(1)
  }

  const limpiarFiltros = () => {
    setTagsSeleccionados([])
    setBusqueda("")
    setPaginaActual(1)
  }

  return {
    modalidadActiva,
    tagsSeleccionados,
    busqueda,
    paginaActual,
    setModalidadActiva: cambiarModalidad,
    toggleTag,
    setBusqueda,
    setPaginaActual,
    limpiarFiltros,
  }
}
