import { useRef, useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { parseDecimal } from "@/lib/format.ts";
import {
  MEASUREMENT_EXAMPLES,
  MEASUREMENT_FORM_LABELS,
  MEASUREMENT_PARAMETER_VALUES,
} from "@/lib/labels.ts";
import {
  hasMeasurementErrors,
  todayIso,
  validateMeasurements,
  type MeasurementErrors,
} from "@/lib/validation.ts";
import type { MeasurementValue } from "@/services/measurement.ts";
import type { Tank } from "@/services/tank.ts";
import type { Enums } from "@/types/database.types.ts";

type MeasurementTexts = Record<Enums<"messparameter">, string>;

const EMPTY_TEXTS: MeasurementTexts = {
  kh: "",
  ca: "",
  mg: "",
  no3: "",
  po4: "",
  temperatur: "",
  salinitaet: "",
};

type MeasurementFormProps = {
  tanks: Tank[];
  cancelTo: string;
  onSubmit: (
    tankId: string,
    date: string,
    values: MeasurementValue[]
  ) => Promise<void>;
};

// Messwerte eines Beckens an einem Datum erfassen (FR-5.1, FR-6.6).
// type="text" mit inputMode="decimal" statt type="number", damit Komma und
// Punkt in allen Browsern gleich ankommen (Hinweis TASK-08-04)
export function MeasurementForm({
  tanks,
  cancelTo,
  onSubmit,
}: MeasurementFormProps) {
  // Bei genau einem Becken vorausgewählt (Entscheidung TASK-08-04)
  const [tankId, setTankId] = useState(tanks.length === 1 ? tanks[0].id : "");
  const [date, setDate] = useState(todayIso());
  const [texts, setTexts] = useState<MeasurementTexts>(EMPTY_TEXTS);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MeasurementErrors>({
    values: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstValueRef = useRef<HTMLInputElement>(null);

  function handleValueChange(parameter: Enums<"messparameter">, text: string) {
    setTexts((prev) => ({ ...prev, [parameter]: text }));
    // Mit dem ersten Wert ist auch der Hinweis „mindestens ein Wert" erledigt
    setFieldErrors((prev) => ({
      ...prev,
      values: { ...prev.values, [parameter]: undefined },
      atLeastOne: undefined,
    }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateMeasurements(tankId, date, texts);
    setFieldErrors(errors);
    if (hasMeasurementErrors(errors)) {
      // Kein einzelnes Feld ist schuld, daher Fokus auf das erste Wertfeld
      if (errors.atLeastOne) {
        firstValueRef.current?.focus();
      }
      return;
    }
    // Leere Felder fallen weg; alle übrigen sind nach der Prüfung gültige Zahlen
    const values = MEASUREMENT_PARAMETER_VALUES.flatMap((parameter) => {
      const wert = parseDecimal(texts[parameter]);
      return wert === null ? [] : [{ parameter, wert }];
    });
    setIsSubmitting(true);
    try {
      await onSubmit(tankId, date, values);
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Messwerte konnten nicht gespeichert werden."
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
        <Label htmlFor="measurement-tank">Becken *</Label>
        <NativeSelect
          id="measurement-tank"
          value={tankId}
          onChange={(event) => {
            setTankId(event.target.value);
            setFieldErrors((prev) => ({ ...prev, tankId: undefined }));
          }}
          aria-invalid={fieldErrors.tankId !== undefined}
          aria-describedby={
            fieldErrors.tankId ? "measurement-tank-error" : undefined
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
            id="measurement-tank-error"
            className="text-label text-destructive"
          >
            {fieldErrors.tankId}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="measurement-date">Datum *</Label>
        <Input
          id="measurement-date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setFieldErrors((prev) => ({ ...prev, date: undefined }));
          }}
          aria-invalid={fieldErrors.date !== undefined}
          aria-describedby={
            fieldErrors.date ? "measurement-date-error" : undefined
          }
        />
        {fieldErrors.date && (
          <p
            id="measurement-date-error"
            className="text-label text-destructive"
          >
            {fieldErrors.date}
          </p>
        )}
      </div>

      <fieldset
        className="flex min-w-0 flex-col gap-4"
        aria-describedby="measurement-hint"
      >
        <legend className="text-body font-medium">Messwerte</legend>
        <p id="measurement-hint" className="text-label text-muted-foreground">
          Mindestens einen Wert eintragen.
        </p>
        {fieldErrors.atLeastOne && (
          <p role="alert" className="text-label text-destructive">
            {fieldErrors.atLeastOne}
          </p>
        )}
        {MEASUREMENT_PARAMETER_VALUES.map((parameter, index) => {
          const id = `measurement-${parameter}`;
          const fieldError = fieldErrors.values[parameter];
          return (
            <div key={parameter} className="flex flex-col gap-2">
              <Label htmlFor={id}>{MEASUREMENT_FORM_LABELS[parameter]}</Label>
              <Input
                id={id}
                ref={index === 0 ? firstValueRef : undefined}
                inputMode="decimal"
                placeholder={`z. B. ${MEASUREMENT_EXAMPLES[parameter]}`}
                value={texts[parameter]}
                onChange={(event) =>
                  handleValueChange(parameter, event.target.value)
                }
                aria-invalid={fieldError !== undefined}
                aria-describedby={fieldError ? `${id}-error` : undefined}
              />
              {fieldError && (
                <p id={`${id}-error`} className="text-label text-destructive">
                  {fieldError}
                </p>
              )}
            </div>
          );
        })}
      </fieldset>

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
