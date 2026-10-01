import { Link, useNavigate, useParams } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteEntryDialog } from "@/components/DeleteEntryDialog.tsx";
import { MeasurementEditForm } from "@/components/MeasurementEditForm.tsx";
import { useMeasurement } from "@/hooks/useMeasurement.ts";
import { useTanks } from "@/hooks/useTanks.ts";
import { formatDate, formatMeasurement } from "@/lib/format.ts";
import {
  MEASUREMENT_PARAMETER_LABELS,
  MEASUREMENT_PARAMETER_SHORT_LABELS,
} from "@/lib/labels.ts";
import {
  deleteMeasurement,
  updateMeasurement,
  type MeasurementInput,
} from "@/services/measurement.ts";

// Einen Messwert korrigieren (FR-5.10, FR-6.4)
export function MeasurementEditPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const measurementState = useMeasurement(id);
  const tanksState = useTanks();
  const { measurement } = measurementState;

  // „Nicht gefunden" geht vor: fremde und ungültige IDs zeigen keinen Fehler
  const states = [measurementState, tanksState];
  const status =
    measurementState.status === "notFound"
      ? "notFound"
      : states.some((state) => state.status === "loading")
        ? "loading"
        : states.some((state) => state.status === "error")
          ? "error"
          : "success";

  const error = measurementState.error ?? tanksState.error;

  function reload() {
    measurementState.reload();
    tanksState.reload();
  }

  // replace: „Zurück" soll nicht wieder im abgeschickten Formular landen
  async function handleSubmit(input: MeasurementInput) {
    await updateMeasurement(id, input);
    await navigate("/diary", { replace: true });
  }

  // replace: die Bearbeiten-Seite des gelöschten Messwerts gibt es nicht mehr
  async function handleDelete() {
    await deleteMeasurement(id);
    await navigate("/diary", { replace: true });
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">
        {measurement
          ? `${MEASUREMENT_PARAMETER_SHORT_LABELS[measurement.parameter]} bearbeiten`
          : "Messwert bearbeiten"}
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
          Der Dialog nennt die gespeicherten Werte, nicht die gerade bearbeiteten */}
      {status === "success" && measurement && (
        <>
          <MeasurementEditForm
            measurement={measurement}
            tanks={tanksState.tanks}
            cancelTo="/diary"
            onSubmit={handleSubmit}
          />
          <DeleteEntryDialog
            title="Messwert löschen?"
            description={`${MEASUREMENT_PARAMETER_LABELS[measurement.parameter]} ${formatMeasurement(measurement.wert, measurement.parameter)} vom ${formatDate(measurement.datum)} wird endgültig gelöscht.`}
            onDelete={handleDelete}
          />
        </>
      )}
    </main>
  );
}

export default MeasurementEditPage;
