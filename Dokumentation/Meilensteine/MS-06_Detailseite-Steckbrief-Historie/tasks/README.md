# MS-6 · Aufgaben im Detail

**Stand: 22.09.2026**

Dieser Ordner zerlegt die neun Tasks aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-06_Detailseite-Steckbrief-Historie.md`](../MS-06_Detailseite-Steckbrief-Historie.md) (Umfang und
Definition of Done).

**Prüfstand 22.09.2026:**

- Tabelle `historieneintrag` besteht seit MS-3 mit RLS für SELECT und INSERT, **ohne** UPDATE- und DELETE-Policy
  (Festlegung 7) – FR-3.3 ist in der Datenbank bereits erzwungen. `datum` ist `NOT NULL` **ohne** Standardwert,
  `text` ist nullable, `erstellt_am` hat `now()`.
- `koralle` hat eine UPDATE-Policy und alle Steckbrief-Spalten (`licht`, `stroemung`, `platzierung`, `nesselkraft`,
  `wuchsform`, `schwierigkeit`, `fuetterung`, `schutzstatus`) – **keine Migration** für den Steckbrief nötig.
- Die generierten Typen enthalten `historieneintrag`, die Enums `stufe`, `platzierung`, `historie_typ` und die
  Werteliste `Constants` – **keine neue Typgenerierung** nötig (ein Trigger ändert keine Typen).
- Auf `koralle` liegen seit TASK-06-01 (23.09.2026) die Trigger `bei_anlage_systemeintrag` und
  `bei_statuswechsel_systemeintrag`; Systemeinträge entstehen dort, nicht im Service.
- shadcn `tabs` ist **nicht** installiert (vorhanden: button, input, label, textarea, alert-dialog).
- Testnutzer A besitzt den Historieneintrag `aaaaaaaa-…-000000000005`.
- **MS-5 ist seit dem 22.09.2026 umgesetzt.** Vorhanden sind `src/services/coral.ts`, `src/hooks/useCorals.ts`
  (Liste), `src/components/CoralForm.tsx`, `src/pages/CoralCreatePage.tsx` und `src/components/ui/native-select.tsx`.
  **Nicht** vorhanden und damit Teil von MS-6: ein Hook für die einzelne Koralle und `CoralDetailPage`.

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
MS-5 abgeschlossen
    │
TASK-06-01  Systemeinträge (Datenbank)
    │
TASK-06-02  Historien-Service & Hook
    │
TASK-06-03  Steckbrief-Service & Beschriftungen
    │
TASK-06-04  Tab-Navigation & Steckbrief-Tab
    │
    ├── TASK-06-05  Steckbrief bearbeiten
    │
    └── TASK-06-06  Historie-Tab
            │
        TASK-06-07  Journaleintrag anlegen
            │
TASK-06-08  Nachweis append-only (FR-3.3)
    │
TASK-06-09  Responsive, Deployment, Abnahme
```

06-05 und 06-06 hängen beide nur an 06-04 und können in beliebiger Reihenfolge erledigt werden.
Alles andere streng nacheinander.

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt oder widersprechen sich. Sie stehen jeweils im Abschnitt
„Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                               | Wo         | Stand                                          |
| --- | --------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------- |
| 1   | Systemeinträge per Datenbank-Trigger oder im Service?                                               | TASK-06-01 | entschieden: Trigger (Anlage + Statuswechsel)  |
| 2   | Datum des Systemeintrags: UTC-Datum oder deutsches Datum?                                           | TASK-06-01 | entschieden: deutsches Datum (`Europe/Berlin`) |
| 3   | Wortlaut der Systemeinträge                                                                         | TASK-06-01 | entschieden: siehe TASK-06-01                  |
| 4   | Darf das Frontend Einträge vom Typ `system` selbst anlegen?                                         | TASK-06-01 | entschieden: ja, nicht eingeschränkt           |
| 5   | Sortierung der Historie – schon jetzt absteigend (FR-3.2 gehört eigentlich zu MS-10)?               | TASK-06-02 | entschieden: absteigend, neuester oben         |
| 6   | Steckbrief-Felder: Wuchsform als Liste oder Freitext, „Besonderheiten" ohne Spalte, Schutzstatus?   | TASK-06-03 | offen                                          |
| 7   | Steckbrief schon im Formular „Koralle anlegen" oder nur auf der Detailseite?                        | TASK-06-03 | offen                                          |
| 8   | Aktiver Tab als lokaler Zustand oder als URL-Parameter?                                             | TASK-06-04 | offen                                          |
| 9   | Aussehen der Tabs (design.md kennt keine Tabs)                                                      | TASK-06-04 | offen                                          |
| 10  | Steckbrief bearbeiten: eigene Formularseite oder direkt im Tab? Pfad?                               | TASK-06-05 | offen                                          |
| 11  | Journaleintrag: eigene Formularseite oder direkt im Tab? Pfad?                                      | TASK-06-07 | offen                                          |
| 12  | Validierung Journaleintrag: Zukunftsdatum erlaubt? Höchstlänge Text?                                | TASK-06-07 | offen                                          |
| 13  | Hinweis auf Unveränderlichkeit vor dem Speichern: Text im Formular oder Bestätigungsdialog?         | TASK-06-07 | offen                                          |

**Anmerkung zu Nr. 1 (23.09.2026, gilt für MS-9):** Der Trigger schreibt als Datum immer den Tag der Änderung.
FR-1.9 nennt beim Statuswechsel „Datum und optionale Notiz"; der Satz ist mehrdeutig. Festgelegt ist die einfache
Lesart: **kein Datumsfeld in der Statuswechsel-Oberfläche**, das Datum ist immer das Tagesdatum. Eine eingegebene
Notiz wird in MS-9 als zusätzlicher Journaleintrag gespeichert, nicht in den Systemeintrag geschrieben –
Historieneinträge sind append-only.

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md, design.md und
Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/MS-06_Detailseite-Steckbrief-Historie.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/tasks/TASK-06-XX.md um.

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
