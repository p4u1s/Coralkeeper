# TASK-08-03 · Diary-Übersicht

**Status:** erledigt (29.09.2026)
**Bezug:** FR-5.1, FR-5.3, FR-5.4, FR-6.4, NFR-1.2, NFR-1.3, NFR-1.4, NFR-1.5, NFR-1.7
**Voraussetzung:** TASK-08-02

---

## Worum geht es

Die Platzhalterseite `/diary` wird zur Übersicht aller Diary-Einträge über alle Becken: nach Datum gruppiert, neueste
oben, je Eintrag Typ, Becken und Inhalt. Von hier aus werden neue Einträge angelegt. Die Einträge werden in
TASK-08-07 zu Links auf ihre Bearbeiten-Seite.

## Vor dem Start klären

- [x] **Einstieg.**
  - **(a)** ein Primärbutton „Eintrag hinzufügen" wie im Mockup, dahinter eine Auswahlseite (`/diary/neu`) mit drei
    Buttons – ein Tipp mehr, eine Route mehr
  - **(b)** drei Buttons direkt auf `/diary`: Primär „Messwerte erfassen", sekundär „Wasserwechsel" und „Ereignis"
  → Vorschlag: **(b)** – kürzester Weg (NFR-1.2), keine Zwischenseite.
  → **Entschieden am 29.09.2026:** (b).
