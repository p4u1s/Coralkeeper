import { Link, useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MeasurementForm } from "@/components/MeasurementForm.tsx";
import { useTanks } from "@/hooks/useTanks.ts";
import {
  createMeasurements,
  type MeasurementValue,
} from "@/services/measurement.ts";

// Messwerte erfassen, nur mit mindestens einem Becken (FR-5.1, FR-6.4)
export function MeasurementCreatePage() {
  const navigate = useNavigate();
  const { status, tanks, error, reload } = useTanks();

  // replace: „Zurück" soll nicht wieder im abgeschickten Formular landen
  async function handleSubmit(
    tankId: string,
    date: string,
    values: MeasurementValue[]
  ) {
    await createMeasurements(tankId, date, values);
    await navigate("/diary", { replace: true });
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Messwerte erfassen</h1>

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

      {/* Ohne Becken kein Formular, auch bei Direktaufruf (wie im Diary) */}
      {status === "success" && tanks.length === 0 && (
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <h2 className="text-h2 font-semibold">Lege zuerst ein Becken an</h2>
          <p className="text-muted-foreground">
            Jeder Diary-Eintrag gehört zu einem Becken.
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
          to="/diary"
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          Zum Diary
        </Link>
      )}

      {status === "success" && tanks.length > 0 && (
        <MeasurementForm
          tanks={tanks}
          cancelTo="/diary"
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}

export default MeasurementCreatePage;
