export type EstadoAsiento = "libre" | "ocupado" | "fuera-servicio" | "limpiando" | "compartir" | "compartido"

export type Asiento = {
  id: string
  numero: number
  estado: EstadoAsiento
  notificaciones?: number
  imagen: string
  nombre: string
}
