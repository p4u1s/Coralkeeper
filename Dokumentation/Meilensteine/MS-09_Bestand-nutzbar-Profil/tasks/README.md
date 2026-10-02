# MS-9 · Aufgaben im Detail

**Stand: 01.10.2026**

Dieser Ordner zerlegt die vierzehn Tasks aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-09_Bestand-nutzbar-Profil.md`](../MS-09_Bestand-nutzbar-Profil.md) (Umfang). Eine **Definition of
Done fehlt** – weder das Meilenstein-Dokument noch `Milestones.md` nennt eine. Sie wird in TASK-09-01 festgelegt.

**Annahme:** Das Gate MS-08a ist ohne Befunde bestanden, es gibt keine Fix-Tasks und keine nach MS-9 verschobenen
Notizen. Zu Beginn von TASK-09-01 bestätigen.

**Prüfstand 01.10.2026** (Code und Dokumentation gelesen, Datenbank nicht abgefragt):

Datenbank (laut Migrationsdatei und ER-Modell)

- `koralle`: SELECT, INSERT, UPDATE eigene – **keine DELETE-Policy** (RLS-Matrix: „eigene ab MS-9"). Trigger
  `bei_anlage_systemeintrag` und `bei_statuswechsel_systemeintrag`; **kein Trigger für den Beckenwechsel** (FR-1.11,
  aus MS-10 vorgezogen).
- `koralle.primaerbild` → `bild_dokument.id` mit `ON DELETE SET NULL`, im Code nirgends verwendet. `schutzstatus` ist
  nullable ohne Standardwert und in keiner Oberfläche.
- `koralle` hat **keine Spalte `notiz`** – FR-1.5 sucht aber über „Notiz" (Befund aus TASK-02-02, dort an MS-9
  verwiesen).
- `profil`: nur SELECT eigenes, **keine UPDATE-Policy** (RLS-Matrix: „ab MS-9"). Der Trigger `profil_anlegen` belegt
  `anzeigename` und `kontakt_email` mit der Konto-E-Mail vor; `kontakt_telefon` ist nullable.
- `bild_dokument`: SELECT und INSERT eigene, **keine DELETE-Policy** (RLS-Matrix: „ab MS-9"), `storage_pfad NOT NULL`.
- **Kein Storage-Bucket, keine Storage-Policies.** Die Bild-Fragen aus
  `MS-02_…/tasks/TASK-02-05_Konventionen-Snapshot-Bilder.md`, Abschnitt D, sind nie entschieden worden (TASK-02-06:
  „Storage … MS-9"). Sie stehen jetzt in TASK-09-01.
- Beim Löschen einer Koralle mit Inserat läuft `angebot_status_setzen` über die Kaskade. TASK-07-04 verlangt, das in
  MS-9 einmal zu prüfen – steht in TASK-09-02.

Code

- `HomeScreen.tsx`: Liste ohne Bild, Status, Filter, Suche und Anzahl; Reihenfolge nach Bezeichnung aus `listCorals`;
  Beckennamen über `useTanks` und eine `Map`.
- `CoralDetailPage.tsx`: Titel, „Art · Handelsname", Status-Plakette, Kacheln „Becken" und „Zugang am", „Ableger
  erzeugen" (bei jedem Status, laut TASK-07-03 in MS-9 erneut prüfen), Inserat-Karte, Tabs Steckbrief · Historie.
  Kein Bild, kein Bearbeiten, kein Statuswechsel.
- `src/services/coral.ts`: `listCorals`, `getCoral`, `createCoral`, `createFrag`, `updateCoralProfile` – kein Ändern
  der Stammdaten, kein Statuswechsel, kein Löschen. `useCoral` hat `reload`.
- `CoralForm.tsx` ist für das Bearbeiten vorbereitet (`initialValues`, TASK-05-02).
- `CoralProfile.tsx` und `CoralProfileForm.tsx`: acht Steckbrieffelder ohne Schutzstatus, nur Text.
- `ProfilePage.tsx`: „Angemeldet als …" und „Abmelden". `src/services/profile.ts` hat nur `getOwnProfile`, das
  nirgends aufgerufen wird.
- `DeleteEntryDialog.tsx` (Diary) nimmt Titel, Beschreibung und `onDelete` entgegen.
- `deleteTank` meldet bei Korallen im Becken „Setze sie zuerst um oder lösche sie." – beides geht erst ab MS-9.
- Installierte shadcn-Komponenten: button, input, label, textarea, alert-dialog, native-select, tabs.

Vorlagen

- design.md: Statusfarben nur für den Korallenstatus, „immer Punkt oder farbcodierter Bildrahmen **plus** Textlabel";
  „Legende Status" auf dem Bestand-Screen dauerhaft sichtbar; Bildfläche Bestandskarte 72 × 72, Korallendetail Höhe
  200, Statusrahmen 2 px; Filterchips „Alle · Bestand · Abgabe · Archiv"; der Lupenbutton ist die einzige Ausnahme von
  „kein Icon ohne Text"; Avatar Profil 56 × 56.
- Mockup (`Coralkeeper.dc.html`): Bestand mit „x von y Korallen · n Becken", Filterchips, Lupe mit Feld „Suche nach
  Handelsname oder Art", Karten mit Bild im Statusrahmen, Legende unter der Liste; Detail mit Bild und Button „Koralle
  bearbeiten"; Profil mit Avatar, Name, E-Mail, drei Kennzahlen, „Einheiten und Formate", „Daten exportieren",
  „Abmelden". Steckbrief-Symbole zeigt nur der Design-Prompt P4 (`Dokumentation/Design/MS-1_Design-Prompts.md`,
  Artboard 11), nicht das Mockup.
- Testdaten von A: Zum Bild …04 aus MS-3 gibt es keine Datei, weil noch kein Bucket existiert.

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
Die Browser-Prüfungen unter „Fertig, wenn" macht der Nutzer im Firefox; Claude validiert Codeänderungen nur mit
`npm run build`, `npm run lint`, `npm run format` (siehe `CLAUDE.md`). SQL führt der Nutzer selbst im
Supabase-SQL-Editor aus.

---

## Reihenfolge und Abhängigkeiten

```text
🚦 Gate MS-08a bestanden
    │
