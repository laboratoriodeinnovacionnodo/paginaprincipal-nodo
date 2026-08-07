"use client"

import { useState } from "react"
import Link from "next/link"
import { LogIn, LogOut, Loader2, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

function UserPhoto({
  name,
  photoURL,
  sizeClass,
}: {
  name: string
  photoURL: string | null
  sizeClass: string
}) {
  if (photoURL) {
    return (
      <img
        src={photoURL || "/placeholder.svg"}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${sizeClass} rounded-full object-cover`}
      />
    )
  }
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold`}
      style={{ backgroundImage: "linear-gradient(to bottom right, #26a7fc, #1c8fe0)" }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

/**
 * Avatar compacto / botón "Ingresar".
 * Vive en la barra superior del Header — visible en mobile, tablet y desktop.
 * Click en el avatar -> /perfil. Click en "Ingresar" -> popup de Google.
 */
export function HeaderAuth({ textColor }: { textColor: string }) {
  const { user, loading, loginWithGoogle } = useAuth()
  const [signingIn, setSigningIn] = useState(false)

  const handleLogin = async () => {
    if (signingIn) return
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error("[header-auth] Error al iniciar sesión:", error)
    } finally {
      setSigningIn(false)
    }
  }

  if (loading) {
    return <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-300/40 animate-pulse" aria-hidden="true" />
  }

  if (user) {
    const displayName = user.displayName ?? user.email ?? "Ciudadano"
    return (
      <Link
        href="/perfil"
        aria-label="Ir a mi perfil"
        className="shrink-0 block rounded-full ring-2 ring-transparent hover:ring-[#26a7fc] transition-all duration-200"
      >
        <UserPhoto name={displayName} photoURL={user.photoURL} sizeClass="h-9 w-9 sm:h-10 sm:w-10" />
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={signingIn}
      className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg border border-current/25 hover:bg-current/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait shrink-0 ${textColor}`}
    >
      {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      <span className="hidden sm:inline">{signingIn ? "Ingresando..." : "Ingresar"}</span>
    </button>
  )
}

/**
 * Tarjeta de perfil dentro del Drawer mobile.
 * Logueado: avatar + nombre + email + acceso a "Cerrar sesión".
 * Sin loguear: botón "Ingresar con Google" a todo el ancho.
 */
export function HeaderAuthMobileCard({ onNavigate }: { onNavigate: () => void }) {
  const { user, loading, loginWithGoogle, logout } = useAuth()
  const [signingIn, setSigningIn] = useState(false)

  const handleLogin = async () => {
    if (signingIn) return
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error("[header-auth-mobile] Error al iniciar sesión:", error)
    } finally {
      setSigningIn(false)
    }
  }

  if (loading) {
    return <div className="h-16 w-full rounded-xl bg-gray-100 animate-pulse" />
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={handleLogin}
        disabled={signingIn}
        className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-sm font-semibold rounded-xl border border-[#26a7fc]/20 text-gray-700 hover:bg-[#26a7fc]/10 transition-all duration-200 disabled:opacity-60"
      >
        {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4 text-[#26a7fc]" />}
        {signingIn ? "Ingresando..." : "Ingresar con Google"}
      </button>
    )
  }

  const displayName = user.displayName ?? user.email ?? "Ciudadano"

  return (
    <div className="rounded-xl border border-[#26a7fc]/10 bg-white/60 p-3">
      <Link
        href="/perfil"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-[#26a7fc]/10 transition-colors"
      >
        <UserPhoto name={displayName} photoURL={user.photoURL} sizeClass="h-11 w-11" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
          {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
      </Link>

      <button
        type="button"
        onClick={async () => {
          await logout()
          onNavigate()
        }}
        className="mt-2 flex items-center gap-2 w-full px-2.5 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut className="h-3.5 w-3.5" />
        Cerrar sesión
      </button>
    </div>
  )
}
