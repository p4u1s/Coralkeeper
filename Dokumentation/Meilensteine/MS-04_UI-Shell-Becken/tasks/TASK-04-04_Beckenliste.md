# TASK-04-04 · Beckenliste

**Status:** erledigt
**Bezug:** FR-1.1, FR-6.4 (Lade-, Leer-, Fehlerzustand), NFR-1.5 (de-DE-Formate), NFR-1.7 (nächste Aktion sichtbar)
**Voraussetzung:** TASK-04-03

---

## Worum geht es

`/becken` zeigt alle eigenen Becken als Karten und bietet „Becken anlegen" an. Jede Karte führt zum Beckendetail
(TASK-04-07). Vorlage ist der Screen „Becken" im Mockup.

## Schritte

1. [x] **Formatierung** in einer Hilfsdatei (z. B. `src/lib/format.ts`), damit alle Screens gleich formatieren:
   - Datum `2026-03-12` → `12.03.2026`
   - Volumen `1320` → `1.320 l`
2. [x] Seite `/becken` mit Überschrift „Becken" (Display).
3. [x] **Ladezustand:** „Wird geladen …" wie im `LoadingScreen` aus TASK-03-09.
4. [x] **Fehlerzustand:** Meldung aus dem Service mit `role="alert"` und Button „Erneut versuchen" (`reload()`).
5. [x] **Leerzustand:** kurzer Satz (z. B. „Noch kein Becken angelegt.") und Primärbutton „Becken anlegen" → `/becken/neu`.
6. [x] **Liste:** je Becken eine Karte (`surface`, Rahmen, Radius 14, Innenabstand 16) als Link auf `/becken/:id`:
   - Name (H2)
   - Metazeile nur aus den gefüllten Werten, z. B. „250 l · seit 12.03.2026"
7. [x] Unter der Liste Sekundärbutton „Becken anlegen" → `/becken/neu`.

## Fertig, wenn

- [x] Alle vier Zustände sind sichtbar zu machen: Laden, Fehler (DevTools → Netzwerk → Offline), leer, gefüllt (FR-6.4)
- [x] Die ganze Karte ist anklickbar und mindestens 44 px hoch (NFR-1.3)
- [x] Datum und Volumen erscheinen im de-DE-Format (NFR-1.5)
- [x] Ein sehr langer Beckenname bricht bei 360 px um, statt waagerechtes Scrollen zu erzeugen (NFR-1.6)
- [x] Becken fehlender Felder zeigen keine leeren Trenner („ · ")
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `new Date("2026-03-12")` wird als UTC-Mitternacht gelesen. Für reine Datumswerte beim Formatieren
  `timeZone: "UTC"` setzen oder die drei Teile direkt zerlegen, sonst kann in anderen Zeitzonen der Vortag erscheinen.
- **Nicht in MS-4:** Beckenbild (die Tabelle hat keine Bildspalte) und die Messwert-Chips aus dem Mockup (Diary, MS-8).
- Karten als Flex/Grid mit `gap` layouten, `min-w-0` auf der Textspalte (`design.md` Abschnitt 5, Regeln 6 und 9).

## Quellen

- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „BECKEN"
- `design.md` – Abschnitt 3 (Karte), Abschnitt 4 (Karte, Primär-/Sekundärbutton)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.1, FR-6.4, NFR-1.5, NFR-1.7
