// Bilder im Storage (Festlegung 20). Hochladen und Anzeige folgen in TASK-09-08.
//
// Pfadschema: <nutzer_id>/<koralle_id>/<bild_dokument.id>.<endung>

import { supabase } from "@/services/supabase.ts";

export const IMAGE_BUCKET = "medien";

// Leert den Ordner einer Koralle. Ohne Angabe liefert list() höchstens
// 100 Dateien – in MS-9 gibt es je Koralle nur das Primärbild.
export async function removeCoralImages(coralId: string): Promise<void> {
  // getSession statt getUser, Begründung siehe createTank
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Nicht angemeldet.", { cause: sessionError });
  }

  const folder = `${sessionData.session.user.id}/${coralId}`;
  const bucket = supabase.storage.from(IMAGE_BUCKET);

  const { data: files, error: listError } = await bucket.list(folder);

  if (listError) {
    throw new Error("Bilder konnten nicht entfernt werden.", {
      cause: listError,
    });
  }
  if (files.length === 0) {
    return;
  }

  const { error: removeError } = await bucket.remove(
    files.map((file) => `${folder}/${file.name}`)
  );

  if (removeError) {
    throw new Error("Bilder konnten nicht entfernt werden.", {
      cause: removeError,
    });
  }
}
