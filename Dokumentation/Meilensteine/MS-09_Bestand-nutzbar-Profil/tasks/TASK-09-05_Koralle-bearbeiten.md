# TASK-09-05 · Koralle bearbeiten

**Status:** offen
**Bezug:** FR-1.10, FR-1.11, FR-1.14, FR-6.4, FR-6.6 · NFR-1.3, NFR-1.4
**Voraussetzung:** TASK-09-04

---

## Worum geht es

Die Stammdaten einer Koralle – Bezeichnung, Becken, Art, Handelsname, Erwerbsdatum – lassen sich ändern. Das Formular
ist `CoralForm` aus MS-5, das dafür schon `initialValues` hat. Ein Beckenwechsel erscheint danach als Systemeintrag in
der Historie (FR-1.11).

## Vor dem Start klären

- [ ] **Button auf der Detailseite.** Das Mockup zeigt „Koralle bearbeiten" als Primärbutton unter den Stammdaten.
  - **(a)** Primärbutton wie im Mockup
  - **(b)** Sekundärbutton mit Stift-Symbol wie „Steckbrief bearbeiten" – die Detailseite hat im Historie-Tab schon
    einen Primärbutton
  → Vorschlag: **(b)**, unter den Stammdaten über „Ableger erzeugen". Die endgültige Anordnung aller Aktionen klärt
  TASK-09-09.
- [ ] **Ziel nach dem Speichern.** Vorschlag: Detailseite der Koralle mit `replace`, damit „Zurück" im Browser nicht
      ins Formular führt (wie TASK-07-03). `TankEditPage` navigiert ohne `replace` – bewusst abweichen oder angleichen?
- [ ] **Seitentitel und Button.** Vorschlag: „Koralle bearbeiten", Button „Speichern", „Abbrechen" zurück zur
      Detailseite.

## Schritte

1. [ ] **`CoralEditPage`** in `src/pages/`, Aufbau aus `TankEditPage` (Koralle laden, `notFound`) und
       `CoralCreatePage` (Beckenliste mit „Erneut versuchen"); `CoralForm` erst nach dem Laden rendern, weil es
       `initialValues` nur beim ersten Rendern übernimmt.
2. [ ] **Route** `/koralle/:id/bearbeiten` außerhalb von `AppLayout`; Pfad im Kommentarkopf von `App.tsx` ergänzen.
3. [ ] **Button** auf der Detailseite nach Entscheidung.
4. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] Das Formular zeigt die gespeicherten Werte, Änderungen erscheinen nach dem Speichern auf der Detailseite
- [ ] Ein geleertes optionales Feld wird als „keine Angabe" angezeigt, nicht als leerer Text
- [ ] Becken ändern → im Historie-Tab steht ein Systemeintrag zum Beckenwechsel; ohne Beckenänderung kein neuer Eintrag
- [ ] Pflichtfeld Bezeichnung leer → Feldfehler, keine Anfrage (FR-6.6)
- [ ] Ladezustand, „Koralle nicht gefunden." und Fehler beim Laden sind sichtbar (FR-6.4)
- [ ] F5 auf `/koralle/<ID>/bearbeiten` zeigt die Seite erneut
- [ ] Bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Das Bild kommt erst in TASK-09-08 ins Formular, der Löschen-Button in TASK-09-06.
- Ein geänderter Name taucht in älteren Systemeinträgen nicht auf („Ableger von „…“ angelegt" behält den alten
  Namen) – gewollt, die Historie ist ein Nachweis (TASK-07-01).
- Die Meldung von `deleteTank` („Setze sie zuerst um oder lösche sie.") ist ab hier umsetzbar.

## Quellen

- `src/components/CoralForm.tsx`, `src/pages/TankEditPage.tsx`, `src/pages/CoralCreatePage.tsx`,
  `src/pages/CoralDetailPage.tsx`
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „KORALLE DETAIL"
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.10, FR-1.11
