import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hasErrors, validateTank, type TankErrors } from "@/lib/validation.ts";
import type { TankInput } from "@/services/tank.ts";

type TankFormProps = {
  initialValues?: TankInput;
  submitLabel: string;
  cancelTo: string;
  onSubmit: (input: TankInput) => Promise<void>;
};

// Formular für Becken anlegen und bearbeiten (FR-1.1, FR-6.6)
export function TankForm({
  initialValues,
  submitLabel,
  cancelTo,
  onSubmit,
}: TankFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [volume, setVolume] = useState(
    initialValues?.volumen_liter?.toString() ?? ""
  );
  const [startDate, setStartDate] = useState(initialValues?.startdatum ?? "");
  const [description, setDescription] = useState(
    initialValues?.beschreibung ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TankErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateTank(name, volume, startDate);
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Leere Felder werden zu null, das Volumen zur Zahl
      await onSubmit({
        name,
        volumen_liter: volume.trim() === "" ? null : Number(volume.trim()),
        startdatum: startDate || null,
        beschreibung: description || null,
      });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Becken konnte nicht gespeichert werden."
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
        <Label htmlFor="tank-name">Name *</Label>
        <Input
          id="tank-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldErrors((prev) => ({ ...prev, name: undefined }));
          }}
          aria-invalid={fieldErrors.name !== undefined}
          aria-describedby={fieldErrors.name ? "tank-name-error" : undefined}
        />
        {fieldErrors.name && (
          <p id="tank-name-error" className="text-label text-destructive">
            {fieldErrors.name}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tank-volume">Volumen in Litern</Label>
        <Input
          id="tank-volume"
          inputMode="numeric"
          placeholder="z. B. 250"
          value={volume}
          onChange={(event) => {
            setVolume(event.target.value);
            setFieldErrors((prev) => ({ ...prev, volume: undefined }));
          }}
          aria-invalid={fieldErrors.volume !== undefined}
          aria-describedby={
            fieldErrors.volume ? "tank-volume-error" : undefined
          }
        />
        {fieldErrors.volume && (
          <p id="tank-volume-error" className="text-label text-destructive">
            {fieldErrors.volume}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tank-start-date">Startdatum</Label>
        <Input
          id="tank-start-date"
          type="date"
          value={startDate}
          onChange={(event) => {
            setStartDate(event.target.value);
            setFieldErrors((prev) => ({ ...prev, startDate: undefined }));
          }}
          aria-invalid={fieldErrors.startDate !== undefined}
          aria-describedby={
            fieldErrors.startDate ? "tank-start-date-error" : undefined
          }
        />
        {fieldErrors.startDate && (
          <p id="tank-start-date-error" className="text-label text-destructive">
            {fieldErrors.startDate}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tank-description">Beschreibung</Label>
        <Textarea
          id="tank-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Wird gespeichert …" : submitLabel}
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
