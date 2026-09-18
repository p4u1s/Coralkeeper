# MS-4 · Aufgaben im Detail

**Stand: 18.09.2026**

Dieser Ordner zerlegt die neun Tasks aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-04_UI-Shell-Becken.md`](../MS-04_UI-Shell-Becken.md) (Umfang und Definition of Done).

**Prüfstand 18.09.2026:** Tabelle `becken` mit RLS für alle vier Operationen besteht seit MS-3, die generierten Typen
enthalten sie bereits – MS-4 braucht **keine Migration und keine neue Typgenerierung**. Das Dark Theme ist seit MS-3
aktiv (`class="dark"` in `index.html`, Tokens in `src/index.css`); in MS-4 nur neu hinzukommende shadcn-Komponenten an die Tokens anpassen.

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
`npm run build`, `npm run lint`, `npm run format` (siehe `CLAUDE.md`).

---

## Reihenfolge und Abhängigkeiten

```text
TASK-04-01  Routen & App-Layout
    │
    ├── TASK-04-02  Bottom-Navigation
    │
TASK-04-03  Becken-Service & Hooks
    │
TASK-04-04  Beckenliste
    │
TASK-04-05  Becken anlegen (Formular)
    │
    ├── TASK-04-06  Leerzustand im Bestand (FR-1.15)
    │
TASK-04-07  Beckendetail & Bearbeiten
    │
TASK-04-08  Löschen mit Bestätigung & Löschsperre
    │
TASK-04-09  Responsive, Deployment, Abnahme
```

TASK-04-02 und 04-03 hängen nur an 04-01 und können in beliebiger Reihenfolge laufen.
TASK-04-06 braucht das Formular aus 04-05 als Ziel der „direkten Aktion".

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt. Sie stehen jeweils im Abschnitt
„Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                     | Wo         |
| --- | ----------------------------------------------------------------------------------------- | ---------- |
| 1   | Pfad für „Becken bearbeiten" – die Routenliste (Abschnitt 7, alt) nennt keinen            | TASK-04-01 |
| 2   | Was zeigen „Diary" und „Profil" in der Navigation, solange MS-8 und MS-9 fehlen?          | TASK-04-01 |
| 3   | Wohin wandert „Abmelden", wenn der Platzhalter-Bestand ersetzt wird?                      | TASK-04-01 |
| 4   | Icons der Bottom-Navigation: lucide oder die SVGs aus dem Mockup?                         | TASK-04-02 |
| 5   | Dateiname des Becken-Service                                                              | TASK-04-03 |
| 6   | Löschsperre: nur Datenbankfehler auswerten oder vorher Korallen zählen?                   | TASK-04-03 |
| 7   | Validierungsregeln für Name, Volumen und Startdatum                                       | TASK-04-05 |
| 8   | Ziel nach „Speichern" und „Abbrechen"                                                     | TASK-04-05 |
| 9   | Was zeigt der Bestand, wenn Becken existieren, die Korallenliste (MS-5) aber noch fehlt?  | TASK-04-06 |
| 10  | Text des Löschdialogs – Diary-Einträge des Beckens werden per `CASCADE` mitgelöscht       | TASK-04-08 |

> **Routenliste:** Die Pfade stammen aus Abschnitt 7 der alten Requirements v2.2 (wie schon `/login`, `/register`, `/`
> in TASK-03-09). Die Entscheidung, diesen Abschnitt in die aktive Anforderungsanalyse zurückzuholen, ist weiterhin offen.

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md, design.md und
Dokumentation/Meilensteine/MS-04_UI-Shell-Becken/MS-04_UI-Shell-Becken.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-04_UI-Shell-Becken/tasks/TASK-04-XX.md um.

1. Kläre die Punkte unter „Vor dem Start klären" mit mir, bevor du etwas änderst.
2. Zeig mir jede Änderung vorher als Vorschlag und warte auf meine Freigabe.
   Code als reinen Code mit Zeilenangabe, nie als Diff.
3. Arbeite die Schritte in der angegebenen Reihenfolge ab.
4. Validiere nach Codeänderungen nur mit npm run build, npm run lint und npm run format
   im Projektordner Coralkeeper/ – keine Tests.
5. Prüf am Ende jedes Kriterium unter „Fertig, wenn" und sag mir, was offen bleibt.
6. Was dir außerhalb dieses Tasks auffällt: benennen, nicht anfassen.
```
