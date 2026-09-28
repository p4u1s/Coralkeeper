// Herkunftskette eines Ablegers als Snapshot (FR-3.6, Festlegung 17)
//
// Wird nur beim Anlegen gebildet und in koralle.herkunftskette gespeichert.
// Eine Zeile je Generation, leere Angaben entfallen.

import type { Coral } from "@/services/coral.ts";
import { formatDate } from "@/lib/format.ts";
import { SOURCE_TYPE_LABELS } from "@/lib/labels.ts";

// createdOn als JJJJ-MM-TT, z. B. aus todayIso()
export function buildOriginChain(mother: Coral, createdOn: string): string {
  const lines = [buildFragLine(mother, createdOn)];

  const sourceLine = buildSourceLine(mother);
  if (sourceLine) {
    lines.push(sourceLine);
  }
  // Kette der Ursprungskoralle anhängen – so wächst sie je Generation
  if (mother.herkunftskette) {
    lines.push(`← ${mother.herkunftskette}`);
  }
  return lines.join("\n");
}

// z. B. Ableger von „Green Slimer“ (Acropora tenuis), erzeugt am 28.09.2026
function buildFragLine(mother: Coral, createdOn: string): string {
  const species = mother.art ? ` (${mother.art})` : "";
  return `Ableger von „${mother.bezeichnung}“${species}, erzeugt am ${formatDate(createdOn)}`;
}

// Nur, wenn mindestens eines der vier Textfelder befüllt ist
function buildSourceLine(mother: Coral): string | null {
  const parts: string[] = [];

  if (mother.quelle_name) {
    parts.push(mother.quelle_name);
  }
  if (mother.belegnummer) {
    parts.push(`Beleg ${mother.belegnummer}`);
  }
  if (mother.cites_nr) {
    parts.push(`CITES-Nr. ${mother.cites_nr}`);
  }
  if (mother.herkunft_notiz) {
    parts.push(mother.herkunft_notiz);
  }

  if (parts.length === 0) {
    return null;
  }
  if (mother.quelle_typ) {
    parts.unshift(SOURCE_TYPE_LABELS[mother.quelle_typ]);
  }
  return `Quelle: ${parts.join(" · ")}`;
}
