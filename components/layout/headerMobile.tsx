"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { logo, navLinks, ctaButton } from "@/lib/header"
import { Logo } from "./Logo"

interface HeaderMobileProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function HeaderMobile({ mobileMenuOpen, setMobileMenuOpen }: HeaderMobileProps) {
  return (
    <nav className="container mx-auto px-6">
      <div className="flex items-center justify-between h-20">
        <Logo />

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="py-6 border-t border-gray-100 animate-in slide-in-from-top">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-semibold rounded-lg text-gray-600 transition-all hover:text-[#0EA5E9] hover:border-b-2 hover:border-[#0EA5E9]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaButton.href}
              className="mt-2 px-4 py-3 text-white text-sm font-semibold rounded-lg text-center shadow-lg shadow-primary/25"
              style={{
                backgroundImage: `linear-gradient(to right, ${ctaButton.gradientFrom}, ${ctaButton.gradientTo})`,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {ctaButton.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
