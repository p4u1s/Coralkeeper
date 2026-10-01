// Eine Karte der Diary-Übersicht: Messung oder Becken-Ereignis
// (FR-5.1, FR-5.3, FR-5.4). Karte bzw. Wertzeile führen zur Bearbeiten-Seite (FR-5.10)

import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  Beef,
  Calendar,
  ChevronRight,
  FlaskConical,
  PaintBucket,
} from "lucide-react";
import type { DiaryEntry } from "@/lib/diary.ts";
import { formatMeasurement, formatTankEventDetails } from "@/lib/format.ts";
import {
  MEASUREMENT_PARAMETER_SHORT_LABELS,
  TANK_EVENT_TYPE_LABELS,
} from "@/lib/labels.ts";
import type { Enums } from "@/types/database.types.ts";

// Liniensymbol nach design.md (Diary-Typ-Chip): 20 px, Strichstärke 1,6
const ICON_PROPS = { size: 20, strokeWidth: 1.6, "aria-hidden": true } as const;

// Pfeil als Hinweis auf den Link, ohne Text – bewusste Abweichung von NFR-1.4
// (Entscheidung TASK-08-07)
const LINK_ARROW = (
  <ChevronRight {...ICON_PROPS} className="shrink-0 text-muted-foreground" />
);

// Projektweiter Fokusring wie in TankCard
const FOCUS_RING_CLASSES =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring";

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
          icon={<FlaskConical {...ICON_PROPS} />}
          label="Messung"
          tankName={tankName}
        />
        <ul className="flex flex-col">
          {entry.values.map((value) => (
            <li key={value.id}>
              <Link
                to={`/diary/messwert/${value.id}/bearbeiten`}
                className={`flex min-h-11 items-center justify-between gap-4 rounded-md ${FOCUS_RING_CLASSES}`}
              >
                <span>
                  {MEASUREMENT_PARAMETER_SHORT_LABELS[value.parameter]}
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  {formatMeasurement(value.wert, value.parameter)}
                  {LINK_ARROW}
                </span>
              </Link>
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
    <li>
      <Link
        to={`/diary/ereignis/${event.id}/bearbeiten`}
        className={`flex items-center gap-2 rounded-xl border border-border bg-card p-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${FOCUS_RING_CLASSES}`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
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
        </div>
        {LINK_ARROW}
      </Link>
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
