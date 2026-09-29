# TASK-08-06 · Ereignis protokollieren

**Status:** offen
**Bezug:** FR-5.4 (Datum, Typ wie Bleaching, Schädling, Vernesselung; Freitext, optional betroffene Koralle), FR-6.4,
FR-6.6, NFR-1.3, NFR-1.4, Abnahmekriterium Abschnitt 7 Punkt 8
**Voraussetzung:** TASK-08-05

---

## Worum geht es

Ein Ereignis im Becken – Bleaching, Schädling, Vernesselung – wird mit Datum, Beschreibung und optional der
betroffenen Koralle festgehalten. Das Formular aus TASK-08-05 bekommt dafür die Ereignis-Variante.

## Vor dem Start klären

- [ ] **Art des Ereignisses** – hängt an Punkt 4 in TASK-08-01:
  - bei (a): kein Auswahlfeld, `typ = 'vorfall'`; Text \* mit Platzhalter „z. B. Bleaching an der Montipora"
  - bei (b)/(c): Auswahlfeld \* mit erster Option „Art wählen", Text optional
- [ ] **Text.** Vorschlag: `Textarea`, höchstens 1.000 Zeichen wie der Journaleintrag.
- [ ] **Betroffene Koralle.** Vorschlag: Auswahlfeld „Betroffene Koralle" mit erster Option „Keine", danach die
      Korallen des gewählten Beckens (Bezeichnung, bei Bedarf Handelsname); bei Beckenwechsel zurück auf „Keine";
      vor der Beckenwahl deaktiviert. Welche Status? Vorschlag: alle Korallen des Beckens.
- [ ] **Beschriftung des Typs.** „Ereignis" oder „Vorfall" in Etikett, Button und Seitentitel – nach
      `TANK_EVENT_TYPE_LABELS` aus TASK-08-02.

## Schritte

1. [ ] **Route** nach TASK-08-01 außerhalb von `AppLayout`, Kopfkommentar ergänzen.
2. [ ] **Validierung** `validateTankEvent` um die Ereignis-Felder erweitern.
3. [ ] **Formular** `TankEventForm` um die Ereignis-Variante erweitern; Korallen über `useCorals`, nach `becken_id`
       gefiltert.
4. [ ] **Seite**, z. B. `src/pages/IncidentCreatePage.tsx`; ohne Becken Hinweis wie in TASK-08-04.
5. [ ] **Speichern** über `createTankEvent` mit dem Typ nach Entscheidung; Zustände wie in TASK-08-05.
6. [ ] **Übersicht**: Korallenzeile nach TASK-08-03 anzeigen.

## Fertig, wenn

- [ ] Ereignis mit Text und betroffener Koralle speichern → Eintrag mit Korallenbezeichnung in der Übersicht
      (**Abnahme Punkt 8**)
- [ ] Ereignis ohne Koralle speichern → `koralle_id = null`
- [ ] Kontrollabfrage (Nutzer): Zeile in `becken_ereignis` mit Typ nach Entscheidung, `text`, `koralle_id`
- [ ] Becken wechseln → Korallenauswahl zeigt nur Korallen des neuen Beckens, Auswahl steht auf „Keine"
- [ ] Pflichtfelder leer, zu langer Text → Feldfehler, keine Anfrage
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `becken_ereignis.koralle_id` prüft die Datenbank nicht auf Eigentum (Festlegung 12 gilt nur für `angebot` und
  `abgabe`); das Auswahlfeld bietet ohnehin nur eigene Korallen an.
- Ob die Koralle im gewählten Becken steht, prüft nur die UI. Wird die Koralle später umgesetzt, bleibt der Verweis
  bestehen – das Ereignis gehört weiter zum alten Becken.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-5.4
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `becken_ereignis`, Löschregel
  `becken_ereignis.koralle_id`, Festlegungen 12 und 19
- `MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-02_Feldliste.md` – Befund FR-5.4
- `src/hooks/useCorals.ts`, `src/components/CoralForm.tsx` – bestehendes Muster
