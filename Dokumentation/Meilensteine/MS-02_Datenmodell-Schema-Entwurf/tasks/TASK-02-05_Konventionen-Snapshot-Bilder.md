# TASK-02-05 · Namenskonvention, Zeitstempel, Snapshot- und Bildstrategie festlegen

**Status:** offen
**Bezug:** Entscheidungen 5 und 6 aus MS-2 · Grundsatz 4, FR-1.7, FR-3.4, FR-3.6 (Snapshot) · FR-1.2, FR-1.3, FR-1.12, FR-3.8, NFR-2.5, NFR-3.1 (Bilder) · NFR-1.5 (de-DE)
**Voraussetzung:** keine

---

## Worum geht es

Vier kleinere Festlegungen, jede in einem eigenen Abschnitt:

- **A · Namenskonvention** und **B · Zeitstempel** schreiben fest, was im Schema schon gelebt wird, und klären zwei Lücken.
- **C · Ableger-Snapshot** und **D · Bilder** sind zwei der sechs MS-2-Entscheidungen und noch offen.

Ergebnis ist je ein kurzer Abschnitt bzw. eine Festlegung im ER-Modell. Die Abschnitte lassen sich einzeln abarbeiten.

---

## A · Namenskonvention

Die Regeln stehen weitgehend fest (`CLAUDE.md`, SQL-Datei). Sie müssen nur einmal an einer Stelle aufgeschrieben werden.

| Regel                                                                      | Beispiel                                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Tabellen deutsch, Singular, `snake_case`                                   | `becken_ereignis`, `historieneintrag`                               |
| Umlaute und ß werden umschrieben                                           | `fuetterung`, `groesse`, `salinitaet`, `haendler`                   |
| Primärschlüssel `id uuid default gen_random_uuid()`                        | Ausnahme: `profil.id` = `auth.users.id`, ohne Default               |
| Fremdschlüssel `<zieltabelle>_id`; bei einer Rolle der Rollenname + `_id`  | `becken_id` · `mutter_id`, `interessent_id`, `empfaenger_nutzer_id` |
| Aufzählungstypen: Typname `snake_case`, Werte klein und ohne Umlaute       | `koralle_status`: `im_bestand`, `zur_abgabe`                        |
| Klartext-Beschriftung der Enum-Werte nur im Frontend                       | `cites_ii` → „CITES II", `eigene_nachzucht` → „Eigene Nachzucht"    |
| Policies `<tabelle>_<operation>_<wem>`                                     | `becken_select_eigene`, `angebot_select_sichtbar`                   |
| Funktionen und Trigger deutsch                                             | `profil_anlegen` (Vorschlag aus TASK-03-06)                         |
| Frontend: englische Bezeichner, Tabellen- und Spaltennamen bleiben deutsch | `getOwnProfile()` liest `profil.anzeigename`                        |

### Vor dem Start klären

- [ ] **`koralle.primaerbild` weicht ab** – ein Fremdschlüssel ohne `_id`. In `primaerbild_id` umbenennen oder als Ausnahme festhalten?
  - Umbenennen ist **jetzt** am billigsten: Die Typen sind noch nicht generiert (TASK-03-07), und kein Code greift auf das Feld zu.
    Später kostet es jede Stelle, die das Feld nutzt. Das farbige PNG zeigt übrigens schon `primaerbild_id` (siehe TASK-02-01).
  - Dagegen: Der Name steht auch in den Anforderungen (Abschnitt 4) und im MS-2-Dokument. Die müssten mitgezogen werden.

---

## B · Zeitstempel

**Regel (Vorschlag):**

- `date` für fachliche Daten, die der Nutzer eingibt: `datum`, `erwerbsdatum`, `startdatum`, `aufnahmedatum`
- `timestamptz not null default now()` für den Zeitpunkt, den das System setzt: `erstellt_am`

**Ist-Stand:** `erstellt_am` gibt es auf `profil`, `historieneintrag`, `angebot` und `anfrage` –
nicht auf `becken`, `koralle`, `messwert`, `becken_ereignis`, `bild_dokument` und `abgabe`.

### Vor dem Start klären

- [ ] **`erstellt_am` nur dort, wo es gebraucht wird, oder auf jeder Tabelle?**
  - Gebraucht wird es bei `historieneintrag` (Reihenfolge bei gleichem Datum, FR-3.2) und bei `anfrage` (Reihenfolge der Anfragen, FR-4.4).
    Für die übrigen Tabellen verlangt keine Anforderung einen Zeitpunkt.
  - Folge ohne `erstellt_am` bei `messwert`: Zwei Messungen am selben Tag lassen sich nicht auseinanderhalten (siehe TASK-02-02, Entscheidung 2).
  - **Vorschlag:** Ist-Stand festschreiben (KISS).
- [ ] **`geaendert_am`?** Keine Anforderung verlangt es. **Vorschlag:** keins.

### Hinweise für die Umsetzung (ins ER-Modell übernehmen)

