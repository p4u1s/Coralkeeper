// Korallen anlegen und lesen (FR-1.2, FR-1.14)

import type { Tables } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";

export type Coral = Tables<"koralle">;

export type CoralInput = Pick<
  Coral,
  "bezeichnung" | "becken_id" | "art" | "handelsname" | "erwerbsdatum"
>;

// Leere Felder mit NULL vorbelegen
function toRow(input: CoralInput): CoralInput {
  return {
    bezeichnung: input.bezeichnung.trim(),
    becken_id: input.becken_id,
    art: input.art?.trim() || null,
    handelsname: input.handelsname?.trim() || null,
    erwerbsdatum: input.erwerbsdatum || null,
  };
}

export async function listCorals(): Promise<Coral[]> {
  const { data, error } = await supabase
    .from("koralle")
    .select("*")
    .order("bezeichnung");

  if (error) {
    throw new Error("Korallen konnten nicht geladen werden.", {
      cause: error,
    });
  }
  return data;
}

export async function createCoral(input: CoralInput): Promise<Coral> {
  // getSession statt getUser, Begründung siehe createTank
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Nicht angemeldet.", { cause: sessionError });
  }

  // status setzt die Datenbank selbst auf im_bestand
  const { data, error } = await supabase
    .from("koralle")
    .insert({ ...toRow(input), nutzer_id: sessionData.session.user.id })
    .select()
    .single();

  if (error) {
    throw new Error("Koralle konnte nicht angelegt werden.", { cause: error });
  }
  return data;
}
