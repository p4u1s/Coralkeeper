// Steckbrief einer Koralle anzeigen (FR-2.1, NFR-1.8)

import {
  CORAL_PROFILE_LABELS,
  LEVEL_LABELS,
  PLACEMENT_LABELS,
} from "@/lib/labels.ts";
import type { Coral, CoralProfileInput } from "@/services/coral.ts";

type ProfileField = keyof CoralProfileInput;

// Kachelbreite je Feld, zugleich die Anzeigereihenfolge. Der Record-Typ
// erzwingt einen Eintrag für jedes Steckbrief-Feld – fehlt einer, scheitert
// der Build (gleiches Muster wie CORAL_PROFILE_LABELS)
const PROFILE_LAYOUT: Record<ProfileField, "half" | "full"> = {
  licht: "half",
  stroemung: "half",
  platzierung: "half",
  nesselkraft: "half",
  wuchsform: "half",
  schwierigkeit: "half",
  fuetterung: "full",
  besonderheiten: "full",
};

// Object.keys liefert string[]; die Schlüssel kommen aus dem Record darüber
const PROFILE_FIELDS = Object.keys(PROFILE_LAYOUT) as ProfileField[];

export function CoralProfile({ coral }: { coral: Coral }) {
  return (
    <dl className="grid grid-cols-2 gap-3">
      {PROFILE_FIELDS.map((field) => (
        <ProfileEntry
          key={field}
          coral={coral}
          field={field}
          wide={PROFILE_LAYOUT[field] === "full"}
        />
      ))}
    </dl>
  );
}

// Auswahlwerte in Klartext, leere Felder als null (NFR-1.8)
function formatValue(coral: Coral, field: ProfileField): string | null {
  switch (field) {
    case "licht":
    case "stroemung":
    case "nesselkraft":
    case "schwierigkeit": {
      const value = coral[field];
      return value ? LEVEL_LABELS[value] : null;
    }
    case "platzierung": {
      const value = coral.platzierung;
      return value ? PLACEMENT_LABELS[value] : null;
    }
    default:
      return coral[field];
  }
}

function ProfileEntry({
  coral,
  field,
  wide = false,
}: {
  coral: Coral;
  field: ProfileField;
  wide?: boolean;
}) {
  const value = formatValue(coral, field);

  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border border-border bg-card p-3 ${wide ? "col-span-2" : ""}`}
    >
      <dt className="text-caption text-muted-foreground">
        {CORAL_PROFILE_LABELS[field]}
      </dt>
      <dd
        className={value ? "wrap-break-word whitespace-pre-line" : "text-ink-3"}
      >
        {value ?? "keine Angabe"}
      </dd>
    </div>
  );
}
