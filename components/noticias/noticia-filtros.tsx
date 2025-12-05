"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Categoria } from "@/lib/noticias/types"

type NoticiaFiltrosProps = {
  categoriaActiva: Categoria
  tagsSeleccionados: string[]
  busqueda: string
  tagsDisponibles: string[]
  onCategoriaChange: (categoria: Categoria) => void
  onToggleTag: (tag: string) => void
  onBusquedaChange: (busqueda: string) => void
  onLimpiarFiltros: () => void
}

export function NoticiaFiltros({
  categoriaActiva,
  tagsSeleccionados,
  busqueda,
  tagsDisponibles,
  onCategoriaChange,
  onToggleTag,
  onBusquedaChange,
  onLimpiarFiltros,
}: NoticiaFiltrosProps) {
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

      {/* Tags Filter */}
      <div className="flex flex-wrap justify-center items-center gap-3">
        {(tagsSeleccionados.length > 0 || busqueda) && (
          <Button variant="ghost" size="sm" onClick={onLimpiarFiltros} className="text-cyan-600 hover:text-cyan-700">
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
                ? "bg-cyan-500 hover:bg-cyan-600"
                : "bg-white/70 backdrop-blur-sm hover:bg-cyan-50"
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
