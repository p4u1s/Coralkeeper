# TASK-08a-04 · Erneute Anmeldung und zweiter Testnutzer

**Status:** erledigt (02.10.2026)
**Bezug:** Abschnitt 7 Einleitung („nach erneuter Anmeldung unverändert") und Schritt 9 · FR-4.2, FR-6.2, NFR-3.1
**Voraussetzung:** TASK-08a-03 (Datenstand von C eingetragen, IDs notiert, Inserat sichtbar)

---

## Worum geht es

Zwei Nachweise: Die Daten von C liegen nach einer neuen Anmeldung unverändert vor, und Testnutzer B sieht von C
ausschließlich das sichtbare Inserat – in der App gar nichts, in der Datenbank nur dieses eine Inserat.

## Vor dem Start klären

- [x] **Nachweisweg für Schritt 9.** In TASK-07-08 entschieden: SQL-Testblock plus Gegenprobe in der App, kein
      REST-Abruf. Vorschlag: genauso, als **neue** Datei
      `TASK-08a-04_Schritt 6_RLS-Test-Nutzer-C.sql` in diesem Ordner, abgeleitet aus
      `MS-07_Ableger-Inserat/tasks/TASK-07-08_Schritt 2_RLS-Inserat-Test.sql`. Der Block sucht die IDs von C selbst (über die
      E-Mail in `auth.users`), statt feste Test-IDs zu verwenden.
      → **Entschieden am 02.10.2026:** wie vorgeschlagen.

## Schritte

### A · Erneute Anmeldung (Nutzer, als C)

1. [ ] Abmelden, Browser vollständig schließen. Bei Entscheidung (b) aus TASK-08a-01 auf dem **Smartphone** anmelden.
2. [ ] Jeden Bereich mit dem Datenstand aus TASK-08a-03 vergleichen, Ergebnis ins Protokoll (Zeilen 1–3).
3. [ ] Abmelden.

### B · App als Testnutzer B (Nutzer)

4. [ ] Als B anmelden: Bestand, Beckenliste und Diary zeigen keine Daten von C.
5. [ ] Direktaufrufe mit den notierten IDs von C, jeweils mit `…/Coralkeeper` davor:
   - `/becken/<Becken>`
   - `/koralle/<Koralle>`
   - `/koralle/<Ableger>`
   - `/koralle/<Ableger>/inserat/neu`
   - `/diary/messwert/<Messwert>/bearbeiten`
   - `/diary/ereignis/<Ereignis>/bearbeiten`

     Erwartet jeweils: „nicht gefunden", keine Daten von C.

### C · Datenbank (Claude schreibt, Nutzer führt aus)

6. [ ] Testblock als `do $$ … $$` mit abschließendem `raise exception`, alles zurückgerollt:
   - als `postgres`: IDs von C ermitteln (Becken, beide Korallen, Inserat, Historie, Diary) und zählen – sonst sagt
     „B liest 0" nichts aus; Abbruch, wenn C kein sichtbares Inserat hat
   - als B: sichtbares Inserat von C → **1 Zeile**
   - als B: Becken, Korallen, Historieneinträge, Messwerte, Becken-Ereignisse von C → **je 0 Zeilen**
   - als B: Inserat von C ändern bzw. löschen → **0 Zeilen**, Inserat unverändert
   - als B: Koralle von C ändern → **0 Zeilen**
7. [ ] Ergebnis aus der Fehlermeldung ins Protokoll übernehmen (Zeilen 6–9).

## Protokoll

Datum: · Gerät erneute Anmeldung:

| #   | Prüfung                                              | Erwartet                                                  | Ergebnis |
| --- | ---------------------------------------------------- | --------------------------------------------------------- | -------- |
| 1   | C neu angemeldet: Becken und Korallen                | wie Datenstand TASK-08a-03 (Abschnitt 7, Einleitung)      |          |
| 2   | C: Steckbrief, Historie, Inserat                     | wie Datenstand TASK-08a-03                                |          |
| 3   | C: Diary-Einträge                                    | wie Datenstand TASK-08a-03, gelöschter Eintrag bleibt weg |          |
| 4   | B: Bestand, Beckenliste, Diary                       | keine Daten von C (**Abnahme 9**)                         |          |
| 5   | B: sechs Direktaufrufe mit IDs von C                 | jeweils „nicht gefunden" (**Abnahme 9**, FR-6.2)          |          |
| 6   | SQL: B liest sichtbares Inserat von C                | 1 Zeile (**Abnahme 9**, FR-4.2)                           |          |
| 7   | SQL: B liest Becken, Korallen, Historie, Diary von C | je 0 Zeilen (**Abnahme 9**)                               |          |
| 8   | SQL: B ändert bzw. löscht Inserat und Koralle von C  | 0 Zeilen, Daten unverändert                               |          |
| 9   | SQL: Testblock zurückgerollt                         | keine Testreste, Daten von C unverändert                  |          |

## Fertig, wenn

- [ ] Alle neun Zeilen haben ein Ergebnis
- [ ] Die SQL-Datei liegt in diesem Ordner
- [ ] Ein nicht bestandener Test ist als Befund vermerkt – **nicht** behoben

## Hinweise

- RLS ohne passende Policy wirft bei UPDATE und DELETE keinen Fehler, sondern betrifft 0 Zeilen – Zeilenzahl mit
  `get diagnostics … = row_count` prüfen (wie in TASK-07-08).
- Der SQL-Editor zeigt nur das letzte Ergebnis; deshalb steht das ganze Protokoll in der Fehlermeldung.
- Ein Direktaufruf, der nicht „nicht gefunden" zeigt, sondern z. B. leer bleibt oder auf die Startseite springt, ist
  trotzdem kein Datenleck – aber als Notiz festhalten.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 7 Einleitung und Schritt 9, FR-4.2, FR-6.2
- `Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-08_RLS-Nachweis-zweiter-Nutzer.md` – Muster
- `Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-08_Schritt 2_RLS-Inserat-Test.sql` – Vorlage
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – RLS-Matrix
