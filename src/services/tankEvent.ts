// Wasserwechsel und Ereignisse lesen, anlegen, bearbeiten und löschen
// (FR-5.3, FR-5.4, FR-5.10)
//
// Fütterungen (FR-5.5) legt die Oberfläche in MS-8 nicht an, vorhandene
// werden aber gelesen, geändert und gelöscht (Festlegung 19).

import type { Tables } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";

export type TankEvent = Tables<"becken_ereignis">;

export type TankEventInput = Pick<
  TankEvent,
  "becken_id" | "datum" | "typ" | "menge" | "text" | "koralle_id"
>;

// Leere Felder mit NULL vorbelegen
function toRow(input: TankEventInput): TankEventInput {
  return {
    becken_id: input.becken_id,
    datum: input.datum,
    typ: input.typ,
    menge: input.menge?.trim() || null,
    text: input.text?.trim() || null,
    koralle_id: input.koralle_id || null,
  };
}

// Neueste zuerst: nach Datum, am selben Tag nach Erfassung (TASK-08-03).
// Bei gleichem Zeitpunkt in der Reihenfolge des Enums (Wasserwechsel … Ereignis)
export async function listTankEvents(): Promise<TankEvent[]> {
  const { data, error } = await supabase
    .from("becken_ereignis")
    .select("*")
    .order("datum", { ascending: false })
    .order("erstellt_am", { ascending: false })
    .order("typ");

  if (error) {
    throw new Error("Einträge konnten nicht geladen werden.", {
      cause: error,
    });
  }
  return data;
}

// null, wenn der Eintrag nicht existiert oder einem anderen Nutzer gehört (RLS)
export async function getTankEvent(id: string): Promise<TankEvent | null> {
  const { data, error } = await supabase
    .from("becken_ereignis")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 22P02: keine gültige UUID in der URL – wird zu „nicht gefunden“
  if (error?.code === "22P02") {
    return null;
  }
  if (error) {
    throw new Error("Eintrag konnte nicht geladen werden.", { cause: error });
  }
  return data;
}

export async function createTankEvent(
  input: TankEventInput
): Promise<TankEvent> {
  // getSession statt getUser, Begründung siehe createTank
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Nicht angemeldet.", { cause: sessionError });
  }

  const { data, error } = await supabase
    .from("becken_ereignis")
    .insert({ ...toRow(input), nutzer_id: sessionData.session.user.id })
    .select()
    .single();

  if (error) {
    throw new Error("Eintrag konnte nicht angelegt werden.", { cause: error });
  }
  return data;
}

export async function updateTankEvent(
  id: string,
  input: TankEventInput
): Promise<TankEvent> {
  const { data, error } = await supabase
    .from("becken_ereignis")
    .update(toRow(input))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Eintrag konnte nicht gespeichert werden.", {
      cause: error,
    });
  }
  return data;
}

export async function deleteTankEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from("becken_ereignis")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Eintrag konnte nicht gelöscht werden.", { cause: error });
  }
}
