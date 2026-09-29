# TASK-08-01 · Diary-Festlegungen

**Status:** offen
**Bezug:** FR-5.1, FR-5.3, FR-5.4, FR-5.10, NFR-1.5, ER-Modell Festlegung 8, Befund FR-5.4 aus TASK-02-02
**Voraussetzung:** MS-7 abgeschlossen

---

## Worum geht es

Das Schema für das Diary steht seit MS-3, aber mehrere fachliche Fragen sind nie entschieden worden. Sie betreffen
alle folgenden Tasks und werden deshalb hier gebündelt geklärt und als ER-Festlegung 19 festgehalten. Code entsteht
in diesem Task nicht; die Datenbank ändert sich nur, wenn Punkt 4 oder 6 eine Schemaänderung ergibt.

## Vor dem Start klären

- [ ] **1 · Was ist ein Messwert-Eintrag?** `messwert` hat eine Zeile je Parameter.
  - **(a)** Jede Zeile ist ein eigener Eintrag. Anlegen schreibt alle ausgefüllten Werte mit **einem** Insert
    (atomar). Korrigiert und gelöscht wird **je Wert**.
  - **(b)** Eine Messung = alle Zeilen eines Beckens an einem Datum. Bearbeiten und Löschen wirken auf die Gruppe.
    Speichern heißt Zeilen abgleichen (ändern, ergänzen, entfernen) – atomar nur über eine Datenbankfunktion (`rpc`).
    Zwei Messungen am selben Tag im selben Becken verschmelzen.
  → Vorschlag: **(a)** (KISS, keine Datenbankfunktion). Die Liste kann die Werte eines Tags trotzdem wie im Mockup
  zusammen zeigen (TASK-08-03).
- [ ] **2 · Einheiten.** Vorschlag nach Mockup und design.md: KH `dKH`, Ca `mg/l`, Mg `mg/l`, NO₃ `mg/l`,
      PO₄ `mg/l`, Temperatur `°C`. **Salinität** ist im Mockup nicht vorgesehen: `‰`, `PSU` oder Dichte
      (z. B. `1,025`, ohne Einheit)? → Einheit wählen.
- [ ] **3 · Spalte `messwert.einheit`.**
  - **(a)** Beim Speichern mit der festen Einheit füllen; angezeigt wird trotzdem immer die Einheit aus der
    Konstante (der Testdatensatz …08 hat keine)
  - **(b)** leer lassen, Einheit nur aus der Konstante
  → Vorschlag: **(a)** – der Datensatz bleibt ohne App lesbar.
- [ ] **4 · Ereignistypen (FR-5.4).** FR-5.4 nennt „Typ wie Bleaching, Schädling, Vernesselung", das Enum kennt nur
      `vorfall`.
  - **(a)** `vorfall` + Freitext; Abweichung als Festlegung im ER-Modell festhalten, FR-5.4 bleibt unverändert
  - **(b)** Enum erweitern: `bleaching`, `schaedling`, `vernesselung` ergänzen, `vorfall` bleibt als „Sonstiges"
    (Migration, Typen neu generieren)
  - **(c)** eigene Spalte `vorfall_art` als Enum (Migration, Typen neu generieren)
  → Vorschlag: **(a)** (keine Schemaänderung, keine Auswertung nach Typ gefordert).
- [ ] **5 · Fütterung.** `fuetterung` gehört zu FR-5.5 (Should, MS-10). Vorschlag: in MS-8 **nicht anlegbar**, in der
      Liste aber mit Beschriftung „Fütterung" anzeigen und bearbeit-/löschbar wie ein Ereignis (Testdatensatz …09).
- [ ] **6 · Reihenfolge bei gleichem Datum.** Ohne `erstellt_am` ist die Reihenfolge innerhalb eines Tags beliebig.
  - **(a)** hinnehmen, innerhalb eines Tags feste Typ-Reihenfolge (Messung, Wasserwechsel, Ereignis)
  - **(b)** Spalte `erstellt_am timestamptz not null default now()` in beiden Tabellen ergänzen (Migration, Typen neu)
  → Vorschlag: **(a)**.
