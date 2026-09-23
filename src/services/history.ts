// Historie einer Koralle lesen, Journaleinträge anlegen (FR-3.5)
//
// Absichtlich ohne Update- und Delete-Funktion: Historieneinträge sind
// append-only (FR-3.3). Die Datenbank hat dafür auch keine UPDATE- oder
// DELETE-Policy (ER-Modell, Festlegung 7).

import type { Tables } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";

export type HistoryEntry = Tables<"historieneintrag">;

// typ, nutzer_id und bild_id setzt nicht das Formular:
// typ ist fest "journal", nutzer_id kommt aus der Session,
// Bilder kommen erst mit MS-9 (NFR-2.5)
export type JournalEntryInput = Pick<
  HistoryEntry,
  "koralle_id" | "datum" | "text"
>;

// Neuester Eintrag oben; erstellt_am macht die Reihenfolge bei
// gleichem Datum eindeutig
export async function listHistory(coralId: string): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from("historieneintrag")
    .select("*")
    .eq("koralle_id", coralId)
    .order("datum", { ascending: false })
    .order("erstellt_am", { ascending: false });

  if (error) {
    throw new Error("Historie konnte nicht geladen werden.", { cause: error });
  }
  return data;
}

export async function createJournalEntry(
  input: JournalEntryInput
): Promise<HistoryEntry> {
  // getSession statt getUser, Begründung siehe createTank
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Nicht angemeldet.", { cause: sessionError });
  }

  const { data, error } = await supabase
    .from("historieneintrag")
    .insert({
      koralle_id: input.koralle_id,
      datum: input.datum,
      text: input.text?.trim() || null,
      typ: "journal",
      nutzer_id: sessionData.session.user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Journaleintrag konnte nicht gespeichert werden.", {
      cause: error,
    });
  }
  return data;
}
