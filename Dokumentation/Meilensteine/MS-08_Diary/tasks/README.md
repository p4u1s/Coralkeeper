# MS-8 · Aufgaben im Detail

**Stand: 29.09.2026**

Dieser Ordner zerlegt die neun Tasks aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-08_Diary.md`](../MS-08_Diary.md) (Umfang und Definition of Done).

**Prüfstand 29.09.2026:**

- **MS-7 ist noch nicht abgeschlossen:** TASK-07-08 (RLS-Nachweis) und TASK-07-09 (Abnahme) sind offen.
- Tabellen `messwert` und `becken_ereignis` bestehen seit MS-3 mit RLS für SELECT, INSERT, UPDATE und DELETE, jeweils
  „eigene" (Festlegung 8). Dass B fremde Zeilen weder lesen noch ändern noch löschen kann, ist in TASK-03-05 geprüft.
  **Keine neue Tabelle nötig**, solange TASK-08-01 keine Schemaänderung beschließt.
- `messwert` speichert **einen Wert je Zeile**: `parameter` (Enum `messparameter`: `kh`, `ca`, `mg`, `no3`, `po4`,
  `temperatur`, `salinitaet`), `wert numeric NOT NULL`, `einheit text` (nullable, ohne Standardwert), `datum NOT NULL`
  ohne Standardwert. Eine Messung mit drei Werten sind also drei Zeilen.
- `becken_ereignis`: `typ` (Enum `ereignis_typ`: `wasserwechsel`, `fuetterung`, `vorfall`), `menge` und `text` als
  Freitext, `koralle_id` nullable (`ON DELETE SET NULL`), `datum NOT NULL` ohne Standardwert.
- Beide Tabellen haben **keine** Spalte `erstellt_am`.
- Beide hängen mit `CASCADE` am Becken; der Löschdialog des Beckens nennt die Diary-Einträge schon (TASK-04-08).
- Die generierten Typen enthalten beide Tabellen und beide Enums.
- `/diary` ist eine Platzhalterseite mit Bottom-Navigation (`src/pages/DiaryPage.tsx`, TASK-04-01).
- Testdaten von A: Becken …01, Messwert …08 (`kh`, Wert 8, **ohne** Einheit), Ereignis …09 (`fuetterung`, ohne
  Menge und Text). Volle IDs in `MS-03_Fundament-Auth/tasks/TASK-03-05_Schritt 7-8_RLS-Test.sql`.
- Mockup (`Coralkeeper.dc.html`): Screen „Diary" mit **einem** Primärbutton „Eintrag hinzufügen", Einträge nach Datum
  gruppiert, je Karte Typ-Etikett, Bezug (Becken) und Titel; eine Messung steht als **eine** Karte
  („8,1 dKH · 425 mg/l Ca · 1.320 mg/l Mg"). Einheiten im Mockup: dKH, mg/l, °C – Salinität kommt nicht vor.
  Beckendetail mit Karte „Letzte Messung", Button „Messwert erfassen" und Verlaufsdiagramm (FR-5.2, MS-10).
- Frühere Verweise auf MS-8: Messwert-Anzeige in der Beckenliste (TASK-04-04), „Diary-Tabs" im Beckendetail
  (TASK-04-07), Befund Ereignistypen FR-5.4 (TASK-02-02) – alle drei in TASK-08-01.
- Installierte shadcn-Komponenten: button, input, label, textarea, alert-dialog, native-select, tabs.

---

## Aufbau jeder Task-Datei

| Abschnitt                | Inhalt                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| **Worum geht es**        | Ziel in zwei, drei Sätzen, mit FR-/NFR-Bezug                           |
| **Vor dem Start klären** | Entscheidungen, die vor der ersten Codezeile getroffen sein müssen     |
| **Schritte**             | Arbeitsschritte in der sinnvollen Reihenfolge                          |
| **Fertig, wenn**         | Akzeptanzkriterien – erst wenn alle abgehakt sind, ist der Task fertig |
| **Hinweise**             | Stolperstellen, Abgrenzung                                             |
| **Quellen**              | Die Dokumente, aus denen der Task abgeleitet ist                       |

Ist ein Task fertig, wird er zusätzlich in [`../Tasks.md`](../Tasks.md) abgehakt.
Die Browser-Prüfungen unter „Fertig, wenn" macht der Nutzer; Claude validiert Codeänderungen nur mit
`npm run build`, `npm run lint`, `npm run format` (siehe `CLAUDE.md`). SQL führt der Nutzer selbst im
Supabase-SQL-Editor aus.

---

## Reihenfolge und Abhängigkeiten

```text
MS-7 abgeschlossen
    │
TASK-08-01  Festlegungen (Dokumentation, Datenbank nur bei Schemaänderung)
    │
