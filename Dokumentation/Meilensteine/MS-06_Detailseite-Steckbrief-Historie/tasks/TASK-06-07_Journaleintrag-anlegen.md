# TASK-06-07 · Journaleintrag anlegen

**Status:** offen
**Bezug:** FR-3.5 (manueller Journaleintrag mit Datum und Freitext), FR-3.3, FR-6.4, FR-6.6, NFR-1.3, NFR-1.4,
Abnahmekriterium Abschnitt 7 Punkt 6
**Voraussetzung:** TASK-06-06

---

## Worum geht es

Aus dem Historie-Tab heraus legt der Nutzer einen Journaleintrag mit Datum und Freitext an. Der Eintrag erscheint
danach in derselben Liste wie die Systemeinträge und lässt sich nicht mehr ändern.

## Vor dem Start klären

- [ ] **Wo wird erfasst?**
  - **(a)** Eigene Formularseite, Vorschlag `/koralle/:id/journal/neu`, ohne Bottom-Navigation
  - **(b)** Formular direkt im Historie-Tab
  → Entscheiden. Möglichst gleich wie bei TASK-06-05.
- [ ] **Validierung.**
  - Datum Pflicht, vorbelegt mit heute. Zukunftsdatum ablehnen (wie `checkStartDate`)? Vorschlag: ja.
  - Text Pflicht (ein Journaleintrag ohne Text sagt nichts), Höchstlänge Vorschlag 2.000 Zeichen.
  → Festlegen.
- [ ] **Hinweis auf Unveränderlichkeit.**
  - **(a)** Sichtbarer Text über dem Speichern-Button: „Der Eintrag kann nach dem Speichern nicht mehr geändert oder
    gelöscht werden."
  - **(b)** Bestätigungsdialog vor dem Speichern
  → Entscheiden. Vorschlag (a) – FR-6.5 verlangt Dialoge nur vor löschenden Aktionen.

## Schritte

1. [ ] **Route** nach Entscheidung. Bei (a) in `src/App.tsx` **außerhalb** von `AppLayout` und im Kopfkommentar als
       „Festgelegt in TASK-06-07" ergänzen.
2. [ ] **Validierung** `validateJournalEntry` in `src/lib/validation.ts` mit Feldfehlern nach Entscheidung.
3. [ ] **Formular:** Datum (`type="date"`) und Textbereich, beide mit Label über dem Feld, `*` und Legende
       „\* Pflichtfeld" am Formularkopf; Hinweis nach Entscheidung.
4. [ ] **Speichern** über `createJournalEntry` aus TASK-06-02; Button während des Speicherns deaktiviert; Serverfehler
       als deutsche Meldung mit `role="alert"`, Eingaben bleiben stehen.
5. [ ] **Nach „Speichern" und „Abbrechen"** zurück zur Detailseite, Historie-Tab; nach dem Speichern steht der neue
       Eintrag in der Liste.
6. [ ] **Button „Journaleintrag hinzufügen"** im Historie-Tab (Primärbutton, Höhe 48, Symbol nur mit Text).
7. [ ] Nicht gefundene oder fremde Koralle wie auf der Detailseite behandeln.

## Fertig, wenn

- [ ] Journaleintrag mit Datum und Text speichern → erscheint im Historie-Tab neben dem Systemeintrag
      (**Abnahme Punkt 6**)
- [ ] Ohne Text oder ohne Datum speichern → Feldfehler, keine Anfrage (FR-6.6)
- [ ] Zukunftsdatum und zu langer Text werden nach Entscheidung abgelehnt
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Der gespeicherte Eintrag bietet keine Aktion zum Ändern oder Löschen (FR-3.3)
- [ ] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Kein Bildfeld: Bild-Upload kommt mit MS-9 (NFR-2.5); `bild_id` bleibt `null`.
- Doppeltes Antippen von „Speichern" darf keinen zweiten Eintrag erzeugen – der deaktivierte Button verhindert das;
  ein doppelter Eintrag ließe sich wegen FR-3.3 nicht mehr entfernen.

## Quellen

- `design.md` – Abschnitt 4 (Eingabefeld, Primärbutton), Abschnitt 5 (Pflichtfelder mit `*`)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-3.3, FR-3.5, FR-6.4, FR-6.5, FR-6.6,
  Abschnitt 7 Punkt 6
- `src/lib/validation.ts`, `src/pages/TankCreatePage.tsx` – bestehendes Muster
