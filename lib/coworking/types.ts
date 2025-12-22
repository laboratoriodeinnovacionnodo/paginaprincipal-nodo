export type EstadoAsiento = "LIBRE" | "OCUPADO" | "LIMPIANDO" | "FUERA_DE_SERVICIO" | "PARA_COMPARTIR" | "COMPARTIDO"

export type Asiento = {
  id: string
  numero: number
  estado: EstadoAsiento
  notificaciones?: number
  imagen: string
  nombre: string
}

export type AreaCoworkingAPI = {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  equipamiento: string[]
  estado: EstadoAsiento
  imagen?: string
  descripcion?: string
  precio?: string
  disponible: boolean
  servicios?: string[]
  imagenesAdicionales?: string[]
  detalles?: {
    area?: string
    iluminacion?: string
    mobiliario?: string[]
    tecnologia?: string[]
    accesoHorario?: string
  }
  usosPrincipales?: string[]
  caracteristicas?: string[]
}
