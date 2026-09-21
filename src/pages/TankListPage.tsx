import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTanks } from "@/hooks/useTanks.ts";
import type { Tank } from "@/services/tank.ts";
import { formatDate, formatVolume } from "@/lib/format.ts";

//Beckenliste mit Lade-, Fehler-, und Leerzustand (nach FR-1.1, Fr-6.4)
export function TankListPage() {
  const { status, tanks, error, reload } = useTanks();

  return (
    <main className="flex flex-col gap-4 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Becken</h1>
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
        <>
          <p className="text-muted-foreground">Noch kein Becken angelegt.</p>
          <Link
            to="/becken/neu"
            className={buttonVariants({ className: "w-full" })}
          >
            <Plus aria-hidden="true" />
            Becken anlegen
          </Link>
        </>
      )}

      {status === "success" && tanks.length > 0 && (
        <>
          <ul className="flex flex-col gap-4">
            {tanks.map((tank) => (
              <li key={tank.id}>
                <TankCard tank={tank} />
              </li>
            ))}
          </ul>
          <Link
            to="/becken/neu"
            className={buttonVariants({
              variant: "secondary",
              className: "w-full",
            })}
          >
            <Plus aria-hidden="true" />
            Becken anlegen
          </Link>
        </>
      )}
    </main>
  );
}

function TankCard({ tank }: { tank: Tank }) {
  const details = formatTankDetails(tank);

  return (
    <Link
      to={`/becken/${tank.id}`}
      className="flex min-h-11 flex-col gap-1 rounded-xl border border-border bg-card p-4"
    >
      <span className="text-h2 font-semibold wrap-break-word">{tank.name}</span>
      {details && (
        <span className="text-label text-muted-foreground tabular-nums">
          {details}
        </span>
      )}
    </Link>
  );
}

// Volumen und Startdatum als eine Zeile, z. B. "250 l · seit 12.03.2026".
// Nur gefüllte Werte, damit kein leerer Trenner „ · " entsteht
function formatTankDetails(tank: Tank): string {
  const parts: string[] = [];

  if (tank.volumen_liter !== null) {
    parts.push(formatVolume(tank.volumen_liter));
  }
  if (tank.startdatum) {
    parts.push(`seit ${formatDate(tank.startdatum)}`);
  }
  return parts.join(" · ");
}

export default TankListPage;
