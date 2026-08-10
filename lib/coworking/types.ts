export type EstadoAsiento =
  | "LIBRE"
  | "OCUPADO"
  | "LIMPIANDO"
  | "FUERA_DE_SERVICIO"
  | "PARA_COMPARTIR"
  | "COMPARTIDO"

export type AreaBackendResponse = {
  id: number
  nombre: string
  descripcion: string | null
  estado: EstadoAsiento
  createdAt: string
}
