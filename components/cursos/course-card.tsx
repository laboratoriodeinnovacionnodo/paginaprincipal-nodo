import type React from "react"
import Link from "next/link"
import { Clock, Users, BookOpen, ArrowRight } from "lucide-react"

interface CourseCardProps {
  icon:        React.ReactNode
  title:       string
  description: string
  duration:    string
  level:       string
  format:      string
  link?:       string
}

export function CourseCard({ icon, title, description, duration, level, format, link = "#" }: CourseCardProps) {
  const isPresencial = format.toLowerCase().includes("presencial")

  return (
    <article className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden
                        transition-all duration-300 ease-out
                        hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(38,167,252,0.12)]
                        hover:border-[#26a7fc]/30 flex flex-col h-full">

      {/* Banda de color por modalidad */}
      <div
        className="h-1 w-full transition-all duration-300"
        style={{
          backgroundImage: isPresencial
            ? "linear-gradient(to right, #7C3AED, #9F67F5)"
            : "linear-gradient(to right, #26a7fc, #1c8fe0)"
        }}
        aria-hidden="true"
      />

      <div className="p-6 flex flex-col flex-1 gap-4">

        {/* Header: ícono + badge modalidad */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: isPresencial ? "rgba(124,58,237,0.08)" : "rgba(38,167,252,0.08)",
              color: isPresencial ? "#7C3AED" : "#26a7fc"
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{
              backgroundColor: isPresencial ? "rgba(124,58,237,0.08)" : "rgba(38,167,252,0.08)",
              color: isPresencial ? "#7C3AED" : "#26a7fc"
            }}
          >
            {isPresencial ? "Presencial" : "Virtual"}
          </span>
        </div>

        {/* Título — peso fuerte, tamaño medio */}
        <h3 className="text-base font-bold text-slate-900 leading-snug text-balance">
          {title}
        </h3>

        {/* Descripción — text-sm, muted */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* Metadata */}
        <div className="flex flex-col gap-1.5 text-xs text-slate-400 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{format}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={link}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold
                     text-white transition-all duration-200 hover:opacity-90 hover:gap-3 mt-auto"
          style={{ backgroundImage: isPresencial
            ? "linear-gradient(to right, #7C3AED, #9F67F5)"
            : "linear-gradient(to right, #26a7fc, #1c8fe0)"
          }}
          aria-label={`Ver más información sobre ${title}`}
        >
          Ver más información
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
