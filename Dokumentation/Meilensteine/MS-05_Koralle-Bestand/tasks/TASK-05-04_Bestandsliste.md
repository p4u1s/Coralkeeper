# TASK-05-04 · Bestandsliste

**Status:** erledigt
**Bezug:** Umfang MS-5 („einfache Bestandsliste"), FR-1.15 (geführter Leerzustand bleibt), FR-6.4
(„Noch keine Korallen angelegt" mit direkter Anlage-Aktion), NFR-1.3, NFR-1.6
**Voraussetzung:** TASK-05-03

---

## Worum geht es

Die Startseite `/` ersetzt den Platzhalter „Die Korallenliste folgt in Kürze." durch die Liste der eigenen Korallen.
Die Einträge sind in MS-5 **nicht anklickbar** – das kommt mit der Detailseite in MS-6. Kachelansicht mit Bild, Status,
Filter, Sortierung und Suche sind **ausdrücklich nicht** Teil von MS-5 (folgen in MS-9).

## Vor dem Start klären

- [x] **Inhalt eines Listeneintrags.** Vorschlag: Bezeichnung (H2), darunter Art bzw. Handelsname, falls vorhanden
      (Label, Text sekundär), und der Beckenname (Caption). Das Mockup-Element „Anzahl Korallen" unter dem Titel:
      aufnehmen oder weglassen? → Festlegen.
      → **Entschieden (22.09.2026):** Bezeichnung (H2); darunter Art und Handelsname mit „ · " verbunden, soweit
      vorhanden (Label, sekundär); Beckenname als Caption. Die Anzahl entfällt in MS-5 und wird in MS-9 nachgezogen.
- [x] **Status und Legende.** `design.md` verlangt die Legende „Legende Status" auf dem Bestand-Screen dauerhaft
      sichtbar; MS-5 schließt die Kachelansicht (mit Statusrahmen am Bild) aus.
      → **Entschieden (22.09.2026):** Status und Legende kommen gemeinsam mit der Kachelansicht in MS-9. Bis dahin
      haben alle Korallen `im_bestand`.
- [x] **Anklickbar?** → **Entschieden (22.09.2026):** nein, Detailseite und Verlinkung kommen in MS-6
      (Definition of Done von MS-5 und MS-6 angepasst).

## Schritte

1. [x] **Daten laden** in `src/pages/HomeScreen.tsx`: Becken (`useTanks`, für FR-1.15) **und** Korallen (`useCorals`).
       Aus beiden einen gemeinsamen Zustand bilden: lädt einer → Laden; scheitert einer → Fehler mit „Erneut versuchen"
       (beide neu laden). Den Beckennamen je Koralle über `becken_id` aus den geladenen Becken zuordnen
       (entschieden in TASK-05-01, kein Join).
2. [x] **Zustände** in dieser Reihenfolge:
   - keine Becken → bestehende Karte „Lege zuerst ein Becken an" bleibt unverändert
   - Becken, aber keine Korallen → „Noch keine Korallen angelegt." mit Primär-Link „Koralle hinzufügen" → `/koralle/neu`
   - Korallen vorhanden → Liste plus Link „Koralle hinzufügen"
3. [x] **Listeneintrag** als Karte (`rounded-xl border border-border bg-card p-4`, Optik wie `TankCard` in
       `TankListPage.tsx`), aber **ohne** `Link` – ein einfaches `li` mit Inhalt. Lange Bezeichnungen umbrechen.
4. [x] **„Koralle hinzufügen"** wie im Mockup oberhalb der Liste, Icon `Plus` mit Text.
5. [x] Platzhaltertext „Die Korallenliste folgt in Kürze." entfernen; Kopfkommentar der Datei anpassen.

## Fertig, wenn

- [x] Als Testnutzer A erscheinen die Korallen `…02` und `…03` mit Beckenname
- [x] Eine in TASK-05-03 angelegte Koralle erscheint nach dem Speichern in der Liste (**Definition of Done**)
- [x] Mit Becken, ohne Korallen: „Noch keine Korallen angelegt." mit direkter Aktion (FR-6.4)
- [x] Ohne Becken: unverändert „Lege zuerst ein Becken an", **kein** Weg zu „Koralle hinzufügen" (FR-1.15)
- [x] Ladezustand und Fehlerzustand mit „Erneut versuchen" sind sichtbar (FR-6.4)
- [x] „Koralle hinzufügen" mindestens 44 px hoch, mit Tastatur erreichbar (NFR-1.3)
- [x] Bei 360 px kein waagerechtes Scrollen, auch bei langer Bezeichnung (NFR-1.6)
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Karten ohne Link dürfen nicht wie Buttons aussehen oder reagieren (kein Hover-/Fokus-Effekt), sonst erwartet man
  eine Aktion, die es noch nicht gibt.
- Die Liste ist nach Bezeichnung sortiert (aus `listCorals`); eine Sortierauswahl ist FR-1.4 und damit MS-9.
- Nicht anfassen: den Leerzustand „Lege zuerst ein Becken an" selbst – er ist in TASK-04-06 abgenommen.

## Quellen

- [`../MS-05_Koralle-Bestand.md`](../MS-05_Koralle-Bestand.md) – Umfang, „Bewusst noch nicht enthalten", Definition of Done
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „BESTAND"
- `design.md` – Abschnitt 4 (Karte), Abschnitt 5
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.15, FR-6.4
- `src/pages/HomeScreen.tsx`, `src/pages/TankListPage.tsx` – bestehendes Muster
