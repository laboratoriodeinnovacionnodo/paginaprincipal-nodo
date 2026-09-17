import type { EstadoAsiento } from "./types"

/** Color del PUNTO de estado (pequeño, sólido) */
export const obtenerColorPunto = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":             return "bg-green-500"
    case "OCUPADO":           return "bg-red-400"
    case "FUERA_DE_SERVICIO": return "bg-gray-400"
    case "LIMPIANDO":         return "bg-blue-400"
    case "PARA_COMPARTIR":    return "bg-orange-400"
    case "COMPARTIDO":        return "bg-orange-500"
    default:                  return "bg-gray-300"
  }
}

/** Clases del BADGE de estado (fondo suave, texto de color) */
export const obtenerColorBadge = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":             return "bg-green-100 text-green-700"
    case "OCUPADO":           return "bg-red-100 text-red-600"
    case "FUERA_DE_SERVICIO": return "bg-gray-100 text-gray-500"
    case "LIMPIANDO":         return "bg-blue-100 text-blue-600"
    case "PARA_COMPARTIR":    return "bg-orange-100 text-orange-600"
    case "COMPARTIDO":        return "bg-orange-100 text-orange-700"
    default:                  return "bg-gray-100 text-gray-400"
  }
}

export const obtenerTextoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":             return "Libre"
    case "OCUPADO":           return "Ocupado"
    case "FUERA_DE_SERVICIO": return "Fuera de servicio"
    case "LIMPIANDO":         return "Limpiando"
    case "PARA_COMPARTIR":    return "Para compartir"
    case "COMPARTIDO":        return "Compartido"
    default:                  return "Desconocido"
  }
}

export const obtenerIconoEstado = (estado: EstadoAsiento): string => {
  switch (estado) {
    case "LIBRE":             return "✅"
    case "OCUPADO":           return "🔴"
    case "FUERA_DE_SERVICIO": return "⚫"
    case "LIMPIANDO":         return "🔵"
    case "PARA_COMPARTIR":    return "🟠"
    case "COMPARTIDO":        return "🟠"
    default:                  return "⚪"
  }
}

export const contarPorEstado = (
  areas: { estado: EstadoAsiento }[],
  estado: EstadoAsiento,
): number => areas.filter((a) => a.estado === estado).length
