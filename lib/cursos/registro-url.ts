// lib/cursos/registro-url.ts
// Fuente de verdad para construir la URL de inscripción.
// Usa el slug del CURSO directamente — sin prefijos.
// registro-front recibe /preinscripciones/{cursoSlug} y construye
// el slug del módulo internamente como "preinscripcion-{cursoSlug}".

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? 'https://registro.nodo.cc.gob.ar')
    .replace(/\/$/, '')

/** Genera: https://registro.nodo.cc.gob.ar/preinscripciones/robot-basico */
export function buildInscripcionUrl(cursoSlug: string): string {
  return `${REGISTRO_BASE}/preinscripciones/${cursoSlug}`
}
