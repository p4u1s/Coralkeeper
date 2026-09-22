# TASK-05-01 · Korallen-Service und Hooks

**Status:** erledigt
**Bezug:** FR-1.2 (Koralle anlegen), FR-1.14 (Becken Pflicht), NFR-4.3 (Datenzugriff nur über `src/services/*`, eigene Hooks),
NFR-4.4 (Typen aus dem Schema), NFR-4.1
**Voraussetzung:** MS-4 abgeschlossen

---

## Worum geht es

Alle Korallen-Zugriffe laufen über eine Service-Datei, die Seiten bekommen die Daten über eigene Hooks mit Lade- und
Fehlerzustand – dasselbe Muster wie `src/services/tank.ts` und `src/hooks/useTanks.ts`. In MS-5 nur **Liste lesen und
Anlegen**; eine einzelne Koralle lesen braucht erst die Detailseite (MS-6), Bearbeiten und Löschen gehören zu FR-1.10 (MS-9).

## Vor dem Start klären

- [x] **Dateiname.** Vorschlag `src/services/coral.ts` (englisch wie `tank.ts`), Hook `useCorals.ts`.
      → **Entschieden 22.09.2026:** `src/services/coral.ts` und `src/hooks/useCorals.ts`.
- [x] **Beckenname in der Liste.** Die Bestandsliste soll zeigen, in welchem Becken eine Koralle steht; `koralle` hat
      nur `becken_id`.
  - **(a)** Join in der Abfrage: `.select("*, becken(name)")` – eine Anfrage, Name kommt direkt mit
  - **(b)** Korallen und Becken getrennt laden und im Frontend über `becken_id` zuordnen – kein Join, aber zwei Hooks
    und eine Zuordnungsfunktion
  → Entscheiden. (a) ist kürzer; der Bestand lädt die Becken wegen FR-1.15 ohnehin (TASK-05-04), (b) nutzt das mit.
  → **Entschieden 22.09.2026:** (b) – `listCorals` liefert nur `Tables<"koralle">`, der Beckenname wird im Bestand über
    `becken_id` aus `useTanks` zugeordnet (TASK-05-04).

## Schritte

1. [x] **Typen** aus den generierten Datenbanktypen ableiten, nicht handschreiben (NFR-4.4):
   - Zeile = `Tables<"koralle">`
   - Eingabe für Anlegen = `bezeichnung`, `becken_id`, `art`, `handelsname`, `erwerbsdatum` (per `Pick`) –
     **ohne** `nutzer_id`, `status` und alle Steckbrief-/Herkunftsfelder
   - ~~bei Entscheidung (a): Listentyp mit dem mitgeladenen Beckennamen~~ – entfällt, Entscheidung (b)
2. [x] **Funktionen** im Service:
   - `listCorals()` – alle eigenen Korallen, sortiert nach `bezeichnung` (es gibt keine Anlagezeit-Spalte)
   - `createCoral(input)` – `nutzer_id` aus `getSession()` setzen (Muster und Begründung aus `createTank`), nie aus dem Formular
3. [x] **Leere optionale Felder** (`art`, `handelsname`, `erwerbsdatum`) als `null` speichern, Texte getrimmt – eigene
       `toRow`-Funktion wie in `tank.ts`.
4. [x] **Hook** `src/hooks/useCorals.ts` – Liste, Status (`loading` / `success` / `error`), Fehlermeldung, `reload()`.
       Statusnamen und Abbruch-Flag wie in `useTanks`.

## Fertig, wenn

- [x] Kein Import von `@supabase/*` außerhalb von `src/services/` (die ESLint-Regel meldet nichts)
- [x] Kein `any`, keine handgeschriebenen Tabellentypen
- [x] Jede Funktion wirft bei Fehlern eine deutsche Meldung mit `cause`
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Kein `status` im Insert – die Datenbank setzt `im_bestand` selbst.
- **Nicht in diesem Task:** der Systemeintrag „Koralle angelegt" in der Historie (FR-3.4) und `getCoral(id)` /
  `useCoral(id)` für die Detailseite. Beides gehört zu MS-6; der Service wird dann erweitert.
- `becken_id` wird vom Frontend nicht gegen fremde Becken geprüft – laut ER-Modell Festlegung 12 bewusst nicht, weil
  fremde Becken-IDs nicht bekannt werden.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `koralle`, RLS-Matrix, Festlegungen 1 und 12
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Tabelle und Policies `koralle`
- `src/services/tank.ts`, `src/hooks/useTanks.ts` – bestehendes Muster
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.2, FR-1.14, NFR-4.3, NFR-4.4
