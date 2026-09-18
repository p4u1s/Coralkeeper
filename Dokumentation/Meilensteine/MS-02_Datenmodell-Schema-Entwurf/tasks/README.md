# MS-2 · Aufgaben im Detail

**Stand: 14.09.2026**

Dieser Ordner zerlegt MS-2 in sechs Tasks mit kleinen, abhakbaren Schritten. Jede Task-Datei beschreibt, **wie** der Task
erledigt wird und **woran** man erkennt, dass er fertig ist. Diese README ist die Übersicht.

Grundlage: [`../MS-02_Datenmodell-Schema-Entwurf.md`](../MS-02_Datenmodell-Schema-Entwurf.md) (Ziel, Ergebnisse, sechs Entscheidungen, Definition of Done).

---

## Übersicht

Ist ein Task fertig, wird er hier abgehakt.

- [ ] [**TASK-02-01**](TASK-02-01_ERD-Kardinalitaeten.md) ERD der MVP-Entitäten mit Kardinalitäten prüfen und vervollständigen
- [ ] [**TASK-02-02**](TASK-02-02_Feldliste.md) Feldliste je Tabelle: Typen, Pflichtangaben, Defaults und Constraints
- [ ] [**TASK-02-03**](TASK-02-03_Fremdschluessel-Loeschverhalten.md) Fremdschlüssel und deren Löschverhalten festlegen
- [ ] [**TASK-02-04**](TASK-02-04_RLS-Matrix.md) RLS-Regeln einschließlich Historie und sichtbarer Angebote dokumentieren
- [ ] [**TASK-02-05**](TASK-02-05_Konventionen-Snapshot-Bilder.md) Namenskonvention, Zeitstempel, Snapshot- und Bildstrategie festlegen
- [ ] [**TASK-02-06**](TASK-02-06_Migrationsreihenfolge-Abnahme.md) Migrationsreihenfolge festlegen und das Modell gegen die Definition of Done prüfen

---

## Was MS-2 ist – und was nicht

MS-2 ist ein **reiner Dokumentations-Meilenstein**. Das Ergebnis ist ein Dokument, keine Migration.
Alle Festlegungen landen im ER-Modell (`Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md`) –
laut `CLAUDE.md` die verbindliche Quelle für Schema, Typen und RLS-Matrix.
Datenbank und SQL-Datei werden in MS-2 **nicht** angefasst, das setzt MS-3 um.

> **Ausgangslage:** Es liegt schon viel vor – das ER-Modell mit Diagramm, Feldern und zehn Festlegungen und die SQL-Datei,
> nach der die Tabellen in Supabase bereits angelegt sind (TASK-03-03 ✔). Viele Schritte sind deshalb **Prüfarbeit**:
> Vorhandenes gegen die Anforderungen abgleichen, Lücken schließen und Entscheidungen begründen, die bisher nur stillschweigend getroffen wurden.
> MS-3 wartet auf zwei Tasks: **TASK-03-04 auf TASK-02-03, TASK-03-05 auf TASK-02-04.**

---

## Aufbau jeder Task-Datei

| Abschnitt                | Inhalt                                                                          |
| ------------------------ | ------------------------------------------------------------------------------- |
| **Worum geht es**        | Ziel in zwei, drei Sätzen, mit FR-/NFR-Bezug                                    |
| **Vor dem Start klären** | Entscheidungen, die getroffen sein müssen, bevor ins ER-Modell geschrieben wird |
| **Arbeitsvorlage**       | Ist-Stand aus ER-Modell und SQL-Datei, als Grundlage für die Entscheidungen     |
| **Schritte**             | Arbeitsschritte in der sinnvollen Reihenfolge                                   |
| **Fertig, wenn**         | Akzeptanzkriterien – erst wenn alle abgehakt sind, ist der Task fertig          |
| **Hinweise**             | Stolperstellen, Befunde aus der Durchsicht, Abgrenzung                          |
| **Quellen**              | Die Dokumente, aus denen der Task abgeleitet ist                                |

Mit „Vorschlag" gekennzeichnete Antworten sind Empfehlungen, keine Entscheidungen. Entschieden wird erst mit Freigabe.

---

## Reihenfolge und Abhängigkeiten

```text
TASK-02-01  ERD & Kardinalitäten                       (Entscheidung 1)
    │
TASK-02-02  Feldliste                                  (Entscheidungen 2 und 3)
    │
    ├── TASK-02-03  Fremdschlüssel & Löschverhalten     → entsperrt TASK-03-04
    ├── TASK-02-04  RLS-Matrix                          (Entscheidung 4) → entsperrt TASK-03-05 und Frage 2 in TASK-03-06
    └── TASK-02-05  Konventionen, Zeitstempel, Snapshot, Bilder   (Entscheidungen 5 und 6)
            │
TASK-02-06  Migrationsreihenfolge & Abnahme gegen die Definition of Done
```

TASK-02-01 und 02-02 sind die Grundlage und bestehen großteils aus Prüfarbeit. TASK-02-03 bis 02-05 hängen nicht voneinander ab.
**Drängt MS-3, können 02-03 und 02-04 vorgezogen werden** – sie kommen mit dem heutigen Stand des ER-Modells aus.
TASK-02-06 fasst am Ende alles zusammen.

---

## Die sechs Entscheidungen aus MS-2

