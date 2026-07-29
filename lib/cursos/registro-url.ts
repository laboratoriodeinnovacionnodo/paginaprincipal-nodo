// lib/cursos/registro-url.ts
// URL de inscripción: /preinscripciones/{cursoSlug}
// Ej: https://registro.nodo.cc.gob.ar/preinscripciones/robot-basico

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? 'https://registro.nodo.cc.gob.ar')
    .replace(/\/$/, '')

export function buildInscripcionUrl(cursoSlug: string): string {
  return `${REGISTRO_BASE}/preinscripciones/${cursoSlug}`
}
