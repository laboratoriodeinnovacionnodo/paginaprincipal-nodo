"use client"

/**
 * contexts/auth-context.tsx
 *
 * AuthProvider — gestiona la sesión Firebase + perfil en ciudadano-back.
 *
 * Flujo:
 *   1. signInWithPopup (Google) → Firebase autentica
 *   2. onAuthStateChanged dispara → obtenemos idToken
 *   3. POST /auth/login en ciudadano-back → upsert del ciudadano en BD
 *   4. GET /ciudadanos/me → perfil completo con lineas
 *
 * Contexto expone:
 *   user    — Firebase User (displayName, email, photoURL, etc.)
 *   perfil  — CiudadanoDB (id, dni, phone, city, lineas, etc.) | null
 *   loading — true mientras se resuelve la sesión inicial
 *   loginWithGoogle()
 *   logout()
 *   refreshPerfil() — re-fetch manual del perfil (útil tras PATCH /me)
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import {
  loginCiudadano,
  getMiPerfil,
  type CiudadanoDB,
} from "@/lib/ciudadano-api"

interface AuthContextValue {
  user: User | null
  perfil: CiudadanoDB | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshPerfil: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Errores de Firebase que NO son fallos reales
const IGNORED_FIREBASE_ERRORS = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
])

function isIgnoredFirebaseError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const code = (error as { code?: string }).code
  return typeof code === "string" && IGNORED_FIREBASE_ERRORS.has(code)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<CiudadanoDB | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Sincroniza con ciudadano-back: hace upsert y luego fetcha el perfil completo.
   * Se llama tanto en el primer login como en cada recarga de sesión.
   */
  const syncConBack = useCallback(async (firebaseUser: User) => {
    try {
      const idToken = await firebaseUser.getIdToken()

      // Upsert — crea o actualiza el ciudadano en la BD
      await loginCiudadano(idToken)

      // Perfil completo con lineas
      const ciudadanoDB = await getMiPerfil(idToken)
      setPerfil(ciudadanoDB)
    } catch (err) {
      // Si el back no está disponible (NEXT_PUBLIC_CIUDADANO_API_URL no seteada
      // o error de red), logueamos pero NO rompemos la sesión Firebase.
      console.warn("[auth] ciudadano-back no disponible o no configurado:", err)
      setPerfil(null)
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        await syncConBack(firebaseUser)
      } else {
        setPerfil(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [syncConBack])

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.warn("[auth] Firebase no está configurado (faltan NEXT_PUBLIC_FIREBASE_*)")
      return
    }
    try {
      await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged se encarga del syncConBack
    } catch (error) {
      if (!isIgnoredFirebaseError(error)) {
        console.error("[auth] Error en login con Google:", error)
        throw error
      }
    }
  }

  const logout = async () => {
    if (!auth) return
    await firebaseSignOut(auth)
    setPerfil(null)
  }

  /** Re-fetcha el perfil desde ciudadano-back (usar tras PATCH /me). */
  const refreshPerfil = useCallback(async () => {
    if (!user) return
    try {
      const idToken = await user.getIdToken()
      const ciudadanoDB = await getMiPerfil(idToken)
      setPerfil(ciudadanoDB)
    } catch (err) {
      console.error("[auth] Error al refrescar perfil:", err)
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{ user, perfil, loading, loginWithGoogle, logout, refreshPerfil }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}
