# TASK-08-05 · Wasserwechsel protokollieren

**Status:** erledigt (30.09.2026)
**Bezug:** FR-5.3 (Datum, Menge als Freitext, Notiz), FR-6.4, FR-6.6, NFR-1.3, NFR-1.4, Abnahmekriterium Abschnitt 7
Punkt 8
**Voraussetzung:** TASK-08-03

---

## Worum geht es

Ein Wasserwechsel wird mit Becken, Datum, Menge und Notiz festgehalten und als `becken_ereignis` mit
`typ = 'wasserwechsel'` gespeichert. Das Formular wird so gebaut, dass TASK-08-06 es für Ereignisse wiederverwendet.

## Vor dem Start klären

- [x] **Pflichtfelder.** Vorschlag: Becken \* und Datum \*; Menge und Notiz optional – ein Wasserwechsel ohne Menge ist
      trotzdem ein Eintrag.
  → **Entschieden am 30.09.2026:** wie vorgeschlagen.
- [x] **Menge.** Freitext (ER-Modell, „z. B. 30 l"), höchstens 50 Zeichen, Platzhalter „z. B. 30 l".
  → **Entschieden am 30.09.2026:** wie vorgeschlagen, Label „Menge".
- [x] **Notiz.** Mehrzeilig (`Textarea`), höchstens 500 Zeichen, Platzhalter „z. B. Scheiben gereinigt".
  → **Entschieden am 30.09.2026:** Label „Notiz", höchstens **800** Zeichen, Platzhalter wie vorgeschlagen.
- [x] **Ein Formular für beide Typen?** Vorschlag: eine Komponente, z. B. `src/components/TankEventForm.tsx`, mit dem
      Typ als Eigenschaft; Wasserwechsel zeigt Menge und Notiz, Ereignis (TASK-08-06) Text und Koralle.
  → **Entschieden am 30.09.2026:** wie vorgeschlagen; in diesem Task entsteht nur die Wasserwechsel-Variante, Text und
  Koralle für das Ereignis kommen in TASK-08-06 dazu.
- [x] **Becken vorbelegen, Ziel nach dem Speichern.** Wie in TASK-08-04 entschieden.
  → **Entschieden am 30.09.2026:** übernommen – Becken bei genau einem vorausgewählt, sonst „Becken wählen"; nach dem
  Speichern `/diary` mit `replace`, Abbrechen nach `/diary`.

**Weitere Entscheidungen (30.09.2026):**

- Datum heute vorbelegt, Zukunft nicht erlaubt (Entscheidung 7 in TASK-08-01).
- Feldfehler: Becken „Bitte ein Becken wählen." · Datum „Bitte ein Datum eingeben." bzw. „Das Datum darf nicht in der
  Zukunft liegen." · Menge „Die Menge darf höchstens 50 Zeichen lang sein." · Notiz „Die Notiz darf höchstens
  800 Zeichen lang sein."
- Seite: Überschrift „Wasserwechsel protokollieren", Button „Speichern" / „Wird gespeichert …"; ohne Becken derselbe
  Kasten und Rückweg „Zum Diary" wie in `MeasurementCreatePage`.
- Serverfehler: Meldung des Service („Eintrag konnte nicht angelegt werden."), als Rückfall im Formular „Eintrag
  konnte nicht gespeichert werden."
- `validateTankEvent(tankId, date, amount, text)` liefert `TankEventErrors` mit `tankId`, `date`, `amount`, `text`;
  Konstanten `MAX_TANK_EVENT_AMOUNT_LENGTH = 50` und `MAX_WATER_CHANGE_NOTE_LENGTH = 800`.
- Kopfkommentar in `App.tsx`: bestehende Zeile ergänzen zu „Festgelegt in TASK-08-01: /diary/messwerte/neu,
  /diary/wasserwechsel/neu".

## Schritte

1. [x] **Route** nach TASK-08-01 außerhalb von `AppLayout`, Kopfkommentar ergänzen.
2. [x] **Validierung** `validateTankEvent` in `src/lib/validation.ts`: Becken und Datum Pflicht, Höchstlängen als
       Konstanten wie `MAX_JOURNAL_TEXT_LENGTH`.
3. [x] **Formular** nach Entscheidung, Label über dem Feld, Legende „\* Pflichtfeld", Feldfehler unter dem Feld.
4. [x] **Seite**, z. B. `src/pages/WaterChangeCreatePage.tsx`: Becken aus `useTanks`, ohne Becken Hinweis wie in
       TASK-08-04.
5. [x] **Speichern** über `createTankEvent` mit `typ: "wasserwechsel"`; Button während des Speicherns deaktiviert,
       Serverfehler mit `role="alert"`, Eingaben bleiben stehen.

## Fertig, wenn

- [x] Wasserwechsel mit Menge „30 l" und Notiz speichern → Eintrag erscheint in der Übersicht (**Abnahme Punkt 8**)
- [x] Kontrollabfrage (Nutzer): Zeile in `becken_ereignis` mit `typ = 'wasserwechsel'`, `menge`, `text`,
      `koralle_id = null`
- [x] Nur Becken und Datum → Eintrag ohne Menge und Notiz, Übersicht zeigt „Keine Angabe" (oder Wortlaut aus 08-03)
- [x] Ohne Becken, ohne Datum, zu lange Texte → Feldfehler, keine Anfrage
- [x] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [x] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Im Mockup steht der Wasserwechsel als „Pflege" – Typ-Etikett und Symbol nach Entscheidung in TASK-08-03.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-5.3
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `becken_ereignis`
- `src/components/JournalEntryForm.tsx`, `src/components/CoralForm.tsx` – bestehendes Muster
