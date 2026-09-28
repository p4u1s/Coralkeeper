import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { hasErrors, validateFrag, type FragErrors } from "@/lib/validation.ts";
import type { Coral, FragInput } from "@/services/coral.ts";
import type { Tank } from "@/services/tank.ts";

type FragFormProps = {
  mother: Coral;
  tanks: Tank[];
  cancelTo: string;
  onSubmit: (input: FragInput) => Promise<void>;
};

// Ableger erzeugen: nur Bezeichnung und Becken, der Rest kommt aus der
// Ursprungskoralle (FR-1.7, FR-1.14, FR-6.6)
export function FragForm({ mother, tanks, cancelTo, onSubmit }: FragFormProps) {
  // Beides mit den Werten der Ursprungskoralle vorbelegt (TASK-07-03)
  const [name, setName] = useState(mother.bezeichnung);
  const [tankId, setTankId] = useState(mother.becken_id);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FragErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateFrag(name, tankId);
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ bezeichnung: name, becken_id: tankId });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Ableger konnte nicht angelegt werden."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-muted-foreground">
        Art, Handelsname und Steckbrief werden von „{mother.bezeichnung}“
        übernommen.
      </p>
      <p className="text-label text-muted-foreground">* Pflichtfeld</p>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="frag-name">Bezeichnung *</Label>
        <Input
          id="frag-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldErrors((prev) => ({ ...prev, name: undefined }));
          }}
          aria-invalid={fieldErrors.name !== undefined}
          aria-describedby={fieldErrors.name ? "frag-name-error" : undefined}
        />
        {fieldErrors.name && (
          <p id="frag-name-error" className="text-label text-destructive">
            {fieldErrors.name}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="frag-tank">Becken *</Label>
        <NativeSelect
          id="frag-tank"
          value={tankId}
          onChange={(event) => {
            setTankId(event.target.value);
            setFieldErrors((prev) => ({ ...prev, tankId: undefined }));
          }}
          aria-invalid={fieldErrors.tankId !== undefined}
          aria-describedby={fieldErrors.tankId ? "frag-tank-error" : undefined}
        >
          <NativeSelectOption value="">Becken wählen</NativeSelectOption>
          {tanks.map((tank) => (
            <NativeSelectOption key={tank.id} value={tank.id}>
              {tank.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {fieldErrors.tankId && (
          <p id="frag-tank-error" className="text-label text-destructive">
            {fieldErrors.tankId}
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
