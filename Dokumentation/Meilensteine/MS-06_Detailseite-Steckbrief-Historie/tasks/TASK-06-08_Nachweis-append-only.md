# TASK-06-08 · Nachweis: Historie ist append-only

**Status:** erledigt (28.09.2026)
**Bezug:** FR-3.3, Definition of Done MS-6 („ein gespeicherter Historieneintrag ist **nachweislich** weder bearbeitbar
noch löschbar"), ER-Modell Festlegung 7, FR-6.2
**Voraussetzung:** TASK-06-07

---

## Worum geht es

Die Unveränderlichkeit wird in der Datenbank erzwungen, nicht in der UI (Festlegung 7). Dieser Task liefert den
Nachweis dafür – auf zwei Ebenen: Die Datenbank lehnt Ändern und Löschen ab, und die Oberfläche bietet es nicht an.

## Schritte

### A · Datenbank

1. [x] **Test als `do $$ … $$`-Block** mit abschließendem `raise exception` (Muster:
       `MS-03_Fundament-Auth/tasks/TASK-03-05_Schritt 7-8_RLS-Test.sql`), angemeldet als Testnutzer A:
   - **Gegenprobe:** A liest den eigenen Eintrag `aaaaaaaa-…-000000000005` (1 Zeile) und legt einen eigenen
     Journaleintrag an – sonst sagt der Test nichts aus
   - A versucht `update` auf den eigenen Eintrag → 0 Zeilen betroffen, Text unverändert
   - A versucht `delete` auf den eigenen Eintrag → 0 Zeilen betroffen, Eintrag noch vorhanden
   - dasselbe für den gerade angelegten Eintrag

   → `TASK-06-08_Schritt 1_Append-only-Test.sql`
2. [x] Ergebnis aus der Fehlermeldung ins Protokoll unten übernehmen.
3. [x] **Kontrollabfrage** auf `pg_policies`: für `historieneintrag` existieren nur SELECT- und INSERT-Policies.

### B · Oberfläche und Code

4. [x] Im Historie-Tab bietet kein Eintrag eine Aktion zum Ändern oder Löschen.
5. [x] In `src/` gibt es keinen Aufruf von `update` oder `delete` auf `historieneintrag` (Suche im Code).
       → 28.09.2026: `historieneintrag` nur in `src/services/history.ts` (`select`, `insert`); die einzigen
       `update`/`delete`-Aufrufe in `src/` gehen auf `koralle` und `becken`.

## Protokoll

Datum: 28.09.2026

| #   | Prüfung                                            | Erwartet                    | Ergebnis                                              |
| --- | -------------------------------------------------- | --------------------------- | ----------------------------------------------------- |
| 1   | Gegenprobe: A liest eigenen Eintrag                | 1 Zeile                     | 1 Zeile ✔                                             |
| 2   | Gegenprobe: A legt Journaleintrag an               | gelingt                     | gelingt ✔                                             |
| 3   | A ändert eigenen Eintrag                           | 0 Zeilen, Text unverändert  | 0 Zeilen, Text unverändert – alt und neu ✔            |
| 4   | A löscht eigenen Eintrag                           | 0 Zeilen, Eintrag vorhanden | 0 Zeilen, Eintrag vorhanden – alt und neu ✔           |
| 5   | Policies auf `historieneintrag`                    | nur SELECT und INSERT       | `_select_eigene`, `_insert_eigene`, sonst keine ✔     |
| 6   | Historie-Tab: Aktionen am Eintrag                  | keine                       | keine ✔                                               |
| 7   | Codesuche `update`/`delete` auf `historieneintrag` | kein Treffer                | kein Treffer ✔                                        |

## Fertig, wenn

- [x] Alle Zeilen im Protokoll bestanden (**Definition of Done**)
- [x] Der Testblock hat alles zurückgerollt (keine Testreste in der Datenbank)

## Hinweise

- RLS ohne passende Policy wirft bei UPDATE und DELETE **keinen Fehler**, sondern betrifft einfach 0 Zeilen. Der Test
  muss deshalb die Zeilenzahl (`get diagnostics … = row_count`) und den Zustand danach prüfen, nicht auf einen Fehler
  warten.
- Das Löschen einer ganzen Koralle nimmt ihre Historie per `CASCADE` mit – das ist gewollt (ER-Modell, Hinweis unter
  der Fremdschlüsseltabelle) und kein Verstoß gegen FR-3.3. Korallen löschen kommt erst mit MS-9.
- Mit dem `service_role`-Schlüssel wäre Ändern möglich – der liegt nie im Frontend (NFR-3.2).

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – RLS-Matrix, Festlegung 7, Fremdschlüssel
  `historieneintrag.koralle_id`
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Abschnitt „Historieneintrag"
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-05_Schritt 7-8_RLS-Test.sql` – Testmuster
