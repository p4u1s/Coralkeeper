import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  hasErrors,
  todayIso,
  validateJournalEntry,
  type JournalEntryErrors,
} from "@/lib/validation.ts";
import type { JournalEntryInput } from "@/services/history.ts";

type JournalEntryFormProps = {
  cancelTo: string;
  // koralle_id setzt die Seite, das Formular kennt nur Datum und Text
  onSubmit: (input: Omit<JournalEntryInput, "koralle_id">) => Promise<void>;
};

// Journaleintrag anlegen (FR-3.5, FR-6.6). Bewusst ohne Bearbeiten-Modus:
// Historieneinträge sind append-only (FR-3.3)
export function JournalEntryForm({
  cancelTo,
  onSubmit,
}: JournalEntryFormProps) {
  const [date, setDate] = useState(todayIso());
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<JournalEntryErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateJournalEntry(date, text);
    setFieldErrors(errors);
    if (hasErrors(errors)) {
      return;
    }
    // Der deaktivierte Button verhindert einen zweiten Eintrag durch
    // doppeltes Antippen – der ließe sich nicht mehr löschen (FR-3.3)
    setIsSubmitting(true);
    try {
      // Getrimmt wird im Service (createJournalEntry)
      await onSubmit({ datum: date, text });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Journaleintrag konnte nicht gespeichert werden."
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
        <Label htmlFor="journal-date">Datum *</Label>
        <Input
          id="journal-date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setFieldErrors((prev) => ({ ...prev, date: undefined }));
          }}
          aria-invalid={fieldErrors.date !== undefined}
          aria-describedby={fieldErrors.date ? "journal-date-error" : undefined}
        />
        {fieldErrors.date && (
          <p id="journal-date-error" className="text-label text-destructive">
            {fieldErrors.date}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="journal-text">Text *</Label>
        <Textarea
          id="journal-text"
          placeholder="z. B. Farbe wird kräftiger, neue Astspitzen"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFieldErrors((prev) => ({ ...prev, text: undefined }));
          }}
          aria-invalid={fieldErrors.text !== undefined}
          aria-describedby={fieldErrors.text ? "journal-text-error" : undefined}
        />
        {fieldErrors.text && (
          <p id="journal-text-error" className="text-label text-destructive">
            {fieldErrors.text}
          </p>
        )}
      </div>

      {/* Entscheidung 28.09.2026: Hinweis als Text statt Dialog (FR-3.3, FR-6.5) */}
      <p className="text-label text-muted-foreground">
        Der Eintrag kann nach dem Speichern nicht mehr geändert oder gelöscht
        werden.
      </p>
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
