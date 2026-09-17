#!/usr/bin/env bash
# ============================================================================
#  v28-ciudadano-coworking-zona-modal.sh  — ciudadano-front
#  Agrega botón "Ver zona" en cada sección de zona del coworking.
#  Al clickear abre un Dialog con:
#    - Imagen de la zona (de /areas/zona-a.jpg etc.)
#    - Nombre de la zona
#    - Descripción completa del área
#
#  Las mismas imágenes de coworking-front (public/areas/) se reutilizan acá.
#  Copiá las imágenes también en ciudadano-front/public/areas/
# ============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; RESET='\033[0m'
ok()   { echo -e "${GREEN}✅  $*${RESET}"; }
warn() { echo -e "${YELLOW}⚠️   $*${RESET}"; }
fail() { echo -e "${RED}❌  $*${RESET}"; exit 1; }

[[ -f "package.json" && -d "app" ]] || fail "Corré desde la raíz de ciudadano-front"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  v28 · ciudadano-front · modal de zona en coworking"
echo "════════════════════════════════════════════════════════════"
echo ""

mkdir -p public/areas
ok "public/areas/"

# ── lib/coworking/area-images.ts ──────────────────────────────────────────
echo "📄  lib/coworking/area-images.ts"
cat > lib/coworking/area-images.ts << 'TSEOF'
/**
 * lib/coworking/area-images.ts
 *
 * Mapea la letra de zona (extraída del nombre del área: A1→"A") a su imagen.
 * Las fotos van en public/areas/
 * Mismo criterio que coworking-front.
 */
export const ZONA_IMAGES: Record<string, string> = {
  A: "/areas/zona-a.jpg",
  B: "/areas/zona-b.jpg",
  C: "/areas/zona-c.jpg",
  D: "/areas/zona-d.jpg",
}

export const ZONA_LABELS: Record<string, string> = {
  A: "Zona A",
  B: "Zona B",
  C: "Zona C",
  D: "Zona D",
}

/** Extrae la letra de zona del nombre del área (ej: "A1" → "A", "B5" → "B") */
export function getZonaLetra(nombreArea: string): string {
  const match = nombreArea.match(/^([A-Za-z]+)/)
  return match ? match[1].toUpperCase() : "A"
}

export function getZonaImage(letra: string): string | null {
  return ZONA_IMAGES[letra] ?? null
}

export function getZonaLabel(letra: string): string {
  return ZONA_LABELS[letra] ?? `Zona ${letra}`
}
TSEOF
ok "lib/coworking/area-images.ts"

