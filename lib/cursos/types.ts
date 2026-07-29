// lib/cursos/types.ts
export type CursoLevel = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'
export type AulaSlot =
  | 'AULA_1' | 'AULA_2' | 'AULA_3'
  | 'AULA_4' | 'AULA_5' | 'AULA_6'

export interface RegistroModuleResumen {
  id: string; slug: string; name: string; active: boolean; type: string
}
export interface ProfeResumen { id: string; nombre: string; email: string }

export interface CursoBack {
  id: string; slug: string; title: string; description: string
  level: CursoLevel; duration: string; modules: number; steps: number
  emoji: string; tags: string[]; available: boolean; current: boolean
  order: number; whatsappLink: string | null; maxParticipants: number | null
  waitlistEnabled: boolean; aula: AulaSlot | null
  horaInicio: string | null; horaFin: string | null
  fechaInicio: string | null; fechaFin: string | null
  profeId: string | null; profe: ProfeResumen | null
  createdAt: string; updatedAt: string
  registroModules: RegistroModuleResumen[]
  _count: { preinscripciones: number; registroModules: number }
}

export interface CursosListResponse {
  items: CursoBack[]; total: number; page: number; limit: number; pages: number
}

/** True si el curso tiene un módulo PREINSCRIPCION activo en registro */
export function tieneInscripcionActiva(curso: CursoBack): boolean {
  return curso.registroModules.some(
    (m) => m.active && m.type === 'PREINSCRIPCION',
  )
}

export const NIVEL_LABEL: Record<CursoLevel, string> = {
  PRINCIPIANTE: 'Principiante',
  INTERMEDIO:   'Intermedio',
  AVANZADO:     'Avanzado',
}

export const AULA_NOMBRE: Record<AulaSlot, string> = {
  AULA_1: 'Aula 1 — Planta baja',  AULA_2: 'Aula 2 — Planta baja',
  AULA_3: 'Aula 3 — Primer piso',  AULA_4: 'Aula 4 — Primer piso',
  AULA_5: 'Aula 5 — Segundo piso', AULA_6: 'Aula 6 — Segundo piso',
}
