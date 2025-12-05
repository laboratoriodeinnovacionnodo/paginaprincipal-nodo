export interface StrapiResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiCursoPresencial {
  id: number
  documentId: string
  titulo: string
  descripcion: Array<{
    type: string
    children: Array<{
      text: string
      type: string
    }>
  }>
  requisitos?: Array<{
    type: string
    format?: string
    children: Array<{
      type: string
      children: Array<{
        text: string
        type: string
      }>
    }>
  }>
  duracion: string
  edad: string
  turno: string
  publicadoEnFecha: string
  cupos?: string
  slug: string
  link: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  tags?: {
    id: number
    documentId: string
    nombre: string
  }[]
}

export interface StrapiCursoVirtual {
  id: number
  documentId: string
  titulo: string
  descripcion: Array<{
    type: string
    children: Array<{
      text: string
      type: string
    }>
  }>
  requisitos?: Array<{
    type: string
    format?: string
    children: Array<{
      type: string
      children: Array<{
        text: string
        type: string
      }>
    }>
  }>
  duracion: string
  edad: string
  turno: string
  publicadoEnFecha: string
  cupos?: string
  slug: string
  link: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  tags?: {
    id: number
    documentId: string
    nombre: string
  }[]
}

export interface StrapiNoticia {
  id: number
  documentId: string
  titulo: string
  slug: string
  contenido: string
  publicadoEnFecha: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  covertura?: {
    id: number
    documentId: string
    name: string
    alternativeText?: string
    caption?: string
    width: number
    height: number
    formats?: {
      large?: { url: string }
      medium?: { url: string }
      small?: { url: string }
      thumbnail?: { url: string }
    }
    url: string
  }[]
  tags?: {
    id: number
    documentId: string
    nombre: string
  }[]
}

export interface StrapiTag {
  id: number
  documentId: string
  nombre: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}
