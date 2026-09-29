import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { OFFER_MODE_LABELS, OFFER_MODE_VALUES } from "@/lib/labels.ts";
import {
  hasErrors,
  validateOffer,
  type OfferErrors,
} from "@/lib/validation.ts";
import type { OfferInput } from "@/services/offer.ts";
import type { Enums } from "@/types/database.types.ts";

type OfferMode = Enums<"angebot_modus">;

type OfferFormProps = {
  cancelTo: string;
  onSubmit: (input: OfferInput) => Promise<void>;
};

// Label und Platzhalter des Freitextfelds je Modus. Bei „Verschenken" und
// vor der Modus-Wahl gibt es das Feld nicht (Entscheidung TASK-07-06)
const PRICE_OR_SWAP_FIELDS: Partial<
  Record<OfferMode, { label: string; placeholder: string }>
> = {
  tauschen: { label: "Tauschwunsch", placeholder: "z. B. gegen eine Zoanthus" },
  verkaufen: { label: "Preis", placeholder: "z. B. 15 €" },
};

// Der Wert eines <select> ist immer string – hier auf die Enum-Werte eingegrenzt
function isOfferMode(value: string): value is OfferMode {
  return OFFER_MODE_VALUES.some((mode) => mode === value);
}

// Inserat anlegen (FR-4.1, FR-6.6). Kein Bildfeld – Upload kommt mit MS-9
export function OfferForm({ cancelTo, onSubmit }: OfferFormProps) {
  const [mode, setMode] = useState<OfferMode | "">("");
  const [priceOrSwap, setPriceOrSwap] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<OfferErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceOrSwapField = mode === "" ? undefined : PRICE_OR_SWAP_FIELDS[mode];

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    // Erst prüfen – bei Feldfehlern geht keine Anfrage raus (FR-6.6)
    const errors = validateOffer(mode, priceOrSwap, size);
    setFieldErrors(errors);
    // mode === "" ist schon ein Feldfehler, der Vergleich grenzt nur den Typ ein
    if (hasErrors(errors) || mode === "") {
      return;
    }
    // Der deaktivierte Button verhindert ein zweites Inserat durch doppeltes
    // Antippen; UNIQUE auf angebot.koralle_id greift zusätzlich
    setIsSubmitting(true);
    try {
      // Ausgeblendetes Feld nicht speichern, auch wenn vorher etwas
      // eingetippt wurde. Getrimmt wird im Service (createOffer)
      await onSubmit({
        modus: mode,
        preis_oder_tauschwunsch: priceOrSwapField ? priceOrSwap : null,
        groesse: size,
      });
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setError(
        err instanceof Error
          ? err.message
          : "Inserat konnte nicht angelegt werden."
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
        <Label htmlFor="offer-mode">Modus *</Label>
        <NativeSelect
          id="offer-mode"
          value={mode}
          onChange={(event) => {
            const value = event.target.value;
            setMode(isOfferMode(value) ? value : "");
            // Mit dem Modus wechselt auch das Freitextfeld
            setFieldErrors((prev) => ({
              ...prev,
              mode: undefined,
              priceOrSwap: undefined,
            }));
          }}
          aria-invalid={fieldErrors.mode !== undefined}
          aria-describedby={fieldErrors.mode ? "offer-mode-error" : undefined}
        >
          <NativeSelectOption value="">Modus wählen</NativeSelectOption>
          {OFFER_MODE_VALUES.map((value) => (
            <NativeSelectOption key={value} value={value}>
              {OFFER_MODE_LABELS[value]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {fieldErrors.mode && (
          <p id="offer-mode-error" className="text-label text-destructive">
            {fieldErrors.mode}
          </p>
        )}
      </div>
      {priceOrSwapField && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="offer-price-or-swap">{priceOrSwapField.label}</Label>
          <Input
            id="offer-price-or-swap"
            placeholder={priceOrSwapField.placeholder}
            value={priceOrSwap}
            onChange={(event) => {
              setPriceOrSwap(event.target.value);
              setFieldErrors((prev) => ({ ...prev, priceOrSwap: undefined }));
            }}
            aria-invalid={fieldErrors.priceOrSwap !== undefined}
            aria-describedby={
              fieldErrors.priceOrSwap ? "offer-price-or-swap-error" : undefined
            }
          />
          {fieldErrors.priceOrSwap && (
            <p
              id="offer-price-or-swap-error"
              className="text-label text-destructive"
            >
              {fieldErrors.priceOrSwap}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="offer-size">Größe</Label>
        <Input
          id="offer-size"
          placeholder="z. B. 3 cm"
          value={size}
          onChange={(event) => {
            setSize(event.target.value);
            setFieldErrors((prev) => ({ ...prev, size: undefined }));
          }}
          aria-invalid={fieldErrors.size !== undefined}
          aria-describedby={fieldErrors.size ? "offer-size-error" : undefined}
        />
        {fieldErrors.size && (
          <p id="offer-size-error" className="text-label text-destructive">
            {fieldErrors.size}
          </p>
        )}
      </div>

      {/* Sichtbarkeit nach FR-4.2, Wortlaut entschieden in TASK-07-06 */}
      <p className="text-label text-muted-foreground">
        Das Inserat ist für alle angemeldeten Nutzer sichtbar. Dein übriger
        Bestand bleibt privat.
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
