// Eine Koralle laden, mit eigenem Zustand für „nicht gefunden" (FR-1.2, FR-6.4)

import { useEffect, useState } from "react";
import { getCoral, type Coral } from "@/services/coral.ts";

export type CoralStatus = "loading" | "success" | "notFound" | "error";

export type CoralState = {
  status: CoralStatus;
  coral: Coral | null;
  error: string | null;
};

export function useCoral(id: string): CoralState {
  const [state, setState] = useState<CoralState>({
    status: "loading",
    coral: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getCoral(id)
      .then((coral) => {
        if (!cancelled) {
          setState(
            coral
              ? { status: "success", coral, error: null }
              : { status: "notFound", coral: null, error: null }
          );
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            coral: null,
            error:
              error instanceof Error ? error.message : "Unbekannter Fehler.",
          });
        }
      });

    // Nach dem Verlassen der Seite keinen State mehr setzen
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
