import { Link, useNavigate, useParams } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteEntryDialog } from "@/components/DeleteEntryDialog.tsx";
import { TankEventForm } from "@/components/TankEventForm.tsx";
import { useCorals } from "@/hooks/useCorals.ts";
import { useTankEvent } from "@/hooks/useTankEvent.ts";
import { useTanks } from "@/hooks/useTanks.ts";
import { formatDate } from "@/lib/format.ts";
import { TANK_EVENT_TYPE_LABELS } from "@/lib/labels.ts";
import {
  deleteTankEvent,
  updateTankEvent,
  type TankEventInput,
} from "@/services/tankEvent.ts";
import type { Enums } from "@/types/database.types.ts";

// Satzanfang im Löschdialog, mit passendem Artikel (Entscheidung TASK-08-08)
const DELETE_SUBJECTS: Record<Enums<"ereignis_typ">, string> = {
  wasserwechsel: "Der Wasserwechsel",
  fuetterung: "Die Fütterung",
  vorfall: "Das Ereignis",
};

// Wasserwechsel, Ereignis oder Fütterung korrigieren (FR-5.10, FR-6.4)
export function TankEventEditPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const tankEventState = useTankEvent(id);
  const tanksState = useTanks();
  const coralsState = useCorals();
  const { tankEvent } = tankEventState;

  // „Nicht gefunden" geht vor: fremde und ungültige IDs zeigen keinen Fehler
  const states = [tankEventState, tanksState, coralsState];
  const status =
    tankEventState.status === "notFound"
      ? "notFound"
      : states.some((state) => state.status === "loading")
        ? "loading"
        : states.some((state) => state.status === "error")
          ? "error"
          : "success";

  const error = tankEventState.error ?? tanksState.error ?? coralsState.error;

  function reload() {
    tankEventState.reload();
    tanksState.reload();
    coralsState.reload();
  }

  // replace: „Zurück" soll nicht wieder im abgeschickten Formular landen
  async function handleSubmit(input: TankEventInput) {
    await updateTankEvent(id, input);
    await navigate("/diary", { replace: true });
  }

  // replace: die Bearbeiten-Seite des gelöschten Eintrags gibt es nicht mehr
  async function handleDelete() {
    await deleteTankEvent(id);
    await navigate("/diary", { replace: true });
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">
        {tankEvent
          ? `${TANK_EVENT_TYPE_LABELS[tankEvent.typ]} bearbeiten`
          : "Eintrag bearbeiten"}
      </h1>

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

      {status === "notFound" && (
        <p className="text-muted-foreground">Eintrag nicht gefunden.</p>
      )}

      {/* Keine Bottom-Navigation auf dieser Seite, daher ein eigener Rückweg */}
      {(status === "error" || status === "notFound") && (
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

      {/* Erst nach dem Laden rendern – das Formular übernimmt die Werte nur beim ersten Rendern.
          Eine Fütterung zeigt die Felder des Ereignisses (Entscheidung TASK-08-07).
          Der Dialog nennt das gespeicherte Datum, nicht das gerade bearbeitete */}
      {status === "success" && tankEvent && (
        <>
          <TankEventForm
            type={
              tankEvent.typ === "wasserwechsel" ? "wasserwechsel" : "vorfall"
            }
            tanks={tanksState.tanks}
            corals={coralsState.corals}
            initialValues={tankEvent}
            cancelTo="/diary"
            onSubmit={handleSubmit}
          />
          <DeleteEntryDialog
            title={`${TANK_EVENT_TYPE_LABELS[tankEvent.typ]} löschen?`}
            description={`${DELETE_SUBJECTS[tankEvent.typ]} vom ${formatDate(tankEvent.datum)} wird endgültig gelöscht.`}
            onDelete={handleDelete}
          />
        </>
      )}
    </main>
  );
}

export default TankEventEditPage;
