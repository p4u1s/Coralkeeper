import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTank } from "@/hooks/useTank.ts";
import { formatTankDetails } from "@/lib/format.ts";
import { deleteTank } from "@/services/tank.ts";

//STammdaten eines Beckens (FR.1-1) Diary-Tabs kommen in MS-8

export function TankDetailPage() {
  // Fehlende ID endet in getTank als null → „nicht gefunden"
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { status, tank, error } = useTank(id);
  const details = tank ? formatTankDetails(tank) : "";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Während des Löschens bleibt der Dialog offen (auch bei Esc)
  function handleOpenChange(open: boolean) {
    if (deleting) {
      return;
    }
    setDialogOpen(open);
    setDeleteError(null);
  }

  // Löschsperre bei Korallen kommt als Meldung aus deleteTank (FR-1.1)
  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTank(id);
      await navigate("/becken");
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Becken konnte nicht gelöscht werden."
      );
      setDeleting(false);
    }
  }

  return (
    <main className="flex flex-col gap-4 px-4 py-6 text-body">
      <Link
        to="/becken"
        className={buttonVariants({
          variant: "secondary",
          className: "self-start",
        })}
      >
        <ArrowLeft aria-hidden="true" />
        Zurück zu Becken
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
        <p className="text-muted-foreground">Becken nicht gefunden.</p>
      )}

      {status === "success" && tank && (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-display font-semibold wrap-break-word">
              {tank.name}
            </h1>
            {details && (
              <p className="text-label text-muted-foreground tabular-nums">
                {details}
              </p>
            )}
          </div>
          {tank.beschreibung && (
            <p className="wrap-break-word whitespace-pre-line">
              {tank.beschreibung}
            </p>
          )}
          <div className="flex flex-col gap-4">
            <Link
              to={`/becken/${tank.id}/bearbeiten`}
              className={buttonVariants({
                variant: "secondary",
                className: "w-full",
              })}
            >
              <Pencil aria-hidden="true" />
              Bearbeiten
            </Link>

            <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="secondary"
                    className="w-full text-destructive"
                  />
                }
              >
                <Trash2 aria-hidden="true" />
                Löschen
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Becken löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    „{tank.name}“ und alle Diary-Einträge dieses Beckens werden
                    endgültig gelöscht.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteError && (
                  <p role="alert" className="text-destructive">
                    {deleteError}
                  </p>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Abbrechen
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="secondary"
                    className="text-destructive"
                    disabled={deleting}
                    onClick={handleDelete}
                  >
                    {deleting ? "Wird gelöscht …" : "Löschen"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </main>
  );
}

export default TankDetailPage;
