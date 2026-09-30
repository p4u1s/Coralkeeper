// Messwerte lesen, anlegen, bearbeiten und löschen (FR-5.1, FR-5.10)
//
// Ein Messwert ist eine Zeile (Festlegung 19). Die Einheit setzt der Service
// selbst aus dem Parameter, bei Salinität bleibt sie leer.

import type { Tables, TablesInsert } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";
import { MEASUREMENT_UNITS } from "@/lib/labels.ts";

export type Measurement = Tables<"messwert">;

export type MeasurementInput = Pick<
  Measurement,
  "becken_id" | "datum" | "parameter" | "wert"
>;

// Ein ausgefüllter Wert aus dem Formular „Messwerte erfassen"
export type MeasurementValue = Pick<Measurement, "parameter" | "wert">;

// Einheit immer aus dem Parameter, damit sie auch nach einer Änderung passt
function toRow(
  input: MeasurementInput
): Omit<TablesInsert<"messwert">, "nutzer_id"> {
  return {
    becken_id: input.becken_id,
    datum: input.datum,
    parameter: input.parameter,
    wert: input.wert,
    einheit: MEASUREMENT_UNITS[input.parameter],
  };
}

// Neueste zuerst: nach Datum, am selben Tag nach Erfassung (TASK-08-03).
// Werte einer Erfassung in der Reihenfolge des Enums (KH … Salinität)
export async function listMeasurements(): Promise<Measurement[]> {
  const { data, error } = await supabase
    .from("messwert")
    .select("*")
    .order("datum", { ascending: false })
    .order("erstellt_am", { ascending: false })
    .order("parameter");

  if (error) {
    throw new Error("Messwerte konnten nicht geladen werden.", {
      cause: error,
    });
  }
  return data;
}

// null, wenn der Messwert nicht existiert oder einem anderen Nutzer gehört (RLS)
export async function getMeasurement(id: string): Promise<Measurement | null> {
  const { data, error } = await supabase
    .from("messwert")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 22P02: keine gültige UUID in der URL – wird zu „nicht gefunden“
  if (error?.code === "22P02") {
    return null;
  }
  if (error) {
    throw new Error("Messwert konnte nicht geladen werden.", { cause: error });
  }
  return data;
}

// Alle Werte in einem Insert: entweder alle gespeichert oder keiner
export async function createMeasurements(
  tankId: string,
  date: string,
  values: MeasurementValue[]
): Promise<Measurement[]> {
  // getSession statt getUser, Begründung siehe createTank
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Nicht angemeldet.", { cause: sessionError });
  }

  const userId = sessionData.session.user.id;
  const rows = values.map((value) => ({
    ...toRow({ becken_id: tankId, datum: date, ...value }),
    nutzer_id: userId,
  }));

  const { data, error } = await supabase.from("messwert").insert(rows).select();

  if (error) {
    throw new Error("Messwerte konnten nicht gespeichert werden.", {
      cause: error,
    });
  }
  return data;
}

export async function updateMeasurement(
  id: string,
  input: MeasurementInput
): Promise<Measurement> {
  const { data, error } = await supabase
    .from("messwert")
    .update(toRow(input))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Messwert konnte nicht gespeichert werden.", {
      cause: error,
    });
  }
  return data;
}

export async function deleteMeasurement(id: string): Promise<void> {
  const { error } = await supabase.from("messwert").delete().eq("id", id);

  if (error) {
    throw new Error("Messwert konnte nicht gelöscht werden.", { cause: error });
  }
}
