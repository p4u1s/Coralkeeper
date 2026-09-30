// Messwerte und Becken-Ereignisse für die Diary-Übersicht laden
// (FR-5.1, FR-5.3, FR-5.4, FR-6.4)

import { useEffect, useState } from "react";
import { listMeasurements, type Measurement } from "@/services/measurement.ts";
import { listTankEvents, type TankEvent } from "@/services/tankEvent.ts";

export type DiaryStatus = "loading" | "success" | "error";

export type DiaryState = {
  status: DiaryStatus;
  measurements: Measurement[];
  tankEvents: TankEvent[];
  error: string | null;
};

export function useDiary(): DiaryState & { reload: () => void } {
  const [state, setState] = useState<DiaryState>({
    status: "loading",
    measurements: [],
    tankEvents: [],
    error: null,
  });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // Beide Listen parallel. Schlägt eine fehl, gilt die ganze Übersicht als
    // fehlerhaft – eine halbe Liste würde Einträge stillschweigend verschweigen
    Promise.all([listMeasurements(), listTankEvents()])
      .then(([measurements, tankEvents]) => {
        if (!cancelled) {
          setState({
            status: "success",
            measurements,
            tankEvents,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            measurements: [],
            tankEvents: [],
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
    setState({
      status: "loading",
      measurements: [],
      tankEvents: [],
      error: null,
    });
    setReloadCount((count) => count + 1);
  }

  return { ...state, reload };
}
