// Eigene Korallen als Liste laden (FR-1.2, FR-6.4)

import { useEffect, useState } from "react";
import { listCorals, type Coral } from "@/services/coral.ts";

export type CoralsStatus = "loading" | "success" | "error";

export type CoralsState = {
  status: CoralsStatus;
  corals: Coral[];
  error: string | null;
};

export function useCorals(): CoralsState & { reload: () => void } {
  const [state, setState] = useState<CoralsState>({
    status: "loading",
    corals: [],
    error: null,
  });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    listCorals()
      .then((corals) => {
        if (!cancelled) {
          setState({ status: "success", corals, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            corals: [],
            error:
              error instanceof Error ? error.message : "Unbekannter Fehler.",
          });
        }
      });

    // Nach dem Verlassen der Seite keinen State mehr setzen
    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  function reload() {
    setState({ status: "loading", corals: [], error: null });
    setReloadCount((count) => count + 1);
  }

  return { ...state, reload };
}
