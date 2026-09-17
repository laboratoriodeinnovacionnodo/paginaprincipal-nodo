"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, Newspaper, Users, Calendar, Briefcase, Code2, FlaskConical } from "lucide-react"
import Link from "next/link"
import { logo, navLinks, ctaButton } from "@/lib/header"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"

const navIcons: Record<string, any> = {
  "/noticias":       Newspaper,
  "/coworking":      Briefcase,
  "/eventos":        Calendar,
  "/laboratorio":    FlaskConical,
  "/sobre-nosotros": Users,
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled]             = useState(false)
  const pathname = usePathname()

  const LogoIcon = logo.icon

  useEffect(() => {
    if (pathname !== "/") return
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.9)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const headerBg       = pathname === "/" ? (scrolled ? "bg-white/25 backdrop-blur-lg" : "bg-transparent") : "bg-white/25 backdrop-blur-lg"
  const textColor      = pathname === "/" ? (scrolled ? "text-gray-700" : "text-white")  : "text-gray-700"
  const logoTitleColor = pathname === "/" ? (scrolled ? "text-gray-900" : "text-white")  : "text-gray-900"
  const logoSubColor   = pathname === "/" ? (scrolled ? "text-gray-500" : "text-gray-200") : "text-gray-500"
  const iconColor      = pathname === "/" && !scrolled ? "text-white" : "text-gray-700"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 transition-colors duration-500">

          {/* Logo */}
          <Link href={logo.href} className="flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundImage: `linear-gradient(to bottom right, ${logo.gradientFrom}, ${logo.gradientTo})` }}
            >
              <LogoIcon className="h-6 w-6 text-white" />
            </div>
            <div className="hidden lg:flex flex-col transition-colors duration-500">
              <span className={`text-xl font-bold leading-tight ${logoTitleColor}`}>
                {logo.title.split("Tech")[0]}
                <span className="text-[#26a7fc]"> Tecnologico</span>
              </span>
              <span className={`text-[10px] font-medium tracking-wide ${logoSubColor}`}>
                {logo.subtitle}
              </span>
            </div>
          </Link>

          {/* Derecha */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 transition-colors duration-500">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${textColor}`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#26a7fc] rounded-full opacity-0 transition-all duration-300 group-hover:w-1/2 group-hover:opacity-100" />
                </Link>
              ))}
              <Link
                href={ctaButton.href}
                className="ml-3 px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundImage: `linear-gradient(to right, ${ctaButton.gradientFrom}, ${ctaButton.gradientTo})` }}
              >
                {ctaButton.label}
              </Link>
            </div>

            {/* Botón hamburguesa mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className={`h-6 w-6 transition-colors duration-300 ${iconColor}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer mobile */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="bottom">
        <DrawerContent className="bg-gradient-to-b from-white to-cyan-50/30 backdrop-blur-xl border-t border-[#26a7fc]/10">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Menu de navegación</DrawerTitle>
            <DrawerDescription>Opciones de navegación del sitio</DrawerDescription>
          </DrawerHeader>

          <DrawerClose className="mx-auto w-full py-3 flex justify-center cursor-pointer active:bg-gray-50/50 transition-colors">
            <div className="w-12 h-1.5 rounded-full bg-gray-300" />
          </DrawerClose>

          <div className="px-6 pb-8">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = navIcons[link.href]
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold rounded-xl text-gray-700 hover:bg-[#26a7fc]/10 active:bg-[#26a7fc]/10 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {Icon && <Icon className="h-5 w-5 text-[#26a7fc]" />}
                    {link.label}
                  </Link>
                )
              })}

              <Link
                href={ctaButton.href}
                className="flex items-center justify-center gap-2 mt-3 px-4 py-3.5 text-white text-base font-semibold rounded-xl text-center shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all duration-200"
                style={{ backgroundImage: `linear-gradient(to right, ${ctaButton.gradientFrom}, ${ctaButton.gradientTo})` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {ctaButton.label}
              </Link>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  )
}
