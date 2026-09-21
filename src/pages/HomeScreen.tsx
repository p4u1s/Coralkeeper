import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTanks } from "@/hooks/useTanks.ts";

// Bestand mit geführten Leerzustand (FR-1.15, NFR-1.7, FR-6.4)

export function HomeScreen() {
  const { status, tanks, error, reload } = useTanks();

  return (
    <main className="flex flex-col gap-4 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Bestand</h1>

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

      {status === "success" && tanks.length > 0 && (
        <p className="text-muted-foreground">
          Die Korallenliste folgt in Kürze.
        </p>
      )}
    </main>
  );
}

export default HomeScreen;
