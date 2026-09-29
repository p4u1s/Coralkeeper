// Inserat einer Koralle lesen, anlegen und zurückziehen (FR-4.1, FR-4.2)
//
// Absichtlich ohne Update-Funktion: die UPDATE-Policy auf angebot kommt
// erst mit MS-11. Den Status der Koralle und den Systemeintrag setzen
// Trigger in der Datenbank (Festlegungen 15 und 18).

import type { Tables } from "@/types/database.types.ts";
import { supabase } from "@/services/supabase.ts";
import type { Coral } from "@/services/coral.ts";

export type Offer = Tables<"angebot">;

export type OfferInput = Pick<
  Offer,
  "modus" | "preis_oder_tauschwunsch" | "groesse"
>;

// Leere Felder mit NULL vorbelegen
function toRow(input: OfferInput): OfferInput {
  return {
    modus: input.modus,
    preis_oder_tauschwunsch: input.preis_oder_tauschwunsch?.trim() || null,
    groesse: input.groesse?.trim() || null,
  };
}

// null, wenn die Koralle kein Inserat hat
export async function getOfferForCoral(coralId: string): Promise<Offer | null> {
  const { data, error } = await supabase
    .from("angebot")
    .select("*")
    .eq("koralle_id", coralId)
    .maybeSingle();

  // 22P02: keine gültige UUID – wird zu „nicht vorhanden“
  if (error?.code === "22P02") {
    return null;
  }
  if (error) {
    throw new Error("Inserat konnte nicht geladen werden.", { cause: error });
  }
  return data;
}

// Status zur_abgabe setzt der Trigger bei_inserat_anlage_status_setzen
export async function createOffer(
  coral: Coral,
  input: OfferInput
): Promise<Offer> {
  // getSession statt getUser, Begründung siehe createTank
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Nicht angemeldet.", { cause: sessionError });
  }

  // art und handelsname als Kopie, weil Fremde die Koralle nicht lesen
  // dürfen (Festlegung 13). sichtbar bleibt beim Standardwert true (FR-4.1)
  const { data, error } = await supabase
    .from("angebot")
    .insert({
      ...toRow(input),
      koralle_id: coral.id,
      art: coral.art,
      handelsname: coral.handelsname,
      nutzer_id: sessionData.session.user.id,
    })
    .select()
    .single();

  // 23505: UNIQUE auf koralle_id (Festlegung 4)
  if (error?.code === "23505") {
    throw new Error("Für diese Koralle gibt es bereits ein Inserat.", {
      cause: error,
    });
  }
  if (error) {
    throw new Error("Inserat konnte nicht angelegt werden.", { cause: error });
  }
  return data;
}

// Status im_bestand setzt der Trigger bei_inserat_loeschung_status_setzen
export async function withdrawOffer(offerId: string): Promise<void> {
  const { error } = await supabase.from("angebot").delete().eq("id", offerId);

  if (error) {
    throw new Error("Inserat konnte nicht zurückgezogen werden.", {
      cause: error,
    });
  }
}
