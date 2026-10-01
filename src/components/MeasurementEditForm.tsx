import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { formatDecimalInput, parseDecimal } from "@/lib/format.ts";
import { MEASUREMENT_EXAMPLES, MEASUREMENT_FORM_LABELS } from "@/lib/labels.ts";
import {
  hasErrors,
  validateMeasurementEdit,
  type MeasurementEditErrors,
} from "@/lib/validation.ts";
import type { Measurement, MeasurementInput } from "@/services/measurement.ts";
import type { Tank } from "@/services/tank.ts";

type MeasurementEditFormProps = {
  measurement: Measurement;
  tanks: Tank[];
  cancelTo: string;
  onSubmit: (input: MeasurementInput) => Promise<void>;
};

// Einen einzelnen Messwert korrigieren (FR-5.10, FR-6.6).
// Der Parameter ist nicht änderbar und steht im Titel der Seite
export function MeasurementEditForm({
  measurement,
  tanks,
  cancelTo,
  onSubmit,
}: MeasurementEditFormProps) {
  const { parameter } = measurement;
  const [tankId, setTankId] = useState(measurement.becken_id);
  const [date, setDate] = useState(measurement.datum);
  // Ohne Tausenderpunkt, sonst würde „1.320" beim Speichern als 1,32 gelesen
  const [text, setText] = useState(formatDecimalInput(measurement.wert));
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MeasurementEditErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateMeasurementEdit(tankId, date, text, parameter);
    setFieldErrors(errors);
    const value = parseDecimal(text);
    if (hasErrors(errors) || value === null) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        becken_id: tankId,
        datum: date,
        parameter,
        wert: value,
      });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Messwert konnte nicht gespeichert werden."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-label text-muted-foreground">* Pflichtfeld</p>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="measurement-edit-tank">Becken *</Label>
        <NativeSelect
          id="measurement-edit-tank"
          value={tankId}
          onChange={(event) => {
            setTankId(event.target.value);
            setFieldErrors((prev) => ({ ...prev, tankId: undefined }));
          }}
          aria-invalid={fieldErrors.tankId !== undefined}
          aria-describedby={
            fieldErrors.tankId ? "measurement-edit-tank-error" : undefined
          }
        >
          <NativeSelectOption value="">Becken wählen</NativeSelectOption>
          {tanks.map((tank) => (
            <NativeSelectOption key={tank.id} value={tank.id}>
              {tank.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {fieldErrors.tankId && (
          <p
            id="measurement-edit-tank-error"
            className="text-label text-destructive"
          >
            {fieldErrors.tankId}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="measurement-edit-date">Datum *</Label>
        <Input
          id="measurement-edit-date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setFieldErrors((prev) => ({ ...prev, date: undefined }));
          }}
          aria-invalid={fieldErrors.date !== undefined}
          aria-describedby={
            fieldErrors.date ? "measurement-edit-date-error" : undefined
          }
        />
        {fieldErrors.date && (
          <p
            id="measurement-edit-date-error"
            className="text-label text-destructive"
          >
            {fieldErrors.date}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="measurement-edit-value">
          {MEASUREMENT_FORM_LABELS[parameter]} *
        </Label>
        <Input
          id="measurement-edit-value"
          inputMode="decimal"
          placeholder={`z. B. ${MEASUREMENT_EXAMPLES[parameter]}`}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFieldErrors((prev) => ({ ...prev, value: undefined }));
          }}
          aria-invalid={fieldErrors.value !== undefined}
          aria-describedby={
            fieldErrors.value ? "measurement-edit-value-error" : undefined
          }
        />
        {fieldErrors.value && (
          <p
            id="measurement-edit-value-error"
            className="text-label text-destructive"
          >
            {fieldErrors.value}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Wird gespeichert …" : "Speichern"}
      </Button>
      <Link
        to={cancelTo}
        className={buttonVariants({
          variant: "secondary",
          className: "w-full",
        })}
      >
        Abbrechen
      </Link>
    </form>
  );
}
