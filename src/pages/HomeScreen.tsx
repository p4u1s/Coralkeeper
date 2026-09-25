import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTanks } from "@/hooks/useTanks.ts";
import { useCorals } from "@/hooks/useCorals.ts";
import type { Coral } from "@/services/coral.ts";

export function HomeScreen() {
  const tanksState = useTanks();
  const coralsState = useCorals();

  // Gemeinsamer Zustand: lädt einer → Laden, scheitert einer → Fehler
  const status =
    tanksState.status === "loading" || coralsState.status === "loading"
      ? "loading"
      : tanksState.status === "error" || coralsState.status === "error"
        ? "error"
        : "success";

  const error = tanksState.error ?? coralsState.error;
  const { tanks } = tanksState;
  const { corals } = coralsState;

  function reload() {
    tanksState.reload();
    coralsState.reload();
  }

  // Beckenname je Koralle im Frontend zuordnen, kein Join (TASK-05-01)
  const tankNames = new Map(tanks.map((tank) => [tank.id, tank.name]));

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
        <Link
          to="/koralle/neu"
          className={buttonVariants({ className: "w-full" })}
        >
          <Plus aria-hidden="true" />
          Koralle hinzufügen
        </Link>
      )}

      {status === "success" && tanks.length > 0 && corals.length === 0 && (
        <p className="text-muted-foreground">Noch keine Korallen angelegt.</p>
      )}

      {status === "success" && tanks.length > 0 && corals.length > 0 && (
        <ul className="flex flex-col gap-4">
          {corals.map((coral) => (
            <CoralCard
              key={coral.id}
              coral={coral}
              tankName={tankNames.get(coral.becken_id)}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

// Nicht anklickbar bis MS-6, daher kein Link und kein Hover-/Fokus-Effekt
function CoralCard({ coral, tankName }: { coral: Coral; tankName?: string }) {
  const details = [coral.art, coral.handelsname].filter(Boolean).join(" · ");

  return (
    <li>
      <Link
        to={`/koralle/${coral.id}`}
        className="flex min-h-11 flex-col gap-1 rounded-xl border border-border bg-card p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="text-h2 font-semibold wrap-break-word">
          {coral.bezeichnung}
        </span>
        {details && (
          <span className="text-label wrap-break-word text-muted-foreground">
            {details}
          </span>
        )}
        {tankName && (
          <span className="text-caption wrap-break-word text-muted-foreground">
            {tankName}
          </span>
        )}
      </Link>
    </li>
  );
}

export default HomeScreen;
