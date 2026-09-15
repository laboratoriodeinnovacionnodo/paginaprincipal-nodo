/**
 * lib/eventos/types.ts
 * Tipos públicos del calendario-back para ciudadano-front.
 * Solo expone campos relevantes para el ciudadano — sin datos internos.
 */

export type TipoEvento =
  | 'PENDIENTE'
  | 'EN_CURSO'
  | 'FINALIZADO'
  | 'CANCELADO'
  | 'MASIVO'
  | 'ESCOLAR'

export interface EventoCiudadano {
  id:                  string
  titulo:              string
  descripcion?:        string
  informacion:         string
  fechaDesde:          string   // ISO 8601
  fechaHasta:          string   // ISO 8601
  horaDesde:           string   // HH:mm
  horaHasta:           string   // HH:mm
  tipoEvento:          TipoEvento
  contactoCiudadano?:  string
  linkInscripcion?:    string
  mostrarEnCiudadanos: boolean
}

export const TIPO_EVENTO_LABEL: Record<TipoEvento, string> = {
  PENDIENTE:  'Próximo',
  EN_CURSO:   'En curso',
  FINALIZADO: 'Finalizado',
  CANCELADO:  'Cancelado',
  MASIVO:     'Masivo',
  ESCOLAR:    'Escolar',
}

export const TIPO_EVENTO_COLOR: Record<TipoEvento, string> = {
  PENDIENTE:  'bg-blue-100 text-blue-700 border-blue-200',
  EN_CURSO:   'bg-green-100 text-green-700 border-green-200',
  FINALIZADO: 'bg-slate-100 text-slate-500 border-slate-200',
  CANCELADO:  'bg-red-100 text-red-600 border-red-200',
  MASIVO:     'bg-purple-100 text-purple-700 border-purple-200',
  ESCOLAR:    'bg-amber-100 text-amber-700 border-amber-200',
}
