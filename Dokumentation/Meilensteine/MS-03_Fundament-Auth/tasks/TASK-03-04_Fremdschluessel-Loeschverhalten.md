# TASK-03-04 · Constraints, Fremdschlüssel und Löschverhalten

**Status:** erledigt
**Bezug:** NFR-4.7 (referenzielle Integrität in der Datenbank), FR-1.1, FR-1.10, FR-1.14
**Voraussetzung:** TASK-03-03 · **TASK-02-03** („Fremdschlüssel und deren Löschverhalten festlegen") – Löschregeln entschieden und im ER-Modell nachgetragen

---

## Worum geht es

Was passiert mit abhängigen Daten, wenn ein Datensatz gelöscht wird? Das soll die **Datenbank** entscheiden,
nicht die UI (NFR-4.7). Drei Regeln sind in den Anforderungen fest vorgegeben, weitere legt das ER-Modell fest,
einige sind noch offen. Dieser Task prüft den Ist-Stand und schließt die Lücken.

## Vor dem Start klären

- [x] Die offenen Löschregeln in MS-2 (TASK-02-03) entscheiden und im ER-Modell nachtragen.
      → **Entschieden am 15.09.2026** (siehe TASK-02-03, Gruppe B), im ER-Modell nachgetragen (Abschnitt 3, „Fremdschlüssel und Löschverhalten").

## Soll-Stand

Entschieden in TASK-02-03, Stand 15.09.2026. Datenbank, SQL-Datei und ER-Modell entsprechen diesem Stand.

| Fremdschlüssel                   | Regel                  | Grundlage             | Folge                                                                |
| -------------------------------- | ---------------------- | --------------------- | -------------------------------------------------------------------- |
| `koralle.becken_id`              | `RESTRICT`, `NOT NULL` | Festlegung 1, NFR-4.7 | Becken mit Korallen nicht löschbar (FR-1.1)                          |
| `koralle.mutter_id`              | `SET NULL`             | Festlegung 2, NFR-4.7 | Ableger bleiben beim Löschen der Ursprungskoralle erhalten (FR-1.10) |
| `anfrage.angebot_id`             | `CASCADE`              | Festlegung 6, NFR-4.7 | Anfragen verschwinden mit dem Inserat                                |
| `historieneintrag.koralle_id`    | `CASCADE`              | ER-Modell Abschnitt 1 | Historie verschwindet mit der Koralle                                |
| `angebot.koralle_id`             | `CASCADE`              | ER-Modell Abschnitt 1 | Inserat verschwindet mit der Koralle                                 |
| `bild_dokument.koralle_id`       | `CASCADE`              | ER-Modell Abschnitt 1 | Bilder und Belege verschwinden mit der Koralle                       |
| `messwert.becken_id`             | `CASCADE`              | ER-Modell Abschnitt 1 | Messwerte verschwinden mit dem Becken                                |
| `becken_ereignis.becken_id`      | `CASCADE`              | ER-Modell Abschnitt 1 | Ereignisse verschwinden mit dem Becken                               |
| `becken_ereignis.koralle_id`     | `SET NULL`             | ER-Modell Abschnitt 1 | Ereignis bleibt, der Verweis auf die Koralle wird geleert            |
| `profil.id` → `auth.users`       | `CASCADE`              | TASK-02-03            | Konto löschen nimmt das Profil mit (FR-6.9)                          |
| `nutzer_id` (alle acht Tabellen) | `CASCADE`              | TASK-02-03            | Profil löschen nimmt alle Daten des Nutzers mit                      |
| `anfrage.interessent_id`         | `CASCADE`              | TASK-02-03            | Anfragen eines gelöschten Kontos verschwinden                        |
| `abgabe.empfaenger_nutzer_id`    | `SET NULL`             | TASK-02-03            | Abgabe bleibt beim Züchter, Empfänger bleibt als Text erhalten       |
| `abgabe.koralle_id`              | `CASCADE`              | TASK-02-03            | Abgabe verschwindet mit der Koralle, wie ihre Historie               |
| `koralle.primaerbild`            | `SET NULL`             | TASK-02-03            | Bild löschen leert das Primärbild                                    |
| `historieneintrag.bild_id`       | `NO ACTION`            | TASK-02-03            | Bild mit Historienbezug ist nicht löschbar (FR-3.3)                  |

`UNIQUE`: `angebot.koralle_id` (Festlegung 4) und `abgabe.koralle_id` (Festlegung 5) sind in der Datenbank vorhanden ✔ – `abgabe` ergänzt am 15.09.2026.

## Schritte

1. [x] **Ist-Stand aus Supabase holen** – alle Fremdschlüssel, Unique- und Check-Constraints mit ihrer Definition:

   ```sql
   select conrelid::regclass        as tabelle,
          conname                   as name,
          pg_get_constraintdef(oid) as definition
   from pg_constraint
   where connamespace = 'public'::regnamespace
     and contype in ('f', 'u', 'c')
   order by 1, 2;
   ```

2. [x] **Mit der Tabelle oben vergleichen** und jede Zeile abhaken.
3. [x] **Offene Regeln entscheiden** (siehe „Vor dem Start klären").
4. [x] **Abweichungen korrigieren** – eine Löschregel lässt sich nur ändern, indem der Constraint gelöscht und neu angelegt wird:

   ```sql
   alter table public.<tabelle> drop constraint <name>;
   alter table public.<tabelle> add constraint <name>
     foreign key (<spalte>) references public.<ziel>(id) on delete <regel>;
   ```

   → Umgesetzt am 15.09.2026; erneute Abfrage aus Schritt 1 zeigt alle 23 Fremdschlüssel und beide `UNIQUE` wie in TASK-02-03 entschieden.

5. [x] **Die drei NFR-4.7-Regeln praktisch testen** (SQL-Editor, mit erfundenen Testdaten nach NFR-3.4):
   - [x] Koralle ohne `becken_id` einfügen → wird abgelehnt
   - [x] Becken löschen, dem noch eine Koralle zugeordnet ist → wird abgelehnt
   - [x] Ursprungskoralle löschen → der Ableger bleibt, sein `mutter_id` ist danach `null`
   - [x] Inserat löschen → zugehörige Anfragen sind weg

   → Am 15.09.2026 mit einem Testskript geprüft, das in einer Transaktion läuft und alles zurückrollt: **alle 9 Tests bestanden**.
   Zusätzlich zu den vier Regeln oben: Becken ohne Korallen löschen, Primärbild löschen, Bild mit Historienbezug löschen (abgelehnt),
   Koralle mit allen Abhängigkeiten löschen, Konto mit Becken und Korallen löschen (trotz `RESTRICT` auf `koralle.becken_id` erfolgreich).

6. [x] **Testdaten wieder entfernen.** → Entfällt, das Testskript rollt alle Daten zurück.
7. [x] **SQL-Quelle im Repo nachziehen** (siehe TASK-03-03). → `Coralkeeper_database_migration.sql` am 15.09.2026 an die Datenbank angeglichen.

## Fertig, wenn

- [x] Jeder Fremdschlüssel hat ein bewusst gewähltes Löschverhalten, dokumentiert im ER-Modell
- [x] Die drei Regeln aus NFR-4.7 sind in der Datenbank nachweislich wirksam (Schritt 5)
- [x] Datenbank und SQL-Quelle im Repo stimmen überein

## Hinweise

- Der SQL-Editor im Supabase-Dashboard arbeitet mit Administratorrechten und **umgeht RLS**. Für Integritätstests ist das gewollt – für RLS-Tests (TASK-03-05) nicht.
  Dass Kaskaden auch für normale Nutzer ohne DELETE-Policy greifen (Historie beim Löschen einer Koralle), ist damit noch nicht belegt.
- Das ER-Modell enthält keine `CHECK`-Constraints (z. B. `volumen_liter > 0`). Ob welche nötig sind, gehört in MS-2 – FR-6.6 verlangt die Prüfung von Zahlenbereichen zumindest im Formular.
- Außerhalb des Umfangs bemerkt: FR-4.3 („je Inserat genau eine Anfrage je Interessent") hätte ein `UNIQUE (angebot_id, interessent_id)` nahegelegt; das ER-Modell enthält es nicht. Betrifft MS-11.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 1, Abschnitt 3 (Festlegungen 1–6, „Fremdschlüssel und Löschverhalten")
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-4.7, FR-1.1, FR-1.10
- `Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-03_Fremdschluessel-Loeschverhalten.md` – entschiedene Löschregeln
