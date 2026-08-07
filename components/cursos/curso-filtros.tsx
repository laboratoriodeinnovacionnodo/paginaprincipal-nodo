"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Modalidad } from "@/lib/cursos/types"

type CursoFiltrosProps = {
  modalidadActiva: Modalidad
  tagsSeleccionados: string[]
  busqueda: string
  tagsDisponibles: string[]
  onModalidadChange: (modalidad: Modalidad) => void
  onToggleTag: (tag: string) => void
  onBusquedaChange: (busqueda: string) => void
  onLimpiarFiltros: () => void
}

export function CursoFiltros({
  modalidadActiva,
  tagsSeleccionados,
  busqueda,
  tagsDisponibles,
  onModalidadChange,
  onToggleTag,
  onBusquedaChange,
  onLimpiarFiltros,
}: CursoFiltrosProps) {
  return (
    <div className="mx-auto max-w-4xl mt-12 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por título, descripción o categoría..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="pl-10 bg-white/70 backdrop-blur-sm"
        />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3">
        <Button
          variant={modalidadActiva === "todos" ? "default" : "outline"}
          onClick={() => onModalidadChange("todos")}
          className={modalidadActiva === "todos" ? "bg-[#26a7fc] hover:bg-[#1c8fe0]" : "bg-white/70 backdrop-blur-sm"}
        >
          Todos
        </Button>
        <Button
          variant={modalidadActiva === "presencial" ? "default" : "outline"}
          onClick={() => onModalidadChange("presencial")}
          className={
            modalidadActiva === "presencial" ? "bg-[#26a7fc] hover:bg-[#1c8fe0]" : "bg-white/70 backdrop-blur-sm"
          }
        >
          Presenciales
        </Button>
        <Button
          variant={modalidadActiva === "virtual" ? "default" : "outline"}
          onClick={() => onModalidadChange("virtual")}
          className={modalidadActiva === "virtual" ? "bg-[#26a7fc] hover:bg-[#1c8fe0]" : "bg-white/70 backdrop-blur-sm"}
        >
          Virtuales
        </Button>

        {(tagsSeleccionados.length > 0 || busqueda) && (
          <Button variant="ghost" size="sm" onClick={onLimpiarFiltros} className="text-[#26a7fc] hover:text-[#1c8fe0]">
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {tagsDisponibles.map((tag) => (
          <Badge
            key={tag}
            variant={tagsSeleccionados.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              tagsSeleccionados.includes(tag)
                ? "bg-[#26a7fc] hover:bg-[#1c8fe0]"
                : "bg-white/70 backdrop-blur-sm hover:bg-[#26a7fc]/10"
            }`}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
