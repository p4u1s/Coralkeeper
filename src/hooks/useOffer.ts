// Inserat einer Koralle laden (FR-4.1, FR-6.4)

import { useEffect, useState } from "react";
import { getOfferForCoral, type Offer } from "@/services/offer.ts";

export type OfferStatus = "loading" | "success" | "error";

export type OfferState = {
  status: OfferStatus;
  offer: Offer | null;
  error: string | null;
};

export function useOffer(coralId: string): OfferState & { reload: () => void } {
  const [state, setState] = useState<OfferState>({
    status: "loading",
    offer: null,
    error: null,
  });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getOfferForCoral(coralId)
      .then((offer) => {
        if (!cancelled) {
          setState({ status: "success", offer, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            offer: null,
            error:
              error instanceof Error ? error.message : "Unbekannter Fehler.",
          });
        }
      });

    // Nach dem Verlassen der Seite keinen State mehr setzen
    return () => {
      cancelled = true;
    };
  }, [coralId, reloadCount]);

  function reload() {
    setState({ status: "loading", offer: null, error: null });
    setReloadCount((count) => count + 1);
  }

  return { ...state, reload };
}
