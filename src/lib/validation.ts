// Feldprüfung der Formulare vor dem Absenden (FR-6.6)

import { formatVolume, parseDecimal } from "@/lib/format.ts";
import {
  MEASUREMENT_EXAMPLES,
  MEASUREMENT_PARAMETER_VALUES,
  MEASUREMENT_UNITS,
} from "@/lib/labels.ts";
import type { Enums } from "@/types/database.types.ts";

// Gleicher Wert wie in den Supabase-Auth-Einstellungen (TASK-03-06, Schritt 8)
export const MIN_PASSWORD_LENGTH = 6;

// Bewusst grob: Text@Text.Text ohne Leerzeichen – die genaue Prüfung macht Supabase
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Begrenzung der Beckenbezeichnung, Korallentextlänge und des Beckenvolumens
export const MAX_TANK_NAME_LENGTH = 100;
export const MAX_TANK_VOLUME = 100_000;
export const MAX_CORAL_TEXT_LENGTH = 100;

// Steckbrief: Wuchsform kurz, Fütterung und Besonderheiten länger (FR-2.2)
export const MAX_GROWTH_FORM_LENGTH = 100;
export const MAX_PROFILE_TEXT_LENGTH = 500;

// Inserat: Preis bzw. Tauschwunsch und Größe als kurzer Freitext (FR-4.1)
export const MAX_PRICE_OR_SWAP_LENGTH = 100;
export const MAX_OFFER_SIZE_LENGTH = 50;

// Journaleintrag: Freitext für Beobachtungen (FR-3.5)
export const MAX_JOURNAL_TEXT_LENGTH = 1_000;

// Wasserwechsel: Menge als kurzer Freitext, Notiz länger (FR-5.3)
export const MAX_TANK_EVENT_AMOUNT_LENGTH = 50;
export const MAX_WATER_CHANGE_NOTE_LENGTH = 800;

// Messwerte: Grenzen gegen Tippfehler, keine Soll-Bereiche (FR-5.6, MS-10).
// Salinität als Dichte hat als einziger Wert eine Untergrenze über 0
export const MEASUREMENT_LIMITS: Record<
  Enums<"messparameter">,
  { min: number; max: number }
> = {
  kh: { min: 0, max: 11 },
  ca: { min: 0, max: 600 },
  mg: { min: 0, max: 1_700 },
  no3: { min: 0, max: 12 },
  po4: { min: 0, max: 10 },
  temperatur: { min: 0, max: 35 },
  salinitaet: { min: 1, max: 1.05 },
};

// Mehr als drei Ziffern nach Komma oder Punkt (Entscheidung TASK-08-04)
const TOO_MANY_DECIMALS_PATTERN = /[.,]\d{4,}$/;

// Nur ganze Zahlen erlaubt: schließt "abc", "-5", "2,5" und "1.320" aus
const WHOLE_NUMBER_PATTERN = /^\d+$/;

export type LoginErrors = {
  email?: string;
  password?: string;
};

export type RegisterErrors = LoginErrors & {
  passwordRepeat?: string;
};

export type TankErrors = {
  name?: string;
  volume?: string;
  startDate?: string;
};

export type CoralErrors = {
  name?: string;
  tankId?: string;
  species?: string;
  tradeName?: string;
  acquisitionDate?: string;
};

export type CoralProfileErrors = {
  growthForm?: string;
  feeding?: string;
  notes?: string;
};

export type JournalEntryErrors = {
  date?: string;
  text?: string;
};

export type FragErrors = {
  name?: string;
  tankId?: string;
};

export type OfferErrors = {
  mode?: string;
  priceOrSwap?: string;
  size?: string;
};

export type MeasurementErrors = {
  tankId?: string;
  date?: string;
  values: Partial<Record<Enums<"messparameter">, string>>;
  atLeastOne?: string;
};

export type TankEventErrors = {
  tankId?: string;
  date?: string;
  amount?: string;
  text?: string;
};

export function validateLogin(email: string, password: string): LoginErrors {
  return {
    email: checkEmail(email),
    password: password === "" ? "Bitte Passwort eingeben." : undefined,
  };
}

export function validateRegister(
  email: string,
  password: string,
  passwordRepeat: string
): RegisterErrors {
  return {
    email: checkEmail(email),
    password: checkNewPassword(password),
    passwordRepeat: checkPasswordRepeat(password, passwordRepeat),
  };
}

// true, sobald mindestens ein Feld einen Fehlertext hat
export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((message) => message !== undefined);
}

function checkEmail(email: string): string | undefined {
  if (email === "") {
    return "Bitte E-Mail-Adresse eingeben.";
  }
  if (!EMAIL_PATTERN.test(email)) {
    return "Bitte eine gültige E-Mail-Adresse eingeben, z. B. name@example.de.";
  }
  return undefined;
}

