"use client"

import { useState }   from "react"
import Image          from "next/image"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Badge }   from "@/components/ui/badge"
import { Input }   from "@/components/ui/input"
import {
  Calendar, Search, ArrowRight, ImageOff,
  X, Tag as TagIcon, Newspaper, ChevronLeft, ChevronRight,
} from "lucide-react"
import { filterNoticias, getTagsParaCategoria } from "@/lib/noticias/filters"
import { useNoticiasFilter }  from "@/hooks/noticias/use-noticias-filter"
import { Paginacion }         from "@/components/shared/paginacion"
import type { Noticia, NoticiaCategoria } from "@/lib/noticias/types"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric", month: "long", year: "numeric",
  })
}

function formatFechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric", month: "short",
  })
}

// ── Componente tarjeta ────────────────────────────────────────────────────────

function NoticiaCard({
  noticia,
  featured = false,
  onOpen,
  onCategoria,
  onTag,
  onPagina,
}: {
  noticia:     Noticia
  featured?:   boolean
  onOpen:      (n: Noticia) => void
  onCategoria: (slug: string) => void
  onTag:       (tag: string) => void
  onPagina:    (p: number) => void
}) {
  const catColor = noticia.categoria?.color ?? "#26a7fc"

  if (featured) {
    // Card grande — primera noticia destacada
    return (
      <article
        onClick={() => onOpen(noticia)}
        className="group col-span-full bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer
                   flex flex-col md:flex-row transition-all duration-200 ease-out
                   hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(38,167,252,0.10)]
                   hover:border-[#26a7fc]/30"
        aria-label={`Leer noticia destacada: ${noticia.titulo}`}
      >
        {/* Imagen */}
        <div className="relative md:w-1/2 h-56 md:h-auto bg-gradient-to-br from-slate-100 to-slate-50 shrink-0 overflow-hidden">
          {noticia.imagenUrl ? (
            <Image
              src={noticia.imagenUrl} alt={noticia.titulo} fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw" priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageOff className="h-10 w-10 text-slate-300" aria-hidden="true" strokeWidth={1.5} />
            </div>
          )}
          {/* Badge destacada */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 bg-[#26a7fc] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              ✦ Destacada
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col justify-between p-6 md:p-8 flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {noticia.categoria && (
                <button
                  onClick={(e) => { e.stopPropagation(); onCategoria(noticia.categoria.slug) }}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide transition-opacity hover:opacity-75"
                  style={{ backgroundColor: `${catColor}15`, color: catColor }}
                >
                  {noticia.categoria.nombre}
                </button>
              )}
              {noticia.publicadaEn && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  {formatFechaCorta(noticia.publicadaEn)}
                </span>
              )}
            </div>

            <h2
              className="text-xl md:text-2xl font-bold text-slate-900 leading-snug text-balance
                         group-hover:text-[#26a7fc] transition-colors duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {noticia.titulo}
            </h2>

            {noticia.resumen && (
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                {noticia.resumen}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-1">
              {(noticia.tags ?? []).slice(0, 3).map((tag) => (
                <button
                  key={tag.id}
                  onClick={(e) => { e.stopPropagation(); onTag(tag.nombre); onPagina(1) }}
                  className="text-[10px] text-slate-400 bg-slate-100 hover:bg-[#26a7fc]/10 hover:text-[#26a7fc]
                             px-2 py-0.5 rounded-md transition-colors"
                >
                  #{tag.nombre}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#26a7fc]">
              Leer más
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    )
  }

  // Card normal
  return (
    <article
      onClick={() => onOpen(noticia)}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer
                 flex flex-col transition-all duration-200 ease-out h-full
                 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(38,167,252,0.09)]
                 hover:border-[#26a7fc]/25"
      aria-label={`Leer noticia: ${noticia.titulo}`}
    >
      {/* Imagen */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 shrink-0">
        {noticia.imagenUrl ? (
          <Image
            src={noticia.imagenUrl} alt={noticia.titulo} fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="h-7 w-7 text-slate-300" aria-hidden="true" strokeWidth={1.5} />
          </div>
        )}
        {/* Banda de color categoría — sutil */}
        {noticia.categoria && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: catColor }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Cuerpo */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          {noticia.categoria && (
            <button
              onClick={(e) => { e.stopPropagation(); onCategoria(noticia.categoria.slug) }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide transition-opacity hover:opacity-75"
              style={{ backgroundColor: `${catColor}15`, color: catColor }}
            >
              {noticia.categoria.nombre}
            </button>
          )}
          {noticia.publicadaEn && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              {formatFechaCorta(noticia.publicadaEn)}
            </span>
          )}
        </div>

        {/* Título */}
        <h3
          className="text-sm font-bold text-slate-800 leading-snug line-clamp-2
                     group-hover:text-[#26a7fc] transition-colors duration-200"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {noticia.titulo}
        </h3>

        {/* Resumen */}
        {noticia.resumen && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
            {noticia.resumen}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <div className="flex flex-wrap gap-1">
            {(noticia.tags ?? []).slice(0, 2).map((tag) => (
              <button
                key={tag.id}
                onClick={(e) => { e.stopPropagation(); onTag(tag.nombre); onPagina(1) }}
                className="text-[10px] text-slate-400 bg-slate-100 hover:bg-[#26a7fc]/10 hover:text-[#26a7fc]
                           px-2 py-0.5 rounded-md transition-colors"
              >
                #{tag.nombre}
              </button>
            ))}
          </div>
          <ArrowRight
            className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#26a7fc] transition-all duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────

interface NoticiasContentProps { noticias?: Noticia[] | null }

export function NoticiasContent({ noticias: raw }: NoticiasContentProps) {
  const noticias: Noticia[] = Array.isArray(raw) ? raw : []

  const {
    categoriaActiva, tagsSeleccionados, busqueda, paginaActual,
    setCategoria, toggleTag, setBusqueda, setPaginaActual, limpiarFiltros,
  } = useNoticiasFilter()

  const [noticiaAbierta, setNoticiaAbierta] = useState<Noticia | null>(null)

  // Categorías únicas ordenadas
  const categorias: NoticiaCategoria[] = Array.from(
    new Map(
      noticias.filter((n) => n.categoria).map((n) => [n.categoria.id, n.categoria])
    ).values()
  ).sort((a, b) => a.nombre.localeCompare(b.nombre))

  const tagsDisponibles   = getTagsParaCategoria(noticias, categoriaActiva)
  const noticiasFiltradas = filterNoticias(noticias, categoriaActiva, tagsSeleccionados, busqueda)

  const ITEMS_POR_PAGINA  = 7  // 1 featured + 6 normales
  const totalPaginas      = Math.ceil(
    Math.max(0, noticiasFiltradas.length - 1) / (ITEMS_POR_PAGINA - 1)
  ) || 1
  const hayFiltros = categoriaActiva !== "todas" || tagsSeleccionados.length > 0 || busqueda !== ""

  // Paginación: primera = featured, resto normales
  const featuredNoticia  = !hayFiltros && paginaActual === 1 && noticiasFiltradas.length > 0
    ? (noticiasFiltradas.find((n) => n.destacada) ?? noticiasFiltradas[0])
    : null

  let paginadas: Noticia[]
  if (hayFiltros) {
    // Con filtros: paginación simple sin featured
    const ITEMS = 6
    const inicio = (paginaActual - 1) * ITEMS
    paginadas = noticiasFiltradas.slice(inicio, inicio + ITEMS)
  } else {
    // Sin filtros: excluir featured de la grilla
    const resto = featuredNoticia
      ? noticiasFiltradas.filter((n) => n.id !== featuredNoticia.id)
      : noticiasFiltradas
    const ITEMS = 6
    const inicio = paginaActual === 1 ? 0 : (paginaActual - 1) * ITEMS
    paginadas = resto.slice(inicio, inicio + ITEMS)
  }

  const totalPaginasSimple = Math.ceil(noticiasFiltradas.length / 6) || 1

  const abrirNoticia = (n: Noticia) => {
    setNoticiaAbierta(n)
    window.history.pushState({}, "", `/noticias/${n.slug}`)
  }
  const cerrarModal = () => {
    setNoticiaAbierta(null)
    window.history.pushState({}, "", "/noticias")
  }

  return (
    <>
      {/* ── Modal detalle ─────────────────────────────────────────────────── */}
      <Dialog open={!!noticiaAbierta} onOpenChange={(o) => { if (!o) cerrarModal() }}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
          {noticiaAbierta && (
            <>
              {/* Imagen / banda */}
              {noticiaAbierta.imagenUrl ? (
                <div className="relative h-60 w-full overflow-hidden rounded-t-2xl bg-slate-100 shrink-0">
                  <Image
                    src={noticiaAbierta.imagenUrl} alt={noticiaAbierta.titulo} fill
                    className="object-cover" sizes="(max-width: 768px) 100vw, 672px" priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  {noticiaAbierta.categoria && (
                    <div className="absolute bottom-4 left-5">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm text-white"
                        style={{ backgroundColor: `${noticiaAbierta.categoria.color ?? "#26a7fc"}cc` }}
                      >
                        {noticiaAbierta.categoria.nombre}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="h-1.5 w-full rounded-t-2xl shrink-0"
                  style={{ backgroundColor: noticiaAbierta.categoria?.color ?? "#26a7fc" }}
                />
              )}

              {/* Cuerpo */}
              <div className="p-6 md:p-8 flex flex-col gap-5">
                <DialogHeader className="gap-2 text-left p-0">
                  <DialogDescription className="sr-only">Detalle de la noticia</DialogDescription>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    {noticiaAbierta.publicadaEn && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.5} />
                        {formatFecha(noticiaAbierta.publicadaEn)}
                      </span>
                    )}
                    {noticiaAbierta.tags.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <TagIcon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.5} />
                        <span className="flex flex-wrap gap-1">
                          {noticiaAbierta.tags.map((tag) => (
                            <Badge key={tag.id} variant="secondary"
                              className="text-xs rounded-md cursor-pointer hover:bg-[#26a7fc]/10"
                              onClick={() => { cerrarModal(); toggleTag(tag.nombre) }}>
                              {tag.nombre}
                            </Badge>
                          ))}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Título */}
                  <DialogTitle
                    className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight text-balance"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {noticiaAbierta.titulo}
                  </DialogTitle>
                </DialogHeader>

                {/* Resumen destacado */}
                {noticiaAbierta.resumen && (
                  <p className="text-slate-600 text-sm leading-relaxed font-medium
                                border-l-[3px] border-[#26a7fc] pl-4 italic bg-[#26a7fc]/3 py-2 pr-3 rounded-r-xl">
                    {noticiaAbierta.resumen}
                  </p>
                )}

                {/* Contenido */}
                <div className="text-slate-700 text-sm leading-7 whitespace-pre-wrap">
                  {noticiaAbierta.contenido}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={cerrarModal}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#26a7fc] transition-colors"
                    aria-label="Volver al listado de noticias"
                  >
                    <ChevronLeft className="h-3 w-3" aria-hidden="true" />
                    Volver a noticias
                  </button>
                  <a
                    href={`/noticias/${noticiaAbierta.slug}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-[#26a7fc] transition-colors underline underline-offset-2"
                  >
                    Abrir en página completa ↗
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Filtros ────────────────────────────────────────────────────────── */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-slate-100 py-4 sticky top-20 z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <Input
                placeholder="Buscar noticias..."
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1) }}
                className="pl-9 bg-white border-slate-200 rounded-xl focus:border-[#26a7fc] focus:ring-[#26a7fc]/15 text-sm h-9"
                aria-label="Buscar noticias"
              />
            </div>

            {/* Categorías */}
            {categorias.length > 0 && (
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por categoría">
                <button
                  onClick={() => setCategoria("todas")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 border ${
                    categoriaActiva === "todas"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                  aria-pressed={categoriaActiva === "todas"}
                >
                  Todas
                </button>
                {categorias.map((cat) => {
                  const color  = cat.color ?? "#26a7fc"
                  const active = categoriaActiva === cat.slug
                  return (
                    <button key={cat.id}
                      onClick={() => setCategoria(cat.slug)}
                      style={active
                        ? { backgroundColor: color, borderColor: color, color: "#fff" }
                        : { borderColor: `${color}35`, color }
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 border ${
                        active ? "shadow-sm" : "bg-white hover:opacity-80"
                      }`}
                      aria-pressed={active}
                    >
                      {cat.nombre}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Limpiar */}
            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#26a7fc] transition-colors ml-auto shrink-0"
                aria-label="Limpiar todos los filtros"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Limpiar
              </button>
            )}
          </div>

          {/* Tags — segunda fila si los hay */}
          {tagsDisponibles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
              {tagsDisponibles.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { toggleTag(tag); setPaginaActual(1) }}
                  className={`rounded-full px-3 py-0.5 text-xs font-medium transition-all duration-200 border ${
                    tagsSeleccionados.includes(tag)
                      ? "bg-[#26a7fc] text-white border-[#26a7fc] shadow-sm shadow-[#26a7fc]/20"
                      : "bg-white text-slate-500 border-slate-200 hover:border-[#26a7fc]/35 hover:text-[#26a7fc]"
                  }`}
                  aria-pressed={tagsSeleccionados.includes(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Contenido ─────────────────────────────────────────────────────── */}
      <section className="py-10 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Contador */}
          {noticiasFiltradas.length > 0 && (
            <p className="text-xs text-slate-400 mb-6 font-medium">
              {noticiasFiltradas.length}{" "}
              {noticiasFiltradas.length === 1 ? "noticia encontrada" : "noticias encontradas"}
              {hayFiltros && (
                <button onClick={limpiarFiltros} className="ml-2 text-[#26a7fc] hover:underline">
                  · Ver todas
                </button>
              )}
            </p>
          )}

          {/* Empty state — sin noticias */}
          {noticias.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 text-center
                            bg-white border border-slate-200 rounded-2xl">
              <div className="h-16 w-16 rounded-2xl bg-[#26a7fc]/8 flex items-center justify-center mb-5">
                <Newspaper className="h-8 w-8 text-[#26a7fc]/40" aria-hidden="true" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-slate-700 mb-2">Próximamente habrá novedades</h2>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Estamos preparando el contenido. ¡Volvé pronto!
              </p>
            </div>
          )}

          {/* Empty state — filtros sin resultado */}
          {noticias.length > 0 && noticiasFiltradas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center
                            bg-white border border-slate-200 rounded-2xl">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Search className="h-7 w-7 text-slate-300" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-slate-700 mb-2">Sin resultados</h2>
              <p className="text-sm text-slate-400 mb-4">Probá con otros términos o quitá los filtros.</p>
              <button
                onClick={limpiarFiltros}
                className="text-sm font-semibold text-[#26a7fc] hover:text-[#1c8fe0] transition-colors"
              >
                Ver todas las noticias
              </button>
            </div>
          )}

          {/* Grid con featured */}
          {noticiasFiltradas.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Featured — solo en primera página sin filtros */}
                {featuredNoticia && (
                  <NoticiaCard
                    noticia={featuredNoticia}
                    featured
                    onOpen={abrirNoticia}
                    onCategoria={setCategoria}
                    onTag={toggleTag}
                    onPagina={setPaginaActual}
                  />
                )}

                {/* Cards normales */}
                {paginadas.map((noticia) => (
                  <NoticiaCard
                    key={noticia.id}
                    noticia={noticia}
                    onOpen={abrirNoticia}
                    onCategoria={setCategoria}
                    onTag={toggleTag}
                    onPagina={setPaginaActual}
                  />
                ))}
              </div>

              {/* Paginación */}
              {totalPaginasSimple > 1 && (
                <div className="mt-10">
                  <Paginacion
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginasSimple}
                    onPaginaChange={setPaginaActual}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
