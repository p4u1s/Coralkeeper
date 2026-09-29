# TASK-08-08 · Einträge löschen

**Status:** offen
**Bezug:** FR-5.10 (löschen mit Bestätigungsdialog), FR-6.5, FR-6.4, NFR-1.3, Abnahmekriterium Abschnitt 7 Punkt 8
(„einen löschen")
**Voraussetzung:** TASK-08-07

---

## Worum geht es

Jeder Diary-Eintrag lässt sich löschen, aber nie ohne Rückfrage. Der Dialog folgt dem Löschdialog des Beckens
(TASK-04-08), der dafür als Vorlage angelegt wurde.

## Vor dem Start klären

- [ ] **Ort des Buttons.**
  - **(a)** „Löschen" auf der Bearbeiten-Seite unter dem Formular, wie im Beckendetail
  - **(b)** zusätzlich direkt an jeder Karte der Übersicht – mehr Buttons, bei Messungen einer je Wertzeile
  → Vorschlag: **(a)**.
- [ ] **Dialogtexte.** Vorschlag:
  - Messwert: Titel „Messwert löschen?", Text „Karbonathärte (KH) 8,1 dKH vom 12.03.2026 wird endgültig gelöscht."
  - Wasserwechsel: „Wasserwechsel löschen?", „Der Wasserwechsel vom 12.03.2026 wird endgültig gelöscht."
  - Ereignis: „Ereignis löschen?", „Das Ereignis vom 12.03.2026 wird endgültig gelöscht."
  - Buttons „Abbrechen" und „Löschen" wie im Beckendialog
- [ ] **Ziel nach dem Löschen.** Vorschlag: `/diary` mit `replace` – die gelöschte Bearbeiten-Seite gibt es nicht mehr.

## Schritte

1. [ ] **Dialog** mit `AlertDialog` wie in `TankDetailPage`: bleibt während des Löschens offen, Buttons deaktiviert,
       Fehler im Dialog mit `role="alert"`.
2. [ ] **Löschen** über `deleteMeasurement` bzw. `deleteTankEvent`, danach Weiterleitung nach Entscheidung.
3. [ ] Wenn Dialog und Ablauf in beiden Bearbeiten-Seiten gleich sind: als eine Komponente, z. B.
       `src/components/DeleteEntryDialog.tsx`, sonst direkt in den Seiten.

## Fertig, wenn

- [ ] Löschen antippen → Dialog erscheint, „Abbrechen" lässt den Eintrag bestehen (FR-6.5)
- [ ] Löschen bestätigen → Eintrag verschwindet aus der Übersicht (**Abnahme Punkt 8**)
- [ ] Kontrollabfrage (Nutzer): die Zeile ist weg, die übrigen Werte derselben Messung sind noch da
- [ ] Ohne Verbindung löschen → deutsche Fehlermeldung im Dialog, Eintrag bleibt (FR-6.4)
- [ ] Dialog-Buttons ≥ 44 px, per Tastatur erreichbar, bei 360 px vollständig sichtbar
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Messwert …08 und Ereignis …09 von A werden in anderen RLS-Tests (TASK-03-05, TASK-07-08) mit fester ID erwartet –
  zum Ausprobieren eigene Einträge anlegen und löschen, nicht die Testdaten.
- Ein DELETE auf eine fremde ID wirft keinen Fehler, sondern betrifft 0 Zeilen (RLS). Die Bearbeiten-Seite zeigt für
  fremde IDs vorher „nicht gefunden", der Button ist dann gar nicht erreichbar.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-5.10, FR-6.5
- `MS-04_UI-Shell-Becken/tasks/TASK-04-08_Becken-loeschen.md` – Vorlage für Löschdialoge
- `src/pages/TankDetailPage.tsx`, `src/components/ui/alert-dialog.tsx` – bestehendes Muster
