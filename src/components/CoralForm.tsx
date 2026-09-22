import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  hasErrors,
  validateCoral,
  type CoralErrors,
} from "@/lib/validation.ts";
import type { CoralInput } from "@/services/coral.ts";
import type { Tank } from "@/services/tank.ts";

type CoralFormProps = {
  tanks: Tank[];
  initialValues?: CoralInput;
  submitLabel: string;
  cancelTo: string;
  onSubmit: (input: CoralInput) => Promise<void>;
};

// Formular für Koralle anlegen und später bearbeiten (FR-1.2, FR-1.14, FR-6.6)
export function CoralForm({
  tanks,
  initialValues,
  submitLabel,
  cancelTo,
  onSubmit,
}: CoralFormProps) {
  const [name, setName] = useState(initialValues?.bezeichnung ?? "");
  const [tankId, setTankId] = useState(initialValues?.becken_id ?? "");
  const [species, setSpecies] = useState(initialValues?.art ?? "");
  const [tradeName, setTradeName] = useState(initialValues?.handelsname ?? "");
  const [acquisitionDate, setAcquisitionDate] = useState(
    initialValues?.erwerbsdatum ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CoralErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateCoral(
      name,
      tankId,
      species,
      tradeName,
      acquisitionDate
    );
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Leere optionale Felder werden zu null; tankId ist hier nie "" (FR-1.14)
      await onSubmit({
        bezeichnung: name,
        becken_id: tankId,
        art: species || null,
        handelsname: tradeName || null,
        erwerbsdatum: acquisitionDate || null,
      });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Koralle konnte nicht gespeichert werden."
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
        <Label htmlFor="coral-name">Bezeichnung *</Label>
        <Input
          id="coral-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldErrors((prev) => ({ ...prev, name: undefined }));
          }}
          aria-invalid={fieldErrors.name !== undefined}
          aria-describedby={fieldErrors.name ? "coral-name-error" : undefined}
        />
        {fieldErrors.name && (
          <p id="coral-name-error" className="text-label text-destructive">
            {fieldErrors.name}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="coral-tank">Becken *</Label>
        <NativeSelect
          id="coral-tank"
          value={tankId}
          onChange={(event) => {
            setTankId(event.target.value);
            setFieldErrors((prev) => ({ ...prev, tankId: undefined }));
          }}
          aria-invalid={fieldErrors.tankId !== undefined}
          aria-describedby={fieldErrors.tankId ? "coral-tank-error" : undefined}
        >
          <NativeSelectOption value="">Becken wählen</NativeSelectOption>
          {tanks.map((tank) => (
            <NativeSelectOption key={tank.id} value={tank.id}>
              {tank.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {fieldErrors.tankId && (
          <p id="coral-tank-error" className="text-label text-destructive">
            {fieldErrors.tankId}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="coral-species">Art (wissenschaftlicher Name)</Label>
        <Input
          id="coral-species"
          placeholder="z. B. Acropora tenuis"
          value={species}
          onChange={(event) => {
            setSpecies(event.target.value);
            setFieldErrors((prev) => ({ ...prev, species: undefined }));
          }}
          aria-invalid={fieldErrors.species !== undefined}
          aria-describedby={
            fieldErrors.species ? "coral-species-error" : undefined
          }
        />
        {fieldErrors.species && (
          <p id="coral-species-error" className="text-label text-destructive">
            {fieldErrors.species}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="coral-trade-name">Handelsname / Morphe</Label>
        <Input
          id="coral-trade-name"
          placeholder="z. B. Green Slimer"
          value={tradeName}
          onChange={(event) => {
            setTradeName(event.target.value);
            setFieldErrors((prev) => ({ ...prev, tradeName: undefined }));
          }}
          aria-invalid={fieldErrors.tradeName !== undefined}
          aria-describedby={
            fieldErrors.tradeName ? "coral-trade-name-error" : undefined
          }
        />
        {fieldErrors.tradeName && (
          <p
            id="coral-trade-name-error"
            className="text-label text-destructive"
          >
            {fieldErrors.tradeName}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="coral-acquisition-date">Erwerbsdatum</Label>
        <Input
          id="coral-acquisition-date"
          type="date"
          value={acquisitionDate}
          onChange={(event) => {
            setAcquisitionDate(event.target.value);
            setFieldErrors((prev) => ({ ...prev, acquisitionDate: undefined }));
          }}
          aria-invalid={fieldErrors.acquisitionDate !== undefined}
          aria-describedby={
            fieldErrors.acquisitionDate
              ? "coral-acquisition-date-error"
              : undefined
          }
        />
        {fieldErrors.acquisitionDate && (
          <p
            id="coral-acquisition-date-error"
            className="text-label text-destructive"
          >
            {fieldErrors.acquisitionDate}
          </p>
        )}
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
