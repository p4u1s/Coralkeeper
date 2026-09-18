# MS-3 · Aufgaben im Detail

**Stand: 11.09.2026**

Dieser Ordner zerlegt die zehn Tasks aus [`../Tasks.md`](../Tasks.md) in kleine, abhakbare Schritte.
`Tasks.md` bleibt die Übersicht. Hier steht, **wie** ein Task erledigt wird und **woran** man erkennt, dass er fertig ist.

Grundlage: [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) (Umfang und Definition of Done).

---

## Aufbau jeder Task-Datei

| Abschnitt                | Inhalt                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| **Worum geht es**        | Ziel in zwei, drei Sätzen, mit FR-/NFR-Bezug                           |
| **Vor dem Start klären** | Entscheidungen, die vor der ersten Codezeile getroffen sein müssen     |
| **Schritte**             | Arbeitsschritte in der sinnvollen Reihenfolge                          |
| **Fertig, wenn**         | Akzeptanzkriterien – erst wenn alle abgehakt sind, ist der Task fertig |
| **Hinweise**             | Stolperstellen, Befunde aus der Durchsicht, Abgrenzung                 |
| **Quellen**              | Die Dokumente, aus denen der Task abgeleitet ist                       |

Ist ein Task fertig, wird er zusätzlich in [`../Tasks.md`](../Tasks.md) abgehakt.

---

## Reihenfolge und Abhängigkeiten

```text
TASK-03-01  Projekt aufsetzen                      ✔ erledigt
    │
TASK-03-02  Supabase-Client & Umgebungsvariablen   ✔ erledigt
    │
    ├── TASK-03-03  Schema abgleichen               ✔ erledigt
    ├── TASK-03-04  Fremdschlüssel & Löschverhalten (braucht TASK-02-03)
    ├── TASK-03-05  RLS-Policies & Zweitnutzer-Test ✔ erledigt
    └── TASK-03-06  Profil-Trigger & E-Mail-Bestätigung ✔ erledigt
            │
TASK-03-07  Datenbanktypen & Service-Schicht        (Schema muss stehen)
    │
TASK-03-08  Registrierung, Anmeldung, Abmeldung
    │
TASK-03-09  Geschützte Routen, Lade-/Fehler-/Validierungszustände
    │
TASK-03-10  Responsive-Check, Deployment (GitHub Pages), Abnahme
```

TASK-03-03 bis 03-06 hängen nur an der Datenbank und können in beliebiger Reihenfolge laufen.
Nur die Auth-Screens (03-08, 03-09) hängen am Mockup aus MS-1.

---

## Offene Entscheidungen im Überblick

Diese Punkte sind in den Quelldokumenten nicht festgelegt. Sie stehen jeweils im Abschnitt
„Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                 | Wo         |
| --- | ------------------------------------------------------------------------------------- | ---------- |
| 2   | Welche SQL-Datei im Repo bildet den tatsächlichen Datenbankstand ab?                  | TASK-03-03 |
| 3   | Löschverhalten der Fremdschlüssel, die das ER-Modell offen lässt (TASK-02-03)         | TASK-03-04 |
| 4   | RLS-Matrix: welche Policies jetzt, welche erst im jeweiligen Meilenstein (TASK-02-04) | TASK-03-05 |
| 5   | Muster der Service-Schicht: Fehler werfen oder `{ data, error }` zurückgeben?         | TASK-03-07 |
| 6   | Formularvalidierung: eigene Lösung oder Bibliothek?                                   | TASK-03-08 |
| 7   | Nach der Registrierung direkt angemeldet oder zur Anmeldeseite?                       | TASK-03-08 |
| 8   | Routenpfade – die verbindliche Routenliste fehlt im aktiven Dokumentenbestand         | TASK-03-09 |
| 9   | Deep-Links auf GitHub Pages: HashRouter oder `404.html`-Fallback?                     | TASK-03-09 |
| 10  | Repo-Name und Sichtbarkeit des GitHub-Repos (bestimmt den `base`-Pfad)                | TASK-03-10 |

> **Hinweis zum Deployment:** Am 11.09.2026 ist GitHub Pages als Ziel festgelegt worden (wie in `CLAUDE.md`).
> `MS-03_Fundament-Auth.md`, `Milestones.md` und NFR-4.5 sind am 18.09.2026 entsprechend angepasst worden.

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md, design.md und
Dokumentation/Meilensteine/MS-03_Fundament-Auth/MS-03_Fundament-Auth.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-XX.md um.

1. Kläre die Punkte unter „Vor dem Start klären" mit mir, bevor du etwas änderst.
2. Zeig mir jede Änderung vorher als Vorschlag und warte auf meine Freigabe.
3. Arbeite die Schritte in der angegebenen Reihenfolge ab.
4. Prüf am Ende jedes Kriterium unter „Fertig, wenn" und sag mir, was offen bleibt.
5. Was dir außerhalb dieses Tasks auffällt: benennen, nicht anfassen.
```
