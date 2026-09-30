// Diary-Einträge für die Übersicht nach Tagen gruppieren (FR-5.1, FR-5.3, FR-5.4)
//
// Reine Funktion ohne React, damit sie für sich testbar bleibt.

import type { Measurement } from "@/services/measurement.ts";
import type { TankEvent } from "@/services/tankEvent.ts";

type DiaryEntryBase = {
  key: string;
  tankId: string;
  date: string;
  createdAt: string;
};

// Eine Messung umfasst alle Werte einer Erfassung (Entscheidung TASK-08-03)
export type DiaryEntry =
  | (DiaryEntryBase & { kind: "measurement"; values: Measurement[] })
  | (DiaryEntryBase & { kind: "event"; event: TankEvent });

export type DiaryDay = {
  date: string;
  entries: DiaryEntry[];
};

// Bei gleichem Erfassungszeitpunkt steht die Messung vor den Ereignissen
const KIND_ORDER: Record<DiaryEntry["kind"], number> = {
  measurement: 0,
  event: 1,
};

// Neueste zuerst: nach Datum, dann nach Erfassung (Festlegung 19)
function compareEntries(a: DiaryEntry, b: DiaryEntry): number {
  return (
    b.date.localeCompare(a.date) ||
    Date.parse(b.createdAt) - Date.parse(a.createdAt) ||
    KIND_ORDER[a.kind] - KIND_ORDER[b.kind]
  );
}

export function groupDiaryByDay(
  measurements: Measurement[],
  tankEvents: TankEvent[]
): DiaryDay[] {
  // Werte einer Erfassung haben dasselbe Becken, Datum und erstellt_am,
  // weil sie mit einem Insert entstehen
  const measurementGroups = new Map<string, Measurement[]>();
  for (const measurement of measurements) {
    const groupKey = `${measurement.becken_id}|${measurement.datum}|${measurement.erstellt_am}`;
    const values = measurementGroups.get(groupKey);
    if (values) {
      values.push(measurement);
    } else {
      measurementGroups.set(groupKey, [measurement]);
    }
  }

  const entries: DiaryEntry[] = [
    ...Array.from(measurementGroups.values(), (values) => ({
      kind: "measurement" as const,
      key: values[0].id,
      tankId: values[0].becken_id,
      date: values[0].datum,
      createdAt: values[0].erstellt_am,
      values,
    })),
    ...tankEvents.map((event) => ({
      kind: "event" as const,
      key: event.id,
      tankId: event.becken_id,
      date: event.datum,
      createdAt: event.erstellt_am,
      event,
    })),
  ];

  // sort ist stabil: Werte und Ereignisse behalten die Enum-Reihenfolge der Services
  entries.sort(compareEntries);

  const days: DiaryDay[] = [];
  for (const entry of entries) {
    const lastDay = days.at(-1);
    if (lastDay?.date === entry.date) {
      lastDay.entries.push(entry);
    } else {
      days.push({ date: entry.date, entries: [entry] });
    }
  }
  return days;
}
