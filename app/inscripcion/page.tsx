"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Mail, User, FileText, GraduationCap } from "lucide-react"
import { cursosDisponibles } from "@/lib/cursos/data"
import { useInscripcionForm } from "@/hooks/inscripcion/use-inscripcion-form"

export default function InscripcionPage() {
  const { formData, enviado, enviando, handleChange, handleSubmit } = useInscripcionForm()

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-balance md:text-6xl">
            Inscripción a <span className="text-cyan-500">Cursos</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Completa el formulario para inscribirte en nuestros cursos del Nodo Tecnológico de Catamarca
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Card className="bg-white/70 backdrop-blur-sm border-cyan-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-600">Formulario de Inscripción</CardTitle>
                <CardDescription>Por favor completa todos los campos para procesar tu inscripción</CardDescription>
              </CardHeader>
              <CardContent>
                {enviado ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                    <h3 className="text-2xl font-bold text-green-600">¡Inscripción Exitosa!</h3>
                    <p className="text-center text-muted-foreground">
                      Gracias por inscribirte. Pronto recibirás un correo con más información.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Datos Personales */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-cyan-700 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Datos Personales
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre *</Label>
                          <Input
                            id="nombre"
                            placeholder="Tu nombre"
                            value={formData.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            required
                            className="bg-white/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="apellido">Apellido *</Label>
                          <Input
                            id="apellido"
                            placeholder="Tu apellido"
                            value={formData.apellido}
                            onChange={(e) => handleChange("apellido", e.target.value)}
                            required
                            className="bg-white/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dni">DNI *</Label>
                        <Input
                          id="dni"
                          type="text"
                          placeholder="12345678"
                          value={formData.dni}
                          onChange={(e) => handleChange("dni", e.target.value)}
                          required
                          pattern="[0-9]{7,8}"
                          className="bg-white/50"
                        />
                      </div>
                    </div>

                    {/* Datos de Contacto */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-cyan-700 flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Datos de Contacto
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                          className="bg-white/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="+54 9 11 1234-5678"
                          value={formData.telefono}
                          onChange={(e) => handleChange("telefono", e.target.value)}
                          required
                          className="bg-white/50"
                        />
                      </div>
                    </div>

                    {/* Selección de Curso */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-cyan-700 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Información del Curso
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="curso">Curso a inscribirse *</Label>
                        <Select value={formData.curso} onValueChange={(value) => handleChange("curso", value)} required>
                          <SelectTrigger id="curso" className="bg-white/50">
                            <SelectValue placeholder="Selecciona un curso" />
                          </SelectTrigger>
                          <SelectContent>
                            {cursosDisponibles.map((curso) => (
                              <SelectItem key={curso} value={curso}>
                                {curso}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motivacion">Motivación *</Label>
                        <Textarea
                          id="motivacion"
                          placeholder="Cuéntanos por qué quieres realizar este curso..."
                          value={formData.motivacion}
                          onChange={(e) => handleChange("motivacion", e.target.value)}
                          required
                          rows={4}
                          className="bg-white/50 resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={enviando}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-6 text-lg"
                      >
                        {enviando ? (
                          <>
                            <span className="animate-pulse">Enviando...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-5 w-5" />
                            Enviar Inscripción
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-center text-muted-foreground">
                      * Campos obligatorios. Tus datos serán tratados de forma confidencial.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Información Adicional */}
            {!enviado && (
              <div className="mt-8 space-y-4">
                <Card className="bg-cyan-50/70 backdrop-blur-sm border-cyan-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-cyan-700 mb-2">Información importante</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✓ Recibirás un correo de confirmación en las próximas 48 horas</li>
                      <li>✓ Revisa tu bandeja de spam si no recibes el correo</li>
                      <li>✓ Los cupos son limitados y se asignan por orden de inscripción</li>
                      <li>✓ Para consultas, contacta a inscripciones@nodocatamarca.gob.ar</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
