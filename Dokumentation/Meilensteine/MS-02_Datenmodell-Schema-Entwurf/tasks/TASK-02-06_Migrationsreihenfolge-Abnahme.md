# TASK-02-06 · Migrationsreihenfolge festlegen und das Modell gegen die Definition of Done prüfen

**Status:** offen
**Bezug:** MS-2 Ergebnis „Migrationsreihenfolge" und Definition of Done · NFR-4.4
**Voraussetzung:** TASK-02-01 bis TASK-02-05

---

## Worum geht es

Der Abschluss von MS-2, in zwei Teilen:

- **A · Migrationsreihenfolge:** eine nummerierte Liste, die MS-3 ohne Rückfrage abarbeiten kann.
- **B · Abnahme:** Das ER-Modell wird gegen die Definition of Done geprüft.

Da die Datenbank schon existiert (TASK-03-03 ✔), hat „Migrationsreihenfolge" zwei Bedeutungen:

1. **Aufbaureihenfolge:** In welcher Reihenfolge ließe sich die Datenbank aus dem Nichts neu aufbauen? Danach richtet sich die SQL-Quelle im Repo.
2. **Restarbeiten:** Was muss an der bestehenden Datenbank noch geändert werden, und in welchem MS-3-Task?

## Vor dem Start klären

- [ ] **Wo steht die Migrationsreihenfolge?** **Vorschlag:** als neuer Abschnitt im ER-Modell. Die SQL-Datei folgt ihr, ist aber Sache von MS-3.
- [ ] **Versionsnummer des ER-Modells.** Nach TASK-02-01 bis 02-05 ist das Dokument deutlich gewachsen. **Vorschlag:** Version im Dokumentkopf
      auf 1.1 erhöhen, den Dateinamen `-v1.0` aber lassen – `CLAUDE.md` und viele Tasks verweisen auf ihn.

---

## A · Migrationsreihenfolge

### A1 · Aufbaureihenfolge (Entwurf)

Regeln: Jede Tabelle kommt nach den Tabellen, auf die sie verweist. **Policies kommen erst, wenn alle Tabellen stehen** – sobald eine Policy
eine andere Tabelle abfragt (TASK-02-04, Fragen 2 und 3; Kontaktfreigabe über `anfrage`), muss diese vorher existieren.

```text
 1  Aufzählungstypen (alle elf)
 2  profil                  → auth.users
 3  Funktion profil_anlegen + Trigger auf auth.users (TASK-03-06)
 4  becken                  → profil
 5  koralle                 → profil, becken, koralle (mutter_id) – noch ohne Fremdschlüssel auf primaerbild
 6  bild_dokument           → profil, koralle
 7  Fremdschlüssel koralle.primaerbild → bild_dokument   (Kreisbezug, deshalb nachträglich)
 8  historieneintrag        → profil, koralle, bild_dokument
 9  abgabe                  → profil, koralle
10  angebot                 → profil, koralle
11  anfrage                 → profil, angebot
12  messwert                → profil, becken
13  becken_ereignis         → profil, becken, koralle
14  RLS auf allen zehn Tabellen einschalten
15  Policies nach der RLS-Matrix (TASK-02-04)
16  Storage: Bucket und Storage-Policies (TASK-02-05 D) – erst, wenn der Bild-Upload kommt (MS-9)
```

- [ ] Liste gegen die Ergebnisse von TASK-02-01 bis 02-05 prüfen und ergänzen (z. B. neue Spalten aus TASK-02-02 oder TASK-02-04, Frage 3).
- [ ] **Abweichung zur SQL-Datei entscheiden:** Dort stehen Aufzählungstypen und Policies direkt bei der jeweiligen Tabelle. Das geht, solange
      jede Policy einzeilig bleibt. Werden Policies mit Unterabfragen beschlossen: SQL-Datei in MS-3 umsortieren oder nur diese Policies ans Ende stellen?

### A2 · Restarbeiten für MS-3 (Entwurf)

