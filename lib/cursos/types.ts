export type Modalidad = "todos" | "presencial" | "virtual"

export type Curso = {
  id: string | number
  titulo: string
  descripcion: string
  modalidad: Modalidad
  tags: string[]
  duracion: string
  cupo: number
  ubicacion?: string
  link?: string
  edad?: string
  turno?: string
  publicadoEnFecha?: string
  slug?: string
  documentId?: string
  requisitos?: string[]
  cupos?: string
}
