# TASK-08-03 · Diary-Übersicht

**Status:** offen
**Bezug:** FR-5.1, FR-5.3, FR-5.4, FR-6.4, NFR-1.2, NFR-1.3, NFR-1.4, NFR-1.5, NFR-1.7
**Voraussetzung:** TASK-08-02

---

## Worum geht es

Die Platzhalterseite `/diary` wird zur Übersicht aller Diary-Einträge über alle Becken: nach Datum gruppiert, neueste
oben, je Eintrag Typ, Becken und Inhalt. Von hier aus werden neue Einträge angelegt. Die Einträge werden in
TASK-08-07 zu Links auf ihre Bearbeiten-Seite.

## Vor dem Start klären

- [ ] **Einstieg.**
  - **(a)** ein Primärbutton „Eintrag hinzufügen" wie im Mockup, dahinter eine Auswahlseite (`/diary/neu`) mit drei
    Buttons – ein Tipp mehr, eine Route mehr
  - **(b)** drei Buttons direkt auf `/diary`: Primär „Messwerte erfassen", sekundär „Wasserwechsel" und „Ereignis"
  → Vorschlag: **(b)** – kürzester Weg (NFR-1.2), keine Zwischenseite.
- [ ] **Darstellung einer Messung** (bei Entscheidung 1 (a) in TASK-08-01).
  - **(a)** je Wert eine eigene Karte
  - **(b)** eine Karte je Becken und Datum mit Typ-Etikett „Messung", darin je Wert eine eigene Zeile
    („Karbonathärte 8,1 dKH"), die in TASK-08-07 zum Link wird (≥ 44 px hoch)
  → Vorschlag: **(b)** – nah am Mockup, jeder Wert bleibt einzeln korrigierbar.
- [ ] **Typ-Etikett.** design.md beschreibt den Diary-Typ-Chip **mit** Symbol (Ableger, Pflege, Abgabe, Zugang,
      Messung). Für „Messung" und „Wasserwechsel" (Symbol „Pflege") gibt es SVGs im Mockup, für „Ereignis" und
      „Fütterung" nicht.
  - **(a)** Symbole aus dem Mockup, wo vorhanden; Ereignis und Fütterung nur Text
  - **(b)** nur Text wie im Historie-Tab (TASK-06-06)
  → Vorschlag: **(a)** – design.md hat Vorrang; das Symbol ergänzt das Textlabel, ersetzt es nicht.
- [ ] **Inhaltszeile je Typ.** Vorschlag:
  - Wasserwechsel: Menge und Notiz, getrennt mit „ · "; ohne beides „Keine Angabe"
  - Ereignis: Text, darunter betroffene Koralle (Bezeichnung), falls gesetzt
  - Bezug neben dem Etikett: Beckenname

## Schritte

1. [ ] **Seite** `src/pages/DiaryPage.tsx` ersetzen: Titel „Diary", Einstieg nach Entscheidung, Liste aus `useDiary`.
2. [ ] **Gruppierung** nach Datum (Überschrift `TT.MM.JJJJ` über `formatDate`), innerhalb eines Tags nach
       Entscheidung 6 in TASK-08-01.
3. [ ] **Eintragskarte** als eigene Komponente, z. B. `src/components/DiaryEntryCard.tsx`: Optik wie die Karten im
       Historie-Tab, Typ-Etikett nach Entscheidung, Werte mit `tabular-nums`.
4. [ ] **Zustände (FR-6.4):**
   - Laden: „Wird geladen …"
   - Fehler: deutsche Meldung mit `role="alert"`
   - Kein Becken: Hinweis, zuerst ein Becken anzulegen, mit Link auf `/becken/neu`; keine Anlegen-Buttons
   - Becken, aber keine Einträge: „Noch keine Einträge." mit den Anlegen-Buttons (NFR-1.7)
5. [ ] **Pfade** aus TASK-08-01 für die Formulare schon verlinken; die Routen entstehen in 08-04 bis 08-06.

## Fertig, wenn

- [ ] Als Testnutzer A erscheinen Messwert …08 („Karbonathärte 8 dKH") und Ereignis …09 („Fütterung") mit Beckenname
- [ ] Gruppen stehen nach Datum absteigend, Datum im Format `TT.MM.JJJJ`
- [ ] Ohne Verbindung laden → deutsche Fehlermeldung (FR-6.4)
- [ ] Neuer Nutzer ohne Becken → Hinweis mit Link zum Becken anlegen
- [ ] Alle Buttons ≥ 44 px, jedes Symbol mit Text, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Ein Filter nach Becken ist nicht gefordert; der gemeinsame Zeitstrahl je Becken ist FR-5.7 (Should, MS-10).
- Korallenbezeichnungen für Ereignisse: `useCorals` liefert alle eigenen Korallen; eine gelöschte Koralle hinterlässt
  `koralle_id = null` (`ON DELETE SET NULL`) – dann keine Korallenzeile.

## Quellen

- `design.md` – Abschnitt 4 (Karte, Diary-Typ-Chip, Primär- und Sekundärbutton), Abschnitt 5
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Screen „Diary", Beispieldaten `DIARY`
- `src/components/CoralHistory.tsx`, `src/pages/TankListPage.tsx` – bestehendes Muster für Karten und Zustände
