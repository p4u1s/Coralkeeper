import { Link, useNavigate, useParams } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { JournalEntryForm } from "@/components/JournalEntryForm.tsx";
import { useCoral } from "@/hooks/useCoral.ts";
import {
  createJournalEntry,
  type JournalEntryInput,
} from "@/services/history.ts";

// Journaleintrag zu einer Koralle anlegen (FR-3.5, FR-6.4)
export function JournalEntryCreatePage() {
  // Fehlende ID endet in getCoral als null → „nicht gefunden"
  const { id = "" } = useParams();
  const navigate = useNavigate();
  // Die Koralle wird geladen, damit fremde oder unbekannte IDs kein
  // Formular bekommen (wie auf der Detailseite)
  const { status, coral, error } = useCoral(id);

  // Nach Speichern und Abbrechen zurück in den Historie-Tab (TASK-06-04: ?tab=)
  const detailPath = `/koralle/${id}?tab=historie`;

  async function handleSubmit(input: Omit<JournalEntryInput, "koralle_id">) {
    await createJournalEntry({ koralle_id: id, ...input });
    await navigate(detailPath);
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <div className="flex flex-col gap-1">
        <h1 className="text-display font-semibold">
          Journaleintrag hinzufügen
        </h1>
        {coral && (
          <p className="text-label wrap-break-word text-muted-foreground">
            {coral.bezeichnung}
          </p>
        )}
      </div>

      {status === "loading" && (
        <p className="text-muted-foreground">Wird geladen …</p>
      )}

      {status === "error" && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}

      {status === "notFound" && (
        <p className="text-muted-foreground">Koralle nicht gefunden.</p>
      )}

      {(status === "error" || status === "notFound") && (
        <Link
          to="/"
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          Zum Bestand
        </Link>
      )}

      {status === "success" && (
        <JournalEntryForm cancelTo={detailPath} onSubmit={handleSubmit} />
      )}
    </main>
  );
}

export default JournalEntryCreatePage;