Die Definition of Done verlangt: **alle sechs entschieden und begründet.**

| #   | Frage                                          | Stand heute                                                                                         | Wo         |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------- |
| 1   | `steckbrief` eigene Tabelle oder in `koralle`? | ◐ eingebettet – so in Anforderungen 4.1 und ER-Modell Festlegung 3. Nur bestätigen                  | TASK-02-01 |
| 2   | `messwert` Lang- oder Breitformat?             | ◐ Langformat steckt in der Datenbank. Begründung und Auflösung des Widerspruchs zu FR-5.1 fehlen    | TASK-02-02 |
| 3   | Enum oder Text mit `CHECK`?                    | ◐ elf Postgres-Enums stecken in der Datenbank. Begründung fehlt                                     | TASK-02-02 |
| 4   | RLS-Muster                                     | ◐ `nutzer_id` auf jeder Tabelle – so in Anforderungen 4.2 und ER-Modell Abschnitt 2. Nur bestätigen | TASK-02-04 |
| 5   | Wo entsteht der Ableger-Snapshot?              | ✘ offen                                                                                             | TASK-02-05 |
| 6   | Bilder                                         | ◐ Tabelle `bild_dokument` entschieden (Festlegung 9). Bucket-Layout und Pfadschema offen            | TASK-02-05 |

---

## Offene Fragen im Überblick

Diese Fragen stehen jeweils im Abschnitt „Vor dem Start klären" des genannten Tasks und sind hier nur gesammelt.

| #   | Frage                                                                                                                 | Wo           |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | Welche Diagrammquelle gilt – Mermaid im ER-Modell oder die beiden PNG-Bilder?                                         | TASK-02-01   |
| 2   | Form der Feldliste: Mermaid-Attribute erweitern oder eine Tabelle je Entität?                                         | TASK-02-02   |
| 3   | `messwert`: Langformat bestätigen, Spalte `einheit`, Bearbeiten je Wert oder je Messung                               | TASK-02-02   |
| 4   | Fehlende Felder aus den Anforderungen (Besonderheiten, Notiz, Inseratbild, Ereignistypen)                             | TASK-02-02   |
| 5   | Soll ein Konto samt aller Daten löschbar sein (Löschregel auf `profil.id` und allen `nutzer_id`)?                     | TASK-02-03   |
| 6   | Löschregeln für `abgabe.koralle_id`, `abgabe.empfaenger_nutzer_id`, `koralle.primaerbild`, `historieneintrag.bild_id` | TASK-02-03   |
| 7   | `angebot.koralle_id` `NOT NULL`? `CHECK`-Constraints für Zahlenbereiche?                                              | TASK-02-03   |
| 8   | Welche Policies entstehen in MS-3, welche erst im Meilenstein, der sie braucht?                                       | TASK-02-04   |
| 9   | Verhindern, dass jemand beim Schreiben auf **fremde** Datensätze verweist?                                            | TASK-02-04   |
| 10  | Wie lesen Fremde die Korallenfelder eines Inserats? RLS wirkt auf ganze Zeilen, nicht auf Spalten                     | TASK-02-04   |
| 11  | Policy `profil_insert_eigenes` entfernen?                                                                             | TASK-02-04   |
| 12  | `koralle.primaerbild` in `primaerbild_id` umbenennen?                                                                 | TASK-02-05 A |
| 13  | `erstellt_am` auf jeder Tabelle oder nur, wo es gebraucht wird?                                                       | TASK-02-05 B |
| 14  | Ableger-Snapshot: Ort, kopierte Spalten, Aufbau von `herkunftskette`, Unveränderlichkeit, Systemeintrag               | TASK-02-05 C |
| 15  | Storage: ein oder zwei Buckets, Ordner je Nutzer, Pfadschema, privat oder öffentlich                                  | TASK-02-05 D |
| 16  | Wo steht die Migrationsreihenfolge? Versionsnummer des ER-Modells?                                                    | TASK-02-06   |

> **Timebox ~4 %.** Nicht jede Frage muss in MS-2 beantwortet werden. Was MS-3 nicht braucht (z. B. Nr. 10 für MS-7,
> Nr. 15 für MS-9), darf bewusst verschoben werden – dann steht es im ER-Modell unter „Offene Punkte" mit Zielmeilenstein.

---

## Vorlage für eine neue Claude-Session

Einen Task pro Session umsetzen lassen. Den folgenden Text kopieren und die Task-Nummer eintragen:

```text
Lies zuerst CLAUDE.md,
Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/MS-02_Datenmodell-Schema-Entwurf.md,
Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md,
Dokumentation/Datenmodell/Coralkeeper_database_migration.sql und
Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md.

Setze danach ausschließlich
Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-XX.md um.

1. MS-2 ist ein Dokumentations-Meilenstein: Du änderst nur das ER-Modell –
   keine Datenbank, keine SQL-Datei, keinen Code.
2. Geh die Punkte unter „Vor dem Start klären" einzeln mit mir durch, bevor du etwas schreibst.
3. Zeig mir jede Änderung am ER-Modell vorher als Vorschlag und warte auf meine Freigabe.
4. Prüf am Ende jedes Kriterium unter „Fertig, wenn" und sag mir, was offen bleibt.
5. Was dir außerhalb dieses Tasks auffällt: benennen, nicht anfassen.
```
