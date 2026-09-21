// Einheitliche de-DE-Formate für alle Screens (NFR-1.5)

// YYYY-MM-DD => DD.MM.YYYY wird hier ohne DAte-Objekt umgesetzt
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

// 1320 → "1.320 l"
export function formatVolume(liters: number): string {
  return `${liters.toLocaleString("de-DE")} l`;
}