- Historie sortieren: `datum` absteigend, bei gleichem Datum `erstellt_am` absteigend (FR-3.2).
- Frontend: `date`-Werte als Text `'JJJJ-MM-TT'` lesen und schreiben, **nie über `toISOString()`**. Das rechnet in UTC um und macht aus
  lokaler Mitternacht in Deutschland den Vortag. Angezeigt wird im Format `12.03.2026` (NFR-1.5).

---

## C · Ableger-Snapshot (Entscheidung 5)

Beim Anlegen eines Ablegers werden Art, Morphe, Steckbrief und Herkunftskette **kopiert, nicht referenziert** (Grundsatz 4, FR-1.7, FR-3.6).
Da Steckbrief und Herkunft in `koralle` eingebettet sind (Festlegung 3), heißt das: Spalten kopieren. Offen ist, **wo** das passiert,
**welche** Spalten es genau sind und **wie** die Herkunftskette aussieht. Umgesetzt wird es in MS-7.

### Vor dem Start klären

- [ ] **Wo entsteht der Snapshot?** MS-2 nennt KISS und NFR-4.3 als Argumente für die Service-Schicht.

  |                                   | Service-Schicht                                                                     | Datenbankfunktion (`rpc`)                 |
  | --------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------- |
  | Ablauf                            | Ursprungskoralle lesen → Ableger einfügen → Historieneintrag einfügen, drei Aufrufe | ein Aufruf, eine Transaktion              |
  | Wenn der letzte Schritt scheitert | Der Ableger existiert ohne Systemeintrag (FR-3.4 verletzt)                          | Es wird nichts gespeichert                |
  | Aufwand                           | TypeScript, testbar wie jeder Service                                               | PL/pgSQL, Migration, eigene Rechteprüfung |

  Dieselbe Frage kommt wieder bei FR-1.9 (Statuswechsel + Historieneintrag, MS-9) und FR-4.7 (Abschluss in einem Schritt, MS-11).
  Am besten **eine Regel für alle Vorgänge mit mehreren Schreibzugriffen** festlegen.

- [ ] **Welche Spalten werden kopiert?** Entwurf:

  | Umgang         | Spalten                                                                                                                                                                                                                                                                          |
  | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | kopiert        | `art`, `handelsname` (= Morphe, FR-1.2), `licht`, `stroemung`, `platzierung`, `nesselkraft`, `wuchsform`, `schwierigkeit`, `fuetterung`, `schutzstatus`                                                                                                                          |
  | neu gesetzt    | `mutter_id` = Ursprungskoralle · `becken_id` = Becken der Ursprungskoralle, änderbar (FR-1.7) · `status` = `im_bestand` (Default) · `herkunftskette` (siehe unten)                                                                                                               |
  | zu entscheiden | `bezeichnung` (Pflichteingabe oder vorbelegt?) · `erwerbsdatum` (Tag der Ablegererzeugung?) · `quelle_typ` (`eigene_nachzucht`?) · `quelle_name`, `belegnummer`, `cites_nr`, `herkunft_notiz` (mitkopieren oder leer lassen, weil sie in `herkunftskette` zusammengefasst sind?) |
  | nicht kopiert  | `id` · `primaerbild` (das Bild gehört über `bild_dokument.koralle_id` zur Ursprungskoralle)                                                                                                                                                                                      |

- [ ] **Wie ist `herkunftskette` aufgebaut?** FR-3.6 nennt den Snapshot, sagt aber nicht, wie der Text aussieht. Er muss so viel enthalten,
      dass die Herkunft auch nach dem Löschen der Ursprungskoralle nachvollziehbar bleibt (Grundsatz 4). Ein mögliches Format, **nur als Beispiel**:

  ```text
  Ableger von „Grüne Acropora", erzeugt am 12.03.2026 · Quelle: Händler Korallenwelt, Beleg 4711
  ← (Herkunftskette der Ursprungskoralle)
  ```

  Die Kette wächst mit jeder Ablegergeneration.

- [ ] **Wie wird „unveränderlich" durchgesetzt (FR-3.6)?** `herkunftskette` ist eine normale Spalte. Die UPDATE-Policy auf `koralle` erlaubt es,
      sie zu ändern. Nur in der UI (Feld nicht bearbeitbar) oder auch in der Datenbank (Trigger)? **Vorschlag:** nur UI (KISS), im ER-Modell vermerkt.
- [ ] **Systemeintrag „Ablegererzeugung" (FR-3.4):** Wird er beim Ableger geschrieben, bei der Ursprungskoralle oder bei beiden?

---

## D · Bilder, Bucket-Layout und Pfadschema (Entscheidung 6)

