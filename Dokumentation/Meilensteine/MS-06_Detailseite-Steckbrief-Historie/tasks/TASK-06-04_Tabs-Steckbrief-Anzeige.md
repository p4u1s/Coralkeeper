1# TASK-06-04 · Tab-Navigation und Steckbrief-Tab

**Status:** erledigt (25.09.2026)
**Bezug:** Umfang MS-6 („Detailseite mit Tab-Navigation"), FR-2.1, Abnahmekriterium Abschnitt 7 Punkt 5
(„unausgefüllte Felder zeigen ‚keine Angabe'"), NFR-4.2, NFR-1.3, NFR-1.4
**Voraussetzung:** TASK-06-03. Die `CoralDetailPage` ist in MS-5 **nicht** entstanden (TASK-05-05 war
„Responsive, Deployment, Abnahme"); sie wird am 23.09.2026 diesem Task zugeschlagen, siehe Schritt 0.

---

## Worum geht es

Die Korallendetailseite aus MS-5 bekommt unter den Stammdaten zwei Tabs: **Steckbrief** und **Historie**. In diesem
Task wird der Steckbrief-Tab gefüllt (nur Anzeige); der Historie-Tab bekommt zunächst einen Platzhaltertext und wird
in TASK-06-06 gefüllt.

## Vor dem Start klären

- [x] **Aktiver Tab.** → am 23.09.2026 entschieden: **(b) URL-Parameter `?tab=`** über `useSearchParams`.
      F5 und Direktaufruf behalten den Tab, und nach dem Speichern in TASK-06-05/06-07 kann gezielt in den
      richtigen Tab zurückgeleitet werden. Ein unbekannter Wert fällt auf den Steckbrief-Tab zurück.
- [x] **Aussehen.** design.md beschreibt keine Tabs. → am 23.09.2026 entschieden: shadcn `tabs`, gestaltet wie
      die Filterchips aus design.md Abschnitt 4 (aktiv: Akzentfläche, inaktiv: Fläche mit Rahmen, Höhe min. 44).
      Ein Unterstrich-Tab wäre eine Form, die das Designsystem sonst nirgends verwendet.

## Schritte

0. [x] **Grundlage der Detailseite** – in MS-5 nicht entstanden, am 23.09.2026 diesem Task zugeschlagen:
   - [x] `getCoral(id)` in `src/services/coral.ts` – Muster `getTank`, 22P02 wird zu „nicht gefunden"
   - [x] `useCoral(id)` in `src/hooks/useCoral.ts` – Muster `useTank`, eigener `notFound`-Zustand,
         bewusst ohne `reload` (Bearbeiten läuft über eigene Seiten)
   - [x] `CoralDetailPage` mit den Stammdaten und Route `/koralle/:id` – Titel, Art · Handelsname, Kacheln
         „Becken" und „Zugang am". Der Beckenname kommt aus `useTank(coral?.becken_id ?? "")`, kein Join
         (TASK-05-01); der erste Aufruf mit leerer ID läuft in den 22P02-Zweig von `getTank`.
   - [x] Bestandskarten im `HomeScreen` verlinken – Definition of Done von MS-6
1. [x] **shadcn `tabs`** über die shadcn-CLI hinzufügen (NFR-4.2) – der Befehl wird vorher gezeigt und freigegeben.
       → am 23.09.2026 mit `npx shadcn@latest add tabs` angelegt: `src/components/ui/tabs.tsx` (Base UI, Style
       `base-lyra`). Die Vorgaben der Komponente (Listenhöhe 32 px, `text-xs`, eckige Ecken) werden beim Aufruf
       überschrieben; `cn` ist ein Drop-in für tailwind-merge und führt das zusammen.
2. [x] **Tabs** in `CoralDetailPage` unter den Stammdaten einbauen: „Steckbrief" · „Historie", Steckbrief zuerst.
       Farben und Maße nur aus den vorhandenen Tokens (vorher gegen `index.css` prüfen).
       → Die Chip-Optik steht in `tabs.tsx` selbst, nicht an der Aufrufstelle: `cn` erkennt eigene
       Theme-Utilities wie `text-label` nicht als Konflikt zu `text-xs`. Geändert wurden Listenhöhe
       (jetzt vom Chip bestimmt), Radius 999, Padding 8/12, `text-label`, inaktiv `bg-card` mit
       `border-border`, aktiv `bg-primary`/`border-primary`/`text-primary-foreground`, Mindesthöhe
       `min-h-11` (NFR-1.3). Die `dark:`-Klassen des Generats sind entfallen – die Variante ist an
       `.dark` gebunden, die die App nirgends setzt. Ebenso entfernt: `text-xs/relaxed` am Panel,
       das sonst den gesamten Tabinhalt auf 12 px gezogen hätte.
       Der aktive Tab steht in `?tab=`; `isDetailTab` grenzt den als `any` typisierten Base-UI-Wert ein.
3. [x] **Eigene Komponente** für den Steckbrief-Inhalt, z. B. `src/components/CoralProfile.tsx` (nicht in
       `components/ui/`): → am 24.09.2026 angelegt
   - je Feld Beschriftung (Text sekundär) und Wert
   - leerer Wert → „keine Angabe" in Text gedämpft (design.md Abschnitt 1) – `text-ink-3`
   - Beschriftungen aus TASK-06-03 – `CORAL_PROFILE_LABELS`, `LEVEL_LABELS`, `PLACEMENT_LABELS`
   - Kachelraster nach dem Mockup-Block „KORALLE DETAIL": zwei Spalten, Fütterung und Besonderheiten über die
     volle Breite. `PROFILE_LAYOUT` (`Record<ProfileField, "half" | "full">`) legt Breite und Reihenfolge fest
     und erzwingt zugleich, dass kein Feld vergessen wird – wie `CORAL_PROFILE_LABELS` in TASK-06-03.
4. [x] **Historie-Tab** vorerst mit einem kurzen Text, keine Attrappe mit Funktion.
       → „Die Historie folgt in Kürze." Wird in TASK-06-06 ersetzt.
5. [x] Tastaturbedienung prüfen: Tabs mit Pfeiltasten wechselbar, Fokus sichtbar (liefert Radix mit).
       Anmerkung: Die Primitive kommt von Base UI, nicht von Radix – die Tastaturbedienung bringt sie
       trotzdem mit. Am 24.09.2026 im Browser geprüft: Pfeiltasten wechseln wie erwartet.
       Für den Fokusring gilt: **eine** Linie, `ring-[3px] ring-ring` mit
       `ring-offset-2 ring-offset-background`, dazu `outline-none`. Drei Dinge standen dem im Weg:
   - Der Ring des Generats lag ohne Abstand auf der Chipfläche – auf dem aktiven Tab Orange auf Orange.
   - `border-ring` und `outline-ring` zusammen mit dem Ring ergaben zwei Linien.
   - Ohne `outline-none` zeichnet Firefox zusätzlich seinen eigenen, blauen Ring: bei
     `outline-style: auto` schlägt die Farbe aus `index.css` (`* { outline-ring/50 }`) nicht durch.

## Fertig, wenn

- [x] Beide Tabs sind sichtbar beschriftet und mindestens 44 px hoch (NFR-1.3, NFR-1.4)
- [x] Eine Koralle ohne Steckbrief zeigt bei **jedem** Feld „keine Angabe"
- [x] Gefüllte Werte erscheinen in Klartext („Mittel", nicht `mittel`) (NFR-1.8)
- [x] Bei Entscheidung (b): F5 und Direktaufruf mit `?tab=historie` öffnen den richtigen Tab
- [x] Bei 360 px kein waagerechtes Scrollen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler (24.09.2026)

## Hinweise

- **Fokusring außerhalb des Task-Umfangs (24.09.2026):** Beim Fokusring der Tabs ist aufgefallen, dass
  dasselbe Problem an weiteren Stellen besteht; im Zuge dessen wurde es bei allen anderen auffälligen
  Stellen nachgezogen – `TankCard` (`TankListPage`), `CoralCard` (`HomeScreen`), `input.tsx`,
  `textarea.tsx`, `native-select.tsx` und `button.tsx`. Die beiden Karten-Links hatten gar keinen
  eigenen Fokusstil und zeigten den blauen Ring von Firefox; die drei Formularfelder hatten zwei
  Linien (`border-ring` plus `ring-1 ring-ring/50`); `button.tsx` hatte den grauen Ring
  (`ring-2 ring-muted-foreground`) aus TASK-05-05 – die Entscheidung ist damit aufgehoben, der
  Abstand löst das Orange-auf-Orange dort genauso wie beim aktiven Tab.
  Unverändert bleibt `BottomNav` mit `ring-inset`: am Bildschirmrand wäre ein Offset abgeschnitten.
  Die Variante `destructive` in `button.tsx` überschreibt die Ringfarbe weiter mit
  `ring-destructive/20`; sie wird derzeit nirgends verwendet und bleibt am 25.09.2026 bewusst so.
- Kein zweites UI-Paket für Tabs (NFR-4.2).
- Icons und Legende zum Steckbrief (FR-2.3) sind MS-9.
- Die Mockup-Buttons „Koralle bearbeiten" und „Zur Abgabe markieren" gehören zu MS-9 und MS-7, nicht hierher.

## Quellen

- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „KORALLE DETAIL" (Karten-Raster),
  Chipzeile der Messgrößen im Block „BECKEN" (Chip-Optik)
- `design.md` – Abschnitt 1 (Text gedämpft), Abschnitt 4 (Filterchip, Karte), Abschnitt 5 (Harte Regeln)
- `Dokumentation/Meilensteine/Milestones.md` – MS-1, Punkt 3 „Korallen-Detail mit Tabs"
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.6, FR-2.3, Abschnitt 7 Punkt 5
