"use client"

import { Card } from "@/components/ui/card"
import { getAllMiembros } from "@/lib/equipo/data"
import Image from "next/image"

export function Organigrama() {
  const miembros = getAllMiembros()

  const intendente = miembros.find((m) => m.orden === 1)
  const secretario = miembros.find((m) => m.orden === 2)
  const director = miembros.find((m) => m.orden === 3)
  const encargado = miembros.find((m) => m.orden === 4)

  return (
    <div className="w-full space-y-8">
      {/* Nivel 1: Intendente */}
      {intendente && (
        <div className="flex justify-center">
          <Card className="relative overflow-hidden rounded-3xl w-full max-w-xs h-[400px] shadow-xl">
            <Image src={intendente.foto || "/placeholder.svg"} alt={intendente.nombre} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">{intendente.nombre}</h3>
              <p className="text-sm text-white/90">{intendente.cargo}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Línea conectora */}
      <div className="flex justify-center">
        <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-400 to-cyan-300"></div>
      </div>

      {/* Nivel 2: Secretario */}
      {secretario && (
        <div className="flex justify-center">
          <Card className="relative overflow-hidden rounded-3xl w-full max-w-sm h-[380px] shadow-xl">
            <Image src={secretario.foto || "/placeholder.svg"} alt={secretario.nombre} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-1">{secretario.nombre}</h3>
              <p className="text-sm text-white/90">{secretario.cargo}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Línea conectora */}
      <div className="flex justify-center">
        <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-300 to-cyan-200"></div>
      </div>

      {/* Nivel 3: Director y Encargado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 md:px-8 max-w-3xl mx-auto">
        {/* Director Nodo Tecnológico */}
        {director && (
          <Card className="relative overflow-hidden rounded-3xl h-[360px] shadow-xl">
            <Image src={director.foto || "/placeholder.svg"} alt={director.nombre} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h4 className="text-lg font-bold mb-1">{director.nombre}</h4>
              <p className="text-sm text-white/90">{director.cargo}</p>
              <p className="text-xs text-white/70 mt-1">{director.area}</p>
            </div>
          </Card>
        )}

        {/* Encargado Laboratorio de Innovación */}
        {encargado && (
          <Card className="relative overflow-hidden rounded-3xl h-[360px] shadow-xl">
            <Image src={encargado.foto || "/placeholder.svg"} alt={encargado.nombre} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h4 className="text-lg font-bold mb-1">{encargado.nombre}</h4>
              <p className="text-sm text-white/90">{encargado.cargo}</p>
              <p className="text-xs text-white/70 mt-1">{encargado.area}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
