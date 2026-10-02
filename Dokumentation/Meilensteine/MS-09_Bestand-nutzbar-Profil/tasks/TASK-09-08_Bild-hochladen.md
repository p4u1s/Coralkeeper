# TASK-09-08 · Bild-Service und Bild hochladen

**Status:** offen
**Bezug:** NFR-2.5 („unverändert hochgeladen … 5 MB … im Formular validiert"), FR-1.2 („ein Bild optional"), NFR-1.1
(„inklusive Foto … in einem Formular"), FR-6.5, FR-6.6, NFR-3.1 · ER-Modell Festlegung 9 und „Bildablage"
**Voraussetzung:** TASK-09-03 (Bucket), TASK-09-04 (`image.ts`), TASK-09-05 (Bearbeiten-Formular)

---

## Worum geht es

Zu einer Koralle lässt sich ein Bild hochladen, ersetzen und entfernen. Die Datei geht unverändert in den Bucket, ein
Datensatz in `bild_dokument` verweist darauf, `koralle.primaerbild` zeigt auf den Datensatz. Dazu kommt das Lesen:
signierte URLs für die Anzeige auf der Detailseite (TASK-09-09) und im Bestand (TASK-09-11).

## Vor dem Start klären

- [ ] **Ort des Uploads.**
  - **(a)** Feld „Bild" in `CoralForm` – beim Anlegen und beim Bearbeiten (NFR-1.1, Mockup-Formular „Bild auswählen")
  - **(b)** eigene Aktion auf der Detailseite – die Koralle existiert dann schon, weniger Fehlerfälle
  → Vorschlag: **(a)**, weil NFR-1.1 das Foto ausdrücklich in das Anlegeformular legt.
- [ ] **Ersetzen und Entfernen** (beim Bearbeiten).
  - Altes Bild beim Ersetzen: **(a)** Datei und Datensatz löschen, **(b)** behalten für eine spätere Wachstumsgalerie
    (FR-1.12, Should in MS-10) → Vorschlag: **(a)** (KISS, keine verwaisten Dateien).
  - „Bild entfernen" ist eine löschende Aktion (FR-6.5). Vorschlag: Bestätigungsdialog „Bild entfernen?"; das Bild
    verschwindet danach sofort, nicht erst beim Speichern.
- [ ] **Fehlerfall beim Anlegen mit Bild.** Die Koralle ist gespeichert, das Bild scheitert.
  - **(a)** trotzdem zur Detailseite, dort die Meldung „Die Koralle wurde angelegt, das Bild konnte aber nicht
    gespeichert werden." (über den Navigationszustand)
  - **(b)** im Formular bleiben – ein zweites Speichern legte die Koralle doppelt an
  → Vorschlag: **(a)**.
- [ ] **Pfad zum Bild lesen.** `koralle.primaerbild` enthält nur die ID des Datensatzes, nicht den Pfad.
  - **(a)** Join in `listCorals`/`getCoral` – weicht von TASK-05-01 („kein Join") ab
  - **(b)** eigene Abfrage in `image.ts`: Datensätze zu den IDs lesen, dann alle signierten URLs mit **einem**
    Aufruf erzeugen
  → Vorschlag: **(b)**, Gültigkeit der URLs eine Stunde.
- [ ] **Kleinigkeiten.** Vorschlag: Vorschau des gewählten Bilds im Formular; `aufnahmedatum` und `bezeichnung`
      bleiben leer; Alternativtext „Foto von {Bezeichnung}"; Dateinamen `src/services/image.ts` (aus TASK-09-04) und
      `src/hooks/useImageUrls.ts`.

## Schritte

1. [ ] **Prüfung** in `src/lib/validation.ts`: Dateityp nach TASK-09-01, Größe ≤ 5 MB. Meldungen z. B. „Das Bild ist
       größer als 5 MB. Bitte ein kleineres Bild wählen." und „Bitte ein Bild im Format JPEG, PNG oder WebP wählen."
2. [ ] **`image.ts` erweitern:**
   - Hochladen: ID per `crypto.randomUUID()`, Pfad nach Festlegung, Datei **ohne** Umwandlung hochladen, Datensatz in
     `bild_dokument` mit dieser ID anlegen, `koralle.primaerbild` setzen; scheitert ein Schritt nach dem Hochladen,
     die Datei wieder entfernen
   - Entfernen: `primaerbild` leeren, Datensatz und Datei löschen
   - Lesen: signierte URLs zu einer Liste von Bild-IDs
3. [ ] **Hook** für die URLs mit Lade- und Fehlerzustand, Muster `useCorals`.
4. [ ] **Formularfeld** in `CoralForm`: sichtbares Label „Bild", Auswahl als Fläche mit Symbol und Text „Bild
       auswählen" (Mockup), Vorschau, Feldfehler; beim Bearbeiten das vorhandene Bild mit „Anderes Bild wählen" und
       „Bild entfernen".
5. [ ] **Anlegen und Bearbeiten** verdrahten: `CoralCreatePage` legt erst die Koralle an, dann das Bild;
       `CoralEditPage` speichert Stammdaten und ggf. das neue Bild.
6. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn"; Dateien und Datensätze im Dashboard ansehen.

## Fertig, wenn

- [ ] Anlegen ohne Bild funktioniert wie bisher (FR-1.2)
- [ ] Anlegen mit einem JPEG um 3 MB → Datei liegt unter `<nutzer_id>/<koralle_id>/<id>.jpg` mit **gleicher Größe**
      wie das Original (NFR-2.5), `primaerbild` ist gesetzt
- [ ] Bild über 5 MB oder falscher Typ → Feldfehler, im Network-Tab **kein** Upload (NFR-2.5, FR-6.6)
- [ ] Ersetzen → neue Datei da, alte nach Entscheidung entfernt; Entfernen → `primaerbild` leer, Datei weg
- [ ] Während des Hochladens ist der Speichern-Button gesperrt („Wird gespeichert …")
- [ ] Ohne Verbindung → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Auswahlfläche und Buttons mindestens 44 px hoch, mit Tastatur erreichbar, kein Symbol ohne Text (NFR-1.3, NFR-1.4)
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Die Anzeige auf Detailseite und Kachel folgt in TASK-09-09 und 09-11; hier reicht die Vorschau im Formular.
- Ableger übernehmen das Bild nicht (Festlegung 17) – unverändert.
- Das Testbild …04 von A hat keine Datei. Erzeugt die URL dafür einen Fehler, muss die Anzeige ihn abfangen
  (Platzhalter statt Absturz) – in TASK-09-09 und 09-11 prüfen.
- Das Mobilgerät bietet bei einem Dateifeld für Bilder meist auch die Kamera an – kein eigener Kamera-Code.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – `bild_dokument`, Festlegung 9, Festlegung „Bildablage"
- `src/components/CoralForm.tsx`, `src/pages/CoralCreatePage.tsx`, `src/services/coral.ts`
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Formular „NEUE KORALLE", Feld „Bild"
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.2, FR-6.5, NFR-1.1, NFR-2.5, NFR-3.1
