# TASK-09-01 · Festlegungen für MS-9

**Status:** offen
**Bezug:** Umfang MS-9 · FR-1.2, FR-1.4, FR-1.5, FR-1.9, FR-3.5, FR-4.1 · NFR-2.5, NFR-3.1 · TASK-02-05 Abschnitte A und D ·
TASK-02-02 (Befunde FR-1.5, FR-4.1) · ER-Modell offene Punkte 1 und 7
**Voraussetzung:** Gate MS-08a bestanden

---

## Worum geht es

Mehrere MS-9-Themen hängen an Fragen, die bisher nirgends entschieden sind: die Bildablage (offen seit MS-2), die
„Notiz" in der Suche, die Regeln für den Statuswechsel und die Definition of Done. Hier wird nur entschieden und
dokumentiert – kein Code, keine Datenbank. Die Ergebnisse gelten für alle folgenden Tasks.

## Vor dem Start klären

- [ ] **Gate-Ergebnis.** Ist MS-08a ohne Befunde abgeschlossen? Hat TASK-08a-05 (Schritt 4) Notizen nach MS-9
      verschoben? Falls ja: hier aufnehmen und einem Task zuordnen.
- [ ] **Definition of Done MS-9.** Vorschlag: „Eine Koralle mit Bild erscheint als Kachel und lässt sich über Filter und
      Suche wiederfinden; Status- und Beckenwechsel stehen als Systemeintrag in ihrer Historie; nach dem Löschen einer
      Ursprungskoralle sind ihre Ableger unverändert da; das eigene Profil lässt sich ändern."
