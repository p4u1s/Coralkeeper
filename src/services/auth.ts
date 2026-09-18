// Registrieren, Anmelden, Abmelden, Session (FR-6.1)

import { supabase } from "./supabase.ts"
import {
  isAuthRetryableFetchError,
  type AuthError,
  type Session,
} from "@supabase/supabase-js"

// Hooks dürfen @supabase/* nicht importieren (NFR-4.3), daher hier durchreichen
export type { Session }

export async function signUp(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    throw new Error(toFormMessage(error), { cause: error })
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error(toFormMessage(error), { cause: error })
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error("Abmelden fehlgeschlagen.", { cause: error })
  }
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw new Error("Sitzung konnte nicht geladen werden.", { cause: error })
  }
  return data.session
}

// Gibt eine Funktion zurück, die den Listener wieder abmeldet
export function onAuthChange(
  callback: (session: Session | null) => void
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return () => data.subscription.unsubscribe()
}

// Deutsche Meldung für die Auth-Formulare anhand des Supabase-Fehlercodes (FR-6.4)
function toFormMessage(error: AuthError): string {
  if (isAuthRetryableFetchError(error)) {
    return "Keine Verbindung zum Server. Bitte später erneut versuchen."
  }
  switch (error.code) {
    case "invalid_credentials":
      return "E-Mail oder Passwort ist falsch."
    case "user_already_exists":
    case "email_exists":
      return "Für diese E-Mail gibt es bereits ein Konto."
    case "weak_password":
      return "Das Passwort ist zu kurz oder zu einfach."
    default:
      return "Das hat nicht geklappt. Bitte erneut versuchen."
  }
}
