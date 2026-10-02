# TASK-09-06 · Koralle löschen

**Status:** offen
**Bezug:** FR-1.10 („Ableger bleiben erhalten, der Verweis auf die Ursprungskoralle wird geleert"), FR-6.5 · ER-Modell
Festlegung 2, Löschverhalten
**Voraussetzung:** TASK-09-05 (falls der Button auf der Bearbeiten-Seite sitzt), TASK-09-03 (Dateien aufräumen)

---

## Worum geht es

Eine Koralle lässt sich nach einer Rückfrage endgültig löschen. Mit ihr verschwinden Steckbrief, Historie, Bild und
Inserat; Ableger bleiben und verlieren nur den Verweis auf die Ursprungskoralle.

## Vor dem Start klären

- [ ] **Ort des Buttons.**
  - **(a)** auf der Bearbeiten-Seite unter „Abbrechen" – wie bei den Diary-Einträgen (TASK-08-08)
  - **(b)** auf der Detailseite
  → Vorschlag: **(a)**.
- [ ] **Dialogtext.** Vorschlag: Titel „Koralle löschen?", Beschreibung „„{Bezeichnung}“ wird mit Steckbrief,
      Historie, Bild und Inserat endgültig gelöscht. Ableger bleiben erhalten." Buttons „Abbrechen" und „Löschen".
- [ ] **Ziel nach dem Löschen.** Vorschlag: Bestand `/` mit `replace` – die Detailseite gibt es nicht mehr.
- [ ] **Dialog-Komponente.** `DeleteEntryDialog` passt schon (Titel, Beschreibung, `onDelete`).
  - **(a)** wiederverwenden wie sie ist
  - **(b)** in einen allgemeinen Namen umbenennen, z. B. `DeleteDialog` – ändert die Diary-Seiten mit
  → Vorschlag: **(a)**. Die Ersatzmeldung „Eintrag konnte nicht gelöscht werden." greift nur, wenn der Fehler kein
  `Error` ist; `deleteCoral` wirft eine eigene Meldung.

## Schritte

1. [ ] Button und Dialog nach Entscheidung einbauen, `deleteCoral` aus TASK-09-04 aufrufen.
2. [ ] Nach Erfolg zum Ziel navigieren; bei Fehler bleibt der Dialog mit Meldung offen.
3. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] Abbrechen → nichts gelöscht; Bestätigen → Koralle ist aus dem Bestand verschwunden
- [ ] Eine gelöschte Ursprungskoralle hinterlässt ihre Ableger im Bestand, deren Detailseite funktioniert weiter
- [ ] Eine Koralle mit Inserat lässt sich ohne Fehler löschen
- [ ] Während des Löschens sind die Dialog-Buttons gesperrt, ohne Verbindung erscheint eine deutsche Fehlermeldung
- [ ] Ein Becken, dessen letzte Koralle gelöscht wurde, lässt sich danach löschen (FR-1.1)
- [ ] Bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Ob die Dateien im Storage mit verschwinden, lässt sich erst prüfen, wenn es Bilder gibt (TASK-09-08) – Zeile im
  Abnahmeprotokoll von TASK-09-14.
- Diary-Ereignisse, die die Koralle nennen, bleiben; der Verweis wird geleert (`ON DELETE SET NULL`). Die Diary-Karte
  zeigt dann keine Koralle mehr.
- Die `herkunftskette` der Ableger ist Text und bleibt unverändert lesbar (Grundsatz 4) – angezeigt wird sie erst ab
  MS-10.

## Quellen

- `src/components/DeleteEntryDialog.tsx`, `src/pages/TankEventEditPage.tsx` – bestehendes Muster
- `Dokumentation/Meilensteine/MS-08_Diary/tasks/README.md` – Entscheidung 19
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Festlegung 2, Löschverhalten
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.1, FR-1.10, FR-6.5