- [ ] **7 · Datum in der Zukunft.** Journaleintrag erlaubt es (Entscheidung 28.09.2026), Becken- und Erwerbsdatum
      nicht. Vorschlag: **nicht erlaubt** – Messung, Wasserwechsel und Ereignis protokollieren Vergangenes;
      `checkNotInFuture` gibt es schon.
- [ ] **8 · Pfade.** Alle Formulare ohne Bottom-Navigation. Vorschlag:

  | Pfad                              | Bildschirm                              |
  | --------------------------------- | --------------------------------------- |
  | `/diary`                          | Übersicht (besteht als Platzhalter)     |
  | `/diary/messwerte/neu`            | Messwerte erfassen                      |
  | `/diary/wasserwechsel/neu`        | Wasserwechsel protokollieren            |
  | `/diary/ereignis/neu`             | Ereignis protokollieren                 |
  | `/diary/messwert/:id/bearbeiten`  | einen Messwert bearbeiten (bei 1 (a))   |
  | `/diary/ereignis/:id/bearbeiten`  | Wasserwechsel oder Ereignis bearbeiten  |

- [ ] **9 · Beckendetail und Beckenliste.** TASK-04-04 und TASK-04-07 haben Messwert-Anzeige und „Diary-Tabs" nach
      MS-8 verschoben; der Umfang von MS-8 nennt beides nicht.
  - **(a)** nichts davon in MS-8; „Letzte Messung", Messwerte in der Beckenliste und „Messwert erfassen" im
    Beckendetail gehen nach MS-10 (gleicher Mockup-Block wie das Diagramm aus FR-5.2)
  - **(b)** nur der Button „Messwert erfassen" im Beckendetail, Becken im Formular vorbelegt
  - **(c)** Karte „Letzte Messung" und Button wie im Mockup
  → Vorschlag: **(a)** – Umfang nicht erweitern; bei (a) in `MS-10_…md` vermerken.

## Schritte

1. [ ] Punkte 1–9 entscheiden, Entscheidungen hier eintragen.
2. [ ] Nur bei 4 (b)/(c) oder 6 (b): SQL-Migration schreiben, Nutzer führt sie aus; Kontrollabfrage; Typen neu
       generieren (NFR-4.4); Migrationsdatei `Coralkeeper_database_migration.sql` ergänzen.
3. [ ] ER-Modell: **Festlegung 19** mit den Punkten 1, 3, 4, 5 und 6 ergänzen; bei 4 (b)/(c) oder 6 (b) auch Diagramm
       und Aufzählungstypen. Den Befund FR-5.4 in `TASK-02-02_Feldliste.md` als entschieden markieren.
4. [ ] Bei 9 (a): Hinweis in `MS-10_Herkunft-Historie-Diary-Ausbau.md` ergänzen.
5. [ ] Entscheidungen in der Tabelle in [`README.md`](README.md) nachtragen.

## Fertig, wenn

- [ ] Alle neun Punkte sind entschieden und hier sowie in der README-Tabelle eingetragen
- [ ] Festlegung 19 steht im ER-Modell
- [ ] Bei Schemaänderung: Kontrollabfrage bestätigt die Änderung, generierte Typen sind aktuell,
      `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Festlegung 8 (UPDATE und DELETE erlaubt) bleibt unberührt – der bewusste Gegensatz zur Historie (FR-3.3).
- Soll-Bereiche und farbliche Markierung (FR-5.6) sowie der gemeinsame Zeitstrahl (FR-5.7) sind nicht Teil von MS-8.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – M5 (FR-5.1 bis FR-5.10), Grundsatzentscheidung 6,
  Abschnitt 7 Punkt 8
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entitäten `messwert`, `becken_ereignis`, Festlegung 8,
  Aufzählungstypen
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Abschnitte Messwert und Becken-Ereignis
- `MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-02_Feldliste.md` – Befund FR-5.4
- `MS-04_UI-Shell-Becken/tasks/TASK-04-04_Beckenliste.md`, `TASK-04-07_Beckendetail-Bearbeiten.md` – Verweise auf MS-8
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Screens „Diary" und „Becken Detail",
  Beispieldaten `BECKEN`, `DIARY`
