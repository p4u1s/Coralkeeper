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
  CORAL_PROFILE_LABELS,
  LEVEL_LABELS,
  LEVEL_VALUES,
  PLACEMENT_LABELS,
  PLACEMENT_VALUES,
} from "@/lib/labels.ts";
import {
  hasErrors,
  validateCoralProfile,
  type CoralProfileErrors,
} from "@/lib/validation.ts";
import type { CoralProfileInput } from "@/services/coral.ts";
import type { Enums } from "@/types/database.types.ts";

type CoralProfileFormProps = {
  initialValues: CoralProfileInput;
  cancelTo: string;
  onSubmit: (input: CoralProfileInput) => Promise<void>;
};

type SelectOption = { value: string; label: string };

const LEVEL_OPTIONS: SelectOption[] = LEVEL_VALUES.map((value) => ({
  value,
  label: LEVEL_LABELS[value],
}));

const PLACEMENT_OPTIONS: SelectOption[] = PLACEMENT_VALUES.map((value) => ({
  value,
  label: PLACEMENT_LABELS[value],
}));

// Die Auswahl liefert einen String; find grenzt ihn ohne Cast auf einen
// gültigen Enum-Wert ein. „keine Angabe" ("") wird zu null
function toLevel(value: string): Enums<"stufe"> | null {
  return LEVEL_VALUES.find((level) => level === value) ?? null;
}

function toPlacement(value: string): Enums<"platzierung"> | null {
  return PLACEMENT_VALUES.find((placement) => placement === value) ?? null;
}

// Steckbrief ausfüllen und ändern (FR-2.1, FR-2.2, FR-6.6).
// Alle Felder sind optional – daher kein * und keine Pflichtfeld-Legende
export function CoralProfileForm({
  initialValues,
  cancelTo,
  onSubmit,
}: CoralProfileFormProps) {
  // Auswahlfelder als String: "" steht für „keine Angabe"
  const [light, setLight] = useState<string>(initialValues.licht ?? "");
  const [flow, setFlow] = useState<string>(initialValues.stroemung ?? "");
  const [placement, setPlacement] = useState<string>(
    initialValues.platzierung ?? ""
  );
  const [stinging, setStinging] = useState<string>(
    initialValues.nesselkraft ?? ""
  );
  const [difficulty, setDifficulty] = useState<string>(
    initialValues.schwierigkeit ?? ""
  );
  const [growthForm, setGrowthForm] = useState(initialValues.wuchsform ?? "");
  const [feeding, setFeeding] = useState(initialValues.fuetterung ?? "");
  const [notes, setNotes] = useState(initialValues.besonderheiten ?? "");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CoralProfileErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateCoralProfile(growthForm, feeding, notes);
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Leere Texte werden zu null, getrimmt wird im Service (toProfileRow)
      await onSubmit({
        licht: toLevel(light),
        stroemung: toLevel(flow),
        platzierung: toPlacement(placement),
        nesselkraft: toLevel(stinging),
        wuchsform: growthForm || null,
        schwierigkeit: toLevel(difficulty),
        fuetterung: feeding || null,
        besonderheiten: notes || null,
      });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Steckbrief konnte nicht gespeichert werden."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ProfileSelect
        id="profile-light"
        label={CORAL_PROFILE_LABELS.licht}
        value={light}
        options={LEVEL_OPTIONS}
        onChange={setLight}
      />
      <ProfileSelect
        id="profile-flow"
        label={CORAL_PROFILE_LABELS.stroemung}
        value={flow}
        options={LEVEL_OPTIONS}
        onChange={setFlow}
      />
      <ProfileSelect
        id="profile-placement"
        label={CORAL_PROFILE_LABELS.platzierung}
        value={placement}
        options={PLACEMENT_OPTIONS}
        onChange={setPlacement}
      />
      <ProfileSelect
        id="profile-stinging"
        label={CORAL_PROFILE_LABELS.nesselkraft}
        value={stinging}
        options={LEVEL_OPTIONS}
        onChange={setStinging}
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-growth-form">
          {CORAL_PROFILE_LABELS.wuchsform}
        </Label>
        <Input
          id="profile-growth-form"
          placeholder="z. B. verzweigt"
          value={growthForm}
          onChange={(event) => {
            setGrowthForm(event.target.value);
            setFieldErrors((prev) => ({ ...prev, growthForm: undefined }));
          }}
          aria-invalid={fieldErrors.growthForm !== undefined}
          aria-describedby={
            fieldErrors.growthForm ? "profile-growth-form-error" : undefined
          }
        />
        {fieldErrors.growthForm && (
          <p
            id="profile-growth-form-error"
            className="text-label text-destructive"
          >
            {fieldErrors.growthForm}
          </p>
        )}
      </div>
      <ProfileSelect
        id="profile-difficulty"
        label={CORAL_PROFILE_LABELS.schwierigkeit}
        value={difficulty}
        options={LEVEL_OPTIONS}
        onChange={setDifficulty}
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-feeding">
          {CORAL_PROFILE_LABELS.fuetterung}
        </Label>
        <Textarea
          id="profile-feeding"
          value={feeding}
          onChange={(event) => {
            setFeeding(event.target.value);
            setFieldErrors((prev) => ({ ...prev, feeding: undefined }));
          }}
          aria-invalid={fieldErrors.feeding !== undefined}
          aria-describedby={
            fieldErrors.feeding ? "profile-feeding-error" : undefined
          }
        />
        {fieldErrors.feeding && (
          <p id="profile-feeding-error" className="text-label text-destructive">
            {fieldErrors.feeding}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-notes">
          {CORAL_PROFILE_LABELS.besonderheiten}
        </Label>
        <Textarea
          id="profile-notes"
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value);
            setFieldErrors((prev) => ({ ...prev, notes: undefined }));
          }}
          aria-invalid={fieldErrors.notes !== undefined}
          aria-describedby={
            fieldErrors.notes ? "profile-notes-error" : undefined
          }
        />
        {fieldErrors.notes && (
          <p id="profile-notes-error" className="text-label text-destructive">
            {fieldErrors.notes}
          </p>
        )}
      </div>

      {/* Direkt über dem Button – bei acht Feldern läge die Meldung oben
          außerhalb des Bildschirms */}
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
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

// Auswahlfeld mit „keine Angabe" als erster Option (FR-2.2: alles optional)
function ProfileSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <NativeSelect
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <NativeSelectOption value="">keine Angabe</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
