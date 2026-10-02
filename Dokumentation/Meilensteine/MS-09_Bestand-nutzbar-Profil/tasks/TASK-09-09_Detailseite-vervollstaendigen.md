# TASK-09-09 · Detailseite vervollständigen

**Status:** offen
**Bezug:** FR-1.6 („Detailansicht mit Bild, Stammdaten und Tab-Navigation"), NFR-1.4, NFR-1.7, NFR-2.3 · design.md
Abschnitt 1 (Statusfarben) und 3 (Bildfläche Korallendetail) · Hinweis aus TASK-07-03
**Voraussetzung:** TASK-09-05, TASK-09-07, TASK-09-08

---

## Worum geht es

Die Detailseite bekommt das Bild – 200 px hoch, im Rahmen der Statusfarbe – und eine geordnete Aktionsleiste. Dabei
wird für jeden Status festgelegt, welche Aktionen sichtbar sind; `abgegeben` und `verendet` sind ab TASK-09-07
erreichbar.

## Vor dem Start klären

- [ ] **Koralle ohne Bild.**
  - **(a)** Fläche in voller Höhe mit Symbol und Text „Kein Bild", Rahmen in Statusfarbe, darunter Link „Bild
    hinzufügen" zur Bearbeiten-Seite (NFR-1.7)
  - **(b)** keine Bildfläche
  → Vorschlag: **(a)**.
- [ ] **Bild lässt sich nicht laden** (URL-Fehler, fehlende Datei wie Testbild …04). Vorschlag: dieselbe Fläche mit
      „Bild konnte nicht geladen werden.", die übrige Seite bleibt bedienbar.
- [ ] **Aktionen je Status.** Vorschlag:

  | Aktion                     | Im Bestand | Zur Abgabe | Abgegeben | Verendet |
  | -------------------------- | ---------- | ---------- | --------- | -------- |
  | Koralle bearbeiten         | ✔          | ✔          | ✔         | ✔        |
  | Status ändern              | ✔          | ✔ ¹        | ✔         | ✔        |
  | Ableger erzeugen           | ✔          | ✔          | –         | –        |
  | Zur Abgabe markieren       | ✔          | –          | –         | –        |
  | Steckbrief bearbeiten      | ✔          | ✔          | ✔         | ✔        |
  | Journaleintrag hinzufügen  | ✔          | ✔          | ✔         | ✔        |

  ¹ Bei bestehendem Inserat zeigt die Statusseite nur den Hinweis (TASK-09-01, TASK-09-07).
  „Ableger erzeugen" entfällt bei `abgegeben` und `verendet`, weil die Koralle nicht mehr da ist. Der Journaleintrag
  bleibt, weil die Historie auch danach Nachweis ist.
- [ ] **Anordnung.** Vorschlag, untereinander in voller Breite: Bild → Titel, „Art · Handelsname", Plakette → Kacheln
      „Becken" und „Zugang am" → „Koralle bearbeiten" → „Status ändern" → „Ableger erzeugen" → Inserat bzw. „Zur
      Abgabe markieren" → Tabs.

## Schritte

1. [ ] **Bildfläche** nach design.md: Höhe 200, Radius 14, Rahmen 2 px in Statusfarbe, `object-fit: cover`,
       Alternativtext aus TASK-09-08; Zustände nach Entscheidung.
2. [ ] Die Statusfarben-Zuordnung (`STATUS_DOT_CLASSES`) für Rahmen **und** Punkt nutzen; wird sie auch in der Kachel
       (TASK-09-11) gebraucht, an einen gemeinsamen Ort legen – Vorschlag vorher zeigen.
3. [ ] **Aktionen** nach Tabelle und Anordnung einbauen; Kommentar „abgegeben/verendet erst ab MS-9 prüfen" an
       „Ableger erzeugen" ersetzen.
4. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] Koralle mit Bild: Bild im Statusrahmen, Rahmenfarbe wechselt mit dem Status
- [ ] Koralle ohne Bild und Bild mit Ladefehler: Fläche nach Entscheidung, keine leere Lücke, kein Absturz
- [ ] Die Aktionen erscheinen je Status wie festgelegt (alle vier Status einmal durchspielen)
- [ ] Status ist nie nur über die Farbe erkennbar – Plakette mit Text bleibt (NFR-1.4)
- [ ] Detailseite erscheint auch mit Bild zügig (NFR-2.3: unter 1 s); das Bild darf nachladen
- [ ] Bei 360 px kein waagerechtes Scrollen, das Bild füllt die Breite
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Die Mockup-Kacheln „Größe", „Ableger insgesamt" und „Herkunft" gehören nicht hierher: `koralle` hat keine Größe,
  die Zahl der Ableger ist FR-1.8 (Could-Backlog), Herkunft ist FR-3.1 (MS-10).
- FR-1.6 nennt die Tab-Navigation Steckbrief · Historie – besteht seit MS-6.

## Quellen

- `src/pages/CoralDetailPage.tsx`, `src/components/CoralOffer.tsx`
- `design.md` – Abschnitt 1 (Statusfarben), Abschnitt 3 (Bildfläche Korallendetail, Rahmenstärke Statusbild)
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „KORALLE DETAIL"
- `Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-03_Ableger-erzeugen.md` – Button „Ableger erzeugen"
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.6, NFR-1.7, NFR-2.3
