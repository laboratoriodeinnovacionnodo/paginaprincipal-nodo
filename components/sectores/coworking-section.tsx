import Image from "next/image"

export function CoworkingSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">Coworking</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-pretty">
              Un entorno dinámico y colaborativo donde se fomenta la innovación y el trabajo en equipo. Ideal para
              emprendedores, freelancers y empresas de nuestra comunidad.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/design-mode/image.png"
              alt="Espacios de coworking modernos y flexibles"
              width={1200}
              height={700}
              className="w-full h-auto"
            />
            <div className="absolute bottom-6 left-6 bg-background/95 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
              <p className="text-sm font-semibold text-foreground">Espacios Flexibles</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
