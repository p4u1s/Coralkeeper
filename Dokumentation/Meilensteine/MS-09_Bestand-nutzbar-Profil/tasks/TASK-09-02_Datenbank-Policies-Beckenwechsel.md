# TASK-09-02 · Datenbank: Policies, Systemeintrag beim Beckenwechsel, Löschtest

**Status:** offen
**Bezug:** FR-1.10, FR-1.11, FR-3.4, FR-6.2, FR-6.8 · RLS-Matrix („ab MS-9") · ER-Modell Festlegungen 2, 15, 18 ·
Hinweis aus TASK-07-04
**Voraussetzung:** TASK-09-01

---

## Worum geht es

Die RLS-Matrix sieht für MS-9 drei Policies vor, die noch fehlen: Koralle löschen, Bilddatensatz löschen, eigenes
Profil ändern. Dazu kommt der Systemeintrag beim Beckenwechsel (FR-1.11, aus MS-10 vorgezogen) – ab TASK-09-05 lässt
sich das Becken einer Koralle ändern. Ein Testblock prüft außerdem das Löschen einer Koralle mit Inserat, Ableger und
Historie.

## Vor dem Start klären

- [ ] **Wortlaut beim Beckenwechsel.** Vorschlag: „Becken gewechselt: Riffbecken 250 l → Ablegerbecken 60 l" – mit den
      Beckennamen zum Zeitpunkt des Wechsels, Aufbau wie „Status geändert: … → …". Ein späteres Umbenennen des Beckens
      ändert den Eintrag nicht (FR-3.3).
- [ ] **Eigene Funktion oder `systemeintrag_anlegen` erweitern?** Die Funktion unterscheidet heute nur INSERT und
      „alles andere = Statuswechsel".
  - **(a)** eigene Funktion `beckenwechsel_systemeintrag()` mit Trigger `bei_beckenwechsel_systemeintrag`
    (`after update of becken_id`, `when (old.becken_id is distinct from new.becken_id)`)
  - **(b)** `systemeintrag_anlegen` um einen Zweig erweitern – sie müsste die beiden Update-Trigger über `tg_name`
    unterscheiden
  → Vorschlag: **(a)**, gebaut wie `systemeintrag_anlegen`: `set search_path = ''`, ohne `security definer`, Datum aus
  `Europe/Berlin`, `revoke execute … from public, anon, authenticated`.
- [ ] **Profil ändern: ganze Zeile?** Die Policy `id = auth.uid()` erlaubt dem Nutzer auch, `erstellt_am` zu setzen.
  - **(a)** ganze Zeile; der Service schreibt nur Anzeigename, Kontakt-E-Mail und Telefon (KISS)
  - **(b)** zusätzlich Spaltenrechte: `update` nur auf `anzeigename`, `kontakt_email`, `kontakt_telefon`
  → Vorschlag: **(a)**.

## Schritte

1. [ ] **Drei Policies**, Namen nach Konvention `<tabelle>_<operation>_<wem>`:
   - `koralle_delete_eigene` – `for delete to authenticated using (nutzer_id = auth.uid())`
   - `bild_dokument_delete_eigene` – gleiche Bedingung
   - `profil_update_eigenes` – `for update to authenticated using (id = auth.uid()) with check (id = auth.uid())`
2. [ ] **Trigger-Funktion und Trigger** für den Beckenwechsel nach Entscheidung. Die Beckennamen liest die Funktion aus
       `public.becken` (RLS: nur eigene Becken – passt, die Koralle gehört dem Nutzer).
3. [ ] **SQL im SQL-Editor ausführen** (Nutzer), Kontrollabfrage auf die drei Policies und den neuen Trigger.
4. [ ] **Test als `do $$ … $$`-Block** mit abschließendem `raise exception`, angemeldet als Testnutzer A:
   - Koralle in Becken X anlegen, Becken auf Y ändern → genau **ein** Eintrag mit dem festgelegten Wortlaut
   - Update ohne Beckenänderung (z. B. nur Bezeichnung) → kein weiterer Eintrag
   - Ursprungskoralle mit Ableger, Inserat und Journaleintrag löschen → Koralle, Inserat und Historie sind weg, der
     Ableger besteht mit `mutter_id = null`; **kein Fehler aus `angebot_status_setzen`** (TASK-07-04)
   - eigenes Profil ändern → Zeile geändert
   - Gegenprobe als B: Koralle von A löschen und Profil von A ändern → jeweils 0 Zeilen
   - → als `TASK-09-02_Schritt 4_Policy-Trigger-Test.sql` in diesem Ordner ablegen
5. [ ] **Security Advisor** im Dashboard prüfen.
6. [ ] **Dokumentation nachziehen** (nach Freigabe): Migrationsdatei (Abschnitte Profil, Koralle, Bild-Dokument,
       Historieneintrag); ER-Modell – RLS-Matrix („ab MS-9" → angelegt) und Festlegung 15 um den Beckenwechsel
       ergänzen.

## Fertig, wenn

- [ ] Die drei Policies existieren
- [ ] Ein Beckenwechsel schreibt genau einen Systemeintrag, andere Änderungen keinen
- [ ] Das Löschen einer Koralle mit Inserat läuft ohne Fehler; Ableger bleiben mit geleertem Verweis (FR-1.10,
      Festlegung 2)
- [ ] B kann Korallen von A weder löschen noch das Profil von A ändern (FR-6.2)
- [ ] Der Testblock rollt alles zurück, der Security Advisor zeigt keine neue Warnung
- [ ] Migrationsdatei und ER-Modell sind nachgezogen

## Hinweise

- Mit der Koralle verschwinden per `CASCADE` auch Historie, Bilddatensätze, Inserat und Abgabe;
  `becken_ereignis.koralle_id` wird geleert (ER-Modell, „Fremdschlüssel und Löschverhalten"). Dateien im Storage
  entfernt keine Kaskade – das übernimmt der Service (TASK-09-04).
- Die generierten Typen ändern sich nicht (keine neue Spalte, kein neuer Enum-Wert).
- Das Statuswechsel-Formular (TASK-09-07) braucht keine neue Datenbankfunktion: Den Systemeintrag schreibt der
  vorhandene Trigger `bei_statuswechsel_systemeintrag`.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – RLS-Matrix, Festlegungen 2, 7, 15, 18, Löschverhalten
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – `profil`, `koralle`, `bild_dokument`,
  `systemeintrag_anlegen`, `angebot_status_setzen`
- `Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-04_Inserat-Status-koppeln.md` – Hinweis zum Löschen
- `Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/tasks/TASK-06-01_Schritt 4_Trigger-Test.sql` –
  Testmuster
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.10, FR-1.11, FR-3.4, FR-6.8
