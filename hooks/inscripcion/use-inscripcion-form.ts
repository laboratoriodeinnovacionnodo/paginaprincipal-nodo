"use client"

import type React from "react"

import { useState } from "react"
import type { FormDataInscripcion } from "@/lib/inscripcion/types"

export const useInscripcionForm = () => {
  const [formData, setFormData] = useState<FormDataInscripcion>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
    curso: "",
    motivacion: "",
  })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const handleChange = (field: keyof FormDataInscripcion, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    // Simulación de envío - reemplazar con lógica real
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Formulario enviado:", formData)
    setEnviado(true)
    setEnviando(false)

    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      resetForm()
    }, 3000)
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      dni: "",
      curso: "",
      motivacion: "",
    })
    setEnviado(false)
  }

  return {
    formData,
    enviado,
    enviando,
    handleChange,
    handleSubmit,
    resetForm,
  }
}
