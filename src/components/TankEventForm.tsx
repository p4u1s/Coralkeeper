import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  hasErrors,
  todayIso,
  validateTankEvent,
  type TankEventErrors,
} from "@/lib/validation.ts";
import type { Tank } from "@/services/tank.ts";
import type { TankEventInput } from "@/services/tankEvent.ts";

type TankEventFormProps = {
  // Die Ereignis-Variante ("vorfall") kommt in TASK-08-06 dazu
  type: "wasserwechsel";
  tanks: Tank[];
  cancelTo: string;
  onSubmit: (input: TankEventInput) => Promise<void>;
};

// Wasserwechsel protokollieren (FR-5.3, FR-6.6). Der Typ ist eine
// Eigenschaft, damit TASK-08-06 das Formular für Ereignisse wiederverwendet
export function TankEventForm({
  type,
  tanks,
  cancelTo,
  onSubmit,
}: TankEventFormProps) {
  // Bei genau einem Becken vorausgewählt (Entscheidung TASK-08-04)
  const [tankId, setTankId] = useState(tanks.length === 1 ? tanks[0].id : "");
  const [date, setDate] = useState(todayIso());
  const [amount, setAmount] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TankEventErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateTankEvent(tankId, date, amount, text);
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Getrimmt wird im Service (createTankEvent)
      await onSubmit({
        becken_id: tankId,
        datum: date,
        typ: type,
        menge: amount,
        text,
        koralle_id: null,
      });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Eintrag konnte nicht gespeichert werden."
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
        <Label htmlFor="tank-event-tank">Becken *</Label>
        <NativeSelect
          id="tank-event-tank"
          value={tankId}
          onChange={(event) => {
            setTankId(event.target.value);
            setFieldErrors((prev) => ({ ...prev, tankId: undefined }));
          }}
          aria-invalid={fieldErrors.tankId !== undefined}
          aria-describedby={
            fieldErrors.tankId ? "tank-event-tank-error" : undefined
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
          <p id="tank-event-tank-error" className="text-label text-destructive">
            {fieldErrors.tankId}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tank-event-date">Datum *</Label>
        <Input
          id="tank-event-date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setFieldErrors((prev) => ({ ...prev, date: undefined }));
          }}
          aria-invalid={fieldErrors.date !== undefined}
          aria-describedby={
            fieldErrors.date ? "tank-event-date-error" : undefined
          }
        />
        {fieldErrors.date && (
          <p id="tank-event-date-error" className="text-label text-destructive">
            {fieldErrors.date}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tank-event-amount">Menge</Label>
        <Input
          id="tank-event-amount"
          placeholder="z. B. 30 l"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setFieldErrors((prev) => ({ ...prev, amount: undefined }));
          }}
          aria-invalid={fieldErrors.amount !== undefined}
          aria-describedby={
            fieldErrors.amount ? "tank-event-amount-error" : undefined
          }
        />
        {fieldErrors.amount && (
          <p
            id="tank-event-amount-error"
            className="text-label text-destructive"
          >
            {fieldErrors.amount}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tank-event-text">Notiz</Label>
        <Textarea
          id="tank-event-text"
          placeholder="z. B. Scheiben gereinigt"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFieldErrors((prev) => ({ ...prev, text: undefined }));
          }}
          aria-invalid={fieldErrors.text !== undefined}
          aria-describedby={
            fieldErrors.text ? "tank-event-text-error" : undefined
          }
        />
        {fieldErrors.text && (
          <p id="tank-event-text-error" className="text-label text-destructive">
            {fieldErrors.text}
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
