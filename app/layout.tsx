import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { FooterEducacion } from "@/components/footer-educacion"
import { Header } from "@/components/header"
import { ColorSeparator } from "@/components/color-separator"
import { StructuredData } from "@/components/seo/structured-data"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import { AuthProvider } from "@/contexts/auth-context"

const _heading = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading" })
const _body = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  metadataBase: new URL("https://nodo.edu.ar"), // Cambiar a tu dominio real
  title: {
    default: "NODO - Centro de Innovación y Desarrollo Tecnológico",
    template: "%s | NODO",
  },
  description:
    "Centro de innovación tecnológica y educación digital en Argentina. Cursos, talleres y capacitaciones en programación, inteligencia artificial y tecnologías emergentes.",
  keywords: [
    "innovación tecnológica",
    "educación digital",
    "cursos de programación",
    "inteligencia artificial",
    "desarrollo de software",
    "capacitación tecnológica",
    "NODO Argentina",
    "formación en tecnología",
  ],
  authors: [{ name: "NODO" }],
  creator: "NODO",
  publisher: "NODO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://nodo.edu.ar",
    siteName: "NODO",
    title: "NODO - Centro de Innovación y Desarrollo Tecnológico",
    description:
      "Centro de innovación tecnológica y educación digital. Cursos, talleres y capacitaciones en programación, IA y tecnologías emergentes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NODO - Centro de Innovación Tecnológica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NODO - Centro de Innovación y Desarrollo Tecnológico",
    description: "Centro de innovación tecnológica y educación digital en Argentina.",
    images: ["/og-image.jpg"],
    creator: "@nodo", // Cambiar a tu usuario de Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "google-site-verification-code", // Agregar código de Google Search Console
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_heading.variable} ${_body.variable} font-sans antialiased`}>
        <StructuredData />
        <AuthProvider>
        <Header />
        {children}
        <ColorSeparator colors="w-full h-20 sm:h-32 md:h-48 bg-gradient-to-b from-blue-100 via-sky-300 to-[#26a7fc] shadow-[0_6px_15px_0_rgba(14,165,233,0.35)]" />

        <FooterEducacion />
          <ChatbotWidget />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
