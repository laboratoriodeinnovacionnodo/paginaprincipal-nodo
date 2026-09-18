"use client"

import { CodeTitle }   from "@/components/shared/code-title"
import { Organigrama } from "@/app/sobre-nosotros/components/organigrama"
import {
  Target, Eye, Users, Lightbulb,
  MapPin, Building2, Rocket, GraduationCap,
} from "lucide-react"

const VALORES = [
  {
    icon:  Lightbulb,
    title: "Innovación",
    desc:  "Promovemos la creatividad y el pensamiento disruptivo para generar soluciones tecnológicas que transformen la realidad.",
    color: "#26a7fc",
    bg:    "rgba(38,167,252,0.08)",
  },
  {
    icon:  Users,
    title: "Inclusión",
    desc:  "Creemos en la tecnología como herramienta de inclusión y desarrollo para toda la comunidad catamarcana.",
    color: "#7C3AED",
    bg:    "rgba(124,58,237,0.08)",
  },
  {
    icon:  Target,
    title: "Excelencia",
    desc:  "Buscamos la calidad en cada proyecto, capacitación y servicio que ofrecemos.",
    color: "#059669",
    bg:    "rgba(5,150,105,0.08)",
  },
  {
    icon:  Eye,
    title: "Transparencia",
    desc:  "Trabajamos con apertura y honestidad en todos nuestros procesos y comunicaciones.",
    color: "#f59e0b",
    bg:    "rgba(245,158,11,0.08)",
  },
]

const PILARES = [
  { icon: GraduationCap, label: "Educación",    desc: "Cursos y talleres gratuitos en tecnología para todas las edades." },
  { icon: Building2,     label: "Coworking",    desc: "Espacio de trabajo colaborativo abierto a la comunidad." },
  { icon: Rocket,        label: "Laboratorio",  desc: "Diseño 3D, hardware y software para proyectos de innovación." },
  { icon: MapPin,        label: "Territorio",   desc: "Anclados en Catamarca, conectados con el mundo tecnológico." },
]

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/50">
      <main>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-16 overflow-hidden">

          {/* Decorativo fondo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#26a7fc]/5" />
            <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-[#26a7fc]/4" />
          </div>

          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">

            <div className="inline-flex items-center gap-2 bg-[#26a7fc]/8 border border-[#26a7fc]/20 rounded-full
                            px-4 py-1.5 text-xs font-semibold text-[#1c8fe0] mb-8">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              Municipalidad de San Fernando del Valle de Catamarca
            </div>

            <CodeTitle
              as="h1"
              className="text-5xl md:text-7xl font-bold text-balance text-slate-900 leading-[1.05] tracking-tight mb-6"
              immediate
            >
              Sobre el{" "}
              <span className="text-[#26a7fc]">Nodo</span>
            </CodeTitle>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed text-balance mb-10">
              Un espacio de innovación y desarrollo tecnológico que impulsa la transformación
              digital de Catamarca desde adentro.
            </p>

            {/* Pilares en fila */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {PILARES.map((p) => (
                <div key={p.label}
                  className="bg-white border border-slate-200 rounded-2xl p-4 text-center
                             transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#26a7fc]/25">
                  <div className="mx-auto h-10 w-10 rounded-xl bg-[#26a7fc]/8 flex items-center justify-center mb-2.5">
                    <p.icon className="h-5 w-5 text-[#26a7fc]" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">{p.label}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quiénes somos ─────────────────────────────────────────────── */}
        <section className="py-16 border-t border-slate-100">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">

              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#26a7fc] uppercase tracking-widest mb-4">
                  <span className="h-px w-6 bg-[#26a7fc]" aria-hidden="true" />
                  Nuestra historia
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-snug">
                  ¿Qué es el Nodo Tecnológico?
                </h2>
                <p className="text-slate-500 text-base leading-relaxed mb-4">
                  El Nodo Tecnológico es una iniciativa de la Municipalidad de San Fernando del Valle de Catamarca
                  que busca promover el desarrollo tecnológico, la innovación y la capacitación en nuevas tecnologías.
                </p>
                <p className="text-slate-500 text-base leading-relaxed">
                  Trabajamos para impulsar la transformación digital del gobierno local y brindar oportunidades
                  de crecimiento a la comunidad, conectando talento local con las demandas del mercado tecnológico actual.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { num: "+1.200", label: "Alumnos formados" },
                  { num: "25+",    label: "Cursos activos" },
                  { num: "3",      label: "Áreas del laboratorio" },
                  { num: "100%",   label: "Acceso gratuito" },
                ].map((s) => (
                  <div key={s.label}
                    className="bg-white border border-slate-200 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-bold text-[#26a7fc] mb-1">{s.num}</p>
                    <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Valores ───────────────────────────────────────────────────── */}
        <section className="py-16 border-t border-slate-100 bg-white/60">
          <div className="container mx-auto px-4 max-w-4xl">

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#26a7fc] uppercase tracking-widest mb-4">
                <span className="h-px w-6 bg-[#26a7fc]" aria-hidden="true" />
                Principios
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Nuestros valores
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALORES.map((v) => (
                <div key={v.title}
                  className="bg-white border border-slate-200 rounded-2xl p-6 text-center
                             transition-all duration-200 hover:-translate-y-1
                             hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)] hover:border-slate-300">
                  <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: v.bg }}>
                    <v.icon className="h-7 w-7" style={{ color: v.color }} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Organigrama ───────────────────────────────────────────────── */}
        <section className="py-16 border-t border-slate-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#26a7fc] uppercase tracking-widest mb-4">
                <span className="h-px w-6 bg-[#26a7fc]" aria-hidden="true" />
                Equipo
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Estructura organizacional
              </h2>
              <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
                Conocé las diferentes áreas que trabajan para impulsar la transformación digital en Catamarca.
              </p>
            </div>
            <Organigrama />
          </div>
        </section>

      </main>
    </div>
  )
}
