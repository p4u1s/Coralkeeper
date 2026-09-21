// Einheitliche de-DE-Formate für alle Screens (NFR-1.5)

import type { Tank } from "@/services/tank.ts";

// YYYY-MM-DD => DD.MM.YYYY wird hier ohne DAte-Objekt umgesetzt
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
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
