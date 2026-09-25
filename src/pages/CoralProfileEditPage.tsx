import { Link, useNavigate, useParams } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { CoralProfileForm } from "@/components/CoralProfileForm.tsx";
import { useCoral } from "@/hooks/useCoral.ts";
import {
  updateCoralProfile,
  type CoralProfileInput,
} from "@/services/coral.ts";

export function CoralProfileEditPage() {
  // Fehlende ID endet in getCoral als null → „nicht gefunden"
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { status, coral, error } = useCoral(id);

  // Nach Speichern und Abbrechen zurück in den Steckbrief-Tab (TASK-06-04: ?tab=)
  const detailPath = `/koralle/${id}?tab=steckbrief`;

  async function handleSubmit(input: CoralProfileInput) {
    await updateCoralProfile(id, input);
    await navigate(detailPath);
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <div className="flex flex-col gap-1">
        <h1 className="text-display font-semibold">Steckbrief bearbeiten</h1>
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

      {/* Erst nach dem Laden rendern – das Formular übernimmt initialValues nur beim ersten Rendern */}
      {status === "success" && coral && (
        <CoralProfileForm
          initialValues={coral}
          cancelTo={detailPath}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}

export default CoralProfileEditPage;