| #   | Änderung an der bestehenden Datenbank                                          | Entschieden in    | Umgesetzt in         |
| --- | ------------------------------------------------------------------------------ | ----------------- | -------------------- |
| 1   | neue oder geänderte Spalten, Defaults, `NOT NULL`                              | TASK-02-02        | MS-3, vor TASK-03-07 |
| 2   | Löschregeln der Fremdschlüssel angleichen (Constraint löschen und neu anlegen) | TASK-02-03        | TASK-03-04           |
| 3   | ggf. `NOT NULL` für `angebot.koralle_id` und `bild_dokument.storage_pfad`      | TASK-02-03, 02-05 | TASK-03-04           |
| 4   | ggf. `koralle.primaerbild` umbenennen                                          | TASK-02-05 A      | MS-3, vor TASK-03-07 |
| 5   | fehlende Policies anlegen, ggf. `profil_insert_eigenes` entfernen              | TASK-02-04        | TASK-03-05           |
| 6   | Trigger `profil_anlegen`                                                       | FR-6.10           | TASK-03-06           |
| 7   | Datenbanktypen generieren – **erst nach 1 bis 6**                              | NFR-4.4           | TASK-03-07           |
| 8   | Storage-Bucket und Storage-Policies                                            | TASK-02-05 D      | MS-9                 |
| 9   | SQL-Quelle im Repo in Aufbaureihenfolge nachziehen                             | A1                | jeweils im Task      |

- [ ] Tabelle vervollständigen und ins ER-Modell übernehmen.
- [ ] **Zeile 1 hat keinen eigenen MS-3-Task.** Klären, in welchem MS-3-Task neue Spalten aus TASK-02-02 umgesetzt werden (naheliegend: TASK-03-04, „Constraints").

---

## B · Abnahme gegen die Definition of Done

> **DoD MS-2:** Das Dokument liegt vor, alle sechs Punkte sind entschieden und begründet, die Migrationsreihenfolge ist so konkret,
> dass MS-3 sie ohne Rückfragen abarbeiten kann.

### Checkliste

- [ ] **ERD** mit Kardinalitäten, genau eine gültige Fassung (TASK-02-01)
- [ ] **Feldliste** mit Typ, `NOT NULL`, Default, Constraint für alle zehn Tabellen (TASK-02-02)
- [ ] **Fremdschlüssel mit Löschverhalten**, alle 23 (TASK-02-03)
- [ ] **RLS-Matrix** mit beiden Sonderfällen (TASK-02-04)
- [ ] **Namenskonvention und Zeitstempel** (TASK-02-05 A, B)
- [ ] **Migrationsreihenfolge** (Abschnitt A)
- [ ] **Alle sechs Entscheidungen** stehen mit Begründung in Abschnitt 3 des ER-Modells:
  - [ ] 1 · Steckbrief eingebettet (TASK-02-01)
  - [ ] 2 · `messwert` im Langformat, Widerspruch zu FR-5.1 aufgelöst (TASK-02-02)
  - [ ] 3 · Postgres-Enums (TASK-02-02)
  - [ ] 4 · `nutzer_id` auf jeder Tabelle (TASK-02-04)
  - [ ] 5 · Ort und Umfang des Ableger-Snapshots (TASK-02-05 C)
  - [ ] 6 · Bilder, Bucket-Layout, Pfadschema (TASK-02-05 D)
- [ ] **Abschnitt 4 „Offene Punkte"** enthält nur noch, was bewusst verschoben ist – jeweils mit Zielmeilenstein
- [ ] **Abnehmer bedient:** Die „Vor dem Start klären"-Punkte in TASK-03-04, TASK-03-05 und TASK-03-06 (Frage 2) sind beantwortet
- [ ] **Diagramm-Bilder** sind neu erzeugt oder entfernt (Entscheidung aus TASK-02-01)
- [ ] **Übersicht** in der [README](README.md) – alle sechs Tasks abgehakt

## Fertig, wenn

- [ ] Aufbaureihenfolge (A1) und Restarbeiten (A2) stehen im ER-Modell
- [ ] Die Checkliste B ist vollständig abgehakt
- [ ] MS-3 kann TASK-03-04 bis 03-07 ohne Rückfrage an MS-2 abarbeiten

## Hinweise

- **Timebox ~4 %.** Was MS-3 nicht braucht, darf mit Zielmeilenstein verschoben werden. MS-2 blockiert nicht – was das Dokument nicht enthält,
  entscheidet MS-3 pragmatisch weiter.
- Nach **jeder** Schemaänderung aus A2 müssen die Typen neu generiert werden (TASK-03-07).
- Nichts in der Datenbank oder in der SQL-Datei ändern.

## Quellen

- [`../MS-02_Datenmodell-Schema-Entwurf.md`](../MS-02_Datenmodell-Schema-Entwurf.md) – Ergebnisse, sechs Entscheidungen, Definition of Done
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – alle Abschnitte
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Ist-Reihenfolge
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-4.4
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/` – TASK-03-04 bis TASK-03-07 als Abnehmer
