// Eine Koralle laden, mit eigenem Zustand für „nicht gefunden" (FR-1.2, FR-6.4)

import { useEffect, useState } from "react";
import { getCoral, type Coral } from "@/services/coral.ts";

export type CoralStatus = "loading" | "success" | "notFound" | "error";

export type CoralState = {
  status: CoralStatus;
  coral: Coral | null;
  error: string | null;
};

export function useCoral(id: string): CoralState & { reload: () => void } {
  const [state, setState] = useState<CoralState>({
    status: "loading",
    coral: null,
    error: null,
  });

  const [reloadCount, setReloadCount] = useState(0);

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
  }, [id, reloadCount]);

  // Setzt auf „loading" zurück: die Detailseite baut sich neu auf, Inserat
  // und Historie laden dabei mit (Entscheidung TASK-07-07)
  function reload() {
    setState({ status: "loading", coral: null, error: null });
    setReloadCount((count) => count + 1);
  }

  return { ...state, reload };
}
