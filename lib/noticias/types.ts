/**
 * lib/noticias/types.ts
 * Espeja el shape real que devuelve noticias-back (Prisma).
 */

export interface NoticiaTag {
  id:     string
  nombre: string
  slug:   string
}

export interface NoticiaCategoria {
  id:     string
  nombre: string
  slug:   string
  color?: string
}

export interface Noticia {
  id:           string
  titulo:       string
  slug:         string
  resumen?:     string
  contenido:    string
  imagenUrl?:   string
  destacada:    boolean
  publicadaEn?: string
  creadaEn:     string
  categoria:    NoticiaCategoria
  tags:         NoticiaTag[]
}

export interface NoticiasResponse {
  items: Noticia[]
  total: number
  page:  number
  limit: number
  pages: number
}