**Teil der Entscheidung ist schon gefallen:** Es gibt eine eigene Tabelle `bild_dokument` (Fotos und Belege zusammengelegt), und
`koralle.primaerbild` verweist darauf (Festlegung 9). Die Frage aus MS-2 („reicht die Spalte `koralle.primaerbild`?") ist damit beantwortet –
die Begründung sollte im ER-Modell ausdrücklich darauf Bezug nehmen. Der Bild-Upload ist Umfang von MS-9; MS-5 schließt ihn ausdrücklich aus.

**Offen ist der Storage-Teil.** Er muss bis MS-9 feststehen, blockiert MS-3 aber nicht.

### Vor dem Start klären

- [ ] **Ein Bucket oder zwei?** (ER-Modell, offener Punkt 1) Fotos und Belege gemeinsam oder getrennt.
      **Vorschlag:** einer (KISS). Unterschieden wird über `bild_dokument.typ`.
- [ ] **„Buckets pro Nutzer" (NFR-3.1) wörtlich nehmen?** Üblich ist in Supabase **ein** Bucket mit **einem Ordner je Nutzer**. Eine Storage-Policy
      lässt dann nur den eigenen Ordner zu: `(storage.foldername(name))[1] = auth.uid()::text`.
      Ein eigener Bucket je Nutzer müsste bei jeder Registrierung angelegt werden. → Klären, ob die Ordner-Lösung NFR-3.1 erfüllt.
- [ ] **Pfadschema.** **Vorschlag:** `<nutzer_id>/<koralle_id>/<bild_dokument.id>.<endung>` – der erste Ordner ist der Nutzer (für die Policy).
      Keine Originaldateinamen im Pfad (Leerzeichen, Umlaute).
- [ ] **Privater oder öffentlicher Bucket?** Privat: Anzeige über signierte URLs, Fremde sehen nichts. Öffentlich: Jeder mit dem Link sieht das Bild.
      Das hängt am Inseratbild (FR-4.1) und an Frage 3 in TASK-02-04.
- [x] **`bild_dokument.storage_pfad` `NOT NULL`?** Im ER-Modell und in der SQL-Datei ist die Spalte nullable. Ein Datensatz ohne Datei ergibt
      keinen Sinn. **Vorschlag:** `NOT NULL`.
      → **Entschieden am 15.09.2026:** `NOT NULL`, umgesetzt in TASK-03-07.
- [ ] **ER-Modell, offener Punkt 2 bestätigen:** Höchstens fünf Belege je Koralle (FR-3.8) werden in der Service-Schicht geprüft, nicht in der Datenbank.
- [ ] **ER-Modell, offener Punkt 3 bestätigen:** `aufnahmedatum` bleibt so und ist bei Belegen in der Regel leer.

### Hinweis

- Die 5-MB-Grenze (NFR-2.5) wird im Formular geprüft. Zusätzlich lässt sich am Bucket eine Dateigrößenbegrenzung setzen – das ist eine Einstellung, kein Code.

---

## Schritte

1. [ ] **A:** Tabelle prüfen, `primaerbild`-Frage entscheiden, Abschnitt „Namenskonvention" ins ER-Modell.
2. [ ] **B:** Fragen entscheiden, Abschnitt „Zeitstempel" samt Umsetzungshinweisen ins ER-Modell.
3. [ ] **C:** Fragen entscheiden, als neue Festlegung in Abschnitt 3 des ER-Modells: Ort, Spaltenliste, Format der Herkunftskette,
       Umgang mit „unveränderlich", Systemeintrag.
4. [ ] **D:** Fragen entscheiden, als Festlegung ins ER-Modell. In Abschnitt 4 („Offene Punkte") die entschiedenen Punkte 1–3 entfernen.

## Fertig, wenn

- [ ] Das ER-Modell hat einen Abschnitt „Namenskonvention" und einen Abschnitt „Zeitstempel"
- [ ] Die Abweichung `koralle.primaerbild` ist entschieden (umbenennen oder Ausnahme)
- [ ] Entscheidung 5 (Snapshot) ist mit Ort, Spaltenliste und Format der Herkunftskette festgelegt und begründet
- [ ] Entscheidung 6 (Bilder) ist mit Bucket-Layout und Pfadschema festgelegt und begründet – oder bewusst mit Zielmeilenstein MS-9 verschoben
- [ ] In Abschnitt 4 des ER-Modells steht nichts mehr, was hier entschieden wurde

## Hinweise

- Nichts in der Datenbank oder in der SQL-Datei ändern. Eine Umbenennung von `primaerbild` oder ein neues `NOT NULL` setzt MS-3 um – vor TASK-03-07 (Typen generieren).
- Eine Umbenennung von `primaerbild` betrifft auch die Anforderungsanalyse (Abschnitt 4). Diese Datei nur mit ausdrücklicher Freigabe ändern.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 1, Festlegungen 3 und 9, Abschnitt 4 (offene Punkte 1–3)
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Namen, `erstellt_am`, `storage_pfad`
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 3 (Grundsatz 4), 4.1, FR-1.2, FR-1.3, FR-1.7, FR-1.12, FR-3.2, FR-3.4, FR-3.6, FR-3.8, FR-4.1, NFR-1.5, NFR-2.5, NFR-3.1
- [`../MS-02_Datenmodell-Schema-Entwurf.md`](../MS-02_Datenmodell-Schema-Entwurf.md) – Ergebnis „Namenskonvention und Zeitstempel", Entscheidungen 5 und 6
- `CLAUDE.md` – Konventionen
