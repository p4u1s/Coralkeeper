# MS-7 · Aufgaben im Detail

**Stand: 28.09.2026**

Dieser Ordner zerlegt die neun Tasks aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-07_Ableger-Inserat.md`](../MS-07_Ableger-Inserat.md) (Umfang und Definition of Done).

**Prüfstand 28.09.2026:**

- Tabelle `angebot` besteht seit MS-3: SELECT eigene **oder** `sichtbar = true`, INSERT eigene mit Prüfung der eigenen
  Koralle (Festlegung 12), DELETE eigene, **keine UPDATE-Policy** (kommt mit MS-11). `koralle_id` ist `UNIQUE` mit
  `ON DELETE CASCADE`, `sichtbar` hat den Standardwert `true`, `art` und `handelsname` sind als Kopie vorgesehen
  (Festlegung 13).
- `koralle` hat `mutter_id` (`ON DELETE SET NULL`) und die Herkunftsspalten `quelle_typ`, `quelle_name`, `belegnummer`,
  `cites_nr`, `herkunft_notiz`, `herkunftskette`. Eine Oberfläche dafür gibt es nicht (FR-3.1 ist MS-10).
- Die Trigger-Funktion `systemeintrag_anlegen` schreibt bei INSERT „Koralle angelegt" und bei echtem Statuswechsel
  „Status geändert: … → …". Ein Ableger bekäme heute nur „Koralle angelegt" (TASK-06-01, Hinweis zu MS-7).
- Die generierten Typen enthalten `angebot` und die Enums `angebot_modus`, `koralle_status`, `quelle_typ`.
- Der Status einer Koralle wird bisher **nirgends** angezeigt. Die Farb-Tokens `status-bestand`, `status-abgabe`,
  `status-abgegeben`, `status-verendet` stehen in `src/index.css`. Status und Legende in der Bestandsliste bleiben
  MS-9 (Entscheidung 22.09.2026).
- `useCoral` hat bewusst kein `reload` (TASK-06-05).
- Die Snapshot-Fragen aus `MS-02_…/tasks/TASK-02-05_Konventionen-Snapshot-Bilder.md`, Abschnitt C, sind nie
  entschieden worden. Sie stehen jetzt in TASK-07-01.
- Testdaten von A (feste IDs `aaaaaaaa-0000-0000-0000-0000000000xx`): Becken …01, Koralle …02 mit sichtbarem
  Inserat …06, Koralle …03 mit Abgabe …10, Bild …04, Historieneintrag …05, Anfrage …07, Messwert …08,
  Ereignis …09. Testnutzer A `ddd19768-…`, B `094fa34b-…` (volle IDs in `TASK-03-05_Schritt 7-8_RLS-Test.sql`).
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
MS-6 abgeschlossen
    │
    ├── TASK-07-01  Snapshot festlegen, Systemeintrag Ablegererzeugung (Datenbank)
    │       │
    │   TASK-07-02  Ableger-Service
    │       │
    │   TASK-07-03  Ableger erzeugen (Formular)
    │
    └── TASK-07-04  Inserat und Status koppeln (Datenbank)
            │
        TASK-07-05  Inserat-Service & Hook
            │
        TASK-07-06  Inserat anlegen (Formular)
            │
        TASK-07-07  Status & Inserat auf der Detailseite, zurückziehen
    │
TASK-07-08  RLS-Nachweis mit zweitem Testnutzer
    │
TASK-07-09  Responsive, Deployment, Abnahme
```

Die beiden Stränge (Ableger 07-01 bis 07-03, Inserat 07-04 bis 07-07) hängen nicht voneinander ab. Empfohlen ist
trotzdem die Nummernfolge – sie entspricht dem Ablauf der Abnahme (erst Ableger, dann Inserat). 07-08 und 07-09
setzen beide Stränge voraus.

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt oder widersprechen sich. Sie stehen jeweils im Abschnitt
„Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                                   | Wo         | Stand |
| --- | ------------------------------------------------------------------------------------------------------- | ---------- | ----- |
| 1   | Snapshot im Service oder als Datenbankfunktion?                                                         | TASK-07-01 | entschieden: Service |
| 2   | Welche Spalten werden kopiert, welche neu gesetzt (Erwerbsdatum, Quelle, übrige Herkunftsfelder)?       | TASK-07-01 | entschieden: siehe TASK-07-01 |
| 3   | Aufbau des Textes `herkunftskette`                                                                      | TASK-07-01 | entschieden (vorläufig): siehe TASK-07-01 |
| 4   | „Unveränderlich" (FR-3.6) nur in der UI oder zusätzlich per Trigger?                                    | TASK-07-01 | entschieden: nur UI |
| 5   | Systemeintrag Ablegererzeugung: Wortlaut, beim Ableger, bei der Ursprungskoralle oder bei beiden?       | TASK-07-01 | entschieden: bei beiden |
| 6   | Herkunftskette schon in MS-7 anzeigen?                                                                  | TASK-07-01 | entschieden: nicht anzeigen, erst MS-10 |
| 7   | Ableger-Formular: Pfad, Vorbelegung der Bezeichnung, Hinweis auf übernommene Daten                      | TASK-07-03 | entschieden: siehe TASK-07-03 |
| 8   | Button „Ableger erzeugen": Ort auf der Detailseite, bei welchem Status sichtbar?                        | TASK-07-03 | entschieden: unter den Stammdaten, jeder Status |
| 9   | Ziel nach dem Speichern: Detailseite des Ablegers oder der Ursprungskoralle?                            | TASK-07-03 | entschieden: Detailseite des Ablegers |
| 10  | Inserat und Status koppeln: Service, Trigger oder Datenbankfunktion?                                    | TASK-07-04 | entschieden: Trigger auf `angebot` |
| 11  | Dateinamen für Inserat-Service und Hook                                                                 | TASK-07-05 | entschieden: `offer.ts`, `useOffer.ts` |
| 12  | Welche Korallen dürfen inseriert werden – jede im Bestand oder nur Ableger (`mutter_id`)?               | TASK-07-06 | entschieden: jede Koralle im Bestand |
| 13  | Inserat-Formular: Pfad, Button-Beschriftung, Modus-Auswahl, Pflichtfelder, Höchstlängen, Hinweistext    | TASK-07-06 | entschieden: siehe TASK-07-06 |
| 14  | Status-Anzeige auf der Detailseite: Ort und Form                                                        | TASK-07-07 | offen |
| 15  | Inserat-Anzeige: Karte über der Tab-Leiste oder dritter Tab?                                            | TASK-07-07 | offen |
| 16  | Neu laden nach dem Zurückziehen: `reload` in `useCoral` ergänzen?                                       | TASK-07-07 | offen |
| 17  | Wie „sieht" Testnutzer B das Inserat ohne Inseratsliste (FR-4.3 ist MS-11)? REST-Abruf zusätzlich?      | TASK-07-08 | offen |

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md, design.md,
Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md und
Dokumentation/Meilensteine/MS-07_Ableger-Inserat/MS-07_Ableger-Inserat.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-XX.md um.

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
