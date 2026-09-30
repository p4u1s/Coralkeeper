// Einen Wasserwechsel oder ein Ereignis laden, mit eigenem Zustand für
// „nicht gefunden" (FR-5.10, FR-6.4)

import { useEffect, useState } from "react";
import { getTankEvent, type TankEvent } from "@/services/tankEvent.ts";

export type TankEventStatus = "loading" | "success" | "notFound" | "error";

export type TankEventState = {
  status: TankEventStatus;
  tankEvent: TankEvent | null;
  error: string | null;
};

export function useTankEvent(id: string): TankEventState {
  const [state, setState] = useState<TankEventState>({
    status: "loading",
    tankEvent: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getTankEvent(id)
      .then((tankEvent) => {
        if (!cancelled) {
          setState(
            tankEvent
              ? { status: "success", tankEvent, error: null }
              : { status: "notFound", tankEvent: null, error: null }
          );
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            tankEvent: null,
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
