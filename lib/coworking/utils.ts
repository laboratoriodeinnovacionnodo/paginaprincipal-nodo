import type { EstadoAsiento } from "./types"

export const obtenerColorBadge = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":            return "bg-green-500"
    case "OCUPADO":          return "bg-red-500"
    case "FUERA_DE_SERVICIO":return "bg-gray-400"
    case "LIMPIANDO":        return "bg-blue-500"
    case "PARA_COMPARTIR":   return "bg-orange-400"
    case "COMPARTIDO":       return "bg-orange-500"
    default:                 return "bg-gray-300"
  }
}

export const obtenerTextoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":            return "Libre"
    case "OCUPADO":          return "Ocupado"
    case "FUERA_DE_SERVICIO":return "Fuera de servicio"
    case "LIMPIANDO":        return "Limpiando"
    case "PARA_COMPARTIR":   return "Para compartir"
    case "COMPARTIDO":       return "Compartido"
    default:                 return "Desconocido"
  }
}

export const obtenerIconoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":            return "✅"
    case "OCUPADO":          return "🔴"
    case "FUERA_DE_SERVICIO":return "⚫"
    case "LIMPIANDO":        return "🔵"
    case "PARA_COMPARTIR":   return "🟠"
    case "COMPARTIDO":       return "🟠"
    default:                 return "⚪"
  }
}

export const contarPorEstado = (
  areas: { estado: EstadoAsiento }[],
  estado: EstadoAsiento,
): number => areas.filter((a) => a.estado === estado).length
