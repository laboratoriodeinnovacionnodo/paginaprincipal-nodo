import { Facebook, Instagram, Twitter, Youtube, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-28.47661266945215,-65.78625572883533"

  return (
    <footer className="bg-slate-100 pt-16 pb-8 relative">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-200/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logonodo1.png" alt="Nodo Logo" width={40} height={40} />
              <span className="text-xl font-bold">Nodo Tecnológico</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Conectando talento con oportunidades tecnológicas en Catamarca
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/noticias" className="text-muted-foreground hover:text-primary transition-colors">
                  Noticias
                </Link>
              </li>
              <li>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  Ver ubicación
                </a>
              </li>
            </ul>
          </div>

          {/* Cursos */}
          <div>
            <h3 className="font-semibold mb-4">Cursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/cursos#cursos-virtuales"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cursos Virtuales
                </Link>
              </li>
              <li>
                <Link
                  href="/cursos#cursos-presenciales"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cursos Presenciales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ubicación</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Catamarca, Argentina</li>
              <li>info@nodotecnologico.edu.ar</li>
              <li>+54 (383) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nodo Tecnológico de Catamarca. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
