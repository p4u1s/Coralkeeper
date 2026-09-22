# TASK-06-04 · Tab-Navigation und Steckbrief-Tab

**Status:** offen
**Bezug:** Umfang MS-6 („Detailseite mit Tab-Navigation"), FR-2.1, Abnahmekriterium Abschnitt 7 Punkt 5
(„unausgefüllte Felder zeigen ‚keine Angabe'"), NFR-4.2, NFR-1.3, NFR-1.4
**Voraussetzung:** TASK-06-03, `CoralDetailPage` aus TASK-05-05

---

## Worum geht es

Die Korallendetailseite aus MS-5 bekommt unter den Stammdaten zwei Tabs: **Steckbrief** und **Historie**. In diesem
Task wird der Steckbrief-Tab gefüllt (nur Anzeige); der Historie-Tab bekommt zunächst einen Platzhaltertext und wird
in TASK-06-06 gefüllt.

## Vor dem Start klären

- [ ] **Aktiver Tab.**
  - **(a)** Lokaler Zustand – einfach, aber nach Speichern auf einer Formularseite landet man immer im ersten Tab
  - **(b)** URL-Parameter `?tab=historie` – nach dem Journaleintrag kann direkt in den Historie-Tab zurückgeleitet
    werden, F5 behält den Tab
  → Entscheiden. (b) lohnt sich, wenn die Formulare in TASK-06-05/06-07 eigene Seiten werden.
- [ ] **Aussehen.** design.md beschreibt keine Tabs. Vorschlag: shadcn `tabs`, gestaltet wie die Filterchips aus
      design.md Abschnitt 4 (aktiv: Akzentfläche, inaktiv: Fläche mit Rahmen, Höhe min. 44). → Festlegen.

## Schritte

1. [ ] **shadcn `tabs`** über die shadcn-CLI hinzufügen (NFR-4.2) – der Befehl wird vorher gezeigt und freigegeben.
2. [ ] **Tabs** in `CoralDetailPage` unter den Stammdaten einbauen: „Steckbrief" · „Historie", Steckbrief zuerst.
       Farben und Maße nur aus den vorhandenen Tokens (vorher gegen `index.css` prüfen).
3. [ ] **Eigene Komponente** für den Steckbrief-Inhalt, z. B. `src/components/CoralProfile.tsx` (nicht in
       `components/ui/`):
   - je Feld Beschriftung (Text sekundär) und Wert
   - leerer Wert → „keine Angabe" in Text gedämpft (design.md Abschnitt 1)
   - Beschriftungen aus TASK-06-03
4. [ ] **Historie-Tab** vorerst mit einem kurzen Text, keine Attrappe mit Funktion.
5. [ ] Tastaturbedienung prüfen: Tabs mit Pfeiltasten wechselbar, Fokus sichtbar (liefert Radix mit).

## Fertig, wenn

- [ ] Beide Tabs sind sichtbar beschriftet und mindestens 44 px hoch (NFR-1.3, NFR-1.4)
- [ ] Eine Koralle ohne Steckbrief zeigt bei **jedem** Feld „keine Angabe"
- [ ] Gefüllte Werte erscheinen in Klartext („Mittel", nicht `mittel`) (NFR-1.8)
- [ ] Bei Entscheidung (b): F5 und Direktaufruf mit `?tab=historie` öffnen den richtigen Tab
- [ ] Bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Kein zweites UI-Paket für Tabs (NFR-4.2).
- Icons und Legende zum Steckbrief (FR-2.3) sind MS-9.
- Die Mockup-Buttons „Koralle bearbeiten" und „Zur Abgabe markieren" gehören zu MS-9 und MS-7, nicht hierher.

## Quellen

- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „KORALLE DETAIL" (Karten-Raster),
  Chipzeile der Messgrößen im Block „BECKEN" (Chip-Optik)
- `design.md` – Abschnitt 1 (Text gedämpft), Abschnitt 4 (Filterchip, Karte), Abschnitt 5 (Harte Regeln)
- `Dokumentation/Meilensteine/Milestones.md` – MS-1, Punkt 3 „Korallen-Detail mit Tabs"
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.6, FR-2.3, Abschnitt 7 Punkt 5
