# TASK-02-02 · Feldliste je Tabelle: Typen, Pflichtangaben, Defaults und Constraints

**Status:** offen
**Bezug:** MS-2 Ergebnis „Feldliste", Entscheidungen 2 und 3 · FR-1.2, FR-1.5, FR-2.2, FR-4.1, FR-5.1, FR-5.2, FR-5.4, FR-5.10 · NFR-4.4
**Voraussetzung:** TASK-02-01 (welche Tabellen es gibt)

---

## Worum geht es

Für jede Spalte jeder Tabelle soll feststehen: **Name, Postgres-Typ, `NOT NULL`, Default, Constraint.**
Das meiste gibt es schon – als Attribute im Mermaid-Diagramm des ER-Modells, als Liste der Aufzählungstypen in Abschnitt 3 und in der
SQL-Datei, nach der die Tabellen in Supabase angelegt sind. Die Aufgabe ist, ER-Modell, SQL-Datei und Anforderungen abzugleichen,
die Lücken zu schließen und zwei Entscheidungen zu begründen, die bisher nur stillschweigend getroffen wurden:
**`messwert` im Langformat (Entscheidung 2)** und **Postgres-Enums (Entscheidung 3)**.

## Vor dem Start klären

- [ ] **Form der Feldliste.**
  - (a) Die Mermaid-Attribute erweitern: konkreter Typname statt `enum`, Defaults in den Kommentar. Eine Quelle, aber lange Kommentare.
  - (b) Eine Tabelle je Entität (Spalte · Typ · `NOT NULL` · Default · Constraint), das Diagramm zeigt dann nur Name und Typ.
    Liest sich besser, wird aber an zwei Stellen gepflegt.
  - **Vorschlag:** (a) – eine Quelle (KISS). Wird es unlesbar, auf (b) wechseln.

- [ ] **Entscheidung 2 · `messwert`: eine Zeile je Parameter oder eine Zeile je Messung?**
      In der Datenbank steht das **Langformat**: eine Zeile je Parameter (`parameter` als Enum, `wert NOT NULL`, `einheit` als Text).
      MS-2 nennt das einen Widerspruch zu FR-5.1 (sieben feste Felder, mindestens eins gefüllt), der hier aufgelöst werden muss.
  - [ ] **Langformat bestätigen** und begründen. Dafür spricht: FR-5.2 (Verlauf je Parameter) ist eine einfache Abfrage
        (`where parameter = 'kh' order by datum`), es gibt keine Leerfelder für nicht gemessene Werte, und FR-5.10 kann einzelne Werte korrigieren.
  - [ ] **FR-5.1 auflösen.** Vorschlag: Das Formular zeigt alle sieben Felder (Breitformat in der UI); beim Speichern entsteht je gefülltem
        Feld eine Zeile. „Mindestens einer gefüllt" prüft das Formular (FR-6.6), nicht die Datenbank.
  - [ ] **Bearbeiten und Löschen (FR-5.10):** je einzelnem Wert oder je Messung (alle Zeilen eines Datums)?
  - [ ] **Spalte `einheit`:** FR-5.1 gibt die Einheiten fest vor, die Spalte ist also aus `parameter` ableitbar – und heute nullable.
        Entfernen (Einheit je Parameter im Frontend hinterlegt) oder behalten und vom Service füllen lassen?
  - [ ] **Zwei Messungen am selben Tag** lassen sich ohne Uhrzeit bzw. `erstellt_am` nicht auseinanderhalten (siehe TASK-02-05 B). Hinnehmen?

- [ ] **Entscheidung 3 · Status- und Typfelder als Postgres-Enum oder als Text mit `CHECK`?**
      In der Datenbank stehen elf Enums – nicht nur für die vier Felder, die MS-2 nennt, sondern auch für die Steckbrief- und Herkunftsfelder.
  - Dafür spricht: Die Werte stehen in den Anforderungen fest. Die generierten Typen (NFR-4.4) liefern für ein Enum eine
    TypeScript-Union wie `'im_bestand' | 'zur_abgabe' | …` – bei Text mit `CHECK` käme nur `string` heraus.
  - Dagegen: Werte lassen sich hinzufügen und umbenennen, aber nicht wieder entfernen.
  - → Bestätigen und als Festlegung begründen.

## Arbeitsvorlage

### Abweichungen ER-Modell ↔ SQL-Datei (Stand 14.09.2026)

Die Datenbank entspricht nach TASK-03-03 der SQL-Datei. Wo das ER-Modell weniger sagt als die SQL-Datei, fehlt die Angabe in der Feldliste.

| Tabelle             | Spalte                         | ER-Modell                     | SQL-Datei                       | Zu tun                                |
| ------------------- | ------------------------------ | ----------------------------- | ------------------------------- | ------------------------------------- |
| alle außer `profil` | `id`                           | kein Default                  | `default gen_random_uuid()`     | Default ins ER-Modell                 |
| `koralle`           | `status`                       | weder `NOT NULL` noch Default | `NOT NULL default 'im_bestand'` | ins ER-Modell                         |
| alle                | Aufzählungsspalten             | Typ nur `enum`                | konkreter Typ (siehe unten)     | Typnamen ins ER-Modell                |
| `profil`            | `anzeigename`, `kontakt_email` | `NOT NULL`, kein Default      | `NOT NULL default ''`           | in der DB entfernt (TASK-03-06)       |
| `koralle`           | `nutzer_id`                    | keine Löschregel              | `on delete cascade`             | → TASK-02-03                          |

