export type Graduado = {
  id: number
  nombre: string
  apellido: string
  dni: string
  curso: string
  fechaGraduacion: string
  promedio: number
  // Campos adicionales del backend
  institucion?: string
  duracion?: string
  nivel?: string
  createdAt?: string
  updatedAt?: string
  // Campos de blockchain
  txHash?: string
  explorerUrl?: string
}

export type DiplomaResponse = {
  id: number
  nombre: string
  dni: string
  curso: string
  txHash: string | null
  explorerUrl: string | null
}
