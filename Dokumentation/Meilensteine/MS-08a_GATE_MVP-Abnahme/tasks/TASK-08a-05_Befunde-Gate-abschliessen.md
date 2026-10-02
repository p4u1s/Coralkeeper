# TASK-08a-05 · Befunde auswerten, Gesamtprotokoll, Gate abschließen

**Status:** erledigt (02.10.2026)
**Bezug:** MS-08a („Ergebnis protokolliert", „ehrlicher Abbruchpunkt") · Abschnitt 1.1 (MVP-Umfang) · Abschnitt 7
**Voraussetzung:** TASK-08a-02 bis 08a-04

---

## Worum geht es

Die Ergebnisse der drei Abnahmeläufe werden zu einem Gesamtergebnis zusammengeführt. Blocker werden behoben und
nachgeprüft, Notizen einem späteren Meilenstein zugeordnet. Danach ist nachweisbar, dass der Pflichtumfang erfüllt
ist, und MS-9 kann beginnen.

## Vor dem Start klären

- [x] **Wo steht das Gesamtergebnis?**
  - **(a)** Nur hier in dieser Datei, dazu ✅ in der Spalte „Stand" von `Milestones.md`
  - **(b)** Wie (a), zusätzlich ein kurzer Abschnitt „Ergebnis" in `MS-08a_GATE_MVP-Abnahme.md` (Datum, bestanden,
    Verweis auf diese Datei)
    → Vorschlag: **(b)** – das Gate-Dokument ist der Ort, an dem man das Ergebnis später sucht.
    → **Entschieden am 02.10.2026:** (b).
- [x] **Konto C nach dem Gate.**
  - **(a)** Behalten, als Nachweis der Abnahme; in den Sitzungsständen als „Abnahmekonto" vermerken
  - **(b)** In Supabase löschen
    → Vorschlag: **(a)** – die Kontolöschung ist noch ungeprüft (Risiko aus TASK-07-04), und C stört nicht.
    → **Entschieden am 02.10.2026:** (a).

## Schritte

### A · Befunde

1. [ ] Alle nicht bestandenen Zeilen und Notizen aus TASK-08a-02 bis 08a-04 in die Befundtabelle unten übernehmen.
2. [ ] Jeden Befund nach der Regel aus TASK-08a-01 als **Blocker** oder **Notiz** einordnen.
3. [ ] **Je Blocker** eine eigene Task-Datei `TASK-08a-06_…` ff. in diesem Ordner (Ursache, Fix, betroffener
       Abnahmeschritt) und in [`../Tasks.md`](../Tasks.md) ergänzen. Umsetzen wie jeder andere Task, eigene Session.
       Danach den betroffenen Abnahmeschritt am deployten Stand wiederholen und das Ergebnis hier eintragen.
4. [ ] **Je Notiz** den Zielmeilenstein festlegen (MS-9 bis MS-12) und dort vermerken – Vorschlag je Notiz vorlegen,
       erst nach Freigabe eintragen.

### B · Gesamtergebnis

5. [ ] Tabelle „Abnahmeschritte" unten ausfüllen.
6. [ ] Tabelle „MVP-Umfang" unten ausfüllen – sie zeigt, dass jede der sieben Pflichtfunktionen aus Abschnitt 1.1
       abgenommen ist.
7. [ ] Gesamtergebnis nach Entscheidung (a) oder (b) eintragen; ✅ für 🚦 in `Milestones.md` setzen.
8. [ ] TASK-08a-01 bis 08a-05 (und eventuelle Fix-Tasks) in [`../Tasks.md`](../Tasks.md) abhaken.

## Befunde

| #   | Herkunft (Task, Zeile) | Befund | Blocker / Notiz | Ziel bzw. Fix-Task | Nachprüfung |
| --- | ---------------------- | ------ | --------------- | ------------------ | ----------- |
|     |                        |        |                 |                    |             |

## Abnahmeschritte (Abschnitt 7)

Datum: · Commit-Stand: · Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Abnahmeschritt                                              | Nachweis                 | Ergebnis |
| --- | ----------------------------------------------------------- | ------------------------ | -------- |
| 1   | Registrierung, Profil automatisch, ohne E-Mail-Bestätigung  | TASK-08a-02, Zeilen 1–2  |          |
| 2   | Anmeldung → Bestand; geschützte Route ohne Session          | TASK-08a-02, Zeilen 3–4  |          |
| 3   | Leerer Bestand mit Hinweis, Becken in einem Formular        | TASK-08a-02, Zeilen 5–6  |          |
| 4   | Koralle: Becken Pflicht, Feldfehler                         | TASK-08a-02, Zeilen 7–8  |          |
| 5   | Steckbrief ausfüllen und ändern, „keine Angabe"             | TASK-08a-03, Zeilen 1–2  |          |
| 6   | Journaleintrag, nicht bearbeitbar, Systemeintrag Anlage     | TASK-08a-03, Zeilen 3–5  |          |
| 7   | Ableger im Bestand, Inserat, Status „Zur Abgabe"            | TASK-08a-03, Zeilen 6–7  |          |
| 8   | Diary: drei Eintragsarten, einer korrigiert, einer gelöscht | TASK-08a-03, Zeilen 8–12 |          |
| 9   | Zweiter Nutzer sieht nur das sichtbare Inserat              | TASK-08a-04, Zeilen 4–9  |          |
| —   | Daten nach erneuter Anmeldung unverändert                   | TASK-08a-04, Zeilen 1–3  |          |

## MVP-Umfang (Abschnitt 1.1)

| #   | MVP-Funktion                                | Abnahmeschritt | Erfüllt |
| --- | ------------------------------------------- | -------------- | ------- |
| 1   | Nutzer anlegen                              | 1, 2           |         |
| 2   | Becken anlegen                              | 3              |         |
| 3   | Koralle anlegen                             | 4              |         |
| 4   | Steckbrief anlegen                          | 5              |         |
| 5   | Historieneintrag anlegen                    | 6              |         |
| 6   | Ableger anlegen und zur Abgabe freischalten | 7, 9           |         |
| 7   | Diary-Eintrag anlegen und editieren         | 8              |         |

## Fertig, wenn

- [ ] Jeder Befund ist eingeordnet; jeder Blocker ist behoben **und** am deployten Stand nachgeprüft
- [ ] Jede Notiz steht im Zielmeilenstein
- [ ] Alle neun Abnahmeschritte und die erneute Anmeldung sind bestanden
- [ ] Alle sieben MVP-Funktionen sind als erfüllt markiert
- [ ] Gesamtergebnis eingetragen, ✅ für 🚦 in `Milestones.md` gesetzt
- [ ] Entscheidungen in der Tabelle in [`README.md`](README.md) eingetragen

## Hinweise

- Ein Fix im Gate behebt nur den Blocker – kein Ausbau, keine „verwandten" Verbesserungen. Was dabei auffällt, wird
  als Notiz einsortiert.
- Ist das Gate bestanden, ist der Pflichtumfang nachgewiesen. Alles ab MS-9 ist Ausbau.

## Quellen

- [`../MS-08a_GATE_MVP-Abnahme.md`](../MS-08a_GATE_MVP-Abnahme.md)
- `Dokumentation/Meilensteine/Milestones.md` – Abschnitt 2 (Spalte „Stand"), Abschnitt 3 (Gate)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 1.1, Abschnitt 7
- `Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-04_Inserat-Status-koppeln.md` – Risiko Kontolöschung
