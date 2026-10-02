# TASK-09-04 · Korallen-Service: Stammdaten ändern, Status wechseln, löschen

**Status:** offen
**Bezug:** FR-1.9, FR-1.10, FR-1.11, FR-3.5 · NFR-4.1, NFR-4.3 · ER-Modell Festlegungen 15 und „Bildablage" (TASK-09-01)
**Voraussetzung:** TASK-09-02 (DELETE-Policy, Beckenwechsel-Trigger), TASK-09-03 (Bucket)

---

## Worum geht es

`src/services/coral.ts` bekommt die drei fehlenden Schreibzugriffe: Stammdaten ändern, Status wechseln und Koralle
löschen. Die Systemeinträge für Status- und Beckenwechsel schreiben die Trigger; der Service setzt nur die Spalten.
Beim Löschen entfernt der Service zusätzlich die Dateien der Koralle aus dem Storage – das macht keine Kaskade.

## Vor dem Start klären

- [ ] **Statuswechsel mit Notiz: Reihenfolge und Fehlerfall.** Die Notiz wird ein Journaleintrag (Festlegung vom
      23.09.2026, MS-6 README Anmerkung zu Nr. 1).
  - Vorschlag: erst den Status ändern, dann `createJournalEntry` aus `history.ts` mit dem Tagesdatum (`todayIso()`) –
    dasselbe Datum, das der Trigger für den Systemeintrag nimmt.
  - Scheitert nur der zweite Aufruf, ist der Status trotzdem geändert. Vorschlag für die Meldung: „Der Status wurde
    geändert, die Notiz konnte aber nicht gespeichert werden."
- [ ] **Löschen: erst Datenbank oder erst Dateien?**
  - **(a)** erst die Zeile löschen, dann den Ordner `<nutzer_id>/<koralle_id>/` leeren. Scheitert das Aufräumen,
    bleiben Dateien ohne Datensatz liegen – unsichtbar, sie belegen nur Speicher.
  - **(b)** erst die Dateien, dann die Zeile. Scheitert die Zeile, zeigt die Koralle auf Dateien, die es nicht mehr gibt.
  → Vorschlag: **(a)**. Ein Fehler beim Aufräumen wird dem Nutzer nicht gemeldet – die Koralle ist gelöscht.
- [ ] **Sperre bei Inserat** (falls TASK-09-01 „sperren" ergibt): nur in der Oberfläche oder zusätzlich im Service?
      → Vorschlag: nur in der Oberfläche, wie „Inserieren nur aus `im_bestand`" (Festlegung 18).
- [ ] **Wo liegen die Storage-Zugriffe?** Vorschlag: neue Datei `src/services/image.ts` mit dem Bucket-Namen als
      Konstante und hier nur `removeCoralImages(coralId)`; TASK-09-08 ergänzt Hochladen und URLs.

## Schritte

1. [ ] **`updateCoral(id, input: CoralInput)`** – dieselben Spalten wie `createCoral`, `toRow` wiederverwenden;
       Status und Steckbrief bleiben unberührt. Ein geändertes Becken löst den Trigger aus TASK-09-02 aus.
2. [ ] **`changeCoralStatus(id, status, note)`** nach Entscheidung oben; leere Notiz → kein Journaleintrag.
3. [ ] **`removeCoralImages(coralId)`** in `src/services/image.ts`: Dateien im Ordner der Koralle auflisten und
       entfernen; `nutzer_id` aus `getSession()` wie in `createCoral`.
4. [ ] **`deleteCoral(id)`** nach Entscheidung oben.
5. [ ] Deutsche Fehlermeldungen mit `cause`, Muster `updateTank`/`deleteTank`.

## Fertig, wenn

- [ ] Die Funktionen sind typisiert aus den generierten Typen, kein `any`, kein Supabase-Aufruf außerhalb von
      `src/services/` (NFR-4.1, NFR-4.3, NFR-4.4)
- [ ] `changeCoralStatus` schreibt keinen Systemeintrag selbst (macht der Trigger) und nur bei Notiz einen Journaleintrag
- [ ] Jede Funktion wirft bei Fehlern eine deutsche Meldung mit `cause`
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Ob die Funktionen wirken, zeigen erst die Oberflächen in TASK-09-05 bis 09-07 – dieser Task hat keine eigene
  Browser-Prüfung.
- `updateCoralProfile` (Steckbrief) bleibt getrennt; der Schutzstatus kommt in TASK-09-10 dorthin.
- Supabase meldet beim Löschen einer fremden oder unbekannten ID keinen Fehler, sondern löscht 0 Zeilen. Die
  Oberfläche erreicht `deleteCoral` nur von der eigenen Koralle aus.

## Quellen

- `src/services/coral.ts`, `src/services/tank.ts`, `src/services/history.ts` – bestehendes Muster
- `Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/tasks/README.md` – Anmerkung zu Nr. 1 (Notiz als
  Journaleintrag, kein Datumsfeld)
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Festlegungen 15 und 18, Löschverhalten
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.9, FR-1.10
