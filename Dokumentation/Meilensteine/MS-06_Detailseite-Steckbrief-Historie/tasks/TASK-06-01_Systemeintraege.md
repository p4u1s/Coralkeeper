# TASK-06-01 · Systemeinträge bei Anlage und Statuswechsel

**Status:** offen
**Bezug:** FR-3.4 (Systemeinträge bei Anlage und Statuswechsel), Definition of Done MS-6 („die Anlage der Koralle steht
als Systemeintrag in derselben Historie"), FR-6.2
**Voraussetzung:** MS-5 abgeschlossen

---

## Worum geht es

Jede neu angelegte Koralle bekommt automatisch einen Historieneintrag vom Typ `system`, ebenso jeder Wechsel des
Status. In MS-6 gibt es noch keine Oberfläche für den Statuswechsel (kommt mit MS-7 „Zur Abgabe" und MS-9 FR-1.9) –
der Mechanismus wird jetzt gebaut und per SQL geprüft, damit die späteren Meilensteine ihn nur noch nutzen.

## Vor dem Start klären

- [ ] **Wo entsteht der Eintrag?**
  - **(a)** Datenbank-Trigger auf `koralle` (`after insert` und `after update of status`) – greift bei jedem Weg,
    auch bei späteren Statuswechseln aus MS-7, MS-9 und MS-11, und läuft in derselben Transaktion wie die Änderung
  - **(b)** Im Service: `createCoral` und jede spätere Statusfunktion schreiben zusätzlich einen Eintrag – zwei
    getrennte Anfragen; scheitert die zweite, fehlt der Eintrag
  → Entscheiden. (a) ist robuster und hält den Service schlank; (b) braucht kein SQL.
- [ ] **Datum.** `current_date` liefert in Supabase das **UTC-Datum** – zwischen 0 und 2 Uhr deutscher Zeit steht dann
      der Vortag im Eintrag. Alternative: `(now() at time zone 'Europe/Berlin')::date`. → Festlegen.
- [ ] **Wortlaut.** Vorschlag: „Koralle angelegt" und „Status geändert: Im Bestand → Zur Abgabe" (deutsche
      Beschriftungen der Statuswerte wie in der Statuslegende von design.md). → Festlegen.
- [ ] **Typ `system` schützen?** Die INSERT-Policy erlaubt dem Frontend heute, selbst Einträge mit `typ = 'system'`
      anzulegen. Einschränken hieße: INSERT-Policy um `typ <> 'system'` ergänzen und die Trigger-Funktion als
      `security definer` anlegen. → Entscheiden. Vorschlag: nicht einschränken (KISS, kein Produktivsystem), aber im
      ER-Modell als bewusste Entscheidung vermerken.

## Schritte

Bei Entscheidung (a):

1. [ ] **Trigger-Funktion** in SQL schreiben: legt einen Eintrag mit `nutzer_id = new.nutzer_id`,
       `koralle_id = new.id`, `typ = 'system'`, Datum und Text nach Entscheidung an. Muster für Aufbau, Kommentare und
       `set search_path = ''`: `profil_anlegen` in der Migrationsdatei.
2. [ ] **Zwei Trigger** auf `public.koralle`:
   - nach INSERT → „Koralle angelegt"
   - nach UPDATE der Spalte `status`, nur wenn sich der Wert wirklich ändert
     (`when (old.status is distinct from new.status)`) → Statuswechsel
3. [ ] **SQL im SQL-Editor ausführen** (Nutzer) und mit einer Kontrollabfrage prüfen, dass Funktion und beide Trigger
       existieren.
4. [ ] **Test als `do $$ … $$`-Block** mit abschließendem `raise exception` (Muster:
       `MS-03_Fundament-Auth/tasks/TASK-03-05_Schritt 7-8_RLS-Test.sql`), angemeldet als Testnutzer A:
   - Koralle anlegen → genau ein Eintrag `system` mit „Koralle angelegt" und dem erwarteten Datum
   - Status auf `zur_abgabe` setzen → zweiter Eintrag mit dem Statuswechsel
   - Status auf denselben Wert setzen → **kein** weiterer Eintrag
   - Bezeichnung ändern → **kein** weiterer Eintrag
5. [ ] **Security Advisor** im Dashboard prüfen; neue Warnungen zur Funktion beheben wie bei `profil_anlegen`.
6. [ ] **Dokumentation nachziehen** (nach Freigabe): SQL in `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql`
       im Abschnitt „Historieneintrag" ergänzen; im ER-Modell eine Festlegung zu den Systemeinträgen ergänzen.

Bei Entscheidung (b): `createCoral` legt nach erfolgreichem Insert einen Eintrag an; ein Fehler beim zweiten Schritt
wird als deutsche Meldung geworfen. Test dann über die Oberfläche in TASK-06-06.

## Fertig, wenn

- [ ] Eine neu angelegte Koralle hat genau einen Systemeintrag „Koralle angelegt" (**Definition of Done**)
- [ ] Ein Statuswechsel erzeugt genau einen Systemeintrag, ein Update ohne Statusänderung keinen
- [ ] Das Datum im Eintrag entspricht der Entscheidung zur Zeitzone
- [ ] Der Testblock läuft durch und rollt alles zurück (keine Testreste in der Datenbank)
- [ ] Security Advisor ohne neue Warnung
- [ ] Migrationsdatei und ER-Modell sind nachgezogen

## Hinweise

- Keine neue Tabelle, keine neue Spalte – die Typen bleiben unverändert (NFR-4.4).
- Bereits vorhandene Korallen (Testdaten, Korallen aus MS-5) bekommen **keinen** nachträglichen Eintrag. Kein
  Nachtragen per SQL ohne eigene Entscheidung.
- TASK-05-01 nennt als Hinweis „`createCoral` wird dann erweitert" – bei Entscheidung (a) entfällt das.
- Ableger (MS-7) sind ebenfalls ein INSERT auf `koralle` und bekommen dann „Koralle angelegt". Ob ein Ableger einen
  eigenen Wortlaut braucht (FR-3.4 „Ablegererzeugung"), wird in MS-7 entschieden – hier nicht vorwegnehmen.
- Beckenwechsel und Abgabe aus FR-3.4 gehören zu MS-10 (FR-1.11, FR-3.7).

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-3.4, FR-1.9, Grundsatzentscheidung 6
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `historieneintrag`, RLS-Matrix, Festlegung 7
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Abschnitte „Koralle", „Historieneintrag", Funktion
  `profil_anlegen`
- `design.md` – Abschnitt 1, Statusfarben Koralle (Beschriftungen der Statuswerte)
