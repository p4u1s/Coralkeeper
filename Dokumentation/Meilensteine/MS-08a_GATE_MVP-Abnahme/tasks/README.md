# 🚦 MS-08a · Aufgaben im Detail

**Stand: 01.10.2026**

Dieser Ordner zerlegt das MVP-Gate aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-08a_GATE_MVP-Abnahme.md`](../MS-08a_GATE_MVP-Abnahme.md) und Abschnitt 7 der Anforderungsanalyse
(„Abnahmekriterien MVP", neun Schritte).

**Kern des Gates:** Ein **frischer Nutzer** schafft die ganze Kette der neun Schritte **am deployten Stand**, und die
Daten liegen nach erneuter Anmeldung unverändert vor. Das Ergebnis wird protokolliert. Erst danach beginnt MS-9.
Im Gate wird **nichts ausgebaut** – Code ändert sich nur, wenn ein Abnahmeschritt scheitert (siehe TASK-08a-05).

**Prüfstand 01.10.2026:**

- **MS-8 ist abgeschlossen** (TASK-08-09, 01.10.2026); `Milestones.md` zeigt ✅ für MS-1 bis MS-8.
- Jeder der neun Schritte ist bereits **einzeln** in seinem Meilenstein abgenommen (TASK-03-10, 04-09, 05-05, 06-09,
  07-08, 07-09, 08-09) – aber mit den gewachsenen Daten von Testnutzer A. Die durchgehende Kette mit einem **neuen**
  Konto gab es noch nicht. Genau das ist neu im Gate.
- Testnutzer A (`ddd19768-…`) und B (`094fa34b-…`) bestehen, volle IDs in
  `MS-07_Ableger-Inserat/tasks/TASK-07-08_Schritt 2_RLS-Inserat-Test.sql`.
- Adresse: <https://p4u1s.github.io/Coralkeeper/>
- Korallenformular: Becken **ohne** Vorbelegung (`CoralForm.tsx`, Startwert leer) – Schritt 4 ist direkt prüfbar.
- Steckbrief-Anzeige zeigt „keine Angabe" für leere Felder (`CoralProfile.tsx`). Symbole und Legende (FR-2.3) bleiben
  MS-9 und sind **nicht** Teil der Abnahme.
- Journaleinträge haben in der App weder Bearbeiten noch Löschen; der Datenbank-Nachweis liegt in TASK-06-08.
- Für andere Nutzer gibt es in der App **keine** Inseratsliste (FR-4.3, MS-11). „B sieht ausschließlich das sichtbare
  Inserat" ist nur in der Datenbank nachweisbar – wie in TASK-07-08 entschieden.
- Bekannt und **nicht** Gegenstand des Gates: Chunk-Warnung > 500 kB beim Build, `__dirname`-Warnung.

---

## Aufbau jeder Task-Datei

| Abschnitt                | Inhalt                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| **Worum geht es**        | Ziel in zwei, drei Sätzen, mit Bezug auf Abschnitt 7                   |
| **Vor dem Start klären** | Entscheidungen, die vor dem Durchspielen getroffen sein müssen         |
| **Schritte**             | Arbeitsschritte in der sinnvollen Reihenfolge                          |
| **Protokoll**            | Test, Erwartung, Ergebnis – wird beim Durchspielen ausgefüllt          |
| **Fertig, wenn**         | Akzeptanzkriterien – erst wenn alle abgehakt sind, ist der Task fertig |
| **Hinweise**             | Stolperstellen, Abgrenzung                                             |
| **Quellen**              | Die Dokumente, aus denen der Task abgeleitet ist                       |

Ist ein Task fertig, wird er zusätzlich in [`../Tasks.md`](../Tasks.md) abgehakt.
Die Browser-Prüfungen macht der Nutzer im Firefox; Claude führt das Protokoll, liefert SQL und validiert
Codeänderungen nur mit `npm run build`, `npm run lint`, `npm run format` (siehe `CLAUDE.md`). SQL führt der Nutzer
selbst im Supabase-SQL-Editor aus.

---

## Reihenfolge und Abhängigkeiten

```text
MS-8 abgeschlossen
    │
