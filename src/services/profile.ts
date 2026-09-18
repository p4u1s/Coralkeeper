// Eigenes Profil lesen

import type { Tables } from "@/types/database.types.ts"
import { supabase } from "./supabase.ts"

export async function getOwnProfile(): Promise<Tables<"profil">> {
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    throw new Error("Nicht angemeldet.", { cause: userError })
  }

  const { data, error } = await supabase
    .from("profil")
    .select("*")
    .eq("id", userData.user.id)
    .single()

  if (error) {
    throw new Error("Profil konnte nicht geladen werden.", { cause: error })
  }
  return data
}