function checkNewPassword(password: string): string | undefined {
  if (password === "") {
    return "Bitte Passwort eingeben.";
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`;
  }
  return undefined;
}

function checkPasswordRepeat(
  password: string,
  passwordRepeat: string
): string | undefined {
  if (passwordRepeat === "") {
    return "Bitte Passwort wiederholen.";
  }
  if (passwordRepeat !== password) {
    return "Die Passwörter stimmen nicht überein.";
  }
  return undefined;
}

export function validateTank(
  name: string,
  volume: string,
  startDate: string
): TankErrors {
  return {
    name: checkTankName(name),
    volume: checkVolume(volume),
    startDate: checkNotInFuture(startDate, "Startdatum"),
  };
}

// type="date" liefert "" oder ein gültiges JJJJ-MM-TT – daher reicht der Textvergleich
function checkNotInFuture(date: string, fieldName: string): string | undefined {
  if (date !== "" && date > todayIso()) {
    return `Das ${fieldName} darf nicht in der Zukunft liegen.`;
  }
  return undefined;
}

function checkTankName(name: string): string | undefined {
  const trimmed = name.trim();
  if (trimmed === "") {
    return "Bitte einen Namen eingeben.";
  }
  if (trimmed.length > MAX_TANK_NAME_LENGTH) {
    return `Der Name darf höchstens ${MAX_TANK_NAME_LENGTH} Zeichen lang sein.`;
  }
  return undefined;
}

function checkVolume(volume: string): string | undefined {
  const trimmed = volume.trim();
  if (trimmed === "") {
    return undefined;
  }
  const liters = Number(trimmed);
  if (!WHOLE_NUMBER_PATTERN.test(trimmed) || liters === 0) {
    return "Bitte das Volumen als ganze Zahl größer 0 eingeben, z. B. 250.";
  }
  if (liters > MAX_TANK_VOLUME) {
    return `Das Volumen darf höchstens ${formatVolume(MAX_TANK_VOLUME)} betragen.`;
  }
  return undefined;
}

// Menge und Notiz sind optional – ein Wasserwechsel ohne Menge ist trotzdem
// ein Eintrag (FR-5.3)
export function validateTankEvent(
  tankId: string,
  date: string,
  amount: string,
  text: string
): TankEventErrors {
  return {
    // Die leere Option „Becken wählen" hat den Wert ""
    tankId: tankId === "" ? "Bitte ein Becken wählen." : undefined,
    date:
      date === ""
        ? "Bitte ein Datum eingeben."
        : checkNotInFuture(date, "Datum"),
    amount: checkCoralText(amount, "Die Menge", MAX_TANK_EVENT_AMOUNT_LENGTH),
    text: checkCoralText(text, "Die Notiz", MAX_WATER_CHANGE_NOTE_LENGTH),
  };
}

export function validateCoral(
  name: string,
  tankId: string,
  species: string,
  tradeName: string,
  acquisitionDate: string
): CoralErrors {
  return {
    name:
      name.trim() === ""
        ? "Bitte eine Bezeichnung eingeben."
        : checkCoralText(name, "Die Bezeichnung"),
    // Die leere Option „Becken wählen" hat den Wert ""
    tankId: tankId === "" ? "Bitte ein Becken wählen." : undefined,
    species: checkCoralText(species, "Die Art"),
    tradeName: checkCoralText(tradeName, "Der Handelsname"),
    acquisitionDate: checkNotInFuture(acquisitionDate, "Erwerbsdatum"),
  };
}

// Gleiche Meldungen wie in validateCoral
export function validateFrag(name: string, tankId: string): FragErrors {
  return {
    name:
      name.trim() === ""
        ? "Bitte eine Bezeichnung eingeben."
        : checkCoralText(name, "Die Bezeichnung"),
    // Die leere Option „Becken wählen" hat den Wert ""
    tankId: tankId === "" ? "Bitte ein Becken wählen." : undefined,
  };
}

// Auswahlfelder brauchen keine Prüfung: der Typ lässt nur gültige Werte zu
export function validateCoralProfile(
  growthForm: string,
  feeding: string,
  notes: string
): CoralProfileErrors {
  return {
    growthForm: checkCoralText(
      growthForm,
      "Die Wuchsform",
      MAX_GROWTH_FORM_LENGTH
    ),
    feeding: checkCoralText(feeding, "Die Fütterung", MAX_PROFILE_TEXT_LENGTH),
    notes: checkCoralText(
      notes,
      'Das Feld „Besonderheiten"',
      MAX_PROFILE_TEXT_LENGTH
    ),
  };
}

// Zukunftsdatum erlaubt (Entscheidung 28.09.2026, TASK-06-07)
export function validateJournalEntry(
  date: string,
  text: string
): JournalEntryErrors {
  return {
    date: date === "" ? "Bitte ein Datum eingeben." : undefined,
    text:
      text.trim() === ""
        ? "Bitte einen Text eingeben."
        : checkCoralText(text, "Der Text", MAX_JOURNAL_TEXT_LENGTH),
  };
}

// Preis bzw. Tauschwunsch nur prüfen, wenn das Feld sichtbar ist –
// bei „Verschenken" und vor der Modus-Wahl wird es nicht gespeichert
export function validateOffer(
  mode: Enums<"angebot_modus"> | "",
  priceOrSwap: string,
  size: string
): OfferErrors {
  const hasPriceOrSwap = mode === "tauschen" || mode === "verkaufen";
  return {
    // Die leere Option „Modus wählen" hat den Wert ""
    mode: mode === "" ? "Bitte einen Modus wählen." : undefined,
    priceOrSwap: hasPriceOrSwap
      ? checkCoralText(
          priceOrSwap,
          mode === "tauschen" ? "Der Tauschwunsch" : "Der Preis",
          MAX_PRICE_OR_SWAP_LENGTH
        )
      : undefined,
    size: checkCoralText(size, "Die Größe", MAX_OFFER_SIZE_LENGTH),
  };
}

// texts: Eingabe je Parameter, leere Felder als ""
export function validateMeasurements(
  tankId: string,
  date: string,
  texts: Record<Enums<"messparameter">, string>
): MeasurementErrors {
  const values: MeasurementErrors["values"] = {};
  for (const parameter of MEASUREMENT_PARAMETER_VALUES) {
    values[parameter] = checkMeasurement(texts[parameter], parameter);
  }
  const allEmpty = MEASUREMENT_PARAMETER_VALUES.every(
    (parameter) => texts[parameter].trim() === ""
  );
  return {
    // Die leere Option „Becken wählen" hat den Wert ""
    tankId: tankId === "" ? "Bitte ein Becken wählen." : undefined,
    date:
      date === ""
        ? "Bitte ein Datum eingeben."
        : checkNotInFuture(date, "Datum"),
    values,
    // Nur wenn alle Felder leer sind – sonst reicht der Feldfehler (FR-5.1)
    atLeastOne: allEmpty
      ? "Bitte mindestens einen Messwert eintragen."
      : undefined,
  };
}

// hasErrors reicht hier nicht, weil die Wertfehler verschachtelt sind
export function hasMeasurementErrors(errors: MeasurementErrors): boolean {
  const { values, ...otherErrors } = errors;
  return hasErrors(otherErrors) || hasErrors(values);
}

// Leeres Feld ist kein Fehler; negative Werte lehnt schon parseDecimal ab
function checkMeasurement(
  text: string,
  parameter: Enums<"messparameter">
): string | undefined {
  const trimmed = text.trim();
  if (trimmed === "") {
    return undefined;
  }
  const value = parseDecimal(trimmed);
  if (value === null) {
    return `Bitte eine Zahl eingeben, z. B. ${MEASUREMENT_EXAMPLES[parameter]}.`;
  }
  if (TOO_MANY_DECIMALS_PATTERN.test(trimmed)) {
    return "Bitte höchstens drei Nachkommastellen eingeben.";
  }
  const { min, max } = MEASUREMENT_LIMITS[parameter];
  if (value < min || value > max) {
    return min === 0
      ? `Der Wert darf höchstens ${formatLimit(max, parameter)} betragen.`
      : `Der Wert muss zwischen ${formatLimit(min, parameter)} und ${formatLimit(max, parameter)} liegen.`;
  }
  return undefined;
}

// Ohne Tausenderpunkt wie in der Eingabe – "1.700" würde dort als 1,7 gelesen.
// Salinität immer mit drei Stellen: "1,000" und "1,050"
function formatLimit(value: number, parameter: Enums<"messparameter">): string {
  const number = value.toLocaleString("de-DE", {
    useGrouping: false,
    minimumFractionDigits: parameter === "salinitaet" ? 3 : 0,
    maximumFractionDigits: 3,
  });
  const unit = MEASUREMENT_UNITS[parameter];
  return unit ? `${number} ${unit}` : number;
}

// Label mit Artikel, weil die Felder unterschiedliche Geschlechter haben
function checkCoralText(
  value: string,
  label: string,
  maxLength = MAX_CORAL_TEXT_LENGTH
): string | undefined {
  if (value.trim().length > maxLength) {
    return `${label} darf höchstens ${maxLength} Zeichen lang sein.`;
  }
  return undefined;
}

// Heutiges Datum in lokaler Zeit als JJJJ-MM-TT
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
