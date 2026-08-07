"use client"


import { CodeTitle } from "@/components/shared/code-title"
import { ContactHero } from "@/components/contacto/contact-hero"
import { ContactInfo } from "@/components/contacto/contact-info"
import { ContactForm } from "@/components/contacto/contact-form"
import { ContactMap } from "@/components/contacto/contact-map"

export default function ContactoPage() {
  return (
    <main className="min-h-screen">
      <ContactHero />

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <ContactInfo />
          <ContactForm />
        </div>

        <ContactMap />
      </div>
    </main>
  )
}
