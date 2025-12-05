import Image from "next/image"
import { Button } from "@/components/ui/button"

export function PropuestasSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Propuestas <span className="text-primary">Complementarias</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-pretty mb-8">
              El nodo permite realizar visitas escolares con previa cita, además de ofrecer la posibilidad de organizar
              eventos educativos personalizados
            </p>
            <Button size="lg" className="rounded-full">
              Contactar
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
