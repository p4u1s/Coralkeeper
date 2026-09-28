import { Link, useNavigate, useParams } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { FragForm } from "@/components/FragForm.tsx";
import { useCoral } from "@/hooks/useCoral.ts";
import { useTanks } from "@/hooks/useTanks.ts";
import { createFrag, type Coral, type FragInput } from "@/services/coral.ts";

// Ableger aus einer Koralle erzeugen (FR-1.7, FR-6.4)
export function FragCreatePage() {
  // Fehlende ID endet in getCoral als null → „nicht gefunden"
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { status: coralStatus, coral, error: coralError } = useCoral(id);
  const { status: tanksStatus, tanks, error: tanksError, reload } = useTanks();

  const coralFailed = coralStatus === "error" || coralStatus === "notFound";
  const isLoading =
    !coralFailed && (coralStatus === "loading" || tanksStatus === "loading");

  async function handleSubmit(mother: Coral, input: FragInput) {
    const frag = await createFrag(mother, input);
    // replace: „Zurück" im Browser führt zur Ursprungskoralle statt ins leere Formular
    await navigate(`/koralle/${frag.id}`, { replace: true });
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <div className="flex flex-col gap-1">
        <h1 className="text-display font-semibold">Ableger erzeugen</h1>
        {coral && (
          <p className="text-label wrap-break-word text-muted-foreground">
            {coral.bezeichnung}
          </p>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Wird geladen …</p>}

      {coralStatus === "error" && (
        <p role="alert" className="text-destructive">
          {coralError}
        </p>
      )}

      {coralStatus === "notFound" && (
        <p className="text-muted-foreground">Koralle nicht gefunden.</p>
      )}

      {coralStatus === "success" && tanksStatus === "error" && (
        <>
          <p role="alert" className="text-destructive">
            {tanksError}
          </p>
          <Button variant="secondary" className="w-full" onClick={reload}>
            Erneut versuchen
          </Button>
        </>
      )}

      {/* Keine Bottom-Navigation auf dieser Seite, daher ein eigener Rückweg */}
      {(coralFailed || tanksStatus === "error") && (
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

      {/* Erst nach dem Laden rendern – das Formular übernimmt die Vorbelegung nur beim ersten Rendern */}
      {coralStatus === "success" && coral && tanksStatus === "success" && (
        <FragForm
          mother={coral}
          tanks={tanks}
          cancelTo={`/koralle/${id}`}
          onSubmit={(input) => handleSubmit(coral, input)}
        />
      )}
    </main>
  );
}

export default FragCreatePage;
