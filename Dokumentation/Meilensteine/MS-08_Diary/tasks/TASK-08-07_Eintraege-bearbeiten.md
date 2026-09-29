# TASK-08-07 · Einträge bearbeiten

**Status:** offen
**Bezug:** FR-5.10 (Diary-Einträge bearbeiten), FR-6.2, FR-6.4, FR-6.6, NFR-1.3, Abnahmekriterium Abschnitt 7
Punkt 8 („einen davon korrigieren")
**Voraussetzung:** TASK-08-04, TASK-08-06

---

## Worum geht es

Messwerte, Wasserwechsel und Ereignisse lassen sich nachträglich korrigieren – der bewusste Gegensatz zur Historie
(FR-3.3). Die Formulare aus 08-04 bis 08-06 bekommen einen Bearbeiten-Modus, die Einträge in der Übersicht werden
zu Links.

## Vor dem Start klären

- [ ] **Messwert bearbeiten** (bei Entscheidung 1 (a) in TASK-08-01). Vorschlag: eigenes kleines Formular statt des
      Sieben-Felder-Formulars – Becken, Datum und **ein** Wert; der Parameter steht als Text im Titel
      („Karbonathärte (KH) bearbeiten") und ist nicht änderbar. Ein leeres Wertfeld ist ein Feldfehler, Entfernen
      läuft über Löschen (TASK-08-08).
- [ ] **Wasserwechsel und Ereignis bearbeiten.** Vorschlag: `TankEventForm` mit Anfangswerten wie `TankForm` im
      Bearbeiten-Modus; der Typ ist nicht änderbar. Ein Eintrag mit Typ `fuetterung` (Testdatensatz …09) wird nach
      Entscheidung 5 in TASK-08-01 wie ein Ereignis bearbeitet.
- [ ] **Becken änderbar?** Vorschlag: ja, über dasselbe Auswahlfeld; beim Ereignis setzt ein Beckenwechsel die
      Koralle auf „Keine".
- [ ] **Erreichbarkeit.** Vorschlag: ganze Karte (Wasserwechsel, Ereignis) bzw. Wertzeile (Messung) als Link auf die
      Bearbeiten-Seite, mit sichtbarem Hinweis „Bearbeiten" oder Pfeil **mit Text** (NFR-1.4) – keine
      Hover-Funktion.
- [ ] **Ziel nach dem Speichern.** Vorschlag: `/diary` mit `replace`; Abbrechen nach `/diary`.

## Schritte

1. [ ] **Routen** nach TASK-08-01 außerhalb von `AppLayout`, Kopfkommentar ergänzen.
2. [ ] **Seiten**, z. B. `src/pages/MeasurementEditPage.tsx` und `src/pages/TankEventEditPage.tsx`: laden über
       `useMeasurement` bzw. `useTankEvent`; Zustände Laden, Fehler, „Eintrag nicht gefunden." wie `TankEditPage`.
3. [ ] **Formulare** um Anfangswerte erweitern (Zahl beim Vorbelegen im de-DE-Format, z. B. `8,1`).
4. [ ] **Speichern** über `updateMeasurement` bzw. `updateTankEvent`; Button während des Speicherns deaktiviert,
       Serverfehler mit `role="alert"`, Eingaben bleiben stehen.
5. [ ] **Übersicht**: Einträge als Links nach Entscheidung.

## Fertig, wenn

- [ ] Messwert KH von 8,1 auf 8,4 korrigieren → Übersicht zeigt 8,4 dKH (**Abnahme Punkt 8**)
- [ ] Wasserwechsel-Menge und Ereignistext ändern → Übersicht zeigt die neuen Werte
- [ ] Datum ändern → Eintrag steht unter dem neuen Datum
- [ ] Ungültige Eingaben → Feldfehler, keine Anfrage
- [ ] Ungültige ID in der URL → „nicht gefunden", keine Fehlermeldung
- [ ] Als Testnutzer B: Bearbeiten-Pfade mit Messwert …08 und Ereignis …09 von A → „nicht gefunden" (FR-6.2)
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Alle Felder, Links und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Speichern ohne Änderung ist erlaubt und schreibt dieselben Werte erneut – kein eigener Fall nötig.
- Die RLS-Policy `…_update_eigene` verhindert fremde Änderungen; ein UPDATE auf eine fremde ID betrifft 0 Zeilen und
  endet bei `.single()` in einem Fehler – über den `notFound`-Zustand der Seite kommt es dazu gar nicht erst.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-5.10, Grundsatzentscheidung 6, Abschnitt 7
  Punkt 8
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Festlegung 8
- `src/pages/TankEditPage.tsx`, `src/components/TankForm.tsx`, `src/pages/CoralProfileEditPage.tsx` – bestehendes
  Muster für Bearbeiten-Seiten
