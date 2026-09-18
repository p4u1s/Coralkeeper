# Designsystem Coralkeeper

Stand: 09.09.2026 · Quelle: `Coralkeeper.dc.html`
Produkt: mobile Verwaltungs-App für Korallenzüchter. Bedienung am Aquarium, mit
feuchten Händen, oft bei blauem Aktinik-Licht. Daraus folgen: dunkles Farbschema,
große Trefferflächen, warme Akzentfarbe.

Plattform: Mobile-First-Webapp (React + Tailwind + shadcn/ui).
Sprache Deutsch, Formate de-DE: `12.03.2026` · `8,1 dKH` · `250 l` · `1.320 mg/l`.

---

## 1. Farben

### Basis (Dark Theme ist der Standard, kein Light Theme)

| Rolle                          | Hex       | Verwendung                                    |
| ------------------------------ | --------- | --------------------------------------------- |
| Hintergrund App                | `#0B1120` | Screen-Grund                                  |
| Hintergrund außerhalb Artboard | `#080D18` | nur Präsentationsrahmen                       |
| Fläche / Karte                 | `#141E2E` | Karten, Eingabefelder, Bottom-Nav             |
| Fläche erhöht                  | `#1C2839` | Chips, sekundäre Buttons, Bildhinterlegung    |
| Rahmen / Trennlinie            | `#2A3A50` | 1 px Rahmen, Diagrammgitter                   |
| Text primär                    | `#E8EEF6` | Titel, Werte, Fließtext                       |
| Text sekundär                  | `#93A4BC` | Labels, Meta, Achsenbeschriftung              |
| Text gedämpft                  | `#808FA2` | ausschließlich „keine Angabe" und Placeholder |

### Akzente

| Rolle               | Hex       | Verwendung                                           |
| ------------------- | --------- | ---------------------------------------------------- |
| Akzent primär       | `#E8963A` | Primärbuttons, aktive Chips, aktives Nav-Item, Links |
| Akzent primär Hover | `#F2A851` | Link-Hover                                           |
| Text auf Akzent     | `#1A0F0A` | Schrift und Icons auf `#E8963A`                      |
| Akzent sekundär     | `#2DD4BF` | Diagrammkurve, Kurvenfläche (16 % Deckkraft), Erfolg |
| Warnung             | `#F5B54A` | Warnhinweise                                         |
| Fehler              | `#F2685E` | Fehlermeldungen, „Abmelden"                          |

### Statusfarben Koralle

Ausschließlich für den Korallenstatus, für nichts anderes. Immer Punkt oder
farbcodierter Bildrahmen **plus** Textlabel — nie Farbe allein.

| Status     | Hex       | Name         |
| ---------- | --------- | ------------ |
| Im Bestand | `#3FBF3F` | Grasgrün     |
| Zur Abgabe | `#EC3FB0` | Magenta      |
| Abgegeben  | `#93A4BC` | Grau         |
| Verendet   | `#FF4438` | Feuerwehrrot |

Legende „Legende Status" ist auf dem Bestand-Screen dauerhaft sichtbar.

---

## 2. Typografie

Schrift: **Inter**, Fallback `system-ui`. Gewichte 400 / 500 / 600.

| Stil    | Größe / Zeilenhöhe | Gewicht | Verwendung                          |
| ------- | ------------------ | ------- | ----------------------------------- |
| Display | 24 / 32            | 600     | Screen-Titel                        |
| H1      | 20 / 28            | 600     | große Messwerte                     |
| H2      | 17 / 24            | 600     | Kartentitel, Abschnitte             |
| Body    | 15 / 22            | 400     | Fließtext, Eingabewerte, Buttons    |
| Label   | 13 / 18            | 500     | Feldlabels, Chips, kompakte Buttons |
| Caption | 12 / 16            | 400     | Meta, Achsen, Nav-Labels            |

Messwerte und Tabellenzahlen mit tabellarischen Ziffern:
`font-variant-numeric: tabular-nums`.

---

## 3. Raster, Maße, Form

