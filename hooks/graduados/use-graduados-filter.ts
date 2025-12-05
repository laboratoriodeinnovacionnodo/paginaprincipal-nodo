"use client"

import { useState } from "react"

export const useGraduadosFilter = () => {
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)

  const limpiarBusqueda = () => {
    setBusqueda("")
    setPaginaActual(1)
  }

  return {
    busqueda,
    paginaActual,
    setBusqueda,
    setPaginaActual,
    limpiarBusqueda,
  }
}
