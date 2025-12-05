import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Target, Users, Award } from "lucide-react"

export function SobreNodoSection() {
  return (
    <section id="sobre-nodo" className="bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre el <span className="text-primary">Nodo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos un centro de innovación tecnológica comprometido con el desarrollo de habilidades digitales
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovación</h3>
              <p className="text-sm text-muted-foreground">
                Fomentamos la creatividad y el pensamiento innovador en cada proyecto
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Objetivos Claros</h3>
              <p className="text-sm text-muted-foreground">
                Programas diseñados con metas específicas y resultados medibles
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comunidad</h3>
              <p className="text-sm text-muted-foreground">
                Una red de estudiantes, mentores y profesionales que se apoyan mutuamente
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/50">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excelencia</h3>
              <p className="text-sm text-muted-foreground">
                Compromiso con la calidad educativa y el desarrollo profesional continuo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
