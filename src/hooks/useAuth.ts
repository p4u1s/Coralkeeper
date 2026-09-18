// Custom Hook für Session-Zustand für die gesamte App (FR-6.1)

import { createContext, useContext } from "react";
import type { Session } from "@/services/auth.ts";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
  status: AuthStatus;
  session: Session | null;
};

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error(
      "useAuth muss innerhalb von <AuthProvider> verwendet werden."
    );
  }
  return auth;
}
