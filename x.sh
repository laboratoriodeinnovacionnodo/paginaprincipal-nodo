#!/usr/bin/env bash
# ============================================================================
#  x.sh — ciudadano-front  v2.0.0
#  Rediseña /laboratorio: hero expandido, descripción de áreas con
#  capacidades, proceso del lab y proyectos destacados.
#  Solo toca: app/laboratorio/page.tsx  +  app/laboratorio/loading.tsx
# ============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; RESET='\033[0m'
ok()   { echo -e "${GREEN}✅  $*${RESET}"; }
warn() { echo -e "${YELLOW}⚠️   $*${RESET}"; }
fail() { echo -e "${RED}❌  $*${RESET}"; exit 1; }

[[ -f "package.json" && -d "app" ]] || fail "Corré desde la raíz de ciudadano-front"

# ─────────────────────────────────────────────────────────────────────────────
echo "📄  Reescribiendo app/laboratorio/page.tsx..."
# ─────────────────────────────────────────────────────────────────────────────

mkdir -p app/laboratorio

cat > app/laboratorio/page.tsx << 'ENDOFFILE'
import Link from "next/link"
import {
  Box, Cpu, Code2, ArrowRight, FlaskConical,
  Printer, Layers, Scissors,
  Wifi, Microchip, Zap,
  Globe, Smartphone, Bot,
  ChevronRight,
} from "lucide-react"
import { getProjects } from "@/lib/laboratorio/api"
import { CodeTitle } from "@/components/shared/code-title"

// ── Áreas con contenido editorial ────────────────────────────────────────────

const AREAS = [
  {
    key:         "DISENO_3D",
    label:       "Diseño 3D",
    icon:        Box,
    color:       "#26a7fc",
    bgLight:     "bg-[#26a7fc]/8",
    borderColor: "border-[#26a7fc]/20",
    hoverBorder: "hover:border-[#26a7fc]/50",
    tagBg:       "bg-[#26a7fc]/10 text-[#1c8fe0]",
    description:
      "Desde la idea hasta el prototipo físico. El área de Diseño 3D materializa conceptos en objetos reales usando modelado paramétrico e impresión aditiva, con foco en resolver problemas concretos del territorio.",
    capacidades: [
      { icon: Printer,  label: "Impresión FDM/FFF" },
      { icon: Layers,   label: "Modelado paramétrico" },
      { icon: Scissors, label: "Corte y ensamble" },
    ],
    ejemplos: ["Prototipos de producto", "Piezas de reemplazo", "Modelos educativos", "Herramental custom"],
  },
  {
    key:         "HARDWARE",
    label:       "Hardware",
    icon:        Cpu,
    color:       "#7C3AED",
    bgLight:     "bg-[#7C3AED]/8",
    borderColor: "border-[#7C3AED]/20",
    hoverBorder: "hover:border-[#7C3AED]/50",
    tagBg:       "bg-[#7C3AED]/10 text-[#7C3AED]",
    description:
      "Electrónica, microcontroladores e IoT al servicio de soluciones reales. El área de Hardware diseña y construye dispositivos físicos que conectan el mundo digital con el mundo físico de Catamarca.",
    capacidades: [
      { icon: Microchip, label: "Arduino / ESP32" },
      { icon: Wifi,      label: "IoT & sensores" },
      { icon: Zap,       label: "Circuitos y PCB" },
    ],
    ejemplos: ["Estaciones de monitoreo", "Automatizaciones", "Dispositivos IoT", "Interfaces físicas"],
  },
  {
    key:         "SOFTWARE",
    label:       "Software",
    icon:        Code2,
    color:       "#059669",
    bgLight:     "bg-[#059669]/8",
    borderColor: "border-[#059669]/20",
    hoverBorder: "hover:border-[#059669]/50",
    tagBg:       "bg-[#059669]/10 text-[#059669]",
    description:
      "Aplicaciones web, mobile e inteligencia artificial aplicada. El área de Software desarrolla herramientas digitales que potencian los servicios del Nodo y crean valor para la comunidad catamarcana.",
    capacidades: [
      { icon: Globe,      label: "Apps web" },
      { icon: Smartphone, label: "Mobile" },
      { icon: Bot,        label: "IA & automatización" },
    ],
    ejemplos: ["Plataformas ciudadanas", "Dashboards de gestión", "Bots y agentes IA", "APIs públicas"],
  },
] as const

