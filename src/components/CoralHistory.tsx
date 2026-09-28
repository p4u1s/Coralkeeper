// Historie einer Koralle anzeigen, nur lesend (FR-3.2, FR-3.3, FR-6.4)

import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/useHistory.ts";
import { formatDate } from "@/lib/format.ts";
import { HISTORY_TYPE_LABELS } from "@/lib/labels.ts";
import type { HistoryEntry } from "@/services/history.ts";

export function CoralHistory({ coralId }: { coralId: string }) {
  const { status, entries, error, reload } = useHistory(coralId);

  if (status === "loading") {
    return <p className="text-muted-foreground">Wird geladen …</p>;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-4">
        <p role="alert" className="text-destructive">
          {error}
        </p>
        <Button variant="secondary" className="w-full" onClick={reload}>
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (entries.length === 0) {
    return <p className="text-muted-foreground">Noch keine Einträge.</p>;
  }

  // Reihenfolge kommt aus listHistory, neuester Eintrag oben
  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <HistoryCard key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

// Bewusst ohne Bearbeiten, Löschen, Wischen oder Langdruck:
// Historieneinträge sind append-only (FR-3.3)
function HistoryCard({ entry }: { entry: HistoryEntry }) {
  return (
    <li className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-caption text-muted-foreground">
          {HISTORY_TYPE_LABELS[entry.typ]}
        </span>
        <span className="text-caption text-muted-foreground tabular-nums">
          {formatDate(entry.datum)}
        </span>
      </div>
      {entry.text && (
        <p className="wrap-break-word whitespace-pre-line">{entry.text}</p>
      )}
    </li>
  );
}
