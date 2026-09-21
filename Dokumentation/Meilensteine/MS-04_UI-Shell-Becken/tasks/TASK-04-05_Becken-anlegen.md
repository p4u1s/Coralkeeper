# TASK-04-05 · Becken anlegen

**Status:** erledigt
**Bezug:** FR-1.1 (Name, Volumen, Beschreibung, Startdatum), FR-6.6 (Feldfehler), FR-6.4 (Lade- und Fehlerzustand im Formular),
Abnahmekriterium Abschnitt 7 Punkt 3 („Becken anlegen gelingt in einem Formular")
**Voraussetzung:** TASK-04-03

---

## Worum geht es

Das erste fachliche Formular der App. Es wird als eigene Komponente gebaut, damit TASK-04-07 (Bearbeiten) es mit
vorbelegten Werten wiederverwenden kann. Das Formularmuster (Label über dem Feld, `* Pflichtfeld`, Speichern und
Abbrechen untereinander) kommt aus dem Mockup „Koralle anlegen".

## Vor dem Start klären

- [x] **Validierungsregeln.** FR-1.1 nennt nur die Felder; `becken.name` ist `NOT NULL`, `volumen_liter` ist `int`,
      weitere Grenzen setzt die Datenbank nicht. Vorschlag:

  | Feld         | Pflicht | Regel (Vorschlag)                               |
  | ------------ | ------- | ----------------------------------------------- |
  | Name         | ja      | nicht leer nach Entfernen der Leerzeichen       |
  | Volumen (l)  | nein    | ganze Zahl größer 0                             |
  | Startdatum   | nein    | gültiges Datum, nicht in der Zukunft            |
  | Beschreibung | nein    | –                                               |

  → Entschieden: Vorschlag plus Obergrenzen – Name höchstens 100 Zeichen, Volumen höchstens 100.000 l;
    Startdatum in der Zukunft nicht erlaubt.

- [x] **Ziel nach „Speichern"** – Vorschlag: Beckenliste `/becken`, dort ist das neue Becken sofort zu sehen.
      **Ziel von „Abbrechen"** – Vorschlag: ein fester Pfad (`/becken`) statt „zurück", weil ein Direktaufruf keinen Verlauf hat.
      → Entschieden: beide nach `/becken`.

## Schritte

1. [x] **Textarea** für die Beschreibung per shadcn hinzufügen (`npx shadcn@latest add textarea`) und wie `input.tsx`
       in TASK-03-08 an `design.md` anpassen (Fläche, Rahmen, Radius 10, `text-body`).
2. [x] **Validierung** in `src/lib/validation.ts`: `validateTank(...)` mit eigenem Fehlertyp.
       `hasErrors` ist heute auf `LoginErrors | RegisterErrors` typisiert → so verallgemeinern, dass es jedes Fehlerobjekt annimmt.
3. [x] **Formular-Komponente** (z. B. `src/components/TankForm.tsx`) mit Anfangswerten, Beschriftung des Speichern-Buttons
       und `onSubmit` als Props:
   - Kopf: Legende „\* Pflichtfeld"
   - Felder: „Name \*", „Volumen in Litern", „Startdatum", „Beschreibung" – sichtbare Labels über dem Feld
   - Volumen mit `inputMode="numeric"`, Startdatum mit `type="date"`
   - `noValidate`, `aria-invalid`, Fehlertext per `aria-describedby`, Fehler verschwinden nach Korrektur (Muster aus TASK-03-09)
   - Primärbutton „Speichern", darunter Sekundärbutton „Abbrechen", beide volle Breite
4. [x] **Eingaben umwandeln:** Text des Volumenfelds → Zahl oder `null`; leere Felder → `null`.
5. [x] **Seite `/becken/neu`:** Überschrift „Becken anlegen", `createTank` aufrufen, danach zum festgelegten Ziel.
6. [x] **Laden und Fehler:** Während des Speicherns Button deaktiviert mit „Wird gespeichert …"; Serverfehler als Meldung
       über dem Formular (`role="alert"`), eingegebene Werte bleiben erhalten.

## Fertig, wenn

- [x] Speichern mit leerem Namen zeigt einen Feldfehler unter dem Feld, es geht keine Anfrage raus (FR-6.6)
- [x] Ungültiges Volumen (z. B. `abc`, `-5`, `2,5`) zeigt einen Feldfehler
- [x] Ein Becken nur mit Namen lässt sich speichern; die übrigen Spalten sind in Supabase `null`
- [x] Ein Becken mit allen Feldern erscheint danach korrekt formatiert in der Beckenliste
- [x] Während des Speicherns ist doppeltes Absenden nicht möglich
- [x] Ohne Verbindung erscheint eine verständliche deutsche Meldung, die Eingaben bleiben stehen (FR-6.4)
- [x] Keine Bottom-Navigation auf dieser Seite; Bedienung mit Tastatur und Enter möglich; bei 360 px vollständig sichtbar
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `type="date"` zeigt das Datum im Format der Browsersprache an (bei deutschem Browser `TT.MM.JJJJ`) und liefert
  den Wert als `JJJJ-MM-TT` – genau das Format, das die Spalte `date` erwartet. Kein eigener Datumsparser nötig.
- `type="number"` vermeiden: erlaubt `e`, Dezimalstellen und das Mausrad-Hochzählen. Textfeld mit `inputMode="numeric"`
  und eigener Prüfung ist berechenbarer.
- Keine allgemeine `FormField`-Komponente einführen – die ist bewusst für MS-12 vorgemerkt.

## Quellen

- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „FORMULAR NEUE KORALLE" (Formularmuster)
- `design.md` – Abschnitt 4 (Eingabefeld, Buttons), Abschnitt 5 (Regeln 4 und 8)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.1, FR-6.4, FR-6.6, Abschnitt 7 Punkt 3
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `becken`
