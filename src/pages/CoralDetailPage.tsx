import type { ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoralProfile } from "@/components/CoralProfile.tsx";
import { useCoral } from "@/hooks/useCoral.ts";
import { useTank } from "@/hooks/useTank.ts";
import { formatDate } from "@/lib/format.ts";

// Stammdaten der Koralle mit den Tabs Steckbrief und Historie (FR-2.1, FR-6.4)

type DetailTab = "steckbrief" | "historie";

// Base UI typisiert den Tabwert als any – hier wird er auf die beiden
// erlaubten Werte eingegrenzt (NFR-4.1)
function isDetailTab(value: unknown): value is DetailTab {
  return value === "steckbrief" || value === "historie";
}

export function CoralDetailPage() {
  // Fehlende ID endet in getCoral als null → „nicht gefunden"
  const { id = "" } = useParams();
  const { status, coral, error } = useCoral(id);
  const [searchParams, setSearchParams] = useSearchParams();

  // Der aktive Tab steht in der URL, damit F5 und die Rückkehr aus einem
  // Formular im richtigen Tab landen; ein unbekannter Wert fällt zurück
  const tabParam = searchParams.get("tab");
  const activeTab: DetailTab = isDetailTab(tabParam) ? tabParam : "steckbrief";

  // Der Beckenname steht nicht in koralle (TASK-05-01: kein Join). Vor dem
  // Laden der Koralle läuft der Hook mit leerer ID und liefert nichts
  const { tank } = useTank(coral?.becken_id ?? "");

  const details = coral
    ? [coral.art, coral.handelsname].filter(Boolean).join(" · ")
    : "";

  return (
    <main className="flex flex-col gap-4 px-4 py-6 text-body">
      <Link
        to="/"
        className={buttonVariants({
          variant: "secondary",
          className: "self-start",
        })}
      >
        <ArrowLeft aria-hidden="true" />
        Zurück zum Bestand
      </Link>

      {status === "loading" && (
        <p className="text-muted-foreground">Wird geladen …</p>
      )}

      {status === "error" && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}

      {status === "notFound" && (
        <p className="text-muted-foreground">Koralle nicht gefunden.</p>
      )}

      {status === "success" && coral && (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-display font-semibold wrap-break-word">
              {coral.bezeichnung}
            </h1>
            {details && (
              <p className="text-label wrap-break-word text-muted-foreground">
                {details}
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <DetailEntry label="Becken">
              <span className="wrap-break-word">
                {tank ? tank.name : "Wird geladen …"}
              </span>
            </DetailEntry>
            <DetailEntry label="Zugang am">
              {coral.erwerbsdatum ? (
                <span className="tabular-nums">
                  {formatDate(coral.erwerbsdatum)}
                </span>
              ) : (
                <span className="text-ink-3">keine Angabe</span>
              )}
            </DetailEntry>
          </dl>

          <Tabs
            className="gap-4"
            value={activeTab}
            onValueChange={(value: unknown) => {
              setSearchParams(
                { tab: isDetailTab(value) ? value : "steckbrief" },
                { replace: true }
              );
            }}
          >
            <TabsList>
              <TabsTrigger value="steckbrief">Steckbrief</TabsTrigger>
              <TabsTrigger value="historie">Historie</TabsTrigger>
            </TabsList>
            <TabsContent value="steckbrief">
              <CoralProfile coral={coral} />
            </TabsContent>
            <TabsContent value="historie">
              <p className="text-muted-foreground">
                Die Historie folgt in Kürze.
              </p>
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  );
}

function DetailEntry({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default CoralDetailPage;
