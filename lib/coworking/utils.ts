import type { EstadoAsiento, Asiento } from "./types"

export const obtenerColorBadge = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":
      return "bg-green-500 border-green-500"
    case "OCUPADO":
      return "bg-red-600 border-red-600"
    case "FUERA_DE_SERVICIO":
      return "bg-gray-500 border-gray-500"
    case "LIMPIANDO":
      return "bg-blue-500 border-blue-500"
    case "PARA_COMPARTIR":
      return "bg-orange-500 border-orange-500"
    case "COMPARTIDO":
      return "bg-orange-600 border-orange-600"
    default:
      return "bg-gray-400 border-gray-400"
  }
}

export const obtenerTextoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":
      return "Libre"
    case "OCUPADO":
      return "Ocupado"
    case "FUERA_DE_SERVICIO":
      return "Fuera de servicio"
    case "LIMPIANDO":
      return "Limpiando"
    case "PARA_COMPARTIR":
      return "Para compartir"
    case "COMPARTIDO":
      return "Compartido"
    default:
      return "Desconocido"
  }
}

export const contarPorEstado = (asientos: Asiento[], estado: EstadoAsiento): number => {
  return asientos.filter((a) => a.estado === estado).length
}
