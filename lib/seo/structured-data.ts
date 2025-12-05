// Datos estructurados JSON-LD para mejorar SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "NODO - Centro de Innovación y Desarrollo Tecnológico",
  url: "https://nodo.edu.ar",
  logo: "https://nodo.edu.ar/logonodo1.png",
  description: "Centro de innovación tecnológica y educación digital en Argentina",
  address: {
    "@type": "PostalAddress",
    addressCountry: "AR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Admisiones",
    availableLanguage: "Spanish",
  },
  sameAs: [
    // Agregar redes sociales cuando estén disponibles
    // "https://facebook.com/nodo",
    // "https://twitter.com/nodo",
    // "https://instagram.com/nodo"
  ],
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NODO",
  url: "https://nodo.edu.ar",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nodo.edu.ar/buscar?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}
