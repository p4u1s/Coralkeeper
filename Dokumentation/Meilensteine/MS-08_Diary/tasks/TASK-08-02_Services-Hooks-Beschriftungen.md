# TASK-08-02 · Services, Hooks, Beschriftungen und Zahlenformat

**Status:** erledigt (29.09.2026)
**Bezug:** FR-5.1, FR-5.3, FR-5.4, FR-5.10, NFR-4.3, NFR-4.4, NFR-4.1, NFR-1.5, NFR-1.8
**Voraussetzung:** TASK-08-01

---

## Worum geht es

Alle Zugriffe auf `messwert` und `becken_ereignis` laufen über eigene Service-Dateien: lesen, anlegen, ändern,
löschen. Die Übersicht bekommt beide Listen über einen Hook, die Bearbeiten-Seiten je einen Hook für den einzelnen
Eintrag. Dazu kommen die deutschen Beschriftungen, die festen Einheiten und das de-DE-Zahlenformat für Ein- und
Ausgabe.

## Vor dem Start klären

- [x] **Dateinamen.** Vorschlag, englisch wie `tank.ts`, `offer.ts`:
  - `src/services/measurement.ts`, `src/services/tankEvent.ts`
  - `src/hooks/useDiary.ts` (beide Listen), `src/hooks/useMeasurement.ts`, `src/hooks/useTankEvent.ts` (je ein Eintrag)
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.
- [x] **Anzeige von Zahlen.** Vorschlag: `toLocaleString("de-DE")` mit höchstens drei Nachkommastellen, mit
      Tausenderpunkt – ergibt `8,1 dKH`, `1.320 mg/l`, `0,04 mg/l` wie design.md.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.
- [x] **Eingabe von Zahlen.** `"1.320"` ist mehrdeutig (1320 oder 1,32).
  - **(a)** nur Komma als Dezimaltrenner, kein Tausenderpunkt; ein Punkt ergibt einen Feldfehler mit Beispiel
  - **(b)** Komma und Punkt als Dezimaltrenner, kein Tausenderpunkt (`"1.320"` = 1,32)
  → Vorschlag: **(b)** – manche Handy-Tastaturen bieten bei `inputMode="decimal"` nur den Punkt an; die
  Plausibilitätsgrenzen aus TASK-08-04 fangen `1,32` bei Magnesium ab.
  → **Entschieden am 29.09.2026:** (b).

**Weitere Entscheidungen (29.09.2026):**

- `vorfall` heißt in der Oberfläche **„Ereignis"** (FR-5.4, Pfad `/diary/ereignis/neu`).
- `MeasurementInput` umfasst `becken_id`, `datum`, `parameter`, `wert`; `einheit` setzt der Service immer aus dem
  Parameter (Salinität `null`). Welche Felder die Oberfläche änderbar macht, entscheidet TASK-08-07.
- Sortierung: `datum` absteigend, bei gleichem Datum nach `parameter` bzw. `typ` (Reihenfolge der Enums).
  → geändert in TASK-08-03: am selben Tag zuerst nach `erstellt_am` absteigend.
- `createMeasurements` bekommt `values` als Liste von `{ parameter, wert }`.
- `MEASUREMENT_UNITS` liegt in `src/lib/labels.ts` und dient Service und Anzeige.
- Fehlermeldungen für `becken_ereignis` sprechen allgemein von „Eintrag"; beim Anlegen von Messwerten heißt es
  „gespeichert" statt „angelegt".

## Schritte

1. [x] **Typen** aus den generierten Datenbanktypen (NFR-4.4): `Measurement = Tables<"messwert">`,
       `TankEvent = Tables<"becken_ereignis">`, Eingabetypen per `Pick` wie `TankInput`.
2. [x] **Messwert-Service** (bei Entscheidung 1 (a) in TASK-08-01):
   - `listMeasurements()` – alle eigenen Messwerte, `datum` absteigend
   - `getMeasurement(id)` – ein Messwert oder `null` (`maybeSingle`, 22P02 wie in `getTank`)
   - `createMeasurements(tankId, date, values)` – alle Werte mit **einem** Insert; `nutzer_id` aus `getSession()`,
     `einheit` nach Entscheidung 3
   - `updateMeasurement(id, input)`, `deleteMeasurement(id)`
   - deutsche Fehlermeldungen mit `cause`
3. [x] **Ereignis-Service**: `listTankEvents()`, `getTankEvent(id)`, `createTankEvent(input)`,
       `updateTankEvent(id, input)`, `deleteTankEvent(id)`; leere Texte getrimmt als `null` (`toRow` wie in `tank.ts`).
4. [x] **Hook `useDiary()`** – lädt beide Listen parallel, Status (`loading` / `success` / `error`), Fehlermeldung,
       `reload()`; Statusnamen und Abbruch-Flag wie in `useTanks`. Beckennamen ordnet die Seite über `useTanks` zu
       (Muster aus MS-5).
5. [x] **Hooks `useMeasurement(id)` und `useTankEvent(id)`** mit `notFound` wie `useTank`.
6. [x] **Beschriftungen** in `src/lib/labels.ts`, Wertelisten aus `Constants`:
   - `MEASUREMENT_PARAMETER_VALUES`, `MEASUREMENT_PARAMETER_LABELS` in Klartext mit Kürzel, z. B.
     „Karbonathärte (KH)", „Nitrat (NO₃)" (design.md, Regel 7)
   - `MEASUREMENT_UNITS` nach Entscheidung 2 in TASK-08-01
   - `TANK_EVENT_TYPE_LABELS`: Wasserwechsel · Fütterung · Ereignis bzw. Vorfall (Wortlaut nach TASK-08-01, Punkt 4)
7. [x] **Zahlenformat**: `formatMeasurement(value, parameter)` in `src/lib/format.ts`; `parseDecimal(text)` für die
       Eingabe nach Entscheidung oben (gibt `null` bei ungültiger Eingabe).

## Fertig, wenn

- [x] Zu jedem Wert von `messparameter` und `ereignis_typ` gibt es Beschriftung bzw. Einheit, TypeScript meldet fehlende
      Werte
- [x] `formatMeasurement` liefert `8,1 dKH`, `1.320 mg/l`, `0,04 mg/l`
      → seit TASK-08-03 mit `°dKH`: `8,1 °dKH`
- [x] `createMeasurements` schreibt mehrere Werte in **einer** Anfrage
- [x] Kein `any`, keine handgeschriebenen Tabellentypen, kein Import von `@supabase/*` außerhalb von `src/services/`
- [x] Jede Service-Funktion wirft bei Fehlern eine deutsche Meldung mit `cause`
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Supabase liefert je Abfrage standardmäßig höchstens **1.000 Zeilen**. NFR-2.1 rechnet mit 1.000 Messwerten je
  Konto – die Grenze liegt genau dort. Im MVP hinnehmen, in MS-12 (NFR-2.1) prüfen.
- Die Update-Funktionen gibt es hier bewusst – anders als bei der Historie (FR-5.10 gegen FR-3.3).

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entitäten `messwert`, `becken_ereignis`, Festlegung 8,
  Festlegung 19 (aus TASK-08-01)
- `src/services/tank.ts`, `src/services/offer.ts`, `src/hooks/useTanks.ts`, `src/hooks/useTank.ts`,
  `src/lib/labels.ts`, `src/lib/format.ts` – bestehendes Muster
- `design.md` – Formatbeispiele (Kopf), Abschnitt 2 (tabellarische Ziffern), Abschnitt 5 Regel 7
