# MS-1 · Design & Mockup

## Meilensteinübersicht

| MS | Name | Deckt ab | Aufwand |
| --- | --- | --- | --- |
| **➤ MS-1** | **Design & Mockup** | **Vorbereitung Bildschirme und Routing, NFR-1.1 bis NFR-1.8** | **~10 %** |
| MS-2 | Datenmodell & Schema-Entwurf *(parallel zu MS-1)* | Abschnitt 3 und 4 der Anforderungsanalyse, NFR-4.7, NFR-4.4 | ~4 % |
| MS-3 | Fundament & Auth | MVP 1 · FR-6.1, FR-6.3, FR-6.10, FR-6.2 | ~8 % |
| MS-4 | UI-Shell & Becken | MVP 2 · FR-1.1, FR-1.15, NFR-1.2 | ~8 % |
| MS-5 | Koralle & Bestand (Grundgerüst) | MVP 3 · FR-1.2, FR-1.14 | ~11 % |
| MS-6 | Detailseite: Steckbrief & Historie | MVP 4 + 5 · FR-2.1, FR-2.2, FR-3.3, FR-3.4, FR-3.5 | ~11 % |
| MS-7 | Ableger & Inserat | MVP 6 · FR-1.7, FR-3.6, FR-4.1, FR-4.2 | ~9 % |
| MS-8 | Diary | MVP 7 · FR-5.1, FR-5.3, FR-5.4, FR-5.10 | ~10 % |
| 🚦 | GATE: MVP-Abnahme | Abnahmekriterien, Abschnitt 7 | — |
| MS-9 | Bestand nutzbar & Profil | FR-1.3 bis FR-1.6, FR-1.9, FR-1.10, FR-2.3, FR-2.4, FR-6.8 | ~9 % |
| MS-10 | Herkunft, Historie & Diary-Ausbau | FR-3.1, FR-3.2, FR-3.7, FR-5.2 | ~7 % |
| MS-11 | Vermittlung *(optional, Abbruchkriterium)* | FR-4.3 bis FR-4.7 | ~8 % |
| MS-12 | Feinschliff & Abgabe | NFR-4.5, NFR-2.1 bis NFR-2.4 | ~5 % |

Der Aufwand ist als relativer Anteil am Gesamtprojekt angegeben, nicht in Wochen – so lässt er sich auf jeden Zeitrahmen abbilden. Bis zum MVP-Gate sind rund **71 %** verplant.

---

## MS-1 im Detail

**Ziel:** Das Aussehen der Anwendung steht fest, bevor Logik verdrahtet wird.

**Umfang – nur diese fünf ★-Screens werden gestaltet:**

1. **Bestand als Kachelliste** – einschließlich des geführten Leerzustands nach FR-1.15. Der Leerzustand ist der eigentlich schwierige Screen, nicht die gefüllte Liste.
2. **Koralle anlegen** – das Formularmuster, aus dem alle weiteren Formulare abgeleitet werden.
3. **Korallen-Detail mit Tabs** (Steckbrief · Historie) – inklusive Steckbrief-Icons **mit** Textlabel und Legende nach FR-2.3.
4. **Beckendetail / Diary mit Tabs** (Werte · Verlauf · Ereignisse) – das zweite Tab-Muster.
5. **Login / Register** – der kleinste Screen, setzt aber Typografie, Buttons und Feldabstände.

Alle übrigen Routen (Beckenliste, Ableger-Formular, Inserat, Profil, Angebotslisten) leiten sich aus diesen fünf ab und werden **nicht** separat gestaltet.

**Ergebnisse:**

- Dark-Theme-Farbtokens und Typografie, abgestimmt auf shadcn/ui und Tailwind
- Struktur der Bottom-Navigation: **Bestand · Becken · Diary · Profil** (NFR-1.2)
- Komponenteninventar: welche shadcn-Komponenten werden gebraucht
- 10–20 Korallenfotos zusammengestellt, für Mockup und später als Demo-Daten (NFR-4.5)

**Definition of Done:** Die fünf Screens sind gestaltet, die Bottom-Navigation ist festgelegt, das Farbschema steht, das Bildmaterial liegt vor.

**Empfohlener Weg:** Low-Fi-Wireframe (schnell, grob) → statische UI-Shell in React + shadcn mit Dummy-Daten → Verdrahtung. Die UI-Shell ist dann kein Wegwerfartefakt, sondern geht direkt in MS-4 und MS-5 über. Wird ein gestaltetes Mockup als eigenes Abgabeartefakt der Weiterbildung verlangt, tritt es vor die UI-Shell.

> **Timebox: harte Obergrenze ~10 % des Projekts.** Ohne Deckelung wird die Designphase in einem Projekt dieses Umfangs zuverlässig zur Hälfte des Projekts. Zweite Regel: **nur ★-Screens gestalten** – die größte Gefahr ist, die schönen Could-Features zu entwerfen statt der Pflicht.



