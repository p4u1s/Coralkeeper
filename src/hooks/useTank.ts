// Ein Becken laden, mit eigenem Zustand für „nicht gefunden" (FR-1.1, FR-6.4)

import { useEffect, useState } from "react";
import { getTank, type Tank } from "@/services/tank.ts";

export type TankStatus = "loading" | "success" | "notFound" | "error";

export type TankState = {
  status: TankStatus;
  tank: Tank | null;
  error: string | null;
};

export function useTank(id: string): TankState {
  const [state, setState] = useState<TankState>({
    status: "loading",
    tank: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getTank(id)
      .then((tank) => {
        if (!cancelled) {
          setState(
            tank
              ? { status: "success", tank, error: null }
              : { status: "notFound", tank: null, error: null }
          );
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            tank: null,
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
