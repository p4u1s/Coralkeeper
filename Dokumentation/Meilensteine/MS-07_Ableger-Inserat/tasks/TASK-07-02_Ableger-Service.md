# TASK-07-02 · Ableger-Service

**Status:** erledigt (28.09.2026)
**Bezug:** FR-1.7 (Ableger mit `mutter_id`, Kopie von Art, Morphe, Steckbrief), FR-3.6 (Herkunftskette als Snapshot),
NFR-4.3, NFR-4.4, NFR-4.1
**Voraussetzung:** TASK-07-01

---

## Worum geht es

Der Korallen-Service bekommt eine Funktion, die aus einer geladenen Ursprungskoralle einen Ableger anlegt – mit den
kopierten Spalten und der Herkunftskette nach Festlegung 17. Der Systemeintrag entsteht im Trigger, nicht hier.

## Vor dem Start klären

- [x] **Ort der Herkunftskette.** Vorschlag: reine Funktion `buildOriginChain(mother, createdOn)` in einer eigenen
      Datei, z. B. `src/lib/origin.ts` – ohne Datenbankzugriff, dadurch leicht nachvollziehbar.
  → **Entschieden am 28.09.2026:** `src/lib/origin.ts`. Die Funktion bildet den Text nur einmal beim Anlegen, gespeichert
  wird er in `koralle.herkunftskette` des Ablegers. Format-Details: Ist `art` leer, entfällt die Klammer; Zeile „Quelle"
  in der Reihenfolge Quelltyp · `quelle_name` · `Beleg …` · `CITES-Nr. …` · `herkunft_notiz`.
- [x] **Benennung im Code.** → **Entschieden am 28.09.2026:** „Frag" statt „Offshoot" (Fachbegriff der
      Meerwasseraquaristik): `FragInput`, `toFragRow`, `createFrag`, `validateFrag`, `FragErrors`. In der UI bleibt
      „Ableger".

## Schritte

1. [x] **Typ** für die Eingabe per `Pick` aus `Coral`: `bezeichnung`, `becken_id` (weitere Felder nur, wenn
       TASK-07-01 oder TASK-07-03 sie ins Formular holt) → `FragInput`.
2. [x] **Beschriftungen** der Quelle in `src/lib/labels.ts`: `SOURCE_TYPE_LABELS` als
       `Record<Enums<"quelle_typ">, string>` – Händler · Privat · Eigene Nachzucht.
3. [x] **Herkunftskette** nach Festlegung 17 bilden; Datum über `formatDate`, Quelle über `SOURCE_TYPE_LABELS`, leere
       Angaben entfallen, die Kette der Ursprungskoralle wird angehängt.
4. [x] **`createFrag(mother, input)`** in `src/services/coral.ts`:
   - `nutzer_id` aus `getSession()` wie in `createCoral`
   - alle kopierten Spalten an **einer** Stelle, in `toFragRow(mother, input)` – so ist die Spaltenliste aus
     Festlegung 17 im Code direkt ablesbar
   - `mutter_id = mother.id`, `herkunftskette`, `erwerbsdatum` und `quelle_typ` nach Festlegung 17
     (Tagesdatum über `todayIso()`, nie über `toISOString()`)
   - Bezeichnung getrimmt; Fehler als „Ableger konnte nicht angelegt werden." mit `cause`
   - Rückgabe: der neue Datensatz (für die Weiterleitung in TASK-07-03)
5. [x] **Validierung** `validateFrag` in `src/lib/validation.ts`: Bezeichnung Pflicht und höchstens
       `MAX_CORAL_TEXT_LENGTH`, Becken Pflicht – dieselben Meldungen wie in `validateCoral`.

## Fertig, wenn

- [x] Die kopierten und neu gesetzten Spalten entsprechen genau Festlegung 17 (Abgleich im Code)
- [x] `primaerbild` und die nicht kopierten Herkunftsfelder stehen **nicht** im Insert
- [x] Zu jedem Wert von `quelle_typ` gibt es eine Beschriftung, TypeScript meldet fehlende Werte
- [x] Kein `any`, keine handgeschriebenen Tabellentypen, kein Import von `@supabase/*` außerhalb von `src/services/`
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Der Snapshot entsteht aus dem Stand der Ursprungskoralle beim Laden der Formularseite. Eine Änderung in einem
  anderen Tab in der Zwischenzeit wirkt nicht – vertretbar, kein Produktivsystem.
- `mutter_id` wird im Frontend nicht gegen fremde Korallen geprüft (ER-Modell, Festlegung 12).
- Im Browser prüfbar wird der Service erst mit TASK-07-03.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Festlegung 17 (aus TASK-07-01), Aufzählungstyp
  `quelle_typ`
- `src/services/coral.ts` (`createCoral`, `toRow`), `src/lib/labels.ts`, `src/lib/validation.ts`, `src/lib/format.ts` –
  bestehendes Muster
- `MS-02_…/tasks/TASK-02-05_Konventionen-Snapshot-Bilder.md`, Abschnitt B – Umgang mit `date`-Werten
