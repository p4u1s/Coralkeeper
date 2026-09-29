# TASK-08-05 · Wasserwechsel protokollieren

**Status:** offen
**Bezug:** FR-5.3 (Datum, Menge als Freitext, Notiz), FR-6.4, FR-6.6, NFR-1.3, NFR-1.4, Abnahmekriterium Abschnitt 7
Punkt 8
**Voraussetzung:** TASK-08-03

---

## Worum geht es

Ein Wasserwechsel wird mit Becken, Datum, Menge und Notiz festgehalten und als `becken_ereignis` mit
`typ = 'wasserwechsel'` gespeichert. Das Formular wird so gebaut, dass TASK-08-06 es für Ereignisse wiederverwendet.

## Vor dem Start klären

- [ ] **Pflichtfelder.** Vorschlag: Becken \* und Datum \*; Menge und Notiz optional – ein Wasserwechsel ohne Menge ist
      trotzdem ein Eintrag.
- [ ] **Menge.** Freitext (ER-Modell, „z. B. 30 l"), höchstens 50 Zeichen, Platzhalter „z. B. 30 l".
- [ ] **Notiz.** Mehrzeilig (`Textarea`), höchstens 500 Zeichen, Platzhalter „z. B. Scheiben gereinigt".
- [ ] **Ein Formular für beide Typen?** Vorschlag: eine Komponente, z. B. `src/components/TankEventForm.tsx`, mit dem
      Typ als Eigenschaft; Wasserwechsel zeigt Menge und Notiz, Ereignis (TASK-08-06) Text und Koralle.
- [ ] **Becken vorbelegen, Ziel nach dem Speichern.** Wie in TASK-08-04 entschieden.

## Schritte

1. [ ] **Route** nach TASK-08-01 außerhalb von `AppLayout`, Kopfkommentar ergänzen.
2. [ ] **Validierung** `validateTankEvent` in `src/lib/validation.ts`: Becken und Datum Pflicht, Höchstlängen als
       Konstanten wie `MAX_JOURNAL_TEXT_LENGTH`.
3. [ ] **Formular** nach Entscheidung, Label über dem Feld, Legende „\* Pflichtfeld", Feldfehler unter dem Feld.
4. [ ] **Seite**, z. B. `src/pages/WaterChangeCreatePage.tsx`: Becken aus `useTanks`, ohne Becken Hinweis wie in
       TASK-08-04.
5. [ ] **Speichern** über `createTankEvent` mit `typ: "wasserwechsel"`; Button während des Speicherns deaktiviert,
       Serverfehler mit `role="alert"`, Eingaben bleiben stehen.

## Fertig, wenn

- [ ] Wasserwechsel mit Menge „30 l" und Notiz speichern → Eintrag erscheint in der Übersicht (**Abnahme Punkt 8**)
- [ ] Kontrollabfrage (Nutzer): Zeile in `becken_ereignis` mit `typ = 'wasserwechsel'`, `menge`, `text`,
      `koralle_id = null`
- [ ] Nur Becken und Datum → Eintrag ohne Menge und Notiz, Übersicht zeigt „Keine Angabe" (oder Wortlaut aus 08-03)
- [ ] Ohne Becken, ohne Datum, zu lange Texte → Feldfehler, keine Anfrage
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Im Mockup steht der Wasserwechsel als „Pflege" – Typ-Etikett und Symbol nach Entscheidung in TASK-08-03.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-5.3
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `becken_ereignis`
- `src/components/JournalEntryForm.tsx`, `src/components/CoralForm.tsx` – bestehendes Muster
