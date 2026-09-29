# TASK-07-04 · Inserat und Status koppeln

**Status:** erledigt
**Bezug:** FR-4.1 („Die Koralle erhält den Status `zur Abgabe`"), FR-4.2 („zurückziehbar – die Koralle geht zurück auf
`im Bestand`, das Inserat wird gelöscht"), FR-3.4, ER-Modell Festlegungen 12 und 15
**Voraussetzung:** MS-6 abgeschlossen (unabhängig vom Ableger-Strang)

---

## Worum geht es

Inserieren und Zurückziehen bestehen aus je zwei Schreibvorgängen: Inserat anlegen bzw. löschen **und** den Status der
Koralle setzen. Den Systemeintrag zum Statuswechsel schreibt bereits der Trigger aus TASK-06-01. Hier wird entschieden,
wo die Kopplung liegt, damit kein halber Zustand entsteht (Inserat sichtbar, Koralle aber „im Bestand").

## Vor dem Start klären

- [x] **Wo liegt die Kopplung?**
  - **(a)** Service: zwei Aufrufe nacheinander. Scheitert der zweite, bleibt ein halber Zustand; ein Rückgängig-Aufruf
    im Service kann selbst scheitern.
  - **(b)** Trigger auf `angebot`: nach INSERT Status `zur_abgabe`, nach DELETE Status `im_bestand`. Eine Transaktion,
    der Service bleibt bei einem Aufruf – Muster Festlegung 15.
  - **(c)** Datenbankfunktion per `rpc`: eine Transaktion, aber eine zweite Aufrufart neben `.from()` und eine eigene
    Rechteprüfung.
  → Vorschlag: **(b)**.
  → **Entschieden am 29.09.2026:** (b).
- [x] **Bedingung beim Löschen.** FR-4.7 (MS-11) setzt die Koralle erst auf `abgegeben` und löscht dann das Inserat.
      Ein Trigger ohne Bedingung würde `abgegeben` wieder mit `im_bestand` überschreiben. → Vorschlag: nach DELETE nur
      zurücksetzen, **wenn der Status noch `zur_abgabe` ist**.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.
- [x] **Inserieren nur aus `im_bestand` – in der Datenbank erzwingen?** → Vorschlag: nein, nur in der UI (KISS).
      Ein zweites Inserat zur selben Koralle verhindert `UNIQUE` auf `angebot.koralle_id` ohnehin.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.

## Schritte

Bei Entscheidung (b):

1. [x] **Trigger-Funktion** in SQL, z. B. `angebot_status_setzen()`: Aufbau wie `systemeintrag_anlegen` –
       `set search_path = ''`, **ohne** `security definer` (die Policy `koralle_update_eigene` greift; Festlegung 12
       stellt sicher, dass die Koralle dem Nutzer gehört), `revoke execute … from public, anon, authenticated`.
   - INSERT: `update public.koralle set status = 'zur_abgabe' where id = new.koralle_id`
   - DELETE: `… set status = 'im_bestand' where id = old.koralle_id and status = 'zur_abgabe'`
2. [x] **Zwei Trigger** auf `public.angebot`: nach INSERT und nach DELETE, je `for each row`.
3. [x] **SQL im SQL-Editor ausführen** (Nutzer), Kontrollabfrage auf Funktion und beide Trigger.
4. [x] **Test als `do $$ … $$`-Block** mit abschließendem `raise exception`, angemeldet als Testnutzer A:
   - Koralle anlegen, Inserat anlegen → Status `zur_abgabe`, genau ein Eintrag
     „Status geändert: Im Bestand → Zur Abgabe"
   - Inserat löschen → Status `im_bestand`, genau ein weiterer Eintrag „Status geändert: Zur Abgabe → Im Bestand"
   - erneut inserieren, Status auf `abgegeben` setzen, Inserat löschen → Status bleibt `abgegeben`
   - → als `TASK-07-04_Schritt 4_Inserat-Status-Test.sql` in diesem Ordner ablegen
5. [x] **Security Advisor** im Dashboard prüfen.
6. [x] **Dokumentation nachziehen** (nach Freigabe): Migrationsdatei, Abschnitt „Angebot"; ER-Modell, neue
       Festlegung 18.

Bei Entscheidung (a) oder (c): keine Trigger. Die Kopplung entsteht in TASK-07-05 im Service bzw. als Funktion;
Schritte 3–6 gelten sinngemäß für (c).

## Fertig, wenn

- [x] Ein neues Inserat setzt die Koralle auf `zur_abgabe` und erzeugt genau einen Systemeintrag
- [x] Das Löschen setzt sie auf `im_bestand` zurück – aber nicht, wenn sie inzwischen `abgegeben` ist
- [x] Der Testblock läuft durch und rollt alles zurück (keine Testreste in der Datenbank)
- [x] Security Advisor ohne neue Warnung
- [x] Migrationsdatei und ER-Modell sind nachgezogen

## Hinweise

- Die Testkoralle …02 von A hat das Inserat …06 schon seit MS-3, angelegt per SQL vor diesem Trigger. Ihr Status
  wird nicht nachträglich angeglichen – die Daten werden für den RLS-Test in TASK-07-08 gebraucht.
- Die Gegenprobe im RLS-Test von TASK-03-05 legt als B ein Inserat an; mit dem Trigger ändert sich dabei auch der
  Status der Koralle von B. Das ist gewollt und rollt mit dem Test zurück.
- Eine Koralle mit Inserat lässt sich erst ab MS-9 löschen (keine DELETE-Policy auf `koralle`). Das Inserat geht dann
  per `CASCADE` mit und der DELETE-Trigger versucht ein Update auf die gerade gelöschte Koralle – beim Löschen in MS-9
  einmal prüfen.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Grundsatzentscheidung 8, FR-4.1, FR-4.2, FR-4.7
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – RLS-Matrix, Festlegungen 4, 12, 15
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Abschnitte „Historieneintrag" (Funktion
  `systemeintrag_anlegen`) und „Angebot"
- `Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/tasks/TASK-06-01_Schritt 4_Trigger-Test.sql` –
  Testmuster
