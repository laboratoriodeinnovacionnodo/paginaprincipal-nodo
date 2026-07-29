"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export function ContactoSection() {
  const handleOpenChatbot = () => {
    const event = new CustomEvent("open-chatbot")
    window.dispatchEvent(event)
  }

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-28.47661266945215,-65.78625572883533"
  const whatsappUrl = "https://wa.me/5493834567890" // Reemplazar con el número real
  const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=info@nodotecnologico.edu.ar"

  return (
    <section id="contacto" className="pt-20 relative">
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Listo para <span className="text-primary">empezar?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Contáctanos para más información sobre nuestros cursos y programas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Dirección</h3>
                  <p className="text-sm text-muted-foreground">
                    Nodo Tecnológico
                    <br />
                    Catamarca, Argentina
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">info@nodotecnologico.edu.ar</p>
                </CardContent>
              </Card>
            </a>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Teléfono</h3>
                  <p className="text-sm text-muted-foreground">+54 (383) 123-4567</p>
                </CardContent>
              </Card>
            </a>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" onClick={handleOpenChatbot}>
              Consultarle a la IA
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" />
    </section>
  )
}
