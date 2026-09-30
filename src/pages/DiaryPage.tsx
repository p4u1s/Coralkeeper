import { Link } from "react-router";
import { Calendar, PaintBucket, Plus, TestTube } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DiaryEntryCard } from "@/components/DiaryEntryCard.tsx";
import { useCorals } from "@/hooks/useCorals.ts";
import { useDiary } from "@/hooks/useDiary.ts";
import { useTanks } from "@/hooks/useTanks.ts";
import { groupDiaryByDay } from "@/lib/diary.ts";
import { formatDate } from "@/lib/format.ts";

// Drei Buttons nebeneinander ab 360 px: Symbol und Text in einer Zeile.
// Unter 450 px steht beim Wasserwechsel die Kurzform „WasserW."
const ENTRY_BUTTON_CLASSES =
  "h-auto min-h-12 gap-1.5 px-2 py-2 text-label whitespace-normal text-center";

// Diary-Übersicht über alle Becken, nach Tagen gruppiert
// (FR-5.1, FR-5.3, FR-5.4, FR-6.4)
export function DiaryPage() {
  const diaryState = useDiary();
  const tanksState = useTanks();
  const coralsState = useCorals();

  // Gemeinsamer Zustand wie im HomeScreen: lädt einer → Laden, scheitert einer → Fehler
  const states = [diaryState, tanksState, coralsState];
  const status = states.some((state) => state.status === "loading")
    ? "loading"
    : states.some((state) => state.status === "error")
      ? "error"
      : "success";

  const error = diaryState.error ?? tanksState.error ?? coralsState.error;
  const { tanks } = tanksState;

  function reload() {
    diaryState.reload();
    tanksState.reload();
    coralsState.reload();
  }

  // Namen im Frontend zuordnen, kein Join (Muster aus TASK-05-01)
  const tankNames = new Map(tanks.map((tank) => [tank.id, tank.name]));
  const coralNames = new Map(
    coralsState.corals.map((coral) => [coral.id, coral.bezeichnung])
  );
  const days = groupDiaryByDay(diaryState.measurements, diaryState.tankEvents);

  return (
    <main className="flex flex-col gap-4 px-4 py-6 text-body">
      <h1 className="text-display font-semibold">Diary</h1>

      {status === "loading" && (
        <p className="text-muted-foreground">Wird geladen …</p>
      )}

      {status === "error" && (
        <>
          <p role="alert" className="text-destructive">
            {error}
          </p>
          <Button variant="secondary" className="w-full" onClick={reload}>
            Erneut versuchen
          </Button>
        </>
      )}

      {status === "success" && tanks.length === 0 && (
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <h2 className="text-h2 font-semibold">Lege zuerst ein Becken an</h2>
          <p className="text-muted-foreground">
            Jeder Diary-Eintrag gehört zu einem Becken.
          </p>
          <Link
            to="/becken/neu"
            className={buttonVariants({ className: "w-full" })}
          >
            <Plus aria-hidden="true" />
            Becken anlegen
          </Link>
        </section>
      )}

      {status === "success" && tanks.length > 0 && (
        <>
          {/* Pfade aus TASK-08-01; die Formulare entstehen in TASK-08-04 bis 08-06 */}
          <div className="grid grid-cols-3 gap-2">
            <Link
              to="/diary/messwerte/neu"
              className={buttonVariants({ className: ENTRY_BUTTON_CLASSES })}
            >
              <TestTube aria-hidden="true" />
              Messwert
            </Link>
            <Link
              to="/diary/wasserwechsel/neu"
              aria-label="Wasserwechsel"
              className={buttonVariants({
                variant: "secondary",
                className: ENTRY_BUTTON_CLASSES,
              })}
            >
              <PaintBucket aria-hidden="true" />
              {/* Unter 450 px ist der Button zu schmal für das ganze Wort */}
              <span className="min-[450px]:hidden">WasserW.</span>
              <span className="hidden min-[450px]:inline">Wasserwechsel</span>
            </Link>
            <Link
              to="/diary/ereignis/neu"
              className={buttonVariants({
                variant: "secondary",
                className: ENTRY_BUTTON_CLASSES,
              })}
            >
              <Calendar aria-hidden="true" />
              Ereignis
            </Link>
          </div>

          {days.length === 0 && (
            <p className="text-muted-foreground">Noch keine Einträge.</p>
          )}

          {days.map((day) => (
            <section key={day.date} className="flex flex-col gap-2">
              <h2 className="text-label font-medium text-muted-foreground tabular-nums">
                {formatDate(day.date)}
              </h2>
              <ul className="flex flex-col gap-2">
                {day.entries.map((entry) => (
                  <DiaryEntryCard
                    key={entry.key}
                    entry={entry}
                    tankNames={tankNames}
                    coralNames={coralNames}
                  />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </main>
  );
}

export default DiaryPage;
