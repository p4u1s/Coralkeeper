import { Link, useNavigate, useParams } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { OfferForm } from "@/components/OfferForm.tsx";
import { useCoral } from "@/hooks/useCoral.ts";
import { CORAL_STATUS_LABELS } from "@/lib/labels.ts";
import type { Coral } from "@/services/coral.ts";
import { createOffer, type OfferInput } from "@/services/offer.ts";

// Koralle zur Abgabe freischalten: Inserat anlegen (FR-4.1, FR-6.4)
export function OfferCreatePage() {
  // Fehlende ID endet in getCoral als null → „nicht gefunden"
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { status, coral, error } = useCoral(id);

  const detailPath = `/koralle/${id}`;

  async function handleSubmit(offeredCoral: Coral, input: OfferInput) {
    await createOffer(offeredCoral, input);
    // replace: „Zurück" im Browser führt nicht wieder ins Formular
    await navigate(detailPath, { replace: true });
  }

  return (
    <main className="flex min-h-svh flex-col gap-6 px-4 py-6 text-body">
      <div className="flex flex-col gap-1">
        <h1 className="text-display font-semibold">Inserat erstellen</h1>
        {coral && (
          <p className="text-label wrap-break-word text-muted-foreground">
            {coral.bezeichnung}
          </p>
        )}
      </div>

      {status === "loading" && (
        <p className="text-muted-foreground">Wird geladen …</p>
      )}

      {status === "error" && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}

      {status === "notFound" && (
        <p className="text-muted-foreground">Koralle nicht gefunden.</p>
      )}

      {(status === "error" || status === "notFound") && (
        <Link
          to="/"
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          Zum Bestand
        </Link>
      )}

      {/* Direktaufruf, wenn die Koralle schon zur Abgabe steht oder weg ist –
          kein zweites Inserat (UNIQUE auf angebot.koralle_id greift zusätzlich) */}
      {status === "success" && coral && coral.status !== "im_bestand" && (
        <>
          <p className="text-muted-foreground">
            Diese Koralle kann nicht inseriert werden. Status:{" "}
            {CORAL_STATUS_LABELS[coral.status]}.
          </p>
          <Link
            to={detailPath}
            className={buttonVariants({
              variant: "secondary",
              className: "w-full",
            })}
          >
            Zur Koralle
          </Link>
        </>
      )}

      {status === "success" && coral && coral.status === "im_bestand" && (
        <OfferForm
          cancelTo={detailPath}
          onSubmit={(input) => handleSubmit(coral, input)}
        />
      )}
    </main>
  );
}

export default OfferCreatePage;
