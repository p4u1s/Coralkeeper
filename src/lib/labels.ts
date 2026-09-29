// Deutsche Beschriftungen für Feldnamen und Auswahlwerte (NFR-1.8)
//
// Die Wertelisten kommen aus Constants der generierten Typen, die Record-Typen
// aus den Enums: ein neuer Enum-Wert lässt den Build scheitern, solange keine
// Beschriftung dafür existiert.

import { Constants, type Enums } from "@/types/database.types.ts";
import type { CoralProfileInput } from "@/services/coral.ts";

// Reihenfolge der Optionen in den Auswahlfeldern
export const LEVEL_VALUES = Constants.public.Enums.stufe;
export const PLACEMENT_VALUES = Constants.public.Enums.platzierung;
export const OFFER_MODE_VALUES = Constants.public.Enums.angebot_modus;

export const LEVEL_LABELS: Record<Enums<"stufe">, string> = {
  gering: "Gering",
  mittel: "Mittel",
  hoch: "Hoch",
};

export const PLACEMENT_LABELS: Record<Enums<"platzierung">, string> = {
  unten: "Unten",
  mitte: "Mitte",
  oben: "Oben",
};

export const HISTORY_TYPE_LABELS: Record<Enums<"historie_typ">, string> = {
  system: "System",
  journal: "Journal",
  abgabe: "Abgabe",
};

export const SOURCE_TYPE_LABELS: Record<Enums<"quelle_typ">, string> = {
  haendler: "Händler",
  privat: "Privat",
  eigene_nachzucht: "Eigene Nachzucht",
};

export const OFFER_MODE_LABELS: Record<Enums<"angebot_modus">, string> = {
  verschenken: "Verschenken",
  tauschen: "Tauschen",
  verkaufen: "Verkaufen",
};

// Derselbe Wortlaut wie im Trigger systemeintrag_anlegen und in design.md
export const CORAL_STATUS_LABELS: Record<Enums<"koralle_status">, string> = {
  im_bestand: "Im Bestand",
  zur_abgabe: "Zur Abgabe",
  abgegeben: "Abgegeben",
  verendet: "Verendet",
};

export const CORAL_PROFILE_LABELS = {
  licht: "Lichtbedarf",
  stroemung: "Strömung",
  platzierung: "Platzierung",
  nesselkraft: "Nesselkraft",
  wuchsform: "Wuchsform",
  schwierigkeit: "Schwierigkeitsgrad",
  fuetterung: "Fütterung",
  besonderheiten: "Besonderheiten",
} satisfies Record<keyof CoralProfileInput, string>;
