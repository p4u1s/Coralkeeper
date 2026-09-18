# TASK-03-03 · MVP-Schema gemäß MS-2 anlegen

**Status:** erledigt
**Bezug:** NFR-4.7 (referenzielle Integrität), FR-1.14 (keine Koralle ohne Becken)
**Voraussetzung:** Zugang zum Supabase-Dashboard

---

## Worum geht es

Die Tabellen existieren bereits. Offen ist der Nachweis, dass sie **dem ER-Modell entsprechen** und dass
das Repo den tatsächlichen Datenbankstand wiedergibt. Ziel ist eine SQL-Quelle im Repo, aus der sich die
Datenbank jederzeit neu aufbauen ließe – und die mit dem übereinstimmt, was in Supabase wirklich steht.

Fremdschlüssel und Löschverhalten sind TASK-03-04, RLS ist TASK-03-05 – hier geht es um Tabellen, Spalten und Aufzählungstypen.

## Vor dem Start klären

- [x] **Welche SQL-Datei ist die Quelle?** Im Repo liegen zwei Dateien, die sich überschneiden:
  - `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – profil, becken, koralle, abgabe, angebot, anfrage, messwert, becken_ereignis, bild_dokument
  - `Dokumentation/Datenmodell/database_migration.sql` – koralle, historieneintrag, abgabe

  `koralle` und `abgabe` stehen in beiden, `historieneintrag` nur in der zweiten.
  → Festlegen, welche Datei (oder welche neue, zusammengeführte Datei) künftig den Stand abbildet.
  → **Entschieden:** `Coralkeeper_database_migration.sql`. `database_migration.sql` ist nicht mehr vorhanden;
    `historie_typ` und `historieneintrag` werden in Schritt 6 ergänzt.

## Schritte

1. [x] **Tabellenliste aus Supabase holen** (SQL-Editor):

   ```sql
   select table_name
   from information_schema.tables
   where table_schema = 'public'
   order by table_name;
   ```

2. [x] **Gegen das ER-Modell abhaken** – erwartet sind diese zehn Tabellen:
   - [x] `profil`
   - [x] `becken`
   - [x] `koralle`
   - [x] `historieneintrag`
   - [x] `angebot`
   - [x] `anfrage`
   - [x] `messwert`
   - [x] `becken_ereignis`
   - [x] `bild_dokument`
   - [x] `abgabe`
3. [x] **Aufzählungstypen holen** und mit der Tabelle „Aufzählungstypen" im ER-Modell (Abschnitt 3) vergleichen.
       Dort stehen elf Typen: `koralle_status`, `stufe`, `platzierung`, `schutzstatus`, `quelle_typ`, `historie_typ`,
       `angebot_modus`, `anfrage_status`, `messparameter`, `ereignis_typ`, `medien_typ`.

   ```sql
   select t.typname as typ,
          string_agg(e.enumlabel, ' · ' order by e.enumsortorder) as werte
   from pg_type t
   join pg_enum e on e.enumtypid = t.oid
   where t.typnamespace = 'public'::regnamespace
   group by t.typname
   order by 1;
   ```

4. [x] **Spalten holen und je Tabelle vergleichen** (Name, Typ, `NOT NULL`, Default):

   ```sql
   select table_name, column_name, udt_name, is_nullable, column_default
   from information_schema.columns
   where table_schema = 'public'
   order by table_name, ordinal_position;
   ```

5. [x] **Abweichungen notieren** (Tabelle unten). Für jede Abweichung entscheiden: in der Datenbank korrigieren
       **oder** bewusst so lassen und im ER-Modell nachtragen. Beides nur mit Freigabe.
6. [x] **Repo nachziehen:** Die festgelegte SQL-Quelle so aktualisieren, dass sie den tatsächlichen Stand
       vollständig und **in ausführbarer Reihenfolge** enthält.

## Befunde aus der Durchsicht der SQL-Dateien (11.09.2026)

Stand der **Dateien**, nicht der Datenbank – in Schritt 4 prüfen, ob die Datenbank genauso aussieht.

- [x] `historieneintrag` wird ohne Schemapräfix angelegt (`create table historieneintrag(`), alle anderen mit `public.`.
- [x] `historieneintrag.bild_id` fehlt in der `create table`-Anweisung. Ergänzt wird die Spalte am Ende von
      `Coralkeeper_database_migration.sql` per `alter table` – in dieser Datei wird `historieneintrag` aber gar nicht angelegt.
      Die Datei läuft allein also nicht in einem Durchgang durch.
- [x] `angebot.sichtbar` hat weder `NOT NULL` noch einen Default. Ein Inserat mit `sichtbar = null` wäre für Fremde unsichtbar und für die UI mehrdeutig.
      → **Entschieden:** `NOT NULL default true` (FR-4.1).
- [x] `angebot.erstellt_am` hat keinen Default, anders als `profil.erstellt_am` und `anfrage.erstellt_am` (`default now()`).
      → **Entschieden:** `NOT NULL default now()`, wie bei `anfrage`, `profil` und `historieneintrag`.
- [x] Mehrere Aufzählungsspalten sind nullable, obwohl sie den Datensatz erst bestimmen:
      `messwert.parameter`, `becken_ereignis.typ`, `angebot.modus`, `bild_dokument.typ`.
      Das ER-Modell sagt dazu nichts – mit MS-2 klären.
      → **Entschieden:** alle vier `NOT NULL`, ohne Default.

## Abweichungsprotokoll

| Tabelle / Typ      | Spalte                                                | ER-Modell                | Datenbank                     | Entscheidung                                                     |
| ------------------ | ----------------------------------------------------- | ------------------------ | ----------------------------- | ---------------------------------------------------------------- |
| `becken`           | `name`, `volumen_liter`, `beschreibung`, `startdatum` | vorhanden                | fehlten                       | in der DB ergänzt                                                |
| `becken`           | `nutzer_id`                                           | `NOT NULL`               | nullable                      | in der DB korrigiert                                             |
| `becken`           | `created_at`                                          | –                        | vorhanden                     | in der DB gelöscht                                               |
| `profil`           | `id`                                                  | kein Default             | `default gen_random_uuid()`   | Default in der DB entfernt                                       |
| `profil`           | `erstellt_am`                                         | `default now()`          | hieß `created_at`, `NOT NULL` | in der DB umbenannt; `NOT NULL` bleibt, im ER-Modell nachgetragen |
| `profil`           | `anzeigename`, `kontakt_email`                        | `NOT NULL`, kein Default | `NOT NULL`, `default ''`      | Default in der DB entfernt (TASK-03-06)                          |
| `historieneintrag` | `typ`                                                 | ohne `NOT NULL`          | `NOT NULL`                    | bewusst so gelassen, im ER-Modell nachgetragen                   |
| `historieneintrag` | `erstellt_am`                                         | ohne Default             | `NOT NULL`, `default now()`   | bewusst so gelassen, im ER-Modell nachgetragen                   |

## Fertig, wenn

- [x] Alle zehn Tabellen und elf Aufzählungstypen sind in Supabase vorhanden und abgehakt
- [x] Jede Abweichung zum ER-Modell ist entweder behoben oder als bewusste Entscheidung festgehalten
- [x] Es gibt **eine** festgelegte SQL-Quelle im Repo, und sie stimmt mit der Datenbank überein

## Hinweise

- MS-3 verlangt, das Schema „in einem Zug, nicht schrittweise" anzulegen. Das ist durch die bereits angelegten Tabellen überholt – entscheidend ist jetzt, dass Repo und Datenbank übereinstimmen.
- Das ER-Modell nennt sieben Tabellen als MVP-Umfang. `bild_dokument` wird trotzdem gebraucht, weil `koralle.primaerbild` und `historieneintrag.bild_id` darauf verweisen.
- Wird später am Schema etwas geändert, müssen die Typen neu generiert werden (TASK-03-07).

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 1 (Felder), Abschnitt 3 (Aufzählungstypen)
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql`, `Dokumentation/Datenmodell/database_migration.sql`
- [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) – Umfang, zweiter Punkt
