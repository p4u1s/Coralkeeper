# TASK-09-11 · Bestand als Kachelansicht

**Status:** offen
**Bezug:** FR-1.3 („Kachelansicht mit Primärbild, Bezeichnung und Becken-Kennzeichnung"), FR-6.4, NFR-1.4, NFR-1.6,
NFR-2.2 (`loading="lazy"`) · design.md Abschnitt 1 (Statusfarben, „Legende Status"), Abschnitt 3 (Bildfläche
Bestandskarte) · aus MS-5 übernommen: Anzahl unter dem Titel
**Voraussetzung:** TASK-09-08 (Bild-URLs), TASK-09-09 (Statusfarben-Zuordnung)

---

## Worum geht es

Die Bestandskarten bekommen das Primärbild im Rahmen der Statusfarbe, der Bestand-Screen die dauerhaft sichtbare
„Legende Status" und unter dem Titel die Anzahl. Damit kommen Status und Legende in den Bestand, wie am 22.09.2026 für
MS-9 entschieden (TASK-05-04).

## Vor dem Start klären

- [ ] **Aufbau der Karte.** Mockup: Bild 72 × 72 links (Radius 10, Rahmen 2 px in Statusfarbe), rechts Bezeichnung,
      Art, Becken. Der Status steht im Mockup nur als Rahmenfarbe; design.md verlangt „Punkt oder Bildrahmen **plus**
      Textlabel".
  - **(a)** zusätzlich Statuspunkt und Statustext in der Karte, z. B. neben dem Beckennamen
  - **(b)** nur Rahmen, erklärt durch die Legende wie im Mockup
  → Vorschlag: **(a)**.
- [ ] **Spalten.** Vorschlag: eine Spalte auf dem Smartphone, ab mittlerer Breite zwei (NFR-1.6 „brauchbare Darstellung
      bis Desktop").
- [ ] **Koralle ohne Bild.** Vorschlag: Bildfläche in „Fläche erhöht" mit Symbol und Text „Kein Bild", Rahmen in
      Statusfarbe – gleiche Lösung wie auf der Detailseite (TASK-09-09).
- [ ] **Ort der Legende.** design.md: „auf dem Bestand-Screen dauerhaft sichtbar"; das Mockup setzt sie unter die Liste.
  - **(a)** unter der Liste wie im Mockup – bei vielen Korallen erst nach dem Scrollen zu sehen
  - **(b)** über der Liste
  → Vorschlag: **(b)**.
- [ ] **Anzahl.** Vorschlag: „12 Korallen · 2 Becken", mit Einzahl „1 Koralle", „1 Becken"; die Form „x von y
      Korallen" kommt mit den Filtern in TASK-09-12.

## Schritte

1. [ ] **Bild-URLs** für alle Korallen mit `primaerbild` über den Hook aus TASK-09-08 laden – ein Aufruf für die ganze
       Liste. Die Liste erscheint sofort; Bilder kommen nach (`loading="lazy"`), ein URL-Fehler zeigt den Platzhalter.
2. [ ] **`CoralCard`** umbauen nach Entscheidung; der veraltete Kommentar „Nicht anklickbar bis MS-6" entfällt.
3. [ ] **Legende** mit den vier Status (Punkt + Text, Statusfarben aus der gemeinsamen Zuordnung).
4. [ ] **Anzahl** unter dem Titel in Label-Größe, Text sekundär, tabellarische Ziffern.
5. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] Jede Karte zeigt Bild bzw. Platzhalter im Statusrahmen, Bezeichnung und Becken (FR-1.3)
- [ ] Der Status ist an jeder Karte ohne Farbe erkennbar (Entscheidung oben) und die Legende ist sichtbar
- [ ] Die Anzahl stimmt, auch mit einer und mit keiner Koralle
- [ ] Leerzustände bleiben: „Lege zuerst ein Becken an" ohne Becken, „Noch keine Korallen angelegt." ohne Korallen
      (FR-1.15, FR-6.4)
- [ ] Die Karte ist als Ganzes anklickbar, mindestens 44 px hoch, Fokus sichtbar (NFR-1.3)
- [ ] Bilder haben `loading="lazy"` und einen Alternativtext (NFR-2.2, NFR-1.4)
- [ ] Bei 360 px kein waagerechtes Scrollen, lange Bezeichnungen umbrechen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Der Kartenradius ist heute `rounded-xl` (12 px), design.md verlangt 14 – am 22.09.2026 gemeldet, nicht angefasst.
  Beim Umbau der Karte nachfragen, ob das jetzt mitgezogen wird.
- Filter, Sortierung und Suche folgen in TASK-09-12.

## Quellen

- `src/pages/HomeScreen.tsx`, `src/pages/CoralDetailPage.tsx` (`STATUS_DOT_CLASSES`), `src/index.css` (Status-Tokens)
- `design.md` – Abschnitt 1, Abschnitt 3 (Bildfläche Bestandskarte, Statuspunkt), Abschnitt 6 (Bilder)
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „BESTAND"
- `Dokumentation/Meilensteine/MS-05_Koralle-Bestand/tasks/TASK-05-04_Bestandsliste.md` – Entscheidung zu Status und
  Anzahl
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.3, NFR-2.2