- [ ] **Bilder – was gehört in MS-9?** Der Umfang nennt „Bild-Upload" ohne Ort. In Frage kommen:
  - Primärbild der Koralle (FR-1.2 „ein Bild optional", FR-1.3, FR-1.6)
  - Bild am Journaleintrag (FR-3.5 „optional Bild", Spalte `historieneintrag.bild_id`)
  - Bild am Inserat (FR-4.1; `angebot` hat keine Bildspalte, gemeint ist vermutlich das Primärbild – TASK-02-02)
  → Vorschlag: **nur das Primärbild**. Journalbild als Notiz nach MS-10 (Historie-Ausbau), Inseratbild nach MS-11 –
  erst dort sehen andere Nutzer Inserate (FR-4.3) und erst dann braucht es die Lesefreigabe für Fremde (RLS-Matrix
  „Inseratbild für Fremde", ER-Modell offener Punkt 7).
- [ ] **Bucket-Layout (TASK-02-05 D).**
  - **ein** Bucket für Fotos und spätere Belege, unterschieden über `bild_dokument.typ` (offener Punkt 1)
  - **ein Ordner je Nutzer** statt eines Buckets je Nutzer; die Policy prüft den ersten Ordner gegen `auth.uid()` –
    so wird NFR-3.1 („Storage-Buckets pro Nutzer abgesichert") umgesetzt
  - Pfadschema `<nutzer_id>/<koralle_id>/<bild_dokument.id>.<endung>`, keine Originaldateinamen
  - **privater** Bucket, Anzeige über signierte URLs. Ein öffentlicher Bucket zeigte jedes Bild jedem, der den Link kennt.
  → Vorschlag: alle vier wie aufgeführt.
- [ ] **Dateitypen.** Vorschlag: JPEG, PNG und WebP. HEIC (iPhone-Format) zeigen Firefox und Chrome nicht an. Die
      5-MB-Grenze (NFR-2.5) zusätzlich als Bucket-Einstellung (TASK-09-03).
- [ ] **`koralle.primaerbild` ohne `_id` (TASK-02-05 A).** Umbenennen kostet eine Migration, neue Typen und eine
      Änderung der Anforderungsanalyse (Abschnitt 4); bisher greift kein Code auf die Spalte zu.
      → Vorschlag: Namen behalten und als Ausnahme festhalten.
- [ ] **„Notiz" in der Suche (FR-1.5).** `koralle` hat keine Spalte `notiz`.
  - **(a)** `besonderheiten` (Freitext im Steckbrief) mit durchsuchen
  - **(b)** `herkunft_notiz` – hat bis MS-10 kein Eingabefeld (FR-3.1)
  - **(c)** stattdessen `art`, wie im Mockup („Suche nach Handelsname oder Art")
  - **(d)** neue Spalte `notiz` samt Feld im Korallenformular (das Mockup-Formular hat eins)
  → Vorschlag: **(c)** – gesucht wird in Bezeichnung, Handelsname und Art; die Abweichung von FR-1.5 wird im
  Meilenstein-Dokument festgehalten.
- [ ] **Statuswechsel – welche Zielstatus?** `zur_abgabe` entsteht heute nur mit einem Inserat (Festlegung 18).
  - `zur_abgabe` im Statuswechsel **nicht** anbieten – sonst gäbe es „Zur Abgabe" ohne Inserat
  - `abgegeben` von Hand erlauben (FR-1.9 nennt es); der Abgabevorgang mit Empfänger folgt in MS-10 (FR-3.7) als
    zweiter Weg
  - Rückweg aus `abgegeben` und `verendet` nach `im_bestand` erlauben (Korrektur, steht dann in der Historie)
  → Vorschlag: alle drei wie aufgeführt.
- [ ] **Statuswechsel bei bestehendem Inserat.** Wird eine inserierte Koralle auf `verendet` gesetzt, bliebe das Inserat
      sichtbar.
  - **(a)** Statuswechsel sperren, solange ein Inserat besteht, mit Hinweis „Zieh zuerst das Inserat zurück."
  - **(b)** erst Status setzen, dann Inserat löschen (Reihenfolge wie FR-4.7, Festlegung 18) – zwei Aufrufe ohne
    Transaktion
  → Vorschlag: **(a)** (KISS).
- [ ] **Status-Filter (FR-1.4).** design.md („Filterchip") und Mockup zeigen „Alle · Bestand · Abgabe · Archiv";
      „Archiv" fasst `abgegeben` und `verendet` zusammen. → Vorschlag: diese vier Filterchips statt der vier Status,
      Start mit „Alle" wie im Mockup.
- [ ] **Pfade.** Vorschlag, alle ohne Bottom-Navigation wie die übrigen Formulare: `/koralle/:id/bearbeiten`,
      `/koralle/:id/status`, `/profil/bearbeiten`.

## Schritte

1. [ ] Gate-Ergebnis bestätigen, verschobene Notizen zuordnen.
2. [ ] Entscheidungen einzeln vorlegen; Ergebnis hier und in der README-Tabelle eintragen.
3. [ ] **ER-Modell** nachziehen (nach Freigabe): neue Festlegung 20 „Bildablage" (Bucket, Ordner je Nutzer,
       Pfadschema, privat, Dateitypen, in MS-9 nur Primärbild, Ausnahme `primaerbild`); offene Punkte 1 und 7
       anpassen. Die RLS-Matrix bleibt bis TASK-09-02 unverändert.
4. [ ] **Meilenstein-Dokument** (beide Kopien) und MS-9-Abschnitt in `Milestones.md` nach Freigabe: Definition of
       Done, Abweichung bei FR-1.5, Bildumfang.
5. [ ] Verschobene Bildorte nach Freigabe in `MS-10_…md` bzw. `MS-11_…md` vermerken.
6. [ ] In TASK-02-05 (Abschnitte A und D) und TASK-02-02 (Befunde FR-1.5, FR-4.1) auf diesen Task verweisen – wie
       Abschnitt C dort auf TASK-07-01.

## Fertig, wenn

- [ ] Jede Entscheidung hat einen Stand in der README-Tabelle
- [ ] Das ER-Modell enthält die Festlegung zur Bildablage, offene Punkte 1 und 7 sind angepasst
- [ ] MS-9 hat eine Definition of Done (beide Kopien des Meilenstein-Dokuments, `Milestones.md`)
- [ ] Verschobene Bildorte sind im Zielmeilenstein vermerkt
- [ ] TASK-02-05 und TASK-02-02 verweisen auf diesen Task

## Hinweise

- Keine Datenbank- und keine Codeänderung. Policies folgen in TASK-09-02, der Bucket in TASK-09-03.
- Die offenen Punkte 2 (höchstens fünf Belege) und 3 (`aufnahmedatum` bei Belegen) im ER-Modell gehören zu FR-3.8
  (MS-10, Should) – hier nicht entscheiden.
- Werden Journal- oder Inseratbild doch in MS-9 aufgenommen, braucht es eigene Tasks; die Taskliste wird dann ergänzt.

## Quellen

- [`../MS-09_Bestand-nutzbar-Profil.md`](../MS-09_Bestand-nutzbar-Profil.md) – Umfang
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.2 bis FR-1.5, FR-1.9, FR-3.5, FR-3.7, FR-4.1,
  FR-4.3, NFR-2.5, NFR-3.1
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – RLS-Matrix, Festlegungen 9 und 18, offene Punkte
- `Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-05_Konventionen-Snapshot-Bilder.md` –
  Abschnitte A und D
- `Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-02_Feldliste.md` – Befunde
- `design.md` – Abschnitt 1 (Statusfarben), Abschnitt 4 (Filterchip)
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „BESTAND", Formular „NEUE KORALLE"
