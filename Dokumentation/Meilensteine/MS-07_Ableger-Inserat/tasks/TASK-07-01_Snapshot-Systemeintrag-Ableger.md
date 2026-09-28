# TASK-07-01 · Ableger-Snapshot festlegen und Systemeintrag bei der Ablegererzeugung

**Status:** erledigt (28.09.2026)
**Bezug:** FR-1.7, FR-3.6 (Snapshot), FR-3.4 (Systemeintrag „Ablegererzeugung"), Grundsatzentscheidung 4,
ER-Modell Festlegungen 3 und 15, MS-2-Entscheidung 5
**Voraussetzung:** MS-6 abgeschlossen

---

## Worum geht es

Beim Ableger werden Art, Morphe, Steckbrief und Herkunftskette **kopiert, nicht referenziert**. Die Regeln dafür sind
seit MS-2 offen (TASK-02-05, Abschnitt C) und werden hier entschieden – sie sind die Grundlage für TASK-07-02 und
07-03. Dazu kommt der Systemeintrag bei der Ablegererzeugung (FR-3.4): Heute schreibt der Trigger für einen Ableger
nur „Koralle angelegt".

## Vor dem Start klären

- [x] **Wo entsteht der Snapshot?** Das Hauptargument aus TASK-02-05 C gegen die Service-Schicht („drei Aufrufe,
      der Systemeintrag kann fehlen") ist seit TASK-06-01 entfallen – den Eintrag schreibt der Trigger in derselben
      Transaktion.
  - **(a)** Service: Die Formularseite hat die Ursprungskoralle ohnehin geladen; der Service fügt den Ableger mit den
    kopierten Spalten in **einem** Insert ein.
  - **(b)** Datenbankfunktion (`rpc`): liest die Ursprungskoralle serverseitig und legt den Ableger an – zweite
    Aufrufart neben `.from()`, PL/pgSQL, eigene Rechteprüfung.
  → Vorschlag: **(a)** (KISS, NFR-4.3).
  → **Entschieden am 28.09.2026:** (a) Service.
- [x] **Welche Spalten?** Entwurf aus TASK-02-05 C, ergänzt um `besonderheiten` (Festlegung 16):

  | Umgang         | Spalten                                                                                                                                                     |
  | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | kopiert        | `art`, `handelsname`, `licht`, `stroemung`, `platzierung`, `nesselkraft`, `wuchsform`, `schwierigkeit`, `fuetterung`, `besonderheiten`, `schutzstatus`      |
  | neu gesetzt    | `mutter_id` = Ursprungskoralle · `becken_id` aus dem Formular · `status` per Standardwert · `herkunftskette` (siehe unten) · `nutzer_id` aus der Session |
  | zu entscheiden | `erwerbsdatum` · `quelle_typ` · `quelle_name`, `belegnummer`, `cites_nr`, `herkunft_notiz`                                                                  |
  | nicht kopiert  | `id` · `primaerbild` (das Bild gehört über `bild_dokument.koralle_id` zur Ursprungskoralle)                                                                |

  Vorschlag für die offenen Spalten: `erwerbsdatum` = Tag der Ablegererzeugung (kein Formularfeld);
  `quelle_typ` = `eigene_nachzucht`; die übrigen vier Herkunftsfelder **leer** – sie beschreiben den Erwerb der
  Ursprungskoralle und stehen in der Herkunftskette.
  Die Bezeichnung ist eine Formularfrage und wird in TASK-07-03 entschieden.
  → **Entschieden am 28.09.2026:** wie vorgeschlagen.
- [x] **Aufbau von `herkunftskette`.** FR-3.6 sagt nicht, wie der Text aussieht. Er muss die Herkunft auch nach dem
      Löschen der Ursprungskoralle nachvollziehbar halten (Grundsatz 4). Vorschlag – eine Zeile je Generation,
      leere Angaben entfallen, Datum im Format `TT.MM.JJJJ`:

  ```text
  Ableger von „Green Slimer" (Acropora tenuis), erzeugt am 28.09.2026
  Quelle: Händler · Korallenwelt · Beleg 4711 · CITES-Nr. …
  ← <Herkunftskette der Ursprungskoralle>
  ```

  Die Herkunftsfelder sind erst ab MS-10 (FR-3.1) über die Oberfläche befüllbar; bis dahin besteht die Kette meist
  nur aus der ersten Zeile.
  → **Entschieden am 28.09.2026 (vorläufig, Nutzer prüft das Format noch):** wie vorgeschlagen; die Zeile „Quelle"
  nur, wenn mindestens eines der vier Textfelder (`quelle_name`, `belegnummer`, `cites_nr`, `herkunft_notiz`)
  befüllt ist.
- [x] **„Unveränderlich" (FR-3.6).** `herkunftskette` ist eine normale Spalte, die UPDATE-Policy auf `koralle` erlaubt
      Änderungen.
  - **(a)** Nur UI: Es gibt kein Eingabefeld für die Kette, auch nicht im Herkunftsformular von MS-10.
  - **(b)** Zusätzlich ein `before update`-Trigger, der eine Änderung der Spalte ablehnt.
  → Vorschlag: **(a)** (KISS, Vorschlag schon in TASK-02-05 C), im ER-Modell vermerkt.
  → **Entschieden am 28.09.2026:** (a) nur UI.
- [x] **Systemeintrag „Ablegererzeugung" (FR-3.4).**
  - **(a)** Nur beim Ableger: „Ableger von „Green Slimer" angelegt" statt „Koralle angelegt"
  - **(b)** Wie (a), zusätzlich bei der Ursprungskoralle: „Ableger „Green Slimer 2" erzeugt"
  - **(c)** Nichts ändern, „Koralle angelegt" genügt
  → Vorschlag: **(b)**. Beim Ableger dokumentiert der Eintrag die Herkunft, bei der Ursprungskoralle den Schnitt –
  dort sucht der Züchter danach (Mockup, Block „DIARY": „Zwei Ableger geschnitten …").
  → **Entschieden am 28.09.2026:** (b). Der Eintrag bei der Ursprungskoralle wird nur geschrieben, wenn der Trigger
  sie lesen kann (`if found`) – sonst entstünde bei einer fremden `mutter_id` ein Eintrag mit fremder `koralle_id`.
- [x] **Herkunftskette in MS-7 anzeigen?** Herkunft (FR-3.1) ist MS-10, die Darstellung der Abstammung (FR-1.8) steht
      im Could-Backlog. → Vorschlag: **nicht anzeigen**, Nachweis per Kontrollabfrage; Anzeige mit MS-10.
  → **Entschieden am 28.09.2026:** nicht anzeigen, Anzeige mit MS-10.

## Schritte

1. [x] **Festlegung 17** mit allen Entscheidungen ins ER-Modell (nach Freigabe). In TASK-02-05, Abschnitt C, vermerken,
       dass die Fragen in TASK-07-01 entschieden sind (nach Freigabe).

Bei Systemeintrag (a) oder (b):

2. [x] **Trigger-Funktion** `systemeintrag_anlegen` per `create or replace function` anpassen, die Trigger bleiben:
   - im INSERT-Zweig `new.mutter_id` prüfen; ist sie gesetzt, die Bezeichnung der Ursprungskoralle lesen und den
     Text nach Entscheidung bilden
   - bei (b) einen zweiten Eintrag mit `koralle_id = new.mutter_id` schreiben – gleicher Datumsausdruck
     (`Europe/Berlin`, Festlegung 15)
   - ohne `mutter_id` bleibt es bei „Koralle angelegt"
3. [x] **SQL im SQL-Editor ausführen** (Nutzer), Kontrollabfrage auf die Funktion (`search_path=""`).
4. [x] **Test als `do $$ … $$`-Block** mit abschließendem `raise exception` (Muster:
       `MS-06_…/tasks/TASK-06-01_Schritt 4_Trigger-Test.sql`), angemeldet als Testnutzer A:
   - Koralle ohne `mutter_id` → genau ein Eintrag „Koralle angelegt"
   - Ableger mit `mutter_id` → Eintrag beim Ableger nach Entscheidung, **kein** „Koralle angelegt"
   - bei (b): genau ein neuer Eintrag bei der Ursprungskoralle
   - Statuswechsel am Ableger → weiterhin „Status geändert: …"
   - → als `TASK-07-01_Schritt 4_Ableger-Trigger-Test.sql` in diesem Ordner ablegen
5. [x] **Security Advisor** im Dashboard prüfen.
6. [x] **Dokumentation nachziehen** (nach Freigabe): Migrationsdatei, Abschnitt „Historieneintrag"; ER-Modell,
       Festlegung 15 um den Ableger-Fall ergänzen.

## Fertig, wenn

- [x] Festlegung 17 steht im ER-Modell: Ort, Spaltenliste, Aufbau der Herkunftskette, Umgang mit „unveränderlich",
      Systemeintrag
- [x] Ein Ableger bekommt den Systemeintrag nach Entscheidung, eine gewöhnliche Koralle weiterhin „Koralle angelegt"
- [x] Der Testblock läuft durch und rollt alles zurück (keine Testreste in der Datenbank)
- [x] Security Advisor ohne neue Warnung
- [x] Migrationsdatei und ER-Modell sind nachgezogen

## Hinweise

- Bei Entscheidung (c) entfallen die Schritte 2–6 bis auf die Festlegung.
- Keine neue Spalte, keine neue Tabelle – die Typen bleiben unverändert (NFR-4.4).
- Die Bezeichnung der Ursprungskoralle wird als Text in den Eintrag geschrieben. Wird die Ursprungskoralle später
  umbenannt oder gelöscht (MS-9), bleibt der alte Name stehen – gewollt, die Historie ist ein Nachweis (FR-3.3).
- Ist die Ursprungskoralle nicht lesbar (fremde ID in `mutter_id`, Festlegung 12 prüft den Verweis nicht), liefert
  das `select` nichts – den Text mit `coalesce` absichern.

## Quellen

- `Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-05_Konventionen-Snapshot-Bilder.md` –
  Abschnitt C
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Grundsatzentscheidungen 3 und 4, Abschnitt 4.1,
  FR-1.7, FR-1.10, FR-3.1, FR-3.4, FR-3.6
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `koralle`, Festlegungen 2, 3, 12, 15, 16
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Funktion `systemeintrag_anlegen`
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „DIARY"
