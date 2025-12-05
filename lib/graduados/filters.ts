import type { Graduado } from "./types"

export const filterGraduados = (graduados: Graduado[], busqueda: string): Graduado[] => {
  return graduados.filter((graduado) => {
    const nombreCompleto = `${graduado.nombre} ${graduado.apellido}`.toLowerCase()
    const busquedaLower = busqueda.toLowerCase()

    return (
      busqueda === "" ||
      nombreCompleto.includes(busquedaLower) ||
      graduado.dni.includes(busquedaLower) ||
      graduado.curso.toLowerCase().includes(busquedaLower)
    )
  })
}

export const getPromedioColor = (promedio: number) => {
  if (promedio >= 9) {
    return "bg-green-100 text-green-800 hover:bg-green-200"
  } else if (promedio >= 8) {
    return "bg-blue-100 text-blue-800 hover:bg-blue-200"
  } else {
    return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}
