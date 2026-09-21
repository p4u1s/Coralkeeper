// Becken anlegen, lesen, bearbeiten und löschen

import type { Tables } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";

export type Tank = Tables<"becken">;

export type TankInput = Pick<
  Tank,
  "name" | "volumen_liter" | "beschreibung" | "startdatum"
>;

// Leere Felder mit NULL vorbelegen
function toRow(input: TankInput): TankInput {
  return {
    name: input.name.trim(),
    volumen_liter: input.volumen_liter,
    beschreibung: input.beschreibung?.trim() || null,
    startdatum: input.startdatum || null,
  };
}

export async function listTanks(): Promise<Tank[]> {
  const { data, error } = await supabase
    .from("becken")
    .select("*")
    .order("name");

  if (error) {
    throw new Error("Becken konnten nicht geladen werden.", { cause: error });
  }
  return data;
}

// null, wenn das Becken nicht existiert oder einem anderen Nutzer gehört (RLS)
export async function getTank(id: string): Promise<Tank | null> {
  const { data, error } = await supabase
    .from("becken")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 22P02: keine gültige UUID in der URL –  wird zu Fehlermeldung "Becken konnte nicht geladen werden"
  if (error?.code === "22P02") {
    return null;
  }
  if (error) {
    throw new Error("Becken konnte nicht geladen werden.", { cause: error });
  }
  return data;
}

export async function createTank(input: TankInput): Promise<Tank> {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Nicht angemeldet.", { cause: userError });
  }

  const { data, error } = await supabase
    .from("becken")
    .insert({ ...toRow(input), nutzer_id: userData.user.id })
    .select()
    .single();

  if (error) {
    throw new Error("Becken konnte nicht angelegt werden.", { cause: error });
  }
  return data;
}

export async function updateTank(id: string, input: TankInput): Promise<Tank> {
  const { data, error } = await supabase
    .from("becken")
    .update(toRow(input))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Becken konnte nicht gespeichert werden.", {
      cause: error,
    });
  }
  return data;
}

export async function deleteTank(id: string): Promise<void> {
  const { error } = await supabase.from("becken").delete().eq("id", id);

  // 23503: koralle.becken_id ist ON DELETE RESTRICT (NFR-4.7)
  if (error?.code === "23503") {
    throw new Error(
      "In diesem Becken sind noch Korallen. Setze sie zuerst um oder lösche sie.",
      { cause: error }
    );
  }
  if (error) {
    throw new Error("Becken konnte nicht gelöscht werden.", { cause: error });
  }
}
