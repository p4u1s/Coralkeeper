// Inserat einer Koralle auf der Detailseite (FR-4.1, FR-6.4, NFR-1.9)

import { useOffer } from "@/hooks/useOffer.ts";
import { formatTimestampDate } from "@/lib/format.ts";
import { OFFER_MODE_LABELS } from "@/lib/labels.ts";
import type { Coral } from "@/services/coral.ts";
import type { Enums } from "@/types/database.types.ts";
import { Link } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { withdrawOffer, type Offer } from "@/services/offer.ts";

// Wie im OfferForm: bei „Verschenken" gibt es kein Freitextfeld
const PRICE_OR_SWAP_LABELS: Partial<Record<Enums<"angebot_modus">, string>> = {
  tauschen: "Tauschwunsch",
  verkaufen: "Preis",
};

type CoralOfferProps = {
  coral: Coral;
  onWithdrawn: () => void;
};

export function CoralOffer({ coral, onWithdrawn }: CoralOfferProps) {
  const { status, offer, error, reload } = useOffer(coral.id);

  if (status === "loading") {
    return <p className="text-muted-foreground">Inserat wird geladen …</p>;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-4">
        <p role="alert" className="text-destructive">
          {error}
        </p>
        <Button variant="secondary" className="w-full" onClick={reload}>
          Erneut versuchen
        </Button>
      </div>
    );
  }
  // Ohne Inserat keine Karte, sondern der Button zum Inserieren – nur im
  // Bestand (Entscheidungen TASK-07-06 und TASK-07-07)
  if (!offer) {
    return coral.status === "im_bestand" ? (
      <Link
        to={`/koralle/${coral.id}/inserat/neu`}
        className={buttonVariants({
          variant: "secondary",
          className: "w-full",
        })}
      >
        Zur Abgabe markieren
      </Link>
    ) : null;
  }

  return (
    <OfferCard
      offer={offer}
      coralName={coral.bezeichnung}
      onWithdrawn={onWithdrawn}
    />
  );
}

type OfferCardProps = {
  offer: Offer;
  coralName: string;
  onWithdrawn: () => void;
};

function OfferCard({ offer, coralName, onWithdrawn }: OfferCardProps) {
  const priceOrSwapLabel = PRICE_OR_SWAP_LABELS[offer.modus];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Während des Zurückziehens bleibt der Dialog offen (auch bei Esc)
  function handleOpenChange(open: boolean) {
    if (withdrawing) {
      return;
    }
    setDialogOpen(open);
    setWithdrawError(null);
  }

  // Status im_bestand und Systemeintrag setzen Trigger (Festlegungen 15, 18)
  async function handleWithdraw() {
    setWithdrawing(true);
    setWithdrawError(null);
    try {
      await withdrawOffer(offer.id);
      // Kein State mehr setzen: reload baut die Seite neu auf, Karte und
      // Dialog verschwinden dabei
      onWithdrawn();
    } catch (err) {
      setWithdrawError(
        err instanceof Error
          ? err.message
          : "Inserat konnte nicht zurückgezogen werden."
      );
      setWithdrawing(false);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <h2 className="text-h2 font-semibold">Inserat</h2>
      <dl className="flex flex-col gap-3">
        <OfferEntry label="Modus" value={OFFER_MODE_LABELS[offer.modus]} />
        {priceOrSwapLabel && (
          <OfferEntry
            label={priceOrSwapLabel}
            value={offer.preis_oder_tauschwunsch}
          />
        )}
        <OfferEntry label="Größe" value={offer.groesse} />
        {/* Zustand des Inserats erkennbar (NFR-1.9) */}
        <OfferEntry
          label="Sichtbarkeit"
          value={
            offer.sichtbar ? "Für andere Nutzer sichtbar" : "Nicht sichtbar"
          }
        />
        <OfferEntry
          label="Inseriert am"
          value={formatTimestampDate(offer.erstellt_am)}
        />
      </dl>
      <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger
          render={
            <Button variant="secondary" className="w-full text-destructive" />
          }
        >
          Inserat zurückziehen
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inserat zurückziehen?</AlertDialogTitle>
            <AlertDialogDescription>
              Das Inserat wird gelöscht und ist für andere nicht mehr sichtbar.
              „{coralName}“ steht danach wieder im Bestand.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {withdrawError && (
            <p role="alert" className="text-destructive">
              {withdrawError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={withdrawing}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              variant="secondary"
              className="text-destructive"
              disabled={withdrawing}
              onClick={handleWithdraw}
            >
              {withdrawing ? "Wird zurückgezogen …" : "Zurückziehen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function OfferEntry({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word">
        {value ?? <span className="text-ink-3">keine Angabe</span>}
      </dd>
    </div>
  );
}