TASK-08-02  Services, Hooks, Beschriftungen, Zahlenformat
    │
TASK-08-03  Diary-Übersicht /diary
    │
    ├── TASK-08-04  Messwerte erfassen
    │
    └── TASK-08-05  Wasserwechsel protokollieren
            │
        TASK-08-06  Ereignis protokollieren (erweitert das Formular aus 08-05)
    │
TASK-08-07  Bearbeiten (alle drei Eintragsarten)
    │
TASK-08-08  Löschen mit Bestätigungsdialog
    │
TASK-08-09  Responsive, Deployment, Abnahme
    │
🚦 GATE: MVP-Abnahme (MS-08a)
```

08-04 und 08-05/08-06 hängen nicht voneinander ab. Empfohlen ist die Nummernfolge – sie entspricht dem Ablauf der
Abnahme (Messwert, Wasserwechsel, Ereignis). 08-08 baut auf den Bearbeiten-Seiten aus 08-07 auf, falls der
Löschbutton dort sitzt (Entscheidung in 08-08).

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt oder widersprechen sich. Sie stehen jeweils im Abschnitt
„Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                                  | Wo         | Stand |
| --- | ------------------------------------------------------------------------------------------------------ | ---------- | ----- |
| 1   | Was ist ein Messwert-Eintrag – ein einzelner Wert (eine Zeile) oder alle Werte eines Beckens und Tags? | TASK-08-01 | offen |
| 2   | Einheiten je Parameter, insbesondere Salinität                                                         | TASK-08-01 | offen |
| 3   | Spalte `messwert.einheit` beim Speichern füllen oder leer lassen?                                      | TASK-08-01 | offen |
| 4   | Ereignistypen aus FR-5.4 (Bleaching, Schädling, Vernesselung): Freitext oder Enum erweitern?           | TASK-08-01 | offen |
| 5   | `fuetterung` (FR-5.5, MS-10) in MS-8 anlegbar oder nur anzeigen?                                       | TASK-08-01 | offen |
| 6   | Reihenfolge bei gleichem Datum ohne `erstellt_am`                                                      | TASK-08-01 | offen |
| 7   | Datum in der Zukunft erlaubt?                                                                          | TASK-08-01 | offen |
| 8   | Pfade für Anlegen und Bearbeiten                                                                       | TASK-08-01 | offen |
| 9   | Beckendetail und Beckenliste: „Letzte Messung", Messwert-Anzeige, „Messwert erfassen" in MS-8?         | TASK-08-01 | offen |
| 10  | Dateinamen für Services und Hooks                                                                      | TASK-08-02 | offen |
| 11  | Zahlenformat: Nachkommastellen, Dezimaltrenner bei der Eingabe                                         | TASK-08-02 | offen |
| 12  | Einstieg: ein Button „Eintrag hinzufügen" oder drei Buttons?                                           | TASK-08-03 | offen |
| 13  | Darstellung einer Messung in der Liste                                                                 | TASK-08-03 | offen |
| 14  | Typ-Etikett mit oder ohne Symbol                                                                       | TASK-08-03 | offen |
| 15  | Messwert-Formular: Plausibilitätsgrenzen, Hinweis „mindestens ein Wert", Becken vorbelegen             | TASK-08-04 | offen |
| 16  | Wasserwechsel: Pflichtfelder, Höchstlängen, Platzhalter                                                | TASK-08-05 | offen |
| 17  | Ereignis: Pflichtfelder, Auswahl der betroffenen Koralle                                               | TASK-08-06 | offen |
| 18  | Bearbeiten: welche Felder änderbar, wie wird die Seite erreicht?                                       | TASK-08-07 | offen |
| 19  | Löschen: Ort des Buttons, Dialogtexte                                                                  | TASK-08-08 | offen |

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md, design.md,
Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md und
Dokumentation/Meilensteine/MS-08_Diary/MS-08_Diary.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-08_Diary/tasks/TASK-08-XX.md um.

1. Kläre die Punkte unter „Vor dem Start klären" mit mir, bevor du etwas änderst.
2. Zeig mir jede Änderung vorher als Vorschlag und warte auf meine Freigabe.
   Code als reinen Code mit Zeilenangabe, nie als Diff.
3. Arbeite die Schritte in der angegebenen Reihenfolge ab.
4. SQL führe ich selbst im Supabase-SQL-Editor aus – liefere es mir mit einer Kontrollabfrage
   und dem erwarteten Ergebnis.
5. Validiere nach Codeänderungen nur mit npm run build, npm run lint und npm run format
   im Projektordner Coralkeeper/ – keine Tests.
6. Prüf am Ende jedes Kriterium unter „Fertig, wenn" und sag mir, was offen bleibt.
7. Was dir außerhalb dieses Tasks auffällt: benennen, nicht anfassen.
```
