import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";

type DeleteEntryDialogProps = {
  title: string;
  description: string;
  // Löscht und navigiert weg – bei einem Fehler bleibt der Dialog offen
  onDelete: () => Promise<void>;
};

// Löschen-Button mit Bestätigungsdialog für Diary-Einträge (FR-5.10, FR-6.5).
// Aufbau wie der Löschdialog im Beckendetail (TASK-04-08)
export function DeleteEntryDialog({
  title,
  description,
  onDelete,
}: DeleteEntryDialogProps) {
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

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete();
    } catch (err) {
      // Nur im Fehlerfall zurücksetzen – nach Erfolg navigiert die Seite weg
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Eintrag konnte nicht gelöscht werden."
      );
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button variant="secondary" className="w-full text-destructive" />
        }
      >
        <Trash2 aria-hidden="true" />
        Löschen
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {deleteError && (
          <p role="alert" className="text-destructive">
            {deleteError}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Abbrechen</AlertDialogCancel>
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
  );
}
