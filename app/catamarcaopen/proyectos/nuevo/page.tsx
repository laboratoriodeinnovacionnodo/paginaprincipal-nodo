"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, LogIn, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { submitProject } from "@/lib/catamarcaopen/api"

const CATEGORIES = ["Trámites digitales", "Medio ambiente", "Infraestructura", "Educación", "Salud", "Otro"]

export default function NuevoProyectoCatamarcaOpenPage() {
  const { user, loading, loginWithGoogle } = useAuth()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [repoUrl, setRepoUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  const handleLogin = async () => {
    if (signingIn) return
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error("[catamarcaopen/proyectos/nuevo] Error al iniciar sesión:", error)
    } finally {
      setSigningIn(false)
    }
  }

  const isValid =
    title.trim().length >= 4 && description.trim().length >= 10 && /^https?:\/\/.+/.test(repoUrl.trim())

  const handleSubmit = async () => {
    if (!isValid || submitting || !user) return
    setSubmitting(true)
    try {
      const idToken = await user.getIdToken()
      await submitProject({ title, description, category, repoUrl }, idToken)
      setSubmitted(true)
    } catch (error) {
      console.error("[catamarcaopen/proyectos/nuevo] Error al publicar el proyecto:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#26a7fc]" />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-[#26a7fc]/10">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Necesitás iniciar sesión</h1>
            <p className="text-sm text-muted-foreground mb-6 text-pretty">
              Para publicar un proyecto en CatamarcaOpen, iniciá sesión con tu cuenta de Google.
            </p>
            <Button
              onClick={handleLogin}
              disabled={signingIn}
              className="w-full text-white"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              {signingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Ingresar con Google
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-[#26a7fc]/10">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">¡Proyecto enviado!</h1>
            <p className="text-sm text-muted-foreground mb-6 text-pretty">
              Tu proyecto quedó en revisión. Te vamos a avisar cuando el equipo lo apruebe.
            </p>
            <Button asChild variant="outline">
              <Link href="/catamarcaopen/proyectos">Volver al listado</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-xl">
        <Link
          href="/catamarcaopen/proyectos"
          className="inline-flex items-center gap-1.5 text-sm text-[#1c8fe0] hover:text-cyan-800 mb-6"
        >
          Volver al listado
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Publicar un proyecto</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Tu proyecto pasa por revisión de la comunidad antes de publicarse.
        </p>

        <Card className="border-[#26a7fc]/10">
          <CardContent className="pt-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Título</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre de tu proyecto" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Descripción</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Qué problema resuelve y cómo funciona"
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">URL del repositorio</label>
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/usuario/proyecto"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="text-white"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {submitting ? "Enviando..." : "Enviar para revisión"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
