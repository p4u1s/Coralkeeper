# MS-5 · Aufgaben im Detail

**Stand: 22.09.2026**

Dieser Ordner zerlegt die fünf Tasks aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-05_Koralle-Bestand.md`](../MS-05_Koralle-Bestand.md) (Umfang und Definition of Done).

**Prüfstand 22.09.2026:** Tabelle `koralle` besteht seit MS-3 mit RLS für SELECT, INSERT und UPDATE; die DELETE-Policy
folgt laut RLS-Matrix erst in MS-9 (FR-1.10). Die generierten Typen enthalten `koralle` bereits – MS-5 braucht
**keine Migration und keine neue Typgenerierung**. `status` hat den Standardwert `im_bestand`. Die Tabelle hat **keine
Anlagezeit-Spalte**. Testnutzer A besitzt die Korallen `aaaaaaaa-…-000000000002` und `…03` im Becken `…01`.

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
TASK-05-01  Korallen-Service & Hooks
    │
TASK-05-02  Korallenformular & Validierung
    │
TASK-05-03  Seite „Koralle anlegen" (/koralle/neu)
    │
TASK-05-04  Bestandsliste (/)
    │
TASK-05-05  Responsive, Deployment, Abnahme
```

Streng nacheinander.

> **Entschieden 22.09.2026:** Die Detailseite `/koralle/:id` und anklickbare Listeneinträge gehören zu MS-6
> (Definition of Done von MS-5 und MS-6 entsprechend angepasst). In MS-5 sind die Einträge der Bestandsliste
> nicht anklickbar.

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt oder widersprechen sich. Sie stehen jeweils im Abschnitt
„Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                              | Wo         | Stand                              |
| --- | -------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------- |
| 1   | Dateiname des Korallen-Service                                                                     | TASK-05-01 | entschieden: `coral.ts`            |
| 2   | Beckenname in der Liste: per Join mitladen oder im Frontend aus den Becken zuordnen?               | TASK-05-01 | entschieden: im Frontend zuordnen  |
| 3   | Formularfelder: FR-1.2 oder Mockup? (Mockup: Art Pflicht, Status, Größe, Notiz, keine Bezeichnung) | TASK-05-02 | entschieden: FR-1.2                |
| 4   | Auswahlfeld für das Becken: shadcn `native-select` oder shadcn `select`?                           | TASK-05-02 | entschieden: `native-select`       |
| 5   | Becken vorbelegen oder immer bewusst wählen lassen?                                                | TASK-05-02 | entschieden: nicht vorbelegen      |
| 6   | Validierungsregeln und Labeltexte                                                                  | TASK-05-02 | entschieden: siehe TASK-05-02      |
| 7   | `/koralle/neu` ohne Becken: Hinweis zeigen oder auf `/` umleiten?                                  | TASK-05-03 | entschieden: Hinweis auf der Seite |
| 8   | Ziel nach „Speichern" und „Abbrechen"                                                              | TASK-05-03 | entschieden: beide auf `/`         |
| 9   | Was zeigt ein Listeneintrag?                                                                       | TASK-05-04 | entschieden: siehe TASK-05-04      |
| 10  | Status und Legende im Bestand                                                                      | TASK-05-04 | entschieden: erst MS-9             |
| 11  | Detailseite und anklickbare Einträge                                                               | –          | entschieden: erst MS-6             |

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md, design.md und
Dokumentation/Meilensteine/MS-05_Koralle-Bestand/MS-05_Koralle-Bestand.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-05_Koralle-Bestand/tasks/TASK-05-XX.md um.

1. Kläre die Punkte unter „Vor dem Start klären" mit mir, bevor du etwas änderst.
2. Zeig mir jede Änderung vorher als Vorschlag und warte auf meine Freigabe.
   Code als reinen Code mit Zeilenangabe, nie als Diff.
3. Arbeite die Schritte in der angegebenen Reihenfolge ab.
4. Validiere nach Codeänderungen nur mit npm run build, npm run lint und npm run format
   im Projektordner Coralkeeper/ – keine Tests.
5. Prüf am Ende jedes Kriterium unter „Fertig, wenn" und sag mir, was offen bleibt.
6. Was dir außerhalb dieses Tasks auffällt: benennen, nicht anfassen.
```
