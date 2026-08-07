import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  const contactDetails = [
    {
      icon: MapPin,
      title: "Dirección",
      content: "Av. Güemes, Av. Virgen del Valle 6",
      subcontent: "San Fernando del Valle de Catamarca, Catamarca",
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+54 383 123-4567",
      subcontent: "Lunes a Viernes de 9:00 a 18:00",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contacto@nodotecnologico.com",
      subcontent: "info@nodotecnologico.com",
    },
    {
      icon: Clock,
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 - 18:00",
      subcontent: "Sábados: 9:00 - 13:00",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Información de Contacto</h2>
        <p className="text-muted-foreground">Visítanos, llámanos o envíanos un mensaje. Estamos aquí para ayudarte.</p>
      </div>

      <div className="space-y-6">
        {contactDetails.map((detail, index) => (
          <div
            key={index}
            className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <detail.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{detail.title}</h3>
              <p className="text-foreground mb-1">{detail.content}</p>
              <p className="text-sm text-muted-foreground">{detail.subcontent}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
        <h3 className="font-bold text-xl mb-2">¿Necesitas más información?</h3>
        <p className="text-muted-foreground mb-4">
          También puedes visitarnos en nuestras instalaciones para conocer todos nuestros espacios y programas
        </p>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Agendar Visita
        </button>
      </div>
    </div>
  )
}