**Zuordnung Spalte → Aufzählungstyp** (aus der SQL-Datei, im ER-Modell bisher nur über die Werte erkennbar):

| Aufzählungstyp   | Spalten                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| `koralle_status` | `koralle.status`                                                                     |
| `stufe`          | `koralle.licht`, `koralle.stroemung`, `koralle.nesselkraft`, `koralle.schwierigkeit` |
| `platzierung`    | `koralle.platzierung`                                                                |
| `schutzstatus`   | `koralle.schutzstatus`                                                               |
| `quelle_typ`     | `koralle.quelle_typ`                                                                 |
| `historie_typ`   | `historieneintrag.typ`                                                               |
| `angebot_modus`  | `angebot.modus`                                                                      |
| `anfrage_status` | `anfrage.status`                                                                     |
| `messparameter`  | `messwert.parameter`                                                                 |
| `ereignis_typ`   | `becken_ereignis.typ`                                                                |
| `medien_typ`     | `bild_dokument.typ`                                                                  |

### Befunde: Feldliste gegen die Anforderungen

Nur benannt – je Punkt entscheiden: Spalte ergänzen, bewusst weglassen (mit Begründung) oder an den Meilenstein weitergeben, der sie braucht.

- [ ] **FR-2.2** nennt „Freitext für Fütterung **und Besonderheiten**". Eine Spalte für Besonderheiten gibt es nicht. (MS-6)
- [ ] **FR-2.2** zählt Wuchsform zu den Feldern mit fester Auswahlliste; im ER-Modell ist `wuchsform` Freitext. `gering`/`mittel`/`hoch`
      passt fachlich nicht zu Wuchsform – die Abweichung bewusst festhalten. (MS-6)
- [ ] **FR-5.4** nennt Ereignistypen „wie Bleaching, Schädling, Vernesselung". Das ER-Modell fasst sie als `vorfall` plus Freitext zusammen –
      bewusst festhalten oder das Enum erweitern. (MS-8)
- [ ] **FR-1.5** sucht über „Notiz". `koralle` hat nur `herkunft_notiz`. Welche Notiz ist gemeint? (MS-9)
- [ ] **FR-4.1** nennt ein Bild zum Inserat. `angebot` hat keine Bildspalte – gemeint ist vermutlich `koralle.primaerbild`.
      Hängt an TASK-02-04 (Frage 3) und TASK-02-05 D. (ab MS-9)
- [ ] **Fraglich nullable:** `angebot.koralle_id` → TASK-02-03 · `bild_dokument.storage_pfad` → TASK-02-05 D · `messwert.einheit` → Entscheidung 2 oben

## Schritte

1. [ ] **Form der Feldliste festlegen.**
2. [ ] **Abweichungen ER-Modell ↔ SQL-Datei ins ER-Modell übernehmen:** Default für `id`, `NOT NULL` und Default für `koralle.status`,
       konkrete Typnamen der Aufzählungsspalten.
3. [ ] **Befunde gegen die Anforderungen einzeln entscheiden.** Jede neue oder geänderte Spalte notieren – sie gehört später in die
       Restarbeitenliste für MS-3 (TASK-02-06, Abschnitt A2).
4. [ ] **Entscheidung 2 treffen** und als Festlegung in Abschnitt 3 des ER-Modells begründen – einschließlich der Auflösung von FR-5.1.
5. [ ] **Entscheidung 3 begründen** und als Festlegung in Abschnitt 3 aufnehmen.

## Fertig, wenn

- [ ] Jede Spalte der zehn Tabellen hat im ER-Modell einen konkreten Typ, eine Angabe zu `NOT NULL`, ihren Default und ihre Constraints
- [ ] ER-Modell und SQL-Datei stimmen überein – oder jede Abweichung ist als Änderung für MS-3 notiert
- [ ] Jeder Befund gegen die Anforderungen ist entschieden oder mit Zielmeilenstein weitergegeben
- [ ] Entscheidungen 2 und 3 stehen begründet in Abschnitt 3 des ER-Modells

## Hinweise

- `NOT NULL` und Kardinalität gehören zusammen: Ändert sich hier eine Pflichtangabe an einem Fremdschlüssel, muss das Diagramm aus TASK-02-01 mitziehen.
- Löschregeln der Fremdschlüssel sind TASK-02-03, nicht dieser Task.
- Nichts in der Datenbank oder in der SQL-Datei ändern. Nach jeder späteren Schemaänderung müssen die Typen neu generiert werden (TASK-03-07).

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 1 (Attribute), Abschnitt 3 (Aufzählungstypen)
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Typen, `NOT NULL`, Defaults
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 4 und 4.1, FR-1.2, FR-1.5, FR-2.2, FR-4.1, FR-5.1, FR-5.2, FR-5.4, FR-5.10, NFR-4.4
- [`../MS-02_Datenmodell-Schema-Entwurf.md`](../MS-02_Datenmodell-Schema-Entwurf.md) – Ergebnis „Feldliste", Entscheidungen 2 und 3
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-03_Schema-abgleichen.md` – Abweichungsprotokoll
