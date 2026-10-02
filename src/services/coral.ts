// Korallen und Ableger anlegen, lesen und Steckbrief befüllen(FR-1.2, FR-1.14 FR-1.7)
// Stammdaten ändern, Status wechseln, löschen (FR-1.9, FR-1.10, FR-1.11)

import type { Tables, TablesInsert } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";
import { createJournalEntry } from "@/services/history.ts";
import { removeCoralImages } from "@/services/image.ts";
import { buildOriginChain } from "@/lib/origin.ts";
import { todayIso } from "@/lib/validation.ts";

export type Coral = Tables<"koralle">;

// zur_abgabe entsteht nur mit einem Inserat (Festlegung 18, TASK-09-01)
export type TargetCoralStatus = Exclude<Coral["status"], "zur_abgabe">;

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

// Eingaben aus dem Ableger-Formular (FR-1.7). Alles andere kommt aus der Ursprungskoralle
export type FragInput = Pick<Coral, "bezeichnung" | "becken_id">;

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

// Status und Steckbrief bleiben unberührt. Den Systemeintrag bei einem
// Beckenwechsel schreibt der Trigger (FR-1.11)
export async function updateCoral(
  id: string,
  input: CoralInput
): Promise<Coral> {
  const { data, error } = await supabase
    .from("koralle")
    .update(toRow(input))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Koralle konnte nicht gespeichert werden.", {
      cause: error,
    });
  }
  return data;
}

// Den Systemeintrag schreibt der Trigger. Die Notiz wird ein Journaleintrag
// mit demselben Datum, leere Notiz → kein Eintrag (FR-1.9, FR-3.5)
export async function changeCoralStatus(
  id: string,
  status: TargetCoralStatus,
  note: string
): Promise<Coral> {
  const { data, error } = await supabase
    .from("koralle")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Status konnte nicht geändert werden.", { cause: error });
  }
  if (!note.trim()) {
    return data;
  }

  try {
    await createJournalEntry({ koralle_id: id, datum: todayIso(), text: note });
  } catch (journalError) {
    throw new Error(
      "Der Status wurde geändert, die Notiz konnte aber nicht gespeichert werden.",
      { cause: journalError }
    );
  }
  return data;
}

// Erst die Zeile, dann die Dateien: Scheitert das Aufräumen, bleiben nur
// unsichtbare Dateien liegen – die Koralle ist gelöscht, der Fehler wird
// bewusst nicht gemeldet (TASK-09-04). Historie, Inserat und
// bild_dokument gehen per Kaskade mit (FR-1.10)
export async function deleteCoral(id: string): Promise<void> {
  const { error } = await supabase.from("koralle").delete().eq("id", id);

  if (error) {
    throw new Error("Koralle konnte nicht gelöscht werden.", { cause: error });
  }

  try {
    await removeCoralImages(id);
  } catch {
    // bewusst ohne Meldung, siehe oben
  }
}

// Snapshot der Ursprungskoralle nach Festlegung 17 – alle Spalten an einer Stelle.
// Nicht im Insert: primaerbild, quelle_name, belegnummer, cites_nr, herkunft_notiz.
// status setzt die Datenbank selbst auf im_bestand
function toFragRow(
  mother: Coral,
  input: FragInput
): Omit<TablesInsert<"koralle">, "nutzer_id"> {
  const today = todayIso();

  return {
    // aus dem Formular
    bezeichnung: input.bezeichnung.trim(),
    becken_id: input.becken_id,
    // kopiert
    art: mother.art,
    handelsname: mother.handelsname,
    licht: mother.licht,
    stroemung: mother.stroemung,
    platzierung: mother.platzierung,
    nesselkraft: mother.nesselkraft,
    wuchsform: mother.wuchsform,
    schwierigkeit: mother.schwierigkeit,
    fuetterung: mother.fuetterung,
    besonderheiten: mother.besonderheiten,
    schutzstatus: mother.schutzstatus,
    // neu gesetzt
    mutter_id: mother.id,
    erwerbsdatum: today,
    quelle_typ: "eigene_nachzucht",
    herkunftskette: buildOriginChain(mother, today),
  };
}

// Die Systemeinträge bei Ableger und Ursprungskoralle schreibt der Trigger (Festlegung 15)
export async function createFrag(
  mother: Coral,
  input: FragInput
): Promise<Coral> {
  // getSession statt getUser, Begründung siehe createTank
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Nicht angemeldet.", { cause: sessionError });
  }

  const { data, error } = await supabase
    .from("koralle")
    .insert({
      ...toFragRow(mother, input),
      nutzer_id: sessionData.session.user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Ableger konnte nicht angelegt werden.", { cause: error });
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
