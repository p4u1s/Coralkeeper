// Einen Messwert laden, mit eigenem Zustand für „nicht gefunden" (FR-5.10, FR-6.4)

import { useEffect, useState } from "react";
import { getMeasurement, type Measurement } from "@/services/measurement.ts";

export type MeasurementStatus = "loading" | "success" | "notFound" | "error";

export type MeasurementState = {
  status: MeasurementStatus;
  measurement: Measurement | null;
  error: string | null;
};

export function useMeasurement(id: string): MeasurementState {
  const [state, setState] = useState<MeasurementState>({
    status: "loading",
    measurement: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getMeasurement(id)
      .then((measurement) => {
        if (!cancelled) {
          setState(
            measurement
              ? { status: "success", measurement, error: null }
              : { status: "notFound", measurement: null, error: null }
          );
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            measurement: null,
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
