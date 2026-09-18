import { useEffect, useState, type ReactNode } from "react"
import { getSession, onAuthChange, type Session } from "@/services/auth.ts"
import { AuthContext, type AuthState } from "./useAuth.ts"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    status: "loading",
    session: null,
  })

  useEffect(() => {
    function update(session: Session | null) {
      setAuth({
        status: session ? "authenticated" : "unauthenticated",
        session,
      })
    }

    getSession()
      .then(update)
      .catch(() => update(null))

    // Im Callback nur den Zustand setzen, keine Supabase-Aufrufe mit await
    return onAuthChange(update)
  }, [])

  return <AuthContext value={auth}>{children}</AuthContext>
}