- [x] **Darstellung einer Messung** (bei Entscheidung 1 (a) in TASK-08-01).
  - **(a)** je Wert eine eigene Karte
  - **(b)** eine Karte je Becken und Datum mit Typ-Etikett „Messung", darin je Wert eine eigene Zeile
    („Karbonathärte 8,1 dKH"), die in TASK-08-07 zum Link wird (≥ 44 px hoch)
  → Vorschlag: **(b)** – nah am Mockup, jeder Wert bleibt einzeln korrigierbar.
  → **Entschieden am 29.09.2026:** (b), genauer: eine Karte je **Erfassung** (gleiches Becken, Datum und
  `erstellt_am` – alle Werte eines Formulars entstehen mit einem Insert).
- [x] **Typ-Etikett.** design.md beschreibt den Diary-Typ-Chip **mit** Symbol (Ableger, Pflege, Abgabe, Zugang,
      Messung). Für „Messung" und „Wasserwechsel" (Symbol „Pflege") gibt es SVGs im Mockup, für „Ereignis" und
      „Fütterung" nicht.
  - **(a)** Symbole aus dem Mockup, wo vorhanden; Ereignis und Fütterung nur Text
  - **(b)** nur Text wie im Historie-Tab (TASK-06-06)
  → Vorschlag: **(a)** – design.md hat Vorrang; das Symbol ergänzt das Textlabel, ersetzt es nicht.
  → **Entschieden am 29.09.2026:** mit Symbol für alle vier Typen, alle aus `lucide-react` (Icon-Bibliothek von
  shadcn/ui, `size={20}`, `strokeWidth={1.6}`): Messung `TestTube`, Wasserwechsel `PaintBucket`, Ereignis `Calendar`,
  Fütterung `Beef` – dieselben Symbole wie auf den Anlegen-Buttons. Keine eigenen SVGs; die Formen weichen bewusst vom
  Mockup ab. Im Etikett steht immer die Typ-Beschriftung, nie „Pflege".
- [x] **Inhaltszeile je Typ.** Vorschlag:
  - Wasserwechsel: Menge und Notiz, getrennt mit „ · "; ohne beides „Keine Angabe"
  - Ereignis: Text, darunter betroffene Koralle (Bezeichnung), falls gesetzt
  - Bezug neben dem Etikett: Beckenname
  → **Entschieden am 29.09.2026:** eine Regel für Wasserwechsel, Fütterung und Ereignis: Menge und Text mit „ · ",
  ohne beides „Keine Angabe"; darunter die Korallenbezeichnung, falls gesetzt; neben dem Etikett der Beckenname.

**Weitere Entscheidungen (29.09.2026):**

- Wertzeile in der Messungs-Karte: nur das Kürzel, Wert rechts mit `tabular-nums` („KH 8,1 °dKH").
  `MEASUREMENT_PARAMETER_SHORT_LABELS` in `labels.ts`: KH, Ca, Mg, NO₃, PO₄, Temp., Sal.
  **Bewusste Abweichung von design.md, Abschnitt 5 Regel 7** (Klartext statt Fachkürzel).
- Einheit der Karbonathärte `°dKH` statt `dKH` (`MEASUREMENT_UNITS`, gilt für Anzeige und gespeicherte `einheit`) –
  Formatbeispiel in design.md und CLAUDE.md auf „8,1 °dKH" angepasst; ändert Entscheidung 2 aus TASK-08-01 und
  Festlegung 19. Keine Migration nötig, der Testdatensatz …08 hat keine Einheit.
- Buttons direkt unter dem Titel, **nebeneinander** in drei gleich breiten Spalten: „Messwert" (Primär),
  „Wasserwechsel" und „Ereignis" (Sekundär). Typ-Symbol (`TestTube`, `PaintBucket`, `Calendar`) und Text in
  Label-Größe in einer Zeile, ohne Plus, 48 px hoch. Unter 450 px Breite steht „WasserW." statt „Wasserwechsel",
  Screenreader lesen per `aria-label` immer das ganze Wort – **weitere bewusste Abweichung von design.md, Abschnitt 5
  Regel 7**. (Erster Versuch untereinander mit langen Texten wirkte überladen.)
- Laden und Fehler: `useDiary`, `useTanks` und `useCorals` mit gemeinsamem Zustand wie im `HomeScreen`;
  „Erneut versuchen" lädt alle drei neu.
- Kein Becken: Karte „Lege zuerst ein Becken an", Text „Jeder Diary-Eintrag gehört zu einem Becken.",
  Primärbutton „Becken anlegen"; keine Anlegen-Buttons.
- Reihenfolge innerhalb eines Tags: nach Erfassung (`erstellt_am`), neueste oben; bei gleichem Zeitpunkt Messung,
  Wasserwechsel, Fütterung, Ereignis. Dafür bekommen `messwert` und `becken_ereignis` die Spalte `erstellt_am` –
  **ändert Entscheidung 6 aus TASK-08-01**. `erstellt_am` bleibt beim Bearbeiten unverändert (TASK-08-07).
- Gruppierung als reine Funktion in `src/lib/diary.ts`, die Seite zeigt nur an.
- Aufbau je Tag: `<section>` mit dem Datum als `<h2>`, darunter die Karten als `<ul>`. Zur Probe.

## Schritte

0. [x] **Schema:** Spalte `erstellt_am timestamptz not null default now()` in `messwert` und `becken_ereignis`
       (Nutzer führt SQL aus, Kontrollabfrage), Typen neu generieren (NFR-4.4), `Coralkeeper_database_migration.sql`,
       ER-Modell (Diagramm, Festlegung 19) und TASK-08-01 Punkt 6 nachziehen; Sortierung in `listMeasurements` und
       `listTankEvents` anpassen.
1. [x] **Seite** `src/pages/DiaryPage.tsx` ersetzen: Titel „Diary", Einstieg nach Entscheidung, Liste aus `useDiary`.
2. [x] **Gruppierung** nach Datum (Überschrift `TT.MM.JJJJ` über `formatDate`), innerhalb eines Tags nach
       Entscheidung 6 in TASK-08-01.
3. [x] **Eintragskarte** als eigene Komponente, z. B. `src/components/DiaryEntryCard.tsx`: Optik wie die Karten im
       Historie-Tab, Typ-Etikett nach Entscheidung, Werte mit `tabular-nums`.
4. [x] **Zustände (FR-6.4):**
   - Laden: „Wird geladen …"
   - Fehler: deutsche Meldung mit `role="alert"`
   - Kein Becken: Hinweis, zuerst ein Becken anzulegen, mit Link auf `/becken/neu`; keine Anlegen-Buttons
   - Becken, aber keine Einträge: „Noch keine Einträge." mit den Anlegen-Buttons (NFR-1.7)
5. [x] **Pfade** aus TASK-08-01 für die Formulare schon verlinken; die Routen entstehen in 08-04 bis 08-06.

## Fertig, wenn

- [x] Als Testnutzer A erscheinen Messwert …08 („KH 8 °dKH") und Ereignis …09 („Fütterung") mit Beckenname
- [x] Gruppen stehen nach Datum absteigend, Datum im Format `TT.MM.JJJJ`
- [x] Ohne Verbindung laden → deutsche Fehlermeldung (FR-6.4)
- [x] Neuer Nutzer ohne Becken → Hinweis mit Link zum Becken anlegen
- [x] Alle Buttons ≥ 44 px, jedes Symbol mit Text, bei 360 px kein waagerechtes Scrollen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Ein Filter nach Becken ist nicht gefordert; der gemeinsame Zeitstrahl je Becken ist FR-5.7 (Should, MS-10).
- Korallenbezeichnungen für Ereignisse: `useCorals` liefert alle eigenen Korallen; eine gelöschte Koralle hinterlässt
  `koralle_id = null` (`ON DELETE SET NULL`) – dann keine Korallenzeile.

## Quellen

- `design.md` – Abschnitt 4 (Karte, Diary-Typ-Chip, Primär- und Sekundärbutton), Abschnitt 5
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Screen „Diary", Beispieldaten `DIARY`
- `src/components/CoralHistory.tsx`, `src/pages/TankListPage.tsx` – bestehendes Muster für Karten und Zustände
