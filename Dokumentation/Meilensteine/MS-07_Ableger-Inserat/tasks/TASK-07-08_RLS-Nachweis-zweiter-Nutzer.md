# TASK-07-08 · RLS-Nachweis mit zweitem Testnutzer

**Status:** erledigt (29.09.2026)
**Bezug:** **Definition of Done MS-7**, FR-4.2 („technisch über RLS erzwungen, nicht nur über die UI"), FR-6.2,
NFR-3.1, Abnahmekriterium Abschnitt 7 Punkt 9
**Voraussetzung:** TASK-07-01 bis 07-07

---

## Worum geht es

Der zweite Testnutzer sieht ausschließlich das sichtbare Inserat – keine Becken, keine Korallen, keine Diary-Daten,
auch nicht bei direktem Abruf über bekannte IDs. Der Nachweis läuft auf zwei Ebenen: in der Datenbank per Testblock
und in der App als Testnutzer B.

## Vor dem Start klären

- [x] **Wie „sieht" B das Inserat?** Eine Liste der Inserate für andere Nutzer ist FR-4.3 (MS-11, Should).
  - **(a)** SQL-Test plus Gegenprobe in der App (B sieht dort keine Daten von A)
  - **(b)** wie (a), zusätzlich ein direkter REST-Abruf mit dem Token von B, z. B. `/rest/v1/angebot?select=*` und
    `/rest/v1/koralle?id=eq.<ID>` – zeigt, dass die Sperre nicht an der Oberfläche hängt
  - **(c)** eine kleine Leseliste sichtbarer Inserate in der App – nimmt MS-11 vorweg
  → Vorschlag: **(a)**, (b) nur wenn gewünscht.
  → **Entschieden am 29.09.2026:** **(a)** – kein REST-Abruf, Schritt 6 entfällt.
- [x] **Testdaten.** Vorschlag: den Test aus TASK-03-05 unverändert wiederholen (feste IDs …01–…10) und einen neuen
      Test für die in MS-7 per App angelegten Datensätze von A schreiben – Ableger, Ursprungskoralle, Inserat des
      Ablegers. Deren IDs vorher per Abfrage ermitteln.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen. Für das unsichtbare Inserat wird zu Beginn (noch als
  `postgres`) das feste Test-Inserat …06 auf `sichtbar = false` gesetzt, das Inserat des Ablegers bleibt sichtbar.
  Die IDs von Ableger, Ursprungskoralle und Inserat sucht der Testblock selbst.

## Schritte

### A · Datenbank

1. [x] `MS-03_Fundament-Auth/tasks/TASK-03-05_Schritt 7-8_RLS-Test.sql` erneut ausführen, Ergebnis ins Protokoll.
       **Achtung Zeile 35:** B legt ein `bild_dokument` **ohne** `storage_pfad` an und erwartet „RLS-Fehler". Seit
       `storage_pfad NOT NULL` hängt das Ergebnis davon ab, dass Postgres RLS vor NOT NULL prüft – diese Zeile genau
       ansehen (vorgemerkt am 15.09.2026).
       → 29.09.2026: `bild_dokument` meldet „RLS-Fehler", RLS greift vor NOT NULL.
2. [x] **Neuer Test als `do $$ … $$`-Block** mit abschließendem `raise exception`, als
       `TASK-07-08_Schritt 2_RLS-Inserat-Test.sql` in diesem Ordner:
   - **Gegenprobe:** B legt eigenes Becken, eigene Koralle und eigenes Inserat an
   - B liest das Inserat des Ablegers von A → 1 Zeile, `art` und `handelsname` gefüllt (Festlegung 13)
   - B liest Ableger und Ursprungskoralle über ihre IDs → je 0 Zeilen
   - B liest die Historieneinträge von Ableger und Ursprungskoralle → 0 Zeilen
   - B liest Becken …01, Messwert …08, Ereignis …09 → je 0 Zeilen
   - B ändert und löscht das Inserat von A → 0 Zeilen, Inserat unverändert vorhanden
   - B legt ein Inserat für eine Koralle von A an → RLS-Fehler (Festlegung 12)
   - **unsichtbares Inserat:** vor dem Wechsel zu B (noch als Eigentümer der Sitzung) `sichtbar = false` setzen →
     B liest 0 Zeilen; bereitet MS-11 vor
   - ohne Anmeldung (`anon`) → `angebot` liefert 0 Zeilen
3. [x] Ergebnisse ins Protokoll übernehmen.
       → 29.09.2026: Testlauf mit Ableger „Hallo Testi 2 (Ableger)" (`c865f69c-…`), Ursprung `b1c43f5c-…`,
       Inserat `5500c93c-…`; 6 Historieneinträge von A.

### B · App (als Testnutzer B angemeldet)

4. [x] Bestand und Beckenliste zeigen keine Daten von A.
5. [x] Direktaufrufe mit IDs von A zeigen „nicht gefunden": `/koralle/<Ableger>`, `/koralle/<Ableger>/ableger/neu`,
       `/koralle/<Ableger>/inserat/neu`, `/becken/aaaaaaaa-0000-0000-0000-000000000001` (Pfade nach den Entscheidungen
       in TASK-07-03 und 07-06).
6. [x] Bei Entscheidung (b): REST-Abrufe mit dem Token von B, Ergebnis ins Protokoll.
       → entfällt, Entscheidung (a).

## Protokoll

Datum: 29.09.2026 · Stand: lokal

| #   | Prüfung                                                     | Erwartet                          | Ergebnis |
| --- | ----------------------------------------------------------- | --------------------------------- | -------- |
| 1   | Wiederholung TASK-03-05 (alle Tabellen)                     | jede Zeile „OK"                   | bestanden (29.09.): Gegenprobe, 10 Tabellen, 2 × Festlegung 12 „OK" |
| 2   | Gegenprobe: B legt eigene Daten an                          | gelingt                           | bestanden: liest eigenes Inserat, 1 Zeile |
| 3   | B liest sichtbares Inserat des Ablegers von A               | 1 Zeile, Art und Handelsname      | bestanden: 1 Zeile, beide gefüllt |
| 4   | B liest Ableger und Ursprungskoralle von A                  | 0 Zeilen                          | bestanden: 0 |
| 5   | B liest deren Historieneinträge                             | 0 Zeilen                          | bestanden: 0 (A hat 6) |
| 6   | B liest Becken, Messwert, Ereignis von A                    | 0 Zeilen                          | bestanden: je 0 |
| 7   | B ändert bzw. löscht Inserat von A                          | 0 Zeilen, Inserat unverändert     | bestanden: 0 / 0, Inserat noch sichtbar |
| 8   | B inseriert Koralle von A                                   | RLS-Fehler                        | bestanden: RLS-Fehler |
| 9   | B liest unsichtbares Inserat von A                          | 0 Zeilen                          | bestanden: 0 (Inserat …06) |
| 10  | `anon` liest `angebot`                                      | 0 Zeilen                          | bestanden: 0 |
| 11  | App: Bestand und Becken als B                               | keine Daten von A                 | bestanden |
| 12  | App: Direktaufrufe mit IDs von A                            | „nicht gefunden"                  | bestanden: alle vier Pfade |

## Fertig, wenn

- [x] Alle Zeilen im Protokoll bestanden (**Definition of Done MS-7**)
- [x] Beide Testblöcke haben alles zurückgerollt (keine Testreste in der Datenbank)

## Hinweise

- RLS ohne passende Policy wirft bei UPDATE und DELETE **keinen Fehler**, sondern betrifft 0 Zeilen – Zeilenzahl mit
  `get diagnostics … = row_count` prüfen, nicht auf einen Fehler warten.
- Die Diary-Oberfläche entsteht erst mit MS-8; „keine Diary-Daten" wird hier nur in der Datenbank nachgewiesen.
- Die Testdaten von A bleiben unangetastet; das Inserat des Ablegers wird für die Abnahme in TASK-07-09 gebraucht.

## Quellen

- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-05_Schritt 7-8_RLS-Test.sql` – Test und Muster
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-05_RLS-Policies.md` – Hinweis auf MS-7
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 2 (Ausnahmen, RLS-Matrix), Festlegungen 12, 13
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-4.2, FR-4.3, FR-6.2, Abschnitt 7 Punkt 9
