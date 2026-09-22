// Feldprüfung der Formulare vor dem Absenden (FR-6.6)

import { formatVolume } from "@/lib/format.ts";

// Gleicher Wert wie in den Supabase-Auth-Einstellungen (TASK-03-06, Schritt 8)
export const MIN_PASSWORD_LENGTH = 6;

// Bewusst grob: Text@Text.Text ohne Leerzeichen – die genaue Prüfung macht Supabase
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Begrenzung der Beckenbezeichnung, Korallentextlänge und des Beckenvolumens
export const MAX_TANK_NAME_LENGTH = 100;
export const MAX_TANK_VOLUME = 100_000;
export const MAX_CORAL_TEXT_LENGTH = 100;

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

// Label mit Artikel, weil die Felder unterschiedliche Geschlechter haben
function checkCoralText(value: string, label: string): string | undefined {
  if (value.trim().length > MAX_CORAL_TEXT_LENGTH) {
    return `${label} darf höchstens ${MAX_CORAL_TEXT_LENGTH} Zeichen lang sein.`;
  }
  return undefined;
}

// Heutiges Datum in lokaler Zeit als JJJJ-MM-TT
function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
