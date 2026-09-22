# TASK-06-05 · Steckbrief anlegen und ändern

**Status:** offen
**Bezug:** FR-2.1, FR-2.2 (alle Felder optional), FR-6.4 (Lade- und Fehlerzustand im Formular), FR-6.6
(Feldfehler), NFR-1.3, NFR-1.4, Abnahmekriterium Abschnitt 7 Punkt 5
**Voraussetzung:** TASK-06-04

---

## Worum geht es

Aus dem Steckbrief-Tab heraus lässt sich der Steckbrief ausfüllen und jederzeit wieder ändern. Weil alle Felder
optional sind, muss jede Auswahl auch wieder auf „keine Angabe" zurückgesetzt werden können.

## Vor dem Start klären

- [ ] **Wo wird bearbeitet?**
  - **(a)** Eigene Formularseite, Vorschlag `/koralle/:id/steckbrief`, ohne Bottom-Navigation – wie
    `/becken/:id/bearbeiten`
  - **(b)** Direkt im Tab mit Umschalter Anzeigen/Bearbeiten
  → Entscheiden. (a) folgt dem vorhandenen Muster und der Regel „keine Bottom-Navigation in Formularen".
- [ ] **Beschriftung des Buttons im Tab.** Vorschlag: „Steckbrief ausfüllen", solange kein Feld gefüllt ist, sonst
      „Steckbrief bearbeiten". → Festlegen.
- [ ] **Auswahlfeld.** Dieselbe Komponente wie das Becken-Auswahlfeld aus TASK-05-02. → Nur bestätigen.

## Schritte

1. [ ] **Route** nach Entscheidung eintragen. Bei (a) in `src/App.tsx` **außerhalb** von `AppLayout` und den Pfad im
       Kopfkommentar von `App.tsx` als „Festgelegt in TASK-06-05" ergänzen (der Pfad steht nicht in Abschnitt 7).
2. [ ] **Formular** als eigene Komponente, z. B. `src/components/CoralProfileForm.tsx`:
   - Auswahlfelder für Lichtbedarf, Strömung, Platzierung, Nesselkraft, Schwierigkeitsgrad – jeweils mit der ersten
     Option „keine Angabe"
   - Textfeld Wuchsform, Textbereich Fütterung (nach Entscheidung aus TASK-06-03)
   - jedes Feld mit sichtbarem Label über dem Feld; **kein** `*`, keine Legende „\* Pflichtfeld" (es gibt keine
     Pflichtfelder)
   - Formular mit den gespeicherten Werten vorbelegt
3. [ ] **Laden:** solange die Koralle lädt „Wird geladen …", bei Fehler Meldung mit „Erneut versuchen", nicht gefunden
       wie auf der Detailseite.
4. [ ] **Speichern:** Validierung aus TASK-06-03, Feldfehler unter dem Feld; Button während des Speicherns
       deaktiviert; Serverfehler als deutsche Meldung mit `role="alert"`, Eingaben bleiben stehen.
5. [ ] **Nach „Speichern" und „Abbrechen"** zurück zur Detailseite, Steckbrief-Tab.
6. [ ] **Button im Steckbrief-Tab** (Sekundärbutton, Höhe 48) führt zum Formular.

## Fertig, wenn

- [ ] Steckbrief einer neuen Koralle ausfüllen und speichern → Werte stehen im Tab (**Abnahme Punkt 5**)
- [ ] Denselben Steckbrief erneut ändern, einen Wert auf „keine Angabe" zurücksetzen → Tab zeigt „keine Angabe"
- [ ] Speichern ganz ohne Eingaben ist möglich und ändert nichts
- [ ] Zu langer Text in Wuchsform oder Fütterung → Feldfehler, keine Anfrage (FR-6.6)
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Als Testnutzer B zeigt der Aufruf für `aaaaaaaa-0000-0000-0000-000000000002` „nicht gefunden" (FR-6.2)
- [ ] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Ein Steckbrief-Update schreibt keinen Historieneintrag (siehe TASK-06-03).
- Muster für Formularseite, Vorbelegung und Rückweg: `src/pages/TankEditPage.tsx`, `src/components/TankForm.tsx`.

## Quellen

- `design.md` – Abschnitt 4 (Eingabefeld, Primär- und Sekundärbutton), Abschnitt 5
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-2.1, FR-2.2, FR-6.4, FR-6.6, Abschnitt 7 Punkt 5
- `src/pages/TankEditPage.tsx`, `src/components/TankForm.tsx`, `src/App.tsx` – bestehendes Muster