TASK-09-01  Festlegungen (nur Dokumentation)
    │
TASK-09-02  Datenbank: Policies, Beckenwechsel-Trigger, Löschtest
    │
TASK-09-03  Storage: Bucket und Policies
    │
TASK-09-04  Korallen-Service: ändern, Status, löschen
    │
    ├── TASK-09-05  Koralle bearbeiten
    │       │
    │   TASK-09-06  Koralle löschen
    │
    └── TASK-09-07  Status wechseln
    │
TASK-09-08  Bild-Service und Bild hochladen
    │
TASK-09-09  Detailseite vervollständigen
    │
TASK-09-10  Steckbrief: Symbole, Legende, Schutzstatus
    │
TASK-09-11  Bestand als Kachelansicht
    │
TASK-09-12  Filter, Sortierung, Suche
    │
TASK-09-13  Profil ansehen und bearbeiten
    │
TASK-09-14  Responsive, Deployment, Abnahme
    │
MS-10
```

Empfohlen ist die Nummernfolge. Abweichen geht an diesen Stellen:

- **09-10** hängt nur an 09-01 und kann jederzeit danach kommen.
- **09-13** hängt an 09-01 und 09-02 (UPDATE-Policy) und kann direkt nach 09-02 kommen.
- **09-08** braucht 09-03 (Bucket) und 09-05 (Bearbeiten-Formular, falls das Bild dort hochgeladen wird).
- **09-11** braucht 09-08 (Bilder anzeigen); 09-12 baut auf der Kachelansicht auf.
- **09-06** braucht 09-03, weil beim Löschen auch die Dateien der Koralle entfernt werden.

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt oder widersprechen sich. Sie stehen jeweils im Abschnitt
„Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                                         | Wo         | Stand |
| --- | ------------------------------------------------------------------------------------------------------------- | ---------- | ----- |
| 1   | Gate ohne Befunde? Wurden Notizen nach MS-9 verschoben?                                                       | TASK-09-01 | offen |
| 2   | Definition of Done MS-9                                                                                       | TASK-09-01 | offen |
| 3   | Bilder in MS-9: nur Primärbild, oder auch Journal- und Inseratbild?                                           | TASK-09-01 | offen |
| 4   | Bucket-Layout: ein Bucket, Ordner je Nutzer, Pfadschema, privat oder öffentlich (TASK-02-05 D)                | TASK-09-01 | offen |
| 5   | Erlaubte Dateitypen                                                                                           | TASK-09-01 | offen |
| 6   | `koralle.primaerbild` umbenennen oder als Ausnahme festhalten (TASK-02-05 A)                                  | TASK-09-01 | offen |
| 7   | „Notiz" in der Suche (FR-1.5) – welche Spalte?                                                                | TASK-09-01 | offen |
| 8   | Statuswechsel: welche Zielstatus, `abgegeben` von Hand, Rückweg nach `im_bestand`?                            | TASK-09-01 | offen |
| 9   | Statuswechsel bei bestehendem Inserat: sperren oder Inserat mitlöschen?                                       | TASK-09-01 | offen |
| 10  | Status-Filter: Filterchips aus design.md (mit „Archiv") oder vier Status?                                     | TASK-09-01 | offen |
| 11  | Pfade für Bearbeiten, Statuswechsel und Profil bearbeiten                                                     | TASK-09-01 | offen |
| 12  | Wortlaut des Systemeintrags beim Beckenwechsel                                                                | TASK-09-02 | offen |
| 13  | Beckenwechsel: eigene Trigger-Funktion oder `systemeintrag_anlegen` erweitern?                                | TASK-09-02 | offen |
| 14  | Profil-UPDATE: ganze Zeile oder nur drei Spalten?                                                             | TASK-09-02 | offen |
| 15  | Bucket-Name, Anlage per SQL oder im Dashboard                                                                 | TASK-09-03 | offen |
| 16  | Welche Storage-Operationen bekommen eine Policy?                                                              | TASK-09-03 | offen |
| 17  | Nachweis der Storage-Policies: SQL-Test oder in der App?                                                      | TASK-09-03 | offen |
| 18  | Statuswechsel mit Notiz: Reihenfolge und Fehlerfall                                                           | TASK-09-04 | offen |
| 19  | Löschen: erst Datenbank oder erst Dateien, Umgang mit Fehlern beim Aufräumen                                  | TASK-09-04 | offen |
| 20  | Inserat-Sperre nur in der UI oder auch im Service?                                                            | TASK-09-04 | offen |
| 21  | Bearbeiten: Ort des Buttons, Ziel nach dem Speichern, Seitentitel                                             | TASK-09-05 | offen |
| 22  | Löschen: Ort des Buttons, Dialogtext, Ziel, Dialog-Komponente                                                 | TASK-09-06 | offen |
| 23  | Statuswechsel: Auswahlelement, Notiz-Länge, Button, Ziel nach dem Speichern                                   | TASK-09-07 | offen |
| 24  | Bild hochladen: im Korallenformular oder auf der Detailseite?                                                 | TASK-09-08 | offen |
| 25  | Bild ersetzen und entfernen; altes Bild löschen oder behalten?                                                | TASK-09-08 | offen |
| 26  | Fehlerfall bei Anlage mit Bild, Vorschau, `aufnahmedatum`, Dateinamen                                         | TASK-09-08 | offen |
| 27  | Detailseite: Platzhalter ohne Bild, Aktionen je Status, Anordnung der Buttons                                 | TASK-09-09 | offen |
| 28  | Steckbrief-Symbole: je Feld oder je Wert, welche Symbole?                                                     | TASK-09-10 | offen |
| 29  | Legende: immer sichtbar oder aufklappbar, Ort                                                                 | TASK-09-10 | offen |
| 30  | Schutzstatus: Beschriftungen, Hinweistext, Ort von Kachel und Hinweis                                         | TASK-09-10 | offen |
| 31  | Kachel: Statustext zusätzlich zum Rahmen, Spalten, Platzhalter, Ort der Legende, Anzahl-Text                  | TASK-09-11 | offen |
| 32  | Filter: Bedienung, Zustand in der URL, Sortieroptionen, Art-Liste, Leerzustand                                | TASK-09-12 | offen |
| 33  | Profil: Anzeige (Avatar, Kennzahlen, Mockup-Buttons), Felder und Validierung, Hinweis zu den Kontaktdaten     | TASK-09-13 | offen |

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md, design.md,
Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md und
Dokumentation/Meilensteine/MS-09_Bestand-nutzbar-Profil/MS-09_Bestand-nutzbar-Profil.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-09_Bestand-nutzbar-Profil/tasks/TASK-09-XX.md um.

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
