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
export const MEASUREMENT_PARAMETER_VALUES =
  Constants.public.Enums.messparameter;

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

// Klartext mit Kürzel (design.md, Abschnitt 5 Regel 7)
export const MEASUREMENT_PARAMETER_LABELS: Record<
  Enums<"messparameter">,
  string
> = {
  kh: "Karbonathärte (KH)",
  ca: "Calcium (Ca)",
  mg: "Magnesium (Mg)",
  no3: "Nitrat (NO₃)",
  po4: "Phosphat (PO₄)",
  temperatur: "Temperatur",
  salinitaet: "Salinität",
};

// Kurzform für die Wertzeilen der Diary-Übersicht. Bewusste Abweichung von
// design.md, Abschnitt 5 Regel 7 (Entscheidung TASK-08-03)
export const MEASUREMENT_PARAMETER_SHORT_LABELS: Record<
  Enums<"messparameter">,
  string
> = {
  kh: "KH",
  ca: "Ca",
  mg: "Mg",
  no3: "NO₃",
  po4: "PO₄",
  temperatur: "Temp.",
  salinitaet: "Sal.",
};

// vorfall heißt in der Oberfläche „Ereignis" wie in FR-5.4 (Entscheidung TASK-08-02)
export const TANK_EVENT_TYPE_LABELS: Record<Enums<"ereignis_typ">, string> = {
  wasserwechsel: "Wasserwechsel",
  fuetterung: "Fütterung",
  vorfall: "Ereignis",
};

// Feste Einheiten (Festlegung 19). Salinität als Dichte ohne Einheit
export const MEASUREMENT_UNITS: Record<
  Enums<"messparameter">,
  string | null
> = {
  kh: "°dKH",
  ca: "mg/l",
  mg: "mg/l",
  no3: "mg/l",
  po4: "mg/l",
  temperatur: "°C",
  salinitaet: null,
};

// Formularlabels nur mit Kürzel und Einheit. Bewusste Abweichung von
// design.md, Abschnitt 5 Regel 7 (Entscheidung TASK-08-04)
export const MEASUREMENT_FORM_LABELS: Record<Enums<"messparameter">, string> = {
  kh: "KH in °dKH",
  ca: "Ca in mg/l",
  mg: "Mg in mg/l",
  no3: "NO₃ in mg/l",
  po4: "PO₄ in mg/l",
  temperatur: "Temp. in °C",
  salinitaet: "Salinität (Dichte)",
};

// Beispielwerte für Platzhalter und Feldfehler, ohne Tausenderpunkt
// (Eingabe nach Entscheidung TASK-08-02)
export const MEASUREMENT_EXAMPLES: Record<Enums<"messparameter">, string> = {
  kh: "8,1",
  ca: "420",
  mg: "1320",
  no3: "5",
  po4: "0,04",
  temperatur: "25,5",
  salinitaet: "1,025",
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
