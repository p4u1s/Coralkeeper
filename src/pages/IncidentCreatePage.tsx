import { Link, useNavigate } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { NoTankNotice } from "@/components/NoTankNotice.tsx";
import { TankEventForm } from "@/components/TankEventForm.tsx";
import { useCorals } from "@/hooks/useCorals.ts";
import { useTanks } from "@/hooks/useTanks.ts";
import { createTankEvent, type TankEventInput } from "@/services/tankEvent.ts";

// Ereignis protokollieren, nur mit mindestens einem Becken (FR-5.4, FR-6.4)
export function IncidentCreatePage() {
  const navigate = useNavigate();
  const tanksState = useTanks();
  const coralsState = useCorals();

  // Gemeinsamer Zustand wie im Diary: lädt einer → Laden, scheitert einer → Fehler
  const states = [tanksState, coralsState];
  const status = states.some((state) => state.status === "loading")
    ? "loading"
    : states.some((state) => state.status === "error")
      ? "error"
      : "success";

  const error = tanksState.error ?? coralsState.error;
  const { tanks } = tanksState;

  function reload() {
    tanksState.reload();
    coralsState.reload();
  }

  // replace: „Zurück" soll nicht wieder im abgeschickten Formular landen
  async function handleSubmit(input: TankEventInput) {
    await createTankEvent(input);
    await navigate("/diary", { replace: true });
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Ereignis protokollieren</h1>

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
      {status === "success" && tanks.length === 0 && <NoTankNotice />}

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
        <TankEventForm
          type="vorfall"
          tanks={tanks}
          corals={coralsState.corals}
          cancelTo="/diary"
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}

export default IncidentCreatePage;
