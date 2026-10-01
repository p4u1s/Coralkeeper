// Einheitliche de-DE-Formate für alle Screens (NFR-1.5)

import type { Tank } from "@/services/tank.ts";
import type { TankEvent } from "@/services/tankEvent.ts";
import type { Enums } from "@/types/database.types.ts";
import { MEASUREMENT_UNITS } from "@/lib/labels.ts";

// YYYY-MM-DD => DD.MM.YYYY wird hier ohne DAte-Objekt umgesetzt
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

// timestamptz → lokales Datum, z. B. "29.09.2026". Nicht über formatDate,
// weil der Zeitstempel in UTC gespeichert ist (Entscheidung TASK-07-07)
export function formatTimestampDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// 1320 → "1.320 l"
export function formatVolume(liters: number): string {
  return `${liters.toLocaleString("de-DE")} l`;
}

// Volumen und Startdatum als eine Zeile, z. B. "250 l · seit 12.03.2026".
// Nur gefüllte Werte, damit kein leerer Trenner „ · " entsteht
export function formatTankDetails(tank: Tank): string {
  const parts: string[] = [];

  if (tank.volumen_liter !== null) {
    parts.push(formatVolume(tank.volumen_liter));
  }
  if (tank.startdatum) {
    parts.push(`seit ${formatDate(tank.startdatum)}`);
  }
  return parts.join(" · ");
}

// 8.1 → "8,1 °dKH", 1320 → "1.320 mg/l", 1.025 → "1,025" (Salinität ohne Einheit).
// Höchstens drei Nachkommastellen (Entscheidung TASK-08-02)
export function formatMeasurement(
  value: number,
  parameter: Enums<"messparameter">
): string {
  const number = value.toLocaleString("de-DE", { maximumFractionDigits: 3 });
  const unit = MEASUREMENT_UNITS[parameter];
  return unit ? `${number} ${unit}` : number;
}

// Komma und Punkt als Dezimaltrenner, kein Tausenderpunkt, kein Vorzeichen
// (Entscheidung TASK-08-02): "8,1" und "8.1" → 8.1, "1.320" → 1.32
const DECIMAL_PATTERN = /^\d+([.,]\d+)?$/;

// null bei leerer oder ungültiger Eingabe, z. B. "", "abc", "-5", ",5", "1.320,5"
export function parseDecimal(text: string): number | null {
  const trimmed = text.trim();
  if (!DECIMAL_PATTERN.test(trimmed)) {
    return null;
  }
  return Number(trimmed.replace(",", "."));
}

// Gegenstück zu parseDecimal für die Vorbelegung eines Eingabefelds:
// Komma, kein Tausenderpunkt, keine Einheit. 8.1 → "8,1", 1320 → "1320"
export function formatDecimalInput(value: number): string {
  return value.toLocaleString("de-DE", {
    useGrouping: false,
    maximumFractionDigits: 3,
  });
}

// Menge und Text eines Becken-Ereignisses als eine Zeile, z. B. "25 l · Scheiben gereinigt".
// Ohne beides "Keine Angabe" (Entscheidung TASK-08-03)
export function formatTankEventDetails(event: TankEvent): string {
  const parts = [event.menge, event.text].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Keine Angabe";
}
