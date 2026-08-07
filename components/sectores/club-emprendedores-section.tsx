import Image from "next/image"

export function ClubEmprendedoresSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">CLUB DE EMPRENDEDORES</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-pretty">
              Un espacio de capacitación, retroalimentación y socialización en el cual los emprendedores encontrarán
              recursos para hacer escalar sus proyectos. El objetivo de este esfuerzo conjunto es alentar la creación y
              apoyar el crecimiento de proyectos tecno-sustentables. La innovación es el camino!
            </p>
          </div>

          <div className="mb-8">
            <p className="text-center text-foreground font-medium mb-6">Son parte del club de emprendedores:</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Facultad de Tecnología y</p>
                  <p className="font-semibold text-foreground text-sm">Ciencias Aplicadas</p>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Ministerio de Industria,</p>
                  <p className="font-semibold text-foreground text-sm">Comercio y Empleo</p>
                  <p className="text-xs text-muted-foreground">Catamarca Gobierno</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl">
            
          </div>
        </div>
      </div>
    </section>
  )
}
