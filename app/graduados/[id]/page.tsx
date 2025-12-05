"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"

// This would come from a database in a real application
const graduadosData: Record<number, any> = {
  1: {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    curso: "Desarrollo Web Full Stack",
    fechaGraduacion: "2024-03-15",
    promedio: 9.2,
  },
  2: {
    id: 2,
    nombre: "María",
    apellido: "González",
    dni: "23456789",
    curso: "Data Science y Machine Learning",
    fechaGraduacion: "2024-03-20",
    promedio: 9.5,
  },
  3: {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    dni: "34567890",
    curso: "Diseño UX/UI",
    fechaGraduacion: "2024-02-28",
    promedio: 8.8,
  },
  4: {
    id: 4,
    nombre: "Ana",
    apellido: "Martínez",
    dni: "45678901",
    curso: "Desarrollo Web Full Stack",
    fechaGraduacion: "2024-03-15",
    promedio: 9.0,
  },
  5: {
    id: 5,
    nombre: "Luis",
    apellido: "Fernández",
    dni: "56789012",
    curso: "Marketing Digital",
    fechaGraduacion: "2024-04-10",
    promedio: 8.7,
  },
  6: {
    id: 6,
    nombre: "Laura",
    apellido: "Sánchez",
    dni: "67890123",
    curso: "Introducción a Python",
    fechaGraduacion: "2024-01-25",
    promedio: 9.3,
  },
  7: {
    id: 7,
    nombre: "Diego",
    apellido: "López",
    dni: "78901234",
    curso: "Ciberseguridad Básica",
    fechaGraduacion: "2024-02-15",
    promedio: 8.9,
  },
  8: {
    id: 8,
    nombre: "Sofía",
    apellido: "Ramírez",
    dni: "89012345",
    curso: "Data Science y Machine Learning",
    fechaGraduacion: "2024-03-20",
    promedio: 9.4,
  },
}

export default async function DiplomaPage({ params }: { params: { id: string } }) {
  const { id } = params
  const graduado = graduadosData[Number.parseInt(id)]

  if (!graduado) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Graduado no encontrado</h1>
          <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
            <Link href="/graduados">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Graduados
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  const fechaFormateada = new Date(graduado.fechaGraduacion).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .diploma-container {
            box-shadow: none !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <section className="relative overflow-hidden pt-24 pb-12 no-print">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-6 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
            <Link href="/graduados">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Graduados
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto diploma-container">
          {/* Diploma with decorative border */}
          <div className="bg-white shadow-2xl relative p-8 md:p-16">
            {/* Decorative border */}
            <div className="absolute inset-4 border-4 border-double border-cyan-600 pointer-events-none"></div>
            <div className="absolute inset-6 border border-cyan-400 pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 space-y-8 text-center">
              {/* Header ornament */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>

              {/* Institution name */}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                  Nodo Tecnológico Catamarca
                </h1>
                <div className="flex items-center justify-center gap-2 text-cyan-600">
                  <div className="h-px w-12 bg-cyan-600"></div>
                  <span className="text-sm font-medium tracking-wider uppercase">Certificado de Graduación</span>
                  <div className="h-px w-12 bg-cyan-600"></div>
                </div>
              </div>

              {/* Certification text */}
              <div className="space-y-6 py-8">
                <p className="text-lg text-gray-600 font-light">Por medio del presente se certifica que</p>

                <div className="py-4">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                    {graduado.nombre} {graduado.apellido}
                  </h2>
                  <div className="mt-2 mx-auto w-64 h-px bg-gradient-to-r from-transparent via-cyan-600 to-transparent"></div>
                </div>

                <p className="text-base text-gray-600">
                  <span className="font-medium">DNI:</span> {graduado.dni}
                </p>

                <p className="text-lg text-gray-600 font-light">
                  ha completado satisfactoriamente el programa de formación
                </p>

                <div className="py-4">
                  <h3 className="text-2xl md:text-3xl font-semibold text-cyan-700">{graduado.curso}</h3>
                </div>

                <p className="text-base text-gray-600">Otorgado el {fechaFormateada}</p>
              </div>

              {/* Signatures */}
              <div className="grid md:grid-cols-2 gap-12 pt-12 mt-12 border-t border-gray-300">
                <div className="text-center space-y-2">
                  <div className="mb-4">
                    <div className="inline-block">
                      <div className="w-48 border-t-2 border-gray-800"></div>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">Dr. Roberto Guzmán</p>
                  <p className="text-sm text-gray-600">Director</p>
                  <p className="text-xs text-gray-500">Nodo Tecnológico Catamarca</p>
                </div>

                <div className="text-center space-y-2">
                  <div className="mb-4">
                    <div className="inline-block">
                      <div className="w-48 border-t-2 border-gray-800"></div>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">Lic. María Fernández</p>
                  <p className="text-sm text-gray-600">Coordinadora Académica</p>
                  <p className="text-xs text-gray-500">Programas de Formación</p>
                </div>
              </div>

              {/* Footer seal */}
              <div className="pt-8 flex justify-center items-center gap-4 text-xs text-gray-500">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-600 flex items-center justify-center">
                  <span className="font-bold text-cyan-600">NT</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Certificado Oficial</p>
                  <p>Registro N° {String(graduado.id).padStart(6, "0")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="mt-8 text-center no-print">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600" onClick={() => window.print()}>
              <Download className="h-5 w-5 mr-2" />
              Descargar Diploma
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