Abstandsskala: **4 · 8 · 12 · 16 · 24 · 32**
Seitenrand mobil: **16**
Artboard: **390 px** breit, muss auch bei **360 px** ohne Umbruchfehler
funktionieren — keine festen Breiten, die das verhindern.

| Element                         | Maß                    |
| ------------------------------- | ---------------------- |
| Eckenradius Karte               | 14                     |
| Eckenradius Button, Eingabefeld | 10                     |
| Eckenradius Chip / Badge        | 999                    |
| Rahmenstärke Fläche             | 1 px `#2A3A50`         |
| Rahmenstärke Statusbild         | 2 px in Statusfarbe    |
| Bottom-Navigation Höhe          | 64                     |
| Trefferfläche Minimum           | 44 × 44                |
| Primärbutton Höhe               | 48 (kompakt 44)        |
| Eingabefeld Höhe                | 48                     |
| Listen-Innenabstand Karte       | 12                     |
| Karten-Innenabstand Detail      | 16                     |
| Unterer Screen-Abstand bei Nav  | 104 (64 Nav + 40 Luft) |
| Miniaturbild Liste              | 44 × 44, Radius 10     |
| Bildfläche Bestandskarte        | 72 × 72+, Radius 10    |
| Bildfläche Korallendetail       | Höhe 200, Radius 14    |
| Bildfläche Beckenkarte          | 64 × 64, Radius 10     |
| Bildfläche Beckendetail         | Höhe 140, Radius 14    |
| Avatar Profil                   | 56 × 56, Radius 999    |
| Statuspunkt                     | 10 × 10, Radius 999    |

**Keine Schatten.** Ebenen entstehen über Flächenhelligkeit und Rahmen.

---

## 4. Komponenten

**Primärbutton** — `#E8963A`, Text `#1A0F0A`, Radius 10, Höhe 48, 600er Gewicht,
Padding 12/16. Icon links, immer mit Text.

**Sekundärbutton** — Fläche `#1C2839`, Rahmen 1 px `#2A3A50`, Text `#E8EEF6`,
Gewicht 500, sonst wie Primärbutton.

**Filterchip** — Höhe min. 44, Padding 8/12, Radius 999.
Inaktiv: Fläche `#141E2E`, Rahmen `#2A3A50`, Text `#E8EEF6`.
Aktiv: Fläche und Rahmen `#E8963A`, Text `#1A0F0A`.
Kurze Labels: Alle · Bestand · Abgabe · Archiv.

**Karte** — Fläche `#141E2E`, Rahmen 1 px `#2A3A50`, Radius 14, Padding 12–16,
Innenabstand 12.

**Eingabefeld** — Fläche `#141E2E`, Rahmen 1 px `#2A3A50`, Radius 10, Höhe 48,
Padding 12, Placeholder `#6B7C93`. Sichtbares Label 13/18/500 in `#E8EEF6`
**über** dem Feld; Pflichtfelder mit `*`, Legende „\* Pflichtfeld" am Formularkopf.

**Bottom-Navigation** — fix, Höhe 64, Fläche `#141E2E`, Oberkante 1 px `#2A3A50`.
Vier Einträge, jeweils Icon 20 px + Textlabel 12/16/500:
Bestand · Becken · Diary · Profil.
Aktiv `#E8963A`, inaktiv `#93A4BC`. Sichtbar auf allen Screens nach der Anmeldung,
außer Login, Register und in Formularen.

**Messwertdiagramm** — SVG, Zeichenfläche 260 × 120 (`preserveAspectRatio="none"`).
Kurve `#2DD4BF`, 2,5 px, abgerundete Enden, kubisch geglättet; Fläche darunter
`#2DD4BF` mit 16 % Deckkraft. Punkte r = 4, Füllung `#0B1120`, Rand 2,5 px
`#2DD4BF`. Gitter `#2A3A50`, innere Linien gestrichelt `3 4`.
Y-Achse: Ticks in gleichmäßigen Schritten (Schrittweite je Messgröße automatisch
aus 0,01 / 0,02 / 0,05 / 0,1 / 0,2 / 0,5 / 1 / 2 / 5 / 10 / 20 / 25 / 50 / 100).
Beschriftung nur mit der Abkürzung, X-Achse nur „Datum".
Messgrößen-Umschalter als Chipzeile: **Kh · Ca · Mg · No3 · Po4 · Tmp**.

