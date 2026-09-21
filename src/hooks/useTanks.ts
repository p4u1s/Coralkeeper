// Eigene Becken als Liste laden (FR-1.1, FR-6.4)

import { useEffect, useState } from "react";
import { listTanks, type Tank } from "@/services/tank.ts";

export type TanksStatus = "loading" | "success" | "error";

export type TanksState = {
  status: TanksStatus;
  tanks: Tank[];
  error: string | null;
};

export function useTanks(): TanksState & { reload: () => void } {
  const [state, setState] = useState<TanksState>({
    status: "loading",
    tanks: [],
    error: null,
  });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    listTanks()
      .then((tanks) => {
        if (!cancelled) {
          setState({ status: "success", tanks, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            tanks: [],
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
    setState({ status: "loading", tanks: [], error: null });
    setReloadCount((count) => count + 1);
  }

  return { ...state, reload };
}