TASK-08a-01  Vorbereitung (Deploy-Stand, Testkonten, Ablauf)
    │
TASK-08a-02  Abnahmelauf Teil 1: Schritte 1–4 als neuer Nutzer C
    │
TASK-08a-03  Abnahmelauf Teil 2: Schritte 5–8, mit denselben Daten weiter
    │
TASK-08a-04  Erneute Anmeldung · Schritt 9 (B gegen die Daten von C)
    │
TASK-08a-05  Befunde, Gesamtprotokoll, Gate abschließen
    │         (scheitert ein Schritt: Fix-Task 08a-06 ff., danach betroffenen Schritt wiederholen)
    │
MS-9
```

02 und 03 sind **eine** Kette mit demselben Konto C – die Daten aus 02 sind die Grundlage für 03, die aus 03 die
Grundlage für 04. Zwischen den Tasks nichts an den Daten von C ändern.

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt. Sie stehen jeweils im Abschnitt „Vor dem Start klären" des
genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                    | Wo          | Stand                                                                |
| --- | ---------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| 1   | Wer spielt den „frischen Nutzer ohne Vorwissen"?                                         | TASK-08a-01 | entschieden: der Nutzer selbst, nur über die Oberfläche              |
| 2   | Auf welchem Gerät läuft die Kette (Smartphone, Firefox, beides)?                         | TASK-08a-01 | entschieden: ganze Kette auf dem Smartphone                          |
| 3   | E-Mail-Adresse und Passwort für Testnutzer C                                             | TASK-08a-01 | entschieden: `user_c@example.com`, Passwort nicht dokumentiert       |
| 4   | Was gilt als Blocker, was als Notiz für später?                                          | TASK-08a-01 | entschieden: wie vorgeschlagen                                       |
| 5   | Schritt 6: Append-only in der Datenbank erneut nachweisen oder auf TASK-06-08 verweisen? | TASK-08a-03 | entschieden: (a) – nur App, für die Datenbank Verweis auf TASK-06-08 |
| 6   | Schritt 9: Nachweisweg wie in TASK-07-08 (SQL-Test plus Gegenprobe in der App)?          | TASK-08a-04 | entschieden: wie vorgeschlagen                                       |
| 7   | Wo steht das Gesamtergebnis, und wird `MS-08a_GATE_MVP-Abnahme.md` ergänzt?              | TASK-08a-05 | entschieden: (b) – zusätzlich Abschnitt „Ergebnis" im Gate-Dokument  |
| 8   | Konto C nach dem Gate behalten oder löschen?                                             | TASK-08a-05 | entschieden: (a) – behalten als Abnahmekonto                         |

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md und
Dokumentation/Meilensteine/MS-08a_GATE_MVP-Abnahme/MS-08a_GATE_MVP-Abnahme.md,
dazu Abschnitt 7 von Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-08a_GATE_MVP-Abnahme/tasks/TASK-08a-XX.md um.

1. Kläre die Punkte unter „Vor dem Start klären" mit mir, bevor du etwas änderst.
2. Die Prüfungen im Browser mache ich am deployten Stand im Firefox. Führ mich Zeile für Zeile
   durch das Protokoll und trag meine Ergebnisse ein.
3. Im Gate wird nichts ausgebaut. Scheitert ein Schritt: Ursache benennen, Befund ins Protokoll,
   nichts am Code ändern.
4. SQL führe ich selbst im Supabase-SQL-Editor aus – liefere es mir mit einer Kontrollabfrage
   und dem erwarteten Ergebnis.
5. Zeig mir jede Dateiänderung vorher als Vorschlag und warte auf meine Freigabe.
6. Prüf am Ende jedes Kriterium unter „Fertig, wenn" und sag mir, was offen bleibt.
7. Was dir außerhalb dieses Tasks auffällt: benennen, nicht anfassen.
```
