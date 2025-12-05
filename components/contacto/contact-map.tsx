export function ContactMap() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Nuestra Ubicación</h2>
        <p className="text-muted-foreground">Encuéntranos en el corazón de San Fernando del Valle de Catamarca</p>
      </div>

      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-border shadow-xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3478.9247864831877!2d-65.78787!3d-28.46861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI4JzA3LjAiUyA2NcKwNDcnMTYuMyJX!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Nodo Tecnológico"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-xl bg-card border border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚗</span>
          </div>
          <h3 className="font-semibold mb-2">En Auto</h3>
          <p className="text-sm text-muted-foreground">Estacionamiento disponible en la zona</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-card border border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🚌</span>
          </div>
          <h3 className="font-semibold mb-2">Transporte Público</h3>
          <p className="text-sm text-muted-foreground">Líneas 1, 5 y 12 con paradas cercanas</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-card border border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">♿</span>
          </div>
          <h3 className="font-semibold mb-2">Accesibilidad</h3>
          <p className="text-sm text-muted-foreground">Instalaciones completamente accesibles</p>
        </div>
      </div>
    </div>
  )
}
