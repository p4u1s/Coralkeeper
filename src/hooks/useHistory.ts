// Historie einer Koralle laden (FR-3.5, FR-6.4)

import { useEffect, useState } from "react";
import { listHistory, type HistoryEntry } from "@/services/history.ts";

export type HistoryStatus = "loading" | "success" | "error";

export type HistoryState = {
  status: HistoryStatus;
  entries: HistoryEntry[];
  error: string | null;
};

export function useHistory(
  coralId: string
): HistoryState & { reload: () => void } {
  const [state, setState] = useState<HistoryState>({
    status: "loading",
    entries: [],
    error: null,
  });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    listHistory(coralId)
      .then((entries) => {
        if (!cancelled) {
          setState({ status: "success", entries, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            entries: [],
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
    setState({ status: "loading", entries: [], error: null });
    setReloadCount((count) => count + 1);
  }

  return { ...state, reload };
}
