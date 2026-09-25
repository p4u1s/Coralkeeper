// Korallen anlegen, lesen und Steckbrief befüllen(FR-1.2, FR-1.14)

import type { Tables } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";

export type Coral = Tables<"koralle">;

export type CoralInput = Pick<
  Coral,
  "bezeichnung" | "becken_id" | "art" | "handelsname" | "erwerbsdatum"
>;

// Steckbrief-Spalten (FR-2.1, FR-2.2). Schutzstatus bleibt MS-9 (FR-2.4).
export type CoralProfileInput = Pick<
  Coral,
  | "licht"
  | "stroemung"
  | "platzierung"
  | "nesselkraft"
  | "wuchsform"
  | "schwierigkeit"
  | "fuetterung"
  | "besonderheiten"
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

// null, wenn die Koralle nicht existiert oder einem anderen Nutzer gehört (RLS)
export async function getCoral(id: string): Promise<Coral | null> {
  const { data, error } = await supabase
    .from("koralle")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 22P02: keine gültige UUID in der URL – wird zu „nicht gefunden“
  if (error?.code === "22P02") {
    return null;
  }
  if (error) {
    throw new Error("Koralle konnte nicht geladen werden.", { cause: error });
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

// Leere Felder mit NULL vorbelegen
function toProfileRow(input: CoralProfileInput): CoralProfileInput {
  return {
    licht: input.licht,
    stroemung: input.stroemung,
    platzierung: input.platzierung,
    nesselkraft: input.nesselkraft,
    wuchsform: input.wuchsform?.trim() || null,
    schwierigkeit: input.schwierigkeit,
    fuetterung: input.fuetterung?.trim() || null,
    besonderheiten: input.besonderheiten?.trim() || null,
  };
}

// Aktualisiert ausschließlich die Steckbrief-Spalten: keine Stammdaten,
// kein Status. Erzeugt deshalb auch keinen Historieneintrag (FR-3.4).
export async function updateCoralProfile(
  id: string,
  input: CoralProfileInput
): Promise<Coral> {
  const { data, error } = await supabase
    .from("koralle")
    .update(toProfileRow(input))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Steckbrief konnte nicht gespeichert werden.", {
      cause: error,
    });
  }
  return data;
}
