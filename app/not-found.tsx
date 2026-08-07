import { Button } from "@/components/ui/button"
import { Home, Search, Workflow } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icono de nodo desconectado */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Workflow className="h-24 w-24 text-primary/20" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">404</span>
            </div>
          </div>
        </div>

        {/* Título con temática de nodo */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
          Nodo <span className="text-primary">Desconectado</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-lg mx-auto">
          Parece que este nodo no está en nuestra red tecnológica. La página que buscas no existe o ha sido movida.
        </p>

        {/* Tarjetas de información */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Volver al inicio</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 hover:border-accent/50 transition-colors">
            <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Search className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Explorar cursos</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Workflow className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Conocer el Nodo</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Volver al inicio
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/cursos">
              <Search className="mr-2 h-5 w-5" />
              Explorar cursos
            </Link>
          </Button>
        </div>

        {/* Texto adicional */}
        <p className="mt-8 text-sm text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <Link href="/sobre-nosotros" className="text-primary hover:underline">
            Contáctanos
          </Link>{" "}
          o usa nuestro chatbot en la esquina inferior derecha.
        </p>
      </div>
    </div>
  )
}
