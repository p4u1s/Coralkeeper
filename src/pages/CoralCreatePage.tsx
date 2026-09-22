import { Link, useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CoralForm } from "@/components/CoralForm";
import { useTanks } from "@/hooks/useTanks.ts";
import { createCoral, type CoralInput } from "@/services/coral.ts";

// Koralle anlegen, nur mit mindestens einem Becken erreichbar (FR-1.2, FR-1.15, FR-6.4)

export function CoralCreatePage() {
  const navigate = useNavigate();
  const { status, tanks, error, reload } = useTanks();

  async function handleSubmit(input: CoralInput) {
    await createCoral(input);
    await navigate("/");
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Koralle anlegen</h1>

      {status === "loading" && (
        <p className="text-muted-foreground">Wird geladen …</p>
      )}

      {status === "error" && (
        <>
          <p role="alert" className="text-destructive">
            {error}
          </p>
          <Button variant="secondary" className="w-full" onClick={reload}>
            Erneut versuchen
          </Button>
        </>
      )}

      {/* Ohne Becken kein Formular, auch bei Direktaufruf (FR-1.15) */}
      {status === "success" && tanks.length === 0 && (
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <h2 className="text-h2 font-semibold">Lege zuerst ein Becken an</h2>
          <p className="text-muted-foreground">
            Jede Koralle gehört zu einem Becken.
          </p>
          <Link
            to="/becken/neu"
            className={buttonVariants({ className: "w-full" })}
          >
            <Plus aria-hidden="true" />
            Becken anlegen
          </Link>
        </section>
      )}

      {/* Keine Bottom-Navigation auf dieser Seite, daher ein eigener Rückweg */}
      {(status === "error" || (status === "success" && tanks.length === 0)) && (
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

      {status === "success" && tanks.length > 0 && (
        <CoralForm
          tanks={tanks}
          submitLabel="Speichern"
          cancelTo="/"
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}

export default CoralCreatePage;
