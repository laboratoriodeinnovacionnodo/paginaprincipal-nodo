import { Facebook, Instagram, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FooterEducacion() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-28.47661266945215,-65.78625572883533"

  return (
    <footer className="relative bg-[#26a7fc] text-white overflow-hidden shadow-[0_-0_10px_0_#26a7fc]">
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">Educación Para El Futuro</h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-8 text-white/90">Creemos el futuro, juntos.</p>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-white text-[#26a7fc] hover:bg-white/90 font-semibold text-lg px-12 py-6 rounded-full mb-10 inline-flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Ver ubicación
            </Button>
          </a>

          {/* Address */}
          <p className="text-sm md:text-base text-white/90 mb-8">
            Av. Güemes, Av. Virgen del Valle 6, San Fernando del Valle de Catamarca, Catamarca
          </p>

          {/* Divider */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-white/70">© 2025 NODO TECNOLÓGICO.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
