// lib/firebase.ts
// Inicialización de Firebase — SOLO autenticación con Google (sin backend propio).
// Las variables NEXT_PUBLIC_FIREBASE_* se inyectan en build time (ver Dockerfile).
// Este archivo NO debe commitearse con valores hardcodeados — siempre usa env vars.

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey:     process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId:      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app:            FirebaseApp | undefined
let auth:           Auth | undefined
let googleProvider: GoogleAuthProvider | undefined

// Solo inicializar si las vars están presentes.
// En build sin vars, evita crash — en runtime, HeaderAuth avisa por consola.
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  app            = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
  auth           = getAuth(app)
  googleProvider = new GoogleAuthProvider()

  // Forzar selección de cuenta en cada login (mejor UX multi-cuenta Google)
  googleProvider.setCustomParameters({ prompt: 'select_account' })
} else {
  console.warn(
    '[Firebase] Variables de entorno no configuradas. ' +
    'Asegurate de tener NEXT_PUBLIC_FIREBASE_* en .env.local o en los secrets del CI.'
  )
}

export { app, auth, googleProvider }