// ── Pasos del proceso ─────────────────────────────────────────────────────────

const PROCESO = [
  { num: "01", titulo: "Ideación",    desc: "El equipo evalúa el problema y define el alcance del proyecto." },
  { num: "02", titulo: "Prototipado", desc: "Se construye una versión funcional rápida para validar el concepto." },
  { num: "03", titulo: "Iteración",   desc: "Mejoras continuas basadas en pruebas y feedback real." },
  { num: "04", titulo: "Entrega",     desc: "El proyecto se documenta y publica como recurso abierto." },
] as const

// ── Página ────────────────────────────────────────────────────────────────────

export const revalidate = 60

export default async function LaboratorioPage() {
  const projects   = await getProjects()
  const destacados = projects.filter((p) => p.featured).slice(0, 4)

  return (
    <main className="min-h-screen pt-32 pb-24 bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-[#26a7fc]/10 border border-[#26a7fc]/20 rounded-full px-4 py-1.5 text-sm font-semibold text-[#1c8fe0] mb-6">
          <FlaskConical className="h-3.5 w-3.5" />
          Laboratorio de Innovación
        </div>

        <CodeTitle as="h1" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 text-balance">
          El lugar donde las <span className="text-[#26a7fc]">ideas se vuelven reales</span>
        </CodeTitle>

        <p className="text-lg text-slate-500 leading-relaxed mb-10 text-pretty max-w-2xl mx-auto">
          El Laboratorio del Nodo es el espacio donde diseño 3D, hardware e inteligencia artificial
          trabajan juntos para crear soluciones concretas para Catamarca.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/laboratorio/proyectos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shadow-md shadow-[#26a7fc]/20"
            style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
          >
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#areas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-slate-600 text-sm font-medium border border-slate-200 bg-white/80 hover:bg-white hover:border-slate-300 transition-all"
          >
            Conocer las áreas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Proceso ───────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-20 max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROCESO.map((paso, i) => (
            <div
              key={paso.num}
              className="relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-5 text-left"
            >
              {/* conector */}
              {i < PROCESO.length - 1 && (
                <div className="hidden md:block absolute top-7 -right-2 w-4 h-0.5 bg-slate-200 z-10" />
              )}
              <span className="text-3xl font-black text-[#26a7fc]/20 leading-none block mb-3">
                {paso.num}
              </span>
              <p className="text-sm font-semibold text-slate-800 mb-1">{paso.titulo}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Áreas ─────────────────────────────────────────────────────────── */}
      <section id="areas" className="container mx-auto px-4 mt-20 max-w-5xl scroll-mt-28">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Las tres áreas del Laboratorio
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Cada área trabaja de forma autónoma pero colabora en proyectos interdisciplinarios
            cuando el problema lo requiere.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {AREAS.map((area) => (
            <div
              key={area.key}
              className={`bg-white/80 backdrop-blur-sm border ${area.borderColor} ${area.hoverBorder} rounded-2xl p-6 md:p-8 transition-all hover:shadow-md group`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">

                {/* Ícono + nombre */}
                <div className="shrink-0 flex md:flex-col items-center md:items-start gap-3 md:gap-2 md:w-36">
                  <div
                    className={`h-12 w-12 rounded-xl ${area.bgLight} flex items-center justify-center`}
                  >
                    <area.icon className="h-6 w-6" style={{ color: area.color }} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{area.label}</h3>
                </div>

                {/* Contenido */}
                <div className="flex-1 space-y-5">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {area.description}
                  </p>

                  {/* Capacidades */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
                      Capacidades
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {area.capacidades.map((cap) => (
                        <div
                          key={cap.label}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${area.bgLight} border ${area.borderColor}`}
                          style={{ color: area.color }}
                        >
                          <cap.icon className="h-3 w-3" />
                          {cap.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ejemplos de proyectos */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
                      Ejemplos de proyectos
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {area.ejemplos.map((ej) => (
                        <span
                          key={ej}
                          className="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md"
                        >
                          {ej}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="shrink-0 self-end md:self-center">
                  <Link
                    href={`/laboratorio/proyectos?area=${area.key}`}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border ${area.borderColor} ${area.bgLight} transition-all group-hover:shadow-sm`}
                    style={{ color: area.color }}
                  >
                    Ver proyectos
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Proyectos destacados ───────────────────────────────────────────── */}
      {destacados.length > 0 && (
        <section className="container mx-auto px-4 mt-20 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Proyectos destacados</h2>
            <Link
              href="/laboratorio/proyectos"
              className="text-sm font-medium text-[#26a7fc] hover:text-[#1c8fe0] inline-flex items-center gap-1 transition-colors"
            >
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {destacados.map((project) => {
              const areaConfig = AREAS.find((a) => a.key === project.area)
              return (
                <Link key={project.id} href={`/laboratorio/proyectos/${project.slug}`}>
                  <div className="group bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-[#26a7fc]/30 rounded-2xl overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
                    {/* Cover */}
                    <div
                      className="h-28 bg-cover bg-center bg-[#26a7fc]/8 shrink-0"
                      style={project.coverImage ? { backgroundImage: `url(${project.coverImage})` } : undefined}
                    />
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      {areaConfig && (
                        <span
                          className={`inline-flex w-fit text-[10px] font-semibold px-2 py-0.5 rounded-full ${areaConfig.tagBg}`}
                        >
                          {areaConfig.label}
                        </span>
                      )}
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {project.title}
                      </p>
                      {project.tags.length > 0 && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-auto">
                          {project.tags.slice(0, 2).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-20 max-w-2xl text-center">
        <div className="bg-white/80 backdrop-blur-sm border border-[#26a7fc]/15 rounded-2xl px-8 py-10">
          <FlaskConical className="h-8 w-8 text-[#26a7fc] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            ¿Tenés una idea para el Laboratorio?
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            El equipo del Nodo está abierto a colaborar con proyectos que impacten
            positivamente en la comunidad catamarcana.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shadow-md shadow-[#26a7fc]/20"
            style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
          >
            Contactanos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </main>
  )
}
ENDOFFILE

ok "app/laboratorio/page.tsx actualizado"

# ─────────────────────────────────────────────────────────────────────────────
echo "📄  Reescribiendo app/laboratorio/loading.tsx..."
# ─────────────────────────────────────────────────────────────────────────────

cat > app/laboratorio/loading.tsx << 'ENDOFFILE'
import { Skeleton } from "@/components/ui/skeleton"

export default function LaboratorioLoading() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* Hero */}
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <Skeleton className="h-7 w-52 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-12 w-full max-w-xl mx-auto mb-3" />
        <Skeleton className="h-12 w-2/3 mx-auto mb-5" />
        <Skeleton className="h-5 w-full max-w-lg mx-auto mb-2" />
        <Skeleton className="h-5 w-4/5 mx-auto mb-10" />
        <div className="flex justify-center gap-3">
          <Skeleton className="h-11 w-48 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* Proceso */}
      <div className="container mx-auto px-4 mt-20 max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      {/* Áreas */}
      <div className="container mx-auto px-4 mt-20 max-w-5xl space-y-5">
        <Skeleton className="h-8 w-64 mx-auto mb-3" />
        <Skeleton className="h-4 w-80 mx-auto mb-8" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>

      {/* Proyectos destacados */}
      <div className="container mx-auto px-4 mt-20 max-w-5xl">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </div>

    </main>
  )
}
ENDOFFILE

ok "app/laboratorio/loading.tsx actualizado"

# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "🔨  TypeScript check..."
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -20 || warn "Revisar errores TS arriba"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅  Cambios aplicados en /laboratorio:"
echo ""
echo "    SECCIONES:"
echo "    • Hero — título, descripción y 2 CTAs"
echo "    • Proceso — 4 pasos: Ideación → Prototipado → Iteración → Entrega"
echo "    • Áreas — 3 cards expandidas con descripción, capacidades y ejemplos"
echo "    • Proyectos destacados — mejorados con badge de área y tags"
echo "    • CTA final — invitación a contacto"
echo ""
echo "    ARCHIVOS MODIFICADOS:"
echo "    • app/laboratorio/page.tsx"
echo "    • app/laboratorio/loading.tsx"
echo "════════════════════════════════════════════════════════════"