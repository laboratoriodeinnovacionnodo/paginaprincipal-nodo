"use client"

import Link from "next/link"
import {
  Box, Cpu, Code2, ArrowRight, FlaskConical,
  Printer, Layers, Scissors,
  Wifi, Microchip, Zap,
  Globe, Smartphone, Bot,
  ChevronRight, Sparkles,
} from "lucide-react"
import { CodeTitle }         from "@/components/shared/code-title"
import { NetworkBackground } from "@/components/shared/network-background"

// ── Data ──────────────────────────────────────────────────────────────────────

const AREAS = [
  {
    num: "01", key: "DISENO_3D", label: "Diseño 3D", icon: Box,
    color: "#26a7fc", bgLight: "rgba(38,167,252,0.07)",
    border: "rgba(38,167,252,0.2)", borderHover: "rgba(38,167,252,0.45)",
    tagBg: "rgba(38,167,252,0.1)",
    gradient: "linear-gradient(135deg, rgba(38,167,252,0.08) 0%, rgba(38,167,252,0.02) 100%)",
    accentLine: "#26a7fc",
    description: "Desde la idea hasta el prototipo físico. Materializamos conceptos en objetos reales usando modelado paramétrico e impresión aditiva, con foco en resolver problemas concretos del territorio.",
    capacidades: [
      { icon: Printer,  label: "Impresión FDM/FFF" },
      { icon: Layers,   label: "Modelado paramétrico" },
      { icon: Scissors, label: "Corte y ensamble" },
    ],
    ejemplos: ["Prototipos de producto", "Piezas de reemplazo", "Modelos educativos", "Herramental custom"],
  },
  {
    num: "02", key: "HARDWARE", label: "Hardware", icon: Cpu,
    color: "#7C3AED", bgLight: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.2)", borderHover: "rgba(124,58,237,0.45)",
    tagBg: "rgba(124,58,237,0.1)",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.02) 100%)",
    accentLine: "#7C3AED",
    description: "Electrónica, microcontroladores e IoT al servicio de soluciones reales. Diseñamos y construimos dispositivos físicos que conectan el mundo digital con el entorno de Catamarca.",
    capacidades: [
      { icon: Microchip, label: "Arduino / ESP32" },
      { icon: Wifi,      label: "IoT & sensores" },
      { icon: Zap,       label: "Circuitos y PCB" },
    ],
    ejemplos: ["Estaciones de monitoreo", "Automatizaciones", "Dispositivos IoT", "Interfaces físicas"],
  },
  {
    num: "03", key: "SOFTWARE", label: "Software", icon: Code2,
    color: "#059669", bgLight: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.2)", borderHover: "rgba(5,150,105,0.45)",
    tagBg: "rgba(5,150,105,0.1)",
    gradient: "linear-gradient(135deg, rgba(5,150,105,0.08) 0%, rgba(5,150,105,0.02) 100%)",
    accentLine: "#059669",
    description: "Aplicaciones web, mobile e inteligencia artificial aplicada. Desarrollamos herramientas digitales que potencian los servicios del Nodo y crean valor concreto para la comunidad.",
    capacidades: [
      { icon: Globe,      label: "Apps web" },
      { icon: Smartphone, label: "Mobile" },
      { icon: Bot,        label: "IA & automatización" },
    ],
    ejemplos: ["Plataformas ciudadanas", "Dashboards de gestión", "Bots y agentes IA", "APIs públicas"],
  },
] as const

const PROCESO = [
  { num: "01", titulo: "Ideación",    desc: "El equipo evalúa el problema, define el alcance y valida que valga la pena construirlo.", color: "#26a7fc" },
  { num: "02", titulo: "Prototipado", desc: "Se construye una versión mínima funcional para testear el concepto rápidamente.",           color: "#7C3AED" },
  { num: "03", titulo: "Iteración",   desc: "Mejoras continuas basadas en pruebas reales y feedback de usuarios finales.",               color: "#059669" },
  { num: "04", titulo: "Entrega",     desc: "El proyecto se documenta, publica y queda disponible como recurso abierto.",                color: "#f59e0b" },
] as const

// ── Página ────────────────────────────────────────────────────────────────────

