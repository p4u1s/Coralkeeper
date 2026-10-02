# TASK-09-12 · Bestand filtern, sortieren und durchsuchen

**Status:** offen
**Bezug:** FR-1.4 („Filtern nach Becken, Art und Status; Sortieren nach Bezeichnung und Erwerbsdatum"), FR-1.5, FR-6.4,
NFR-1.3, NFR-1.4, NFR-2.3 („Suchergebnis unter 1 s") · design.md Abschnitt 4 (Filterchip), Abschnitt 5 Regel 2
(Lupenbutton)
**Voraussetzung:** TASK-09-11, Entscheidungen aus TASK-09-01 (Status-Filter, Suchfelder)

---

## Worum geht es

Über der Kachelliste stehen die Filterchips für den Status, Auswahlfelder für Becken, Art und Sortierung sowie die Lupe
für die Suche. Gefiltert wird im Browser auf der geladenen Liste – NFR-2.1 rechnet mit höchstens 300 Korallen.

## Vor dem Start klären

- [ ] **Bedienung.** Filterchips und Lupe stehen immer da (design.md, Mockup). Für Becken, Art und Sortierung:
  - **(a)** drei Auswahlfelder immer sichtbar
  - **(b)** hinter einem Sekundärbutton „Filter und Sortierung", aufklappbar; bei aktiven Filtern mit Anzahl im Text
  → Vorschlag: **(b)** – bei 360 px schöben drei Felder die Liste weit nach unten.
- [ ] **Zustand merken.**
  - **(a)** in der URL (`?status=…&becken=…&art=…&sortierung=…&suche=…`, mit `replace`) – F5 und „Zurück" im Browser
    behalten die Auswahl; Muster wie `?tab=` auf der Detailseite
  - **(b)** nur im Komponentenzustand – nach jedem Seitenwechsel zurückgesetzt
  → Vorschlag: **(a)**. Der Link „Zurück zum Bestand" auf der Detailseite führt auf `/` und setzt die Auswahl damit
  zurück – so lassen oder ändern?
- [ ] **Sortieroptionen.** Vorschlag: „Bezeichnung (A–Z)" (Start) und „Erwerbsdatum (neueste zuerst)"; Korallen ohne
      Erwerbsdatum stehen am Ende. Eine dritte Option „älteste zuerst"?
- [ ] **Art-Auswahl.** Vorschlag: „Alle Arten" plus alle vorkommenden Arten der geladenen Korallen, alphabetisch;
      Korallen ohne Art bekommen keinen eigenen Eintrag.
- [ ] **Suche.** Vorschlag nach design.md Regel 2: Lupenbutton mit `aria-label="Suchen"`, öffnet ein sichtbar
      beschriftetes Feld „Suche nach Bezeichnung, Handelsname oder Art" (Felder nach TASK-09-01); Treffer während der
      Eingabe, ohne Groß-/Kleinschreibung; Schließen leert die Suche (wie im Mockup).
- [ ] **Leerzustand bei null Treffern.** Vorschlag: „Keine Korallen für diese Auswahl." und Sekundärbutton „Filter
      zurücksetzen".

## Schritte

1. [ ] **Filterlogik** als reine Funktion (z. B. in `src/lib/`), damit sie ohne Oberfläche lesbar und testbar bleibt:
       Status nach Filterchip (Archiv = `abgegeben` + `verendet`), Becken, Art und Suchtext mit UND verknüpft,
       danach sortieren (`localeCompare` mit `de`).
2. [ ] **Filterchips** nach design.md Abschnitt 4: Höhe min. 44, aktiv Akzentfläche; als Umschaltgruppe mit
       erkennbarem Zustand (z. B. `aria-pressed`).
3. [ ] **Auswahlfelder** Becken, Art, Sortierung mit sichtbaren Labels (`NativeSelect`), Bedienung nach Entscheidung.
4. [ ] **Suche** mit Lupenbutton und Feld.
5. [ ] **Anzahl** auf „x von y Korallen · n Becken" umstellen (Mockup).
6. [ ] **Zustand** nach Entscheidung (URL oder lokal).
7. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] Jeder Filterchip, jeder Filter und die Sortierung wirken einzeln und kombiniert
- [ ] „Archiv" zeigt genau die abgegebenen und verendeten Korallen
- [ ] Die Suche findet Teilwörter in jedem festgelegten Feld, unabhängig von Groß-/Kleinschreibung (FR-1.5)
- [ ] Null Treffer → Leerzustand mit „Filter zurücksetzen" (FR-6.4)
- [ ] Die Anzahl zeigt „x von y" passend zur Auswahl
- [ ] Bei Entscheidung (a): F5 behält die Auswahl
- [ ] Alle Bedienelemente mindestens 44 px, beschriftet, mit Tastatur erreichbar; einziges Symbol ohne sichtbaren Text
      ist die Lupe (design.md Regel 2)
- [ ] Bei 360 px kein waagerechtes Scrollen, die Filterchips umbrechen sauber
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `listCorals` sortiert in der Datenbank nach Bezeichnung; mit der Sortierung im Browser zählt nur noch diese.
- Kein Filter in der Datenbank, keine Suchfunktion in Supabase – bei 300 Korallen reicht der Browser (KISS).

## Quellen

- `src/pages/HomeScreen.tsx`, `src/pages/CoralDetailPage.tsx` (Muster `?tab=`)
- `design.md` – Abschnitt 4 (Filterchip), Abschnitt 5 Regel 2
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „BESTAND" und `renderVals` (Filterlogik
  „Archiv", Suche, Anzahl)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.4, FR-1.5, NFR-2.1, NFR-2.3
