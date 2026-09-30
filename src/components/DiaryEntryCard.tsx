// Eine Karte der Diary-Übersicht: Messung oder Becken-Ereignis
// (FR-5.1, FR-5.3, FR-5.4). Wird in TASK-08-07 zum Link auf die Bearbeiten-Seite

import type { ReactNode } from "react";
import { Beef, Calendar, PaintBucket, TestTube } from "lucide-react";
import type { DiaryEntry } from "@/lib/diary.ts";
import { formatMeasurement, formatTankEventDetails } from "@/lib/format.ts";
import {
  MEASUREMENT_PARAMETER_SHORT_LABELS,
  TANK_EVENT_TYPE_LABELS,
} from "@/lib/labels.ts";
import type { Enums } from "@/types/database.types.ts";

// Liniensymbol nach design.md (Diary-Typ-Chip): 20 px, Strichstärke 1,6
const ICON_PROPS = { size: 20, strokeWidth: 1.6, "aria-hidden": true } as const;

const EVENT_ICONS: Record<Enums<"ereignis_typ">, ReactNode> = {
  wasserwechsel: <PaintBucket {...ICON_PROPS} />,
  fuetterung: <Beef {...ICON_PROPS} />,
  vorfall: <Calendar {...ICON_PROPS} />,
};

type DiaryEntryCardProps = {
  entry: DiaryEntry;
  tankNames: Map<string, string>;
  coralNames: Map<string, string>;
};

export function DiaryEntryCard({
  entry,
  tankNames,
  coralNames,
}: DiaryEntryCardProps) {
  const tankName = tankNames.get(entry.tankId);

  if (entry.kind === "measurement") {
    return (
      <li className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3">
        <CardHeader
          icon={<TestTube {...ICON_PROPS} />}
          label="Messung"
          tankName={tankName}
        />
        <ul className="flex flex-col">
          {entry.values.map((value) => (
            <li
              key={value.id}
              className="flex min-h-11 items-center justify-between gap-4"
            >
              <span>{MEASUREMENT_PARAMETER_SHORT_LABELS[value.parameter]}</span>
              <span className="tabular-nums">
                {formatMeasurement(value.wert, value.parameter)}
              </span>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  const { event } = entry;
  // Gelöschte Koralle: koralle_id ist null (ON DELETE SET NULL), keine Zeile
  const coralName = event.koralle_id
    ? coralNames.get(event.koralle_id)
    : undefined;

  return (
    <li className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3">
      <CardHeader
        icon={EVENT_ICONS[event.typ]}
        label={TANK_EVENT_TYPE_LABELS[event.typ]}
        tankName={tankName}
      />
      <p className="wrap-break-word whitespace-pre-line">
        {formatTankEventDetails(event)}
      </p>
      {coralName && (
        <p className="text-caption wrap-break-word text-muted-foreground">
          {coralName}
        </p>
      )}
    </li>
  );
}

// Typ-Etikett mit Symbol und Text (design.md, Diary-Typ-Chip), daneben das Becken
function CardHeader({
  icon,
  label,
  tankName,
}: {
  icon: ReactNode;
  label: string;
  tankName?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-caption text-muted-foreground">
        {icon}
        {label}
      </span>
      {tankName && (
        <span className="text-caption wrap-break-word text-muted-foreground">
          {tankName}
        </span>
      )}
    </div>
  );
}