export default function LaboratorioPage() {
  return (
    /*
      position: relative en el main para que el canvas absoluto
      se contenga dentro y cubra TODA la página
    */
    <main className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* ── NetworkBackground — cubre toda la página ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <NetworkBackground
          opacity={0.9}
          colorPrimary="#26a7fc"
          colorSecondary="#7C3AED"
          colorTertiary="#0ea5e9"
          maxDist={140}
          speed={0.2}
          lineOpacity={0.35}
          lineWidth={1.2}
        />
      </div>

      {/* Todo el contenido va con position relative z-10 para estar encima */}
      <div className="relative z-10">

        {/* ── Hero centrado ─────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 overflow-hidden">

          {/* Glows decorativos encima de la red */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#26a7fc]/6 blur-3xl" />
            <div className="absolute top-20 -left-24 w-72 h-72 rounded-full bg-[#7C3AED]/4 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#26a7fc]/8 border border-[#26a7fc]/20
                            rounded-full px-4 py-1.5 text-xs font-semibold text-[#1c8fe0] mb-8">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Laboratorio de Innovación · Nodo Tecnológico
            </div>

            <CodeTitle
              as="h1"
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6
                         text-balance leading-[1.05] tracking-tight"
              immediate
            >
              Donde las <span className="text-[#26a7fc]">ideas</span> se
              vuelven <span style={{ color: "#7C3AED" }}>realidad</span>
            </CodeTitle>

            <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10
                          max-w-2xl mx-auto text-pretty">
              Diseño 3D, hardware e inteligencia artificial trabajando juntos
              para crear soluciones concretas para Catamarca.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link
                href="#areas"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-white
                           text-sm font-semibold transition-all hover:opacity-90 hover:scale-105
                           shadow-lg shadow-[#26a7fc]/25"
                style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
              >
                Explorar áreas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/laboratorio/proyectos"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-slate-600
                           text-sm font-medium border border-slate-200 bg-white/80
                           hover:bg-white hover:border-slate-300 backdrop-blur-sm transition-all"
              >
                Ver proyectos
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Badges áreas */}
            <div className="flex flex-wrap justify-center gap-2">
              {AREAS.map((a) => (
                <span
                  key={a.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                             text-xs font-medium border bg-white/70 backdrop-blur-sm"
                  style={{ borderColor: a.border, color: a.color }}
                >
                  <a.icon className="h-3 w-3" aria-hidden="true" />
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proceso ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20 max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400
                            uppercase tracking-widest mb-3">
              <span className="h-px w-6 bg-slate-300" aria-hidden="true" />
              Metodología
              <span className="h-px w-6 bg-slate-300" aria-hidden="true" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Cómo trabajamos</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PROCESO.map((paso, i) => (
              <div key={paso.num} className="relative">
                {i < PROCESO.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-4 h-0.5
                                  bg-slate-200 z-10 -translate-x-2" aria-hidden="true" />
                )}
                <div className="bg-white/85 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 h-full
                               transition-all duration-200 hover:-translate-y-0.5
                               hover:shadow-md hover:border-slate-300">
                  <div className="text-4xl font-black leading-none mb-4 tabular-nums"
                    style={{ color: `${paso.color}28` }} aria-hidden="true">
                    {paso.num}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: paso.color }} aria-hidden="true" />
                    <p className="text-sm font-bold text-slate-800">{paso.titulo}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Áreas ─────────────────────────────────────────────────────────── */}
        <section id="areas" className="container mx-auto px-4 pb-20 max-w-5xl scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400
                            uppercase tracking-widest mb-3">
              <span className="h-px w-6 bg-slate-300" aria-hidden="true" />
              Especialidades
              <span className="h-px w-6 bg-slate-300" aria-hidden="true" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Las tres áreas del Laboratorio
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Cada área trabaja de forma autónoma y colabora en proyectos
              interdisciplinarios cuando el problema lo requiere.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {AREAS.map((area) => (
              <article
                key={area.key}
                className="group relative rounded-2xl overflow-hidden
                           transition-all duration-200 ease-out
                           hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                style={{ border: `1px solid ${area.border}`, backgroundColor: "rgba(255,255,255,0.85)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = area.borderHover }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = area.border }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ backgroundColor: area.accentLine }} aria-hidden="true" />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: area.gradient }} aria-hidden="true" />

                <div className="relative p-6 md:p-8 pl-8 md:pl-10">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">

                    <div className="shrink-0 flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:w-40">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center
                                      transition-transform duration-200 group-hover:scale-110"
                        style={{ backgroundColor: area.bgLight }}>
                        <area.icon className="h-6 w-6" style={{ color: area.color }} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                          style={{ color: area.color }}>Área {area.num}</p>
                        <h3 className="text-lg font-bold text-slate-800">{area.label}</h3>
                      </div>
                    </div>

                    <div className="flex-1 space-y-5">
                      <p className="text-sm text-slate-600 leading-relaxed text-pretty">
                        {area.description}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                            Capacidades
                          </p>
                          <div className="flex flex-col gap-1.5">
                            {area.capacidades.map((cap) => (
                              <div key={cap.label}
                                className="inline-flex items-center gap-2 text-xs font-medium"
                                style={{ color: area.color }}>
                                <div className="h-6 w-6 rounded-md flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: area.bgLight }}>
                                  <cap.icon className="h-3 w-3" aria-hidden="true" />
                                </div>
                                {cap.label}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                            Tipo de proyectos
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {area.ejemplos.map((ej) => (
                              <span key={ej}
                                className="text-[11px] font-medium px-2.5 py-1 rounded-lg border"
                                style={{ backgroundColor: area.bgLight, borderColor: area.border, color: area.color }}>
                                {ej}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 self-end md:self-center">
                      <Link
                        href={`/laboratorio/proyectos?area=${area.key}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold
                                   px-4 py-2.5 rounded-xl border transition-all duration-200 hover:gap-2.5"
                        style={{ backgroundColor: area.bgLight, borderColor: area.border, color: area.color }}
                      >
                        Ver proyectos
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 pb-24 max-w-3xl">
          <div className="relative bg-white/90 backdrop-blur-sm border border-slate-200
                          rounded-3xl px-8 py-14 text-center overflow-hidden
                          shadow-[0_8px_40px_rgba(38,167,252,0.08)]">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#26a7fc]/6 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#7C3AED]/6 blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundImage: "linear-gradient(135deg, rgba(38,167,252,0.12), rgba(124,58,237,0.12))", border: "1px solid rgba(38,167,252,0.2)" }}>
                <Sparkles className="h-7 w-7 text-[#26a7fc]" aria-hidden="true" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                ¿Tenés una idea para el Laboratorio?
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md mx-auto">
                El equipo del Nodo está abierto a colaborar con proyectos que impacten
                positivamente en la comunidad catamarcana.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl
                             text-white text-sm font-semibold transition-all hover:opacity-90
                             hover:scale-105 shadow-lg shadow-[#26a7fc]/25"
                  style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
                >
                  Contactanos
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/laboratorio/proyectos"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl
                             text-slate-600 text-sm font-medium border border-slate-200
                             bg-white hover:bg-slate-50 transition-all"
                >
                  Ver proyectos
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
