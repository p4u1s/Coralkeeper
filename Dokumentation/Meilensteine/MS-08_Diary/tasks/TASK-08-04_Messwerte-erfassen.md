# TASK-08-04 · Messwerte erfassen

**Status:** offen
**Bezug:** FR-5.1 (Messwerte je Becken mit Datum, alle optional, mindestens einer, feste Einheiten), FR-6.4, FR-6.6,
NFR-1.3, NFR-1.4, NFR-1.5, Abnahmekriterium Abschnitt 7 Punkt 8
**Voraussetzung:** TASK-08-03

---

## Worum geht es

Ein Formular erfasst die Messwerte eines Beckens an einem Datum: sieben Felder, alle optional, mindestens eines muss
gefüllt sein. Gespeichert wird mit einer Anfrage, danach stehen die Werte in der Diary-Übersicht.

## Vor dem Start klären

- [x] **Hinweis „mindestens ein Wert".** Kein einzelnes Feld ist schuld. Vorschlag: Hinweistext über den Wertfeldern
      („Mindestens einen Wert eintragen.") und bei Verstoß eine Meldung mit `role="alert"` an derselben Stelle, Fokus
      auf das erste Wertfeld.
  → **Entschieden am 29.09.2026:** Wertfelder in einem `fieldset` mit Legende „Messwerte", darunter der Hinweis. Die
  Meldung „Bitte mindestens einen Messwert eintragen." (`role="alert"`, Fokus auf KH) nur, wenn **alle** Felder leer
  sind – bei einer ungültigen Eingabe gilt nur deren Feldfehler.
- [x] **Plausibilitätsgrenzen** gegen Tippfehler, Vorschlag (Werte ≥ 0, obere Grenze):
      KH 30 · Ca 1.000 · Mg 3.000 · NO₃ 500 · PO₄ 10 · Temperatur 40 · Salinität je nach Einheit aus TASK-08-01.
      → Grenzen bestätigen oder anpassen. Höchstens drei Nachkommastellen?
  → **Entschieden am 29.09.2026:** Werte ab 0 (0 erlaubt), höchstens KH 11 · Ca 600 · Mg 1700 · NO₃ 12 · PO₄ 10 ·
  Temperatur 35. Salinität (Dichte) von 1,000 bis 1,050. Höchstens drei Nachkommastellen.
- [x] **Becken vorbelegen.** Vorschlag: bei genau einem Becken vorausgewählt, sonst erste Option „Becken wählen" wie im
      Korallenformular.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.
- [x] **Feldbeschriftung.** Vorschlag: Klartext mit Kürzel und Einheit, z. B. „Karbonathärte (KH) in °dKH",
      Platzhalter mit Beispielwert („z. B. 8,1").
  → **Entschieden am 29.09.2026:** nur Kürzel mit Einheit – „KH in °dKH", „Ca in mg/l", „Mg in mg/l", „NO₃ in mg/l",
  „PO₄ in mg/l", „Temp. in °C", „Salinität (Dichte)". Bewusste Abweichung von design.md, Abschnitt 5 Regel 7 (wie
  TASK-08-03). Platzhalter: z. B. 8,1 · 420 · 1320 · 5 · 0,04 · 25,5 · 1,025.
- [x] **Ziel nach dem Speichern.** Vorschlag: `/diary` mit `replace`, Abbrechen ohne `replace` nach `/diary`.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.

**Weitere Entscheidungen (29.09.2026):**

- Feldfehler: Becken „Bitte ein Becken wählen." · Datum „Bitte ein Datum eingeben." bzw. über `checkNotInFuture`
  „Das Datum darf nicht in der Zukunft liegen." · keine Zahl „Bitte eine Zahl eingeben, z. B. 8,1." (Beispiel des
  Felds) · zu viele Stellen „Bitte höchstens drei Nachkommastellen eingeben." · über der Grenze „Der Wert darf
  höchstens 11 °dKH betragen." (über `formatMeasurement`), Salinität „Der Wert muss zwischen 1,000 und 1,050 liegen."
- Seite: Überschrift „Messwerte erfassen", Button „Speichern" / „Wird gespeichert …"; ohne Becken derselbe Kasten
  wie im Diary; bei „ohne Becken" und Ladefehler Rückweg „Zum Diary".
- `validateMeasurements` liefert `tankId`, `date`, `values` (je Parameter) und `atLeastOne`.
- Kopfkommentar in `App.tsx`: nur „Festgelegt in TASK-08-01: /diary/messwerte/neu".

## Schritte

1. [x] **Route** nach TASK-08-01 in `src/App.tsx` **außerhalb** von `AppLayout`, Kopfkommentar „Festgelegt in
       TASK-08-01" ergänzen.
2. [x] **Validierung** `validateMeasurements` in `src/lib/validation.ts`: Becken Pflicht, Datum Pflicht (Zukunft nach
       Entscheidung 7 in TASK-08-01), je Wert `parseDecimal` und Grenzen, mindestens ein Wert.
3. [x] **Formular** als eigene Komponente, z. B. `src/components/MeasurementForm.tsx`: Becken \*, Datum \* (heute
       vorbelegt), sieben Wertfelder mit `inputMode="decimal"`; Label über dem Feld, Legende „\* Pflichtfeld",
       Feldfehler unter dem Feld.
4. [x] **Seite**, z. B. `src/pages/MeasurementCreatePage.tsx`: lädt die Becken mit `useTanks`; ohne Becken Hinweis mit
       Link auf `/becken/neu` statt des Formulars.
5. [x] **Speichern** über `createMeasurements`; Button während des Speicherns deaktiviert; Serverfehler als deutsche
       Meldung mit `role="alert"`, Eingaben bleiben stehen.

## Fertig, wenn

- [ ] KH und Ca eintragen, speichern → beide Werte erscheinen in der Übersicht unter dem Datum (**Abnahme Punkt 8**)
- [ ] Kontrollabfrage (Nutzer): zwei Zeilen in `messwert` mit gleichem Becken und Datum, `einheit` nach Entscheidung 3
- [ ] Ohne Wert speichern → Hinweis, keine Anfrage (FR-5.1, FR-6.6)
- [ ] Ohne Becken speichern → Feldfehler, keine Anfrage
- [ ] `8,1` und – je nach Entscheidung in TASK-08-02 – `8.1` werden als 8,1 gespeichert; `abc` und Werte über der
      Grenze ergeben Feldfehler
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `type="number"` meiden: Firefox und Chrome gehen unterschiedlich mit dem Komma um, und leere oder ungültige
  Eingaben kommen als `""` an. `type="text"` mit `inputMode="decimal"` und eigener Prüfung ist berechenbarer.
- Soll-Bereiche mit farblicher Markierung sind FR-5.6 (Should, MS-10) – die Plausibilitätsgrenzen hier sind nur
  Tippfehlerschutz.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-5.1, Abschnitt 7 Punkt 8
- `design.md` – Abschnitt 4 (Eingabefeld, Primärbutton), Abschnitt 5 (Pflichtfelder, Klartext)
- `src/components/CoralForm.tsx`, `src/pages/CoralCreatePage.tsx`, `src/lib/validation.ts` – bestehendes Muster
  (Beckenauswahl, Leerzustand ohne Becken)
