import type { EstadoAsiento, Asiento } from "./types"

export const obtenerColorBadge = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "libre":
      return "bg-green-500 border-green-500"
    case "ocupado":
      return "bg-red-600 border-red-600"
    case "fuera-servicio":
      return "bg-gray-500 border-gray-500"
    case "limpiando":
      return "bg-blue-500 border-blue-500"
    case "compartir":
      return "bg-orange-500 border-orange-500"
    case "compartido":
      return "bg-orange-600 border-orange-600"
    default:
      return "bg-gray-400 border-gray-400"
  }
}

export const obtenerTextoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "libre":
      return "Libre"
    case "ocupado":
      return "Ocupado"
    case "fuera-servicio":
      return "Fuera de servicio"
    case "limpiando":
      return "Limpiando"
    case "compartir":
      return "Para compartir"
    case "compartido":
      return "Compartido"
    default:
      return "Desconocido"
  }
}

export const contarPorEstado = (asientos: Asiento[], estado: EstadoAsiento): number => {
  return asientos.filter((a) => a.estado === estado).length
}