**Diary-Typ-Chip** — Fläche `#1C2839`, Rahmen `#2A3A50`, Radius 999, Padding 4/10,
Text 12/16 in `#93A4BC`, links ein 20-px-Liniensymbol (`stroke-width` 1,6,
`currentColor`). Symbole: Ableger, Pflege, Abgabe, Zugang, Messung.
Symbol ergänzt das Textlabel, ersetzt es nicht.

---

## 5. Harte Regeln

1. Jede Trefferfläche mindestens 44 × 44 px.
2. Kein Icon ohne sichtbaren Text daneben oder darunter. (Einzige bewusste
   Ausnahme: der Lupenbutton in der Filterzeile — mit `aria-label` und einem
   sichtbar gelabelten Suchfeld beim Aufklappen.)
3. Keine Funktion, die nur bei Hover erscheint.
4. Jedes Formularfeld hat ein sichtbares Label über dem Feld. Der Placeholder ist
   kein Label-Ersatz.
5. Kontrast mindestens WCAG 2.1 AA (Text 4,5:1, Text ab Überschriftgröße 3:1).
6. Artboard 390 px, funktionsfähig bis 360 px; keine festen Breiten, `min-width: 0`
   auf flexiblen Spalten.
7. Deutsche Beschriftungen in Klartext, keine Fachkürzel ohne Erklärung
   (Ausnahme: die Achsen-Abkürzungen im Diagramm, der Kartentitel nennt den
   vollen Namen).
8. Pflichtfelder mit `*` und Legende „\* Pflichtfeld".
9. Sibling-Gruppen mit Flex/Grid und `gap` layouten, nicht mit Einzelmargins.

---

## 6. Beispieldaten

Becken: „Riffbecken 250 l", „Ablegerbecken 60 l"

Korallen:
Acropora tenuis „Green Slimer" · Euphyllia paradivisa „Gold Torch" ·
Montipora digitata „Forest Fire" · Stylophora pistillata „Milka" ·
Zoanthus sp. „Rasta" · Duncanopsammia axifuga „Duncan"

Bilder: echte Fotos unter `assets/` (`green-slimer.png`, `gold-torch.png`,
`forest-fire.png`, `milka.png`, `rasta.png`, `duncan.png`, `zuchtanlage.png`),
`object-fit: cover`, Statusrahmen 2 px außen herum.

---

## 7. Nicht im Umfang

Artenkatalog, Vorlagen, Chat, Bewertungen, Zahlungsabwicklung, Onboarding-Tour,
Benachrichtigungen, Abstammungsbaum, QR-Codes, Light Theme.

---

## 8. Tokens zum Übernehmen

```js
// tailwind.config.js – theme.extend
colors: {
  bg:        "#0B1120",
  surface:   "#141E2E",
  raised:    "#1C2839",
  border:    "#2A3A50",
  ink:       "#E8EEF6",
  "ink-2":   "#93A4BC",
  "ink-3":   "#808FA2",
  accent:    "#E8963A",
  "accent-hover": "#F2A851",
  "on-accent":    "#1A0F0A",
  teal:      "#2DD4BF",
  warn:      "#F5B54A",
  error:     "#F2685E",
  status: {
    bestand:   "#3FBF3F",
    abgabe:    "#EC3FB0",
    abgegeben: "#93A4BC",
    verendet:  "#FF4438",
  },
},
borderRadius: { card: "14px", control: "10px", pill: "999px" },
spacing: { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px" },
fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
fontSize: {
  display: ["24px", "32px"],
  h1:      ["20px", "28px"],
  h2:      ["17px", "24px"],
  body:    ["15px", "22px"],
  label:   ["13px", "18px"],
  caption: ["12px", "16px"],
},
boxShadow: { none: "none" },
```
