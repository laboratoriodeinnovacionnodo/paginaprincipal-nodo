// lib/catamarcaopen/types.ts
// Shape real que devuelve ciudadano-back /api/v1/catamarcaopen

export interface CatamarcaOpenRepo {
  id:          string
  ciudadanoId: string
  url:         string
  nombre:      string
  descripcion: string | null
  proveedor:   'GITHUB'
  rama:        string
  publico:     boolean
  metadata:    Record<string, unknown>
  createdAt:   string
  updatedAt:   string
  // incluido en /publicos
  ciudadano?: {
    id:      string
    googleId: string
    name:    string
    email:   string
    picture: string | null
  }
}

export interface CreateRepoInput {
  url:         string
  nombre:      string
  descripcion?: string
  rama?:       string
  publico?:    boolean
}

export interface UpdateRepoInput {
  nombre?:      string
  descripcion?: string
  rama?:        string
  publico?:     boolean
}