# ── app/coworking/page.tsx ────────────────────────────────────────────────
echo "📄  app/coworking/page.tsx"
cat > app/coworking/page.tsx << 'TSEOF'
"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge }  from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCoworking } from "@/hooks/coworking/use-coworking"
import {
  obtenerColorBadge,
  obtenerTextoEstado,
  contarPorEstado,
} from "@/lib/coworking/utils"
import {
  getZonaLetra,
  getZonaImage,
  getZonaLabel,
} from "@/lib/coworking/area-images"
import type { EstadoAsiento, AreaBackendResponse } from "@/lib/coworking/types"
import {
  Armchair,
  RefreshCw,
  Clock,
  WifiOff,
  Loader2,
  ImageIcon,
  Info,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── leyenda de estados ────────────────────────────────────────────────────
const ESTADOS: { estado: EstadoAsiento; label: string; color: string }[] = [
  { estado: "LIBRE",             label: "Libre",             color: "bg-green-500" },
  { estado: "OCUPADO",           label: "Ocupado",           color: "bg-red-500"   },
  { estado: "PARA_COMPARTIR",    label: "Para compartir",    color: "bg-orange-400"},
  { estado: "COMPARTIDO",        label: "Compartido",        color: "bg-orange-500"},
  { estado: "LIMPIANDO",         label: "Limpiando",         color: "bg-blue-500"  },
  { estado: "FUERA_DE_SERVICIO", label: "Fuera de servicio", color: "bg-gray-400"  },
]

// ─── Tipos internos ────────────────────────────────────────────────────────
interface ZonaInfo {
  letra:       string
  label:       string
  imagen:      string | null
  descripcion: string | null
  areas:       AreaBackendResponse[]
}

// ─── Modal de zona ─────────────────────────────────────────────────────────
function ZonaModal({
  zona,
  open,
  onClose,
}: {
  zona: ZonaInfo | null
  open: boolean
  onClose: () => void
}) {
  if (!zona) return null

  const libres  = zona.areas.filter((a) => a.estado === "LIBRE").length
  const ocupados = zona.areas.filter((a) => a.estado === "OCUPADO").length
  const total   = zona.areas.length

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl">

        {/* Imagen */}
        <div className="relative w-full h-52 bg-slate-100">
          {zona.imagen ? (
            <Image
              src={zona.imagen}
              alt={zona.label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
              <ImageIcon className="w-10 h-10" />
              <span className="text-xs">Sin imagen</span>
            </div>
          )}
          {/* Overlay con nombre */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="text-2xl font-bold text-white drop-shadow">{zona.label}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">{zona.label}</DialogTitle>
            <DialogDescription className="sr-only">Información de {zona.label}</DialogDescription>
          </DialogHeader>

          {/* Descripción */}
          {zona.descripcion && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {zona.descripcion}
            </p>
          )}

          {/* Stats de ocupación */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-slate-800">{total}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Puestos</p>
            </div>
            <div className="bg-green-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-green-600">{libres}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Libres</p>
            </div>
            <div className="bg-red-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-red-500">{ocupados}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Ocupados</p>
            </div>
          </div>

          {/* Barra de ocupación */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Ocupación</span>
              <span>{total > 0 ? Math.round((ocupados / total) * 100) : 0}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  ocupados === total ? "bg-red-500"
                    : ocupados > total / 2 ? "bg-yellow-500"
                    : "bg-green-500"
                )}
                style={{ width: `${total > 0 ? (ocupados / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────
export default function CoworkingPage() {
  const { areas, loading, error, ultimaActualizacion, refetch } = useCoworking()
  const [zonaModal, setZonaModal] = useState<ZonaInfo | null>(null)

  // Agrupar por zona (letra del nombre del área: A1→"A", B3→"B")
  const zonaMap = areas.reduce<Record<string, AreaBackendResponse[]>>((acc, area) => {
    const letra = getZonaLetra(area.nombre)
    if (!acc[letra]) acc[letra] = []
    acc[letra].push(area)
    return acc
  }, {})

  const zonas: ZonaInfo[] = Object.entries(zonaMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letra, areasZona]) => ({
      letra,
      label:       getZonaLabel(letra),
      imagen:      getZonaImage(letra),
      // La descripción es la misma para todas las áreas de la zona
      descripcion: areasZona[0]?.descripcion ?? null,
      areas:       areasZona,
    }))

  const totalLibres   = areas.filter((a) => a.estado === "LIBRE").length
  const totalOcupados = areas.filter((a) => a.estado === "OCUPADO").length

  return (
    <main className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#26a7fc] uppercase tracking-widest mb-3">
            <span className="h-px w-6 bg-[#26a7fc]" />
            Espacio de trabajo
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                Coworking <span className="text-[#26a7fc]">NODO</span>
              </h1>
              <p className="text-slate-500 text-sm">
                Disponibilidad en tiempo real · {areas.length} puestos en total
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="gap-1.5 shrink-0"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* ── Resumen global ────────────────────────────────────────────── */}
        {!loading && areas.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{areas.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Total</p>
            </div>
            <div className="bg-green-50 rounded-2xl border border-green-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{totalLibres}</p>
              <p className="text-xs text-slate-400 mt-0.5">Libres</p>
            </div>
            <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{totalOcupados}</p>
              <p className="text-xs text-slate-400 mt-0.5">Ocupados</p>
            </div>
          </div>
        )}

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#26a7fc]" />
            <span className="text-sm">Cargando disponibilidad...</span>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && !loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400 flex-col">
            <WifiOff className="w-8 h-8 opacity-40" />
            <p className="text-sm text-center max-w-xs">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="gap-1.5 mt-2">
              <RefreshCw className="w-4 h-4" /> Reintentar
            </Button>
          </div>
        )}

        {/* ── Zonas ─────────────────────────────────────────────────────── */}
        {!loading && !error && (
          <div className="space-y-6">
            {zonas.map((zona) => {
              const libres   = zona.areas.filter((a) => a.estado === "LIBRE").length
              const ocupados = zona.areas.filter((a) => a.estado === "OCUPADO").length
              const total    = zona.areas.length
              const pct      = total > 0 ? Math.round((ocupados / total) * 100) : 0

              return (
                <Card key={zona.letra} className="overflow-hidden border-slate-100 shadow-sm">
                  <CardContent className="p-0">

                    {/* ── Header de zona ──────────────────────────────── */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#26a7fc]/10 shrink-0">
                          <Armchair className="w-4 h-4 text-[#26a7fc]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800">{zona.label}</p>
                          {zona.descripcion && (
                            <p className="text-xs text-slate-400 truncate max-w-[220px] sm:max-w-xs">
                              {zona.descripcion}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Badges resumen */}
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          {libres}
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                          {ocupados}
                        </span>

                        {/* Botón Ver zona */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs h-7 px-2.5 border-[#26a7fc]/30 text-[#26a7fc] hover:bg-[#26a7fc]/5"
                          onClick={() => setZonaModal(zona)}
                        >
                          <Info className="w-3.5 h-3.5" />
                          Ver zona
                        </Button>
                      </div>
                    </div>

                    {/* ── Barra de ocupación ──────────────────────────── */}
                    <div className="px-4 pt-2 pb-0">
                      <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            pct === 100 ? "bg-red-500" : pct > 50 ? "bg-yellow-500" : "bg-green-500"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* ── Grid de asientos ────────────────────────────── */}
                    <div className="px-4 py-3 flex flex-wrap gap-2">
                      {zona.areas
                        .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }))
                        .map((area) => (
                          <div
                            key={area.id}
                            title={`${area.nombre} — ${obtenerTextoEstado(area.estado)}`}
                            className={cn(
                              "flex flex-col items-center justify-center w-12 h-12 rounded-xl border text-xs font-semibold transition-all",
                              obtenerColorBadge(area.estado),
                            )}
                          >
                            <Armchair className="w-4 h-4 mb-0.5" />
                            <span className="text-[10px] leading-none">
                              {area.nombre.replace(/^[A-Za-z]+/, "")}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* ── Leyenda mobile ──────────────────────────────── */}
                    <div className="sm:hidden px-4 pb-3 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        {libres} libres
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        {ocupados} ocupados
                      </span>
                    </div>

                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* ── Leyenda global ─────────────────────────────────────────────── */}
        {!loading && areas.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-3 justify-center">
            {ESTADOS.map(({ estado, label, color }) => {
              const count = contarPorEstado(areas, estado)
              if (count === 0) return null
              return (
                <div key={estado} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className={cn("w-2.5 h-2.5 rounded-full", color)} />
                  {label} ({count})
                </div>
              )
            })}
          </div>
        )}

        {/* ── Última actualización ───────────────────────────────────────── */}
        {ultimaActualizacion && (
          <p className="text-center text-xs text-slate-300 mt-4 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Actualizado {ultimaActualizacion}
          </p>
        )}

      </div>

      {/* ── Modal de zona ─────────────────────────────────────────────────── */}
      <ZonaModal
        zona={zonaModal}
        open={zonaModal !== null}
        onClose={() => setZonaModal(null)}
      />
    </main>
  )
}
TSEOF
ok "app/coworking/page.tsx"

# ── Verificar que lib/coworking/utils.ts tenga contarPorEstado ───────────
echo "🔍  Verificando lib/coworking/utils.ts..."
if grep -q "contarPorEstado" lib/coworking/utils.ts 2>/dev/null; then
  ok "contarPorEstado ya existe en utils.ts"
else
  warn "contarPorEstado no encontrado en utils.ts — agregándolo..."
  cat >> lib/coworking/utils.ts << 'TSEOF'

export function contarPorEstado(
  areas: { estado: string }[],
  estado: string,
): number {
  return areas.filter((a) => a.estado === estado).length
}
TSEOF
  ok "contarPorEstado agregado a utils.ts"
fi

# ── TypeScript check ──────────────────────────────────────────────────────
echo ""
echo "🔨  TypeScript check..."
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -40 || true

# ── Build ─────────────────────────────────────────────────────────────────
echo ""
echo "🔨  Build..."
pnpm build

echo ""
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo -e "\033[0;32m  ✅  v28 ciudadano-front completado\033[0m"
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo ""
echo "  Archivos tocados:"
echo "    lib/coworking/area-images.ts  → mapa letra→imagen"
echo "    app/coworking/page.tsx        → zonas con botón 'Ver zona' + modal"
echo ""
echo -e "\033[1;33m  ⚠️  ACCIÓN MANUAL:\033[0m"
echo "  Copiá las mismas fotos de coworking-front en ciudadano-front/public/areas/"
echo "    public/areas/zona-a.jpg"
echo "    public/areas/zona-b.jpg"
echo "    public/areas/zona-c.jpg"
echo "    public/areas/zona-d.jpg"
echo ""