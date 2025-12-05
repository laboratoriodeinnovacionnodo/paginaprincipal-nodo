export interface MiembroEquipo {
  id: string
  slug: string
  nombre: string
  cargo: string
  area: string
  foto: string
  bio: string
  email?: string
  telefono?: string
  orden: number
}
