# MS-1 · Design-Prompts für Claude Design

**Stand: 08.09.2026** · Grundlage: `Claude-Reefkeeper-Requirements-v2.2.md` (Abschnitt 6 NFR-1.x, Abschnitt 7 Bildschirme) und `Milestones.md` (MS-1, fünf ★-Screens)

Dieses Dokument ist **kein** Anforderungsdokument. Es übersetzt die bestehenden Anforderungen in ausführbare Prompts für Claude Design. Die Anforderungsanalyse bleibt bei Version 2.2 unverändert.

---

## 0. Wie du diese Prompts benutzt

**Reihenfolge einhalten.** Prompt 1 legt Farben, Typografie und Komponenten fest. Die Prompts 2 bis 5 bauen darauf auf. Wenn du P2–P5 in **derselben** Claude-Design-Sitzung ausführst, genügt der Prompt so, wie er hier steht. Startest du eine **neue** Sitzung, stelle dem Prompt den **Baustein A** (Abschnitt 1) voran – sonst erfindet das Modell eine neue Palette.

| Prompt | Artboards | Deckt ab (MS-1) |
| --- | --- | --- |
| **P1** Fundament, UI-Kit, Login/Register | 4 | ★-Screen 5, Farbschema, Komponenteninventar |
| **P2** Bestand – leer, gefüllt, ladend | 3 | ★-Screen 1, Bottom-Navigation |
| **P3** Koralle anlegen – Formularmuster | 3 | ★-Screen 2, Lösch-Dialog |
| **P4** Korallen-Detail – Steckbrief, Historie | 2 | ★-Screen 3 |
| **P5** Beckendetail/Diary – Werte, Verlauf, Ereignisse | 3 | ★-Screen 4 |
| **P6** *(optional)* Desktop-Adaption | 2 | NFR-1.6, obere Grenze |

**Timebox.** MS-1 ist auf ~10 % des Projekts gedeckelt. P1–P5 sind Pflicht, P6 nur, wenn Zeit bleibt. Iteriere höchstens zwei Runden je Prompt – danach ist der Screen gut genug für eine Weiterbildungsabgabe.

**Nach jedem Prompt: Design-Review-Checkliste** (Abschnitt 8) durchgehen. Sie ist direkt aus den NFRs abgeleitet und dein Abnahmekriterium.

---

## 1. Baustein A – Designsystem (bei neuer Sitzung voranstellen)

> Kopiere diesen Block unverändert vor jeden Prompt, wenn du nicht in derselben Sitzung wie Prompt 1 arbeitest.

```
DESIGNSYSTEM CORALKEEPER (verbindlich, nicht abweichen)

Produkt: Coralkeeper – mobile Verwaltungs-App für Korallenzüchter.
Nutzungskontext: wird am Aquarium bedient, mit feuchten Händen, oft bei blauem
Aktinik-Licht. Daraus folgt: dunkles Farbschema, große Trefferflächen, warme
Akzentfarbe (blaue Akzente verschwinden unter Blaulicht).

Plattform: Mobile-First-Webapp, React + Tailwind + shadcn/ui. Sprache Deutsch,
Datums- und Zahlenformat de-DE (12.03.2026 · 8,1 dKH · 250 l).

FARBEN (Dark Theme ist der Standard, kein Light Theme entwerfen)
  Hintergrund App      #0B1120
  Flaeche / Karte      #141E2E
  Flaeche erhoeht      #1C2839
  Rahmen / Trennlinie  #2A3A50
  Text primaer         #E8EEF6
  Text sekundaer       #93A4BC
  Text gedaempft       #6B7C93   (nur fuer "keine Angabe")
  Akzent primaer       #FF7A59   (Korallenorange: Buttons, aktive Zustaende)
  Text auf Akzent      #1A0F0A
  Akzent sekundaer     #2DD4BF   (Diagramme, Erfolg)
  Warnung              #F5B54A
  Fehler               #F2685E

STATUSFARBEN Koralle (immer Punkt + Textlabel, nie nur Farbe)
  im Bestand  #3FBF3F   Grasgruen
  zur Abgabe  #EC3FB0   Magenta
  abgegeben   #93A4BC   Grau
  verendet    #FF4438   Feuerwehrrot
  Diese vier Farben werden ausschliesslich fuer den Korallenstatus verwendet und
  fuer nichts anderes.

TYPOGRAFIE  Inter (Fallback system-ui)
  Display 24/32 SemiBold · H1 20/28 SemiBold · H2 17/24 SemiBold
  Body 15/22 Regular · Label 13/18 Medium · Caption 12/16 Regular
  Messwerte und Tabellenzahlen mit tabellarischen Ziffern.

RASTER UND FORM
  Abstaende: 4 / 8 / 12 / 16 / 24 / 32
  Seitenrand mobil: 16
  Eckenradius: Karte 14, Button und Eingabefeld 10, Chip/Badge 999
  Keine Schatten. Ebenen entstehen ueber Flaechenhelligkeit und Rahmen.

HARTE REGELN (aus den nicht-funktionalen Anforderungen, gelten ueberall)
  1. Jede Trefferflaeche mindestens 44 x 44 px.
  2. Kein Icon ohne sichtbaren Text daneben oder darunter. Nie.
  3. Keine Funktion, die nur bei Hover erscheint.
  4. Jedes Formularfeld hat ein sichtbares Label ueber dem Feld. Der Placeholder
     ist kein Label-Ersatz.
  5. Kontrast mindestens WCAG 2.1 AA.
  6. Artboard-Breite 390 px; das Layout muss auch bei 360 px ohne Umbruchfehler
     funktionieren - keine festen Breiten, die das verhindern.
  7. Deutsche Beschriftungen in Klartext, keine Fachkuerzel ohne Erklaerung.
  8. Pflichtfelder mit "*" und Legende "* Pflichtfeld".

NAVIGATION
  Fixe Bottom-Navigation, 4 Eintraege, jeweils Icon + Textlabel, Hoehe 64 px:
  Bestand · Becken · Diary · Profil. Aktiver Eintrag in #FF7A59, inaktiv in
  #93A4BC. Auf jedem Screen nach der Anmeldung sichtbar, ausser auf Login,
  Register und in Formularen.

BEISPIELDATEN (immer diese verwenden, kein Lorem ipsum)
  Becken: "Riffbecken 250 l", "Ablegerbecken 60 l"
  Korallen: Acropora tenuis "Green Slimer" · Euphyllia paradivisa "Gold Torch" ·
  Montipora digitata "Forest Fire" · Stylophora pistillata "Milka" ·
  Zoanthus sp. "Rasta" · Duncanopsammia axifuga "Duncan"
  Korallenbilder als farbige Platzhalterflaechen mit Bildsymbol und Beschriftung
  darstellen, keine Fotos erfinden.

NICHT ENTWERFEN (bewusst ausserhalb des Umfangs)
  Artenkatalog, Vorlagen, Chat, Bewertungen, Zahlungsabwicklung, Onboarding-Tour,
  Benachrichtigungen, Abstammungsbaum, QR-Codes, Light Theme.
```

---

## 2. Prompt 1 · Fundament, UI-Kit und Login/Register

**Ziel:** Palette, Typografie und Komponenten stehen fest, bevor ein einziger Screen entsteht. Login und Register sind die kleinsten Screens und eignen sich, um Buttons, Felder und Abstände zum ersten Mal in Kombination zu sehen.

```
Erstelle eine Design-Canvas mit vier Artboards nebeneinander fuer die App
"Coralkeeper". Verwende das folgende Designsystem verbindlich:

[HIER BAUSTEIN A EINFUEGEN]

ARTBOARD 1 - "Fundament" (1000 x 1400)
Ein Style-Tile, kein Screen. Zeige untereinander in klar getrennten Abschnitten:
- Farbpalette: jede Farbe als 72x72-Feld mit Hex-Wert, Name und
  Verwendungszweck als Text darunter. Gruppiert nach Flaechen, Text, Akzent,
  Status.
- Typografie: alle sechs Stufen mit deutschem Beispieltext, daneben Groesse,
  Zeilenhoehe und Verwendung ("H1 20/28 - Seitentitel").
- Abstandsskala 4 bis 32 als Balken mit Zahl.
- Eckenradien und die vier Statusfarben als Badge-Beispiele, jeweils Punkt +
  Text: "im Bestand" #3FBF3F Grasgruen, "zur Abgabe" #EC3FB0 Magenta,
  "abgegeben" #93A4BC Grau, "verendet" #FF4438 Feuerwehrrot. Zeige diese vier
  Badges zusaetzlich auf der Kartenflaeche #141E2E, damit der Kontrast im
  echten Umfeld pruefbar ist.

ARTBOARD 2 - "UI-Kit" (1000 x 1600)
Das Komponenteninventar, aus dem alle folgenden Screens gebaut werden. Zeige
jede Komponente in ihren Zustaenden, beschriftet:
- Button primaer, sekundaer (Outline), Ghost, destruktiv - je Normal, Gedrueckt,
  Deaktiviert, Ladend. Hoehe 48, Radius 10, volle Breite und Inline-Variante.
- Eingabefeld: Label darueber, Hilfetext darunter, Fehlerzustand mit Rahmen in
  #F2685E und Feldfehlertext "Bitte ein Becken auswaehlen", Fokuszustand mit
  2px-Ring in #FF7A59, deaktiviert.
- Auswahlfeld (Select) geschlossen und offen mit drei Optionen.
- Datumsfeld mit deutschem Format 12.03.2026.
- Segmentierte Auswahl mit drei Optionen "gering / mittel / hoch".
- Filter-Chip: inaktiv, aktiv, aktiv mit Entfernen-Kreuz.
- Karte (Listeneintrag) und Kachel (Bild oben, Titel, Beckenbadge, Status).
- Tab-Leiste mit drei Tabs, einer aktiv, Unterstreichung in #FF7A59.
- Bottom-Navigation, 4 Eintraege, einer aktiv.
- Bestaetigungsdialog in klein.
- Toast: Erfolg und Fehler.
- Skeleton-Platzhalter fuer Kachel und Listenzeile.
- Leerzustand-Baustein: Symbol, Ueberschrift, ein Satz Erklaerung, primaere
  Aktion.
Beschrifte jede Komponente mit ihrem shadcn/ui-Namen in Caption-Groesse darunter
(Button, Input, Select, Tabs, Card, Badge, Dialog, Sonner, Skeleton ...).

ARTBOARD 3 - "Anmeldung" (390 x 844)
Vertikal zentriert, Seitenrand 16, keine Bottom-Navigation:
- Wortmarke "Coralkeeper" in Display-Groesse, darunter in Text sekundaer
  "Deine Korallen im Blick".
- Feld "E-Mail" mit sichtbarem Label, Feld "Passwort" mit der Aktion "Anzeigen"
  als Text rechts im Feld (kein reines Augensymbol).
- Primaerbutton "Anmelden", volle Breite, 48 hoch.
- Textlink "Passwort vergessen?" zentriert.
- Trennlinie, darunter "Noch kein Konto?" mit sekundaerem Button "Registrieren",
  volle Breite.
- Oberhalb der Felder ein Fehler-Banner: "E-Mail oder Passwort ist falsch."

ARTBOARD 4 - "Registrierung" (390 x 844)
Gleicher Aufbau wie Artboard 3, mit:
- Titel "Konto anlegen", Untertitel "Du kannst dich sofort anmelden - keine
  E-Mail-Bestaetigung noetig."
- Felder: Anzeigename*, E-Mail*, Passwort* mit Hilfetext "Mindestens 8 Zeichen".
- Primaerbutton "Konto anlegen", darunter Textlink "Ich habe schon ein Konto".
- Fusszeile in Caption-Groesse: "Abschlussprojekt, kein Produktivsystem."

Ordne die Artboards in einer Reihe an und beschrifte jedes mit seinem Namen.
```

---

## 3. Prompt 2 · Bestand (Startseite) mit Leerzustand

**Ziel:** Der schwierigste Screen des Projekts. Nicht die gefüllte Liste ist die Herausforderung, sondern der geführte Erstlauf: Ohne Becken darf keine Koralle anlegbar sein, und der Nutzer muss trotzdem sofort wissen, was zu tun ist (FR-1.15).

```
Erweitere die bestehende Canvas um drei Artboards (je 390 x 844) fuer den
Bestands-Screen von Coralkeeper. Verwende exakt die Farben, Typografie und
Komponenten aus den Artboards "Fundament" und "UI-Kit".

Gemeinsam fuer alle drei Artboards:
- Kopfzeile 56 hoch: links Titel "Bestand", rechts ein Ghost-Button mit Icon
  UND Text "Filter".
- Fixe Bottom-Navigation unten, "Bestand" aktiv.
- Ueber der Bottom-Navigation ein erweiterter FAB (Pill, 48 hoch) mit Plus-Icon
  und Text "Koralle", rechtsbuendig, 16 Abstand zum Rand.

ARTBOARD 5 - "Bestand - leer, kein Becken"
Der gefuehrte Erstlauf. Die Korallenanlage ist hier NICHT moeglich:
- Der erweiterte FAB fehlt in diesem Zustand ganz.
- Zentriert im Inhaltsbereich der Leerzustand-Baustein:
  Symbol (Aquarium-Umriss), Ueberschrift "Lege zuerst ein Becken an",
  Erklaerung "Jede Koralle gehoert zu einem Becken. Ohne Becken kann es keinen
  Bestand geben.", Primaerbutton "Becken anlegen", volle Breite, 48 hoch.
- Kein Suchfeld, keine Filterleiste in diesem Zustand.

ARTBOARD 6 - "Bestand - gefuellt"
- Unter der Kopfzeile ein Suchfeld ueber die volle Breite mit Lupensymbol und
  Placeholder "Bezeichnung, Handelsname, Notiz".
- Darunter eine horizontal scrollbare Chip-Leiste:
  "Alle Becken" (aktiv), "Riffbecken 250 l", "Ablegerbecken 60 l",
  "Status: alle", "Sortieren: Bezeichnung A-Z". Chips immer mit Textlabel; das
  letzte Chip zeigt durch ein kleines Chevron, dass es ein Menue oeffnet.
- Ergebniszeile in Caption: "6 Korallen".
- Zweispaltiges Kachelraster, Abstand 12, 6 Kacheln. Jede Kachel: quadratische
  Bildflaeche als farbiger Platzhalter mit Bildsymbol, darunter Bezeichnung
  (maximal zwei Zeilen, dann Auslassungszeichen), darunter eine Zeile mit
  Becken-Badge und Statuspunkt + Statustext. Inhalte in dieser Reihenfolge:
  1. Acropora tenuis "Green Slimer" - Riffbecken 250 l - im Bestand
  2. Euphyllia paradivisa "Gold Torch" - Riffbecken 250 l - im Bestand
  3. Montipora digitata "Forest Fire" - Ablegerbecken 60 l - zur Abgabe
  4. Stylophora pistillata "Milka" - Ablegerbecken 60 l - zur Abgabe
  5. Zoanthus sp. "Rasta" - Riffbecken 250 l - abgegeben
  6. Duncanopsammia axifuga "Duncan" - Riffbecken 250 l - verendet
- Die untere Kachelreihe wird vom Bildrand angeschnitten, damit erkennbar ist,
  dass die Liste scrollt.

ARTBOARD 7 - "Bestand - laedt"
Identisch zu Artboard 6, aber Suchfeld und Chips in Ruhe und das Kachelraster
durch sechs Skeleton-Kacheln ersetzt (Bildflaeche, zwei Textbalken
unterschiedlicher Laenge). Keine Spinner-Kreise.

Setze neben Artboard 5 eine kurze Notiz: "FR-1.15 gefuehrter Erstlauf - ohne
Becken keine Korallenanlage".
```

---

## 4. Prompt 3 · Koralle anlegen (das Formularmuster)

**Ziel:** Aus diesem einen Screen leiten sich alle weiteren Formulare ab (Becken, Ableger, Inserat, Messwert, Profil). Hier ist Sorgfalt am besten investiert: Feldabstände, Pflichtfeldkennzeichnung, Fehlerdarstellung, Speicherleiste. NFR-1.1 verlangt maximal fünf Pflichteingaben – dieser Screen hat zwei.

```
Erweitere die Canvas um drei Artboards (je 390 x 844) fuer das Formularmuster
von Coralkeeper. Es ist die Vorlage fuer alle weiteren Formulare der App -
gestalte Abstaende und Zustaende entsprechend sorgfaeltig.

Gemeinsam:
- Kopfzeile 56 hoch: links Zurueck-Pfeil MIT Text "Zurueck", mittig Titel
  "Koralle anlegen".
- Keine Bottom-Navigation (das Formular ist ein modaler Vorgang).
- Fixe Fussleiste 72 hoch, Flaeche #141E2E mit Oberrahmen: Primaerbutton
  "Speichern", volle Breite, 48 hoch. Darueber im Inhalt der Textlink
  "Abbrechen", zentriert.
- Hinweiszeile unter der Kopfzeile in Caption: "* Pflichtfeld".
- Feldabstand 16, Abschnittsabstand 24.

ARTBOARD 8 - "Koralle anlegen - leer"
Abschnitt "Grunddaten":
  - "Bezeichnung *" - Textfeld, Hilfetext "Wie du diese Koralle nennst".
  - "Becken *" - Select mit den Optionen "Riffbecken 250 l" und
    "Ablegerbecken 60 l".
  - "Art" - Textfeld, Hilfetext "z. B. Acropora tenuis", optional.
  - "Handelsname / Morphe" - Textfeld, optional.
  - "Erwerbsdatum" - Datumsfeld im Format 12.03.2026, optional.
Abschnitt "Bild":
  - Upload-Flaeche 100 hoch, gestrichelter Rahmen, Bildsymbol, Text
    "Foto auswaehlen", darunter Caption "JPG oder PNG, maximal 5 MB".
Abschnitt "Steckbrief (optional)" als eingeklapptes Accordion mit dem Zusatz
  "Kannst du auch spaeter ausfuellen". Eingeklappt lassen - so bleibt sichtbar,
  dass nur zwei Pflichtfelder auszufuellen sind.

ARTBOARD 9 - "Koralle anlegen - Fehler und ausgefuellt"
Gleicher Screen, aber:
  - "Bezeichnung *" gefuellt mit: Acropora tenuis "Green Slimer".
  - "Becken *" leer und im Fehlerzustand: Rahmen #F2685E, darunter der
    Feldfehler "Bitte ein Becken auswaehlen."
  - Fehler-Banner oben im Inhalt: "Bitte pruefe die markierten Felder."
  - "Art" gefuellt mit "Acropora tenuis"; die Bildflaeche zeigt eine ausgewaehlte
    Vorschau mit Dateiname und Textbutton "Entfernen".
  - Das Accordion "Steckbrief (optional)" ist aufgeklappt und zeigt:
    Lichtbedarf, Stroemung, Nesselkraft und Schwierigkeitsgrad jeweils als
    segmentierte Auswahl "gering / mittel / hoch"; Platzierung als
    "unten / mitte / oben"; Wuchsform als Select; "Fuetterung" und
    "Besonderheiten" als mehrzeilige Textfelder. Alle diese Felder ohne Stern.

ARTBOARD 10 - "Bestaetigungsdialog Loeschen" (390 x 844)
Ein zentrierter Dialog ueber einem abgedunkelten Bestands-Screen:
  - Titel "Koralle loeschen?"
  - Text: Acropora tenuis "Green Slimer" wird dauerhaft geloescht. Bereits
    erzeugte Ableger bleiben erhalten. Das laesst sich nicht rueckgaengig machen.
  - Buttons untereinander, beide volle Breite und 48 hoch: oben destruktiv
    "Loeschen", darunter sekundaer "Abbrechen".
Dieser Dialog ist das Muster fuer jede loeschende Aktion der App.
```

---

## 5. Prompt 4 · Korallen-Detail mit Tabs

**Ziel:** Das erste Tab-Muster und die Steckbrief-Symbolik. Hier wird die Regel „kein Icon ohne Text" auf die Probe gestellt, denn die Steckbriefwerte sind der eigentliche Grund für Symbole (FR-2.3). Außerdem muss sichtbar werden, dass Historieneinträge unveränderlich sind (FR-3.3).

```
Erweitere die Canvas um zwei Artboards (je 390 x 900) fuer die Detailansicht
einer Koralle in Coralkeeper.

Gemeinsamer Kopf beider Artboards:
- Kopfzeile 56: Zurueck-Pfeil mit Text "Zurueck", rechts ein Ghost-Button mit
  Icon und Text "Mehr" (oeffnet Bearbeiten / Status aendern / Loeschen).
- Heldenbild im Verhaeltnis 16:9 als farbiger Platzhalter mit Bildsymbol. Oben
  rechts im Bild ein Status-Badge "im Bestand" (Punkt + Text).
- Darunter Titel: Acropora tenuis "Green Slimer" (H1), darunter in Text
  sekundaer "Acropora tenuis · Riffbecken 250 l · seit 12.03.2026".
- Aktionsleiste: zwei nebeneinanderliegende sekundaere Buttons gleicher Breite,
  je 48 hoch: "Ableger erzeugen" und "Inserieren".
- Tab-Leiste mit zwei Tabs: "Steckbrief" und "Historie", aktiver Tab
  unterstrichen in #FF7A59.
- Bottom-Navigation unten, "Bestand" aktiv.

ARTBOARD 11 - "Korallen-Detail - Steckbrief" (Tab "Steckbrief" aktiv)
- Zweispaltiges Raster aus Attribut-Karten, Abstand 12. Jede Karte enthaelt
  untereinander: Icon (24), Feldname in Label-Groesse, Wert in Body-Groesse.
  Nie nur das Icon. Inhalte:
    Lichtbedarf - hoch          (Sonnen-Icon)
    Stroemung - hoch            (Wellen-Icon)
    Platzierung - oben          (Pfeil-nach-oben-Icon)
    Nesselkraft - gering        (Blitz-Icon)
    Wuchsform - verzweigt       (Verzweigungs-Icon)
    Schwierigkeitsgrad - hoch   (Tacho-Icon)
- Eine Karte MUSS den Leerfall zeigen: "Fuetterung - keine Angabe" in Text
  gedaempft #6B7C93, dazu ein Textlink "Ergaenzen".
- Darunter eine Karte ueber die volle Breite "Schutzstatus" mit dem Wert
  "CITES II" und einem Hinweisfeld mit Info-Icon: "Eigenangabe des Nutzers,
  keine Rechtsauskunft."
- Ganz unten ein Accordion "Legende: Was bedeuten die Symbole?" - zeige es
  AUFGEKLAPPT mit einer Liste aus Icon + Symbolname + einem erklaerenden Satz
  je Zeile.

ARTBOARD 12 - "Korallen-Detail - Historie" (Tab "Historie" aktiv)
- Direkt unter der Tab-Leiste eine Hinweiszeile mit Schloss-Icon und Text:
  "Eintraege sind Nachweis und koennen nicht geaendert oder geloescht werden."
- Primaerbutton "Journaleintrag hinzufuegen", volle Breite.
- Chronologische Liste, neueste zuerst, als vertikale Zeitachse mit Punkt und
  Verbindungslinie links. Jeder Eintrag: Datum in Caption, Typ-Badge, Text in
  Body. Typ-Badges: "System" (gedaempft), "Journal" (Akzent sekundaer),
  "Abgabe" (Akzent primaer). Eintraege:
    04.09.2026 - System  - Status geaendert auf "zur Abgabe"
    28.08.2026 - Journal - "Polypenbild deutlich besser seit dem Umsetzen an die
                 obere Riffkante. Die blauen Spitzen kommen durch."
    15.08.2026 - System  - Ableger erzeugt: Green Slimer #2
    12.03.2026 - System  - Koralle angelegt, Becken "Riffbecken 250 l"
- Kein Bearbeiten- und kein Loeschen-Symbol an den Eintraegen. Das ist Absicht
  und muss im Screen sichtbar bleiben.
```

---

## 6. Prompt 5 · Beckendetail / Diary mit drei Tabs

**Ziel:** Das zweite Tab-Muster, mit einer wichtigen Besonderheit: Diary-Einträge sind – anders als die Historie – bearbeitbar und löschbar (FR-5.10). Dieser Unterschied muss auf den ersten Blick erkennbar sein.

```
Erweitere die Canvas um drei Artboards (je 390 x 900) fuer das Beckendetail mit
dem Diary von Coralkeeper.

Gemeinsam fuer alle drei:
- Kopfzeile 56: Zurueck mit Text, Titel "Riffbecken 250 l", rechts Ghost-Button
  mit Icon und Text "Mehr".
- Kopfbereich: H1 "Riffbecken 250 l", darunter in Text sekundaer
  "250 l · in Betrieb seit 01.02.2024 · 24 Korallen".
- Tab-Leiste mit drei Tabs: "Werte" · "Verlauf" · "Ereignisse".
- Erweiterter FAB ueber der Bottom-Navigation mit Plus-Icon und Text "Eintrag".
- Bottom-Navigation unten, "Diary" aktiv.

ARTBOARD 13 - "Diary - Werte" (Tab "Werte" aktiv)
- Oben eine Karte "Letzte Messung · 02.09.2026" mit einem dreispaltigen Raster
  kompakter Wertekacheln: Parametername in Label-Groesse oben, Wert mit Einheit
  in H2 darunter, tabellarische Ziffern:
    KH 8,1 dKH · Ca 420 mg/l · Mg 1.350 mg/l
    NO3 2,5 mg/l · PO4 0,04 mg/l · Temperatur 25,4 Grad C
  Darunter ueber die volle Breite "Salinitaet 35,0 PSU".
- Abschnittsueberschrift "Alle Messungen", darunter vier Messungs-Karten
  (02.09.2026, 26.08.2026, 19.08.2026, 12.08.2026). Jede Karte: Datum als
  Kartentitel, darunter die Werte als kompakte, umbrechende Textzeile
  ("KH 8,1 · Ca 420 · Mg 1.350 · NO3 2,5 · PO4 0,04 · 25,4 Grad C"), darunter
  eine Aktionszeile mit den Textbuttons "Bearbeiten" und "Loeschen", jeweils
  mindestens 44 px hoch und als Text ausgeschrieben.
  Diese sichtbaren Aktionen sind der bewusste Unterschied zur Korallenhistorie.

ARTBOARD 14 - "Diary - Verlauf" (Tab "Verlauf" aktiv)
- Horizontal scrollbare Chip-Leiste zur Parameterauswahl:
  "KH" (aktiv) · "Ca" · "Mg" · "NO3" · "PO4" · "Temperatur" · "Salinitaet".
- Segmentierte Auswahl fuer den Zeitraum: "30 Tage" (aktiv) / "90 Tage" /
  "Gesamt".
- Ein Liniendiagramm, Hoehe etwa 240, Linie in #2DD4BF, Achsen und Gitternetz
  in #2A3A50. Y-Achse beschriftet von 7,0 bis 9,0 dKH, X-Achse mit vier
  Datumsmarken 05.08. / 12.08. / 19.08. / 26.08., Datenpunkte als kleine Kreise,
  leicht schwankende Kurve mit einem sichtbaren Einbruch. Ueber dem Diagramm
  links "KH · letzte 30 Tage" und rechts "Durchschnitt 8,0 dKH".
- Unter dem Diagramm eine Caption "Basis: 9 Messungen".

ARTBOARD 15 - "Diary - Ereignisse" (Tab "Ereignisse" aktiv)
- Filter-Chips: "Alle" (aktiv) · "Wasserwechsel" · "Ereignis".
- Liste gemischter Eintraege, neueste zuerst, jeweils als Karte mit Typ-Badge,
  Datum, Text und den Textbuttons "Bearbeiten" / "Loeschen":
    02.09.2026 - Wasserwechsel - 40 l gewechselt - Notiz "Salz neu angesetzt"
    29.08.2026 - Ereignis - Typ "Vernesselung" - "Die Euphyllia hat die
                 Montipora an der linken Flanke angenesselt." - betroffene
                 Koralle als klickbarer Chip: Montipora digitata "Forest Fire"
    21.08.2026 - Wasserwechsel - 40 l gewechselt
    14.08.2026 - Ereignis - Typ "Schaedling" - "Roter Planarienbefall im
                 Ablegerbecken entdeckt."
```

---

## 7. Prompt 6 *(optional)* · Desktop-Adaption

**Ziel:** Nur ausführen, wenn die Timebox es hergibt. Er beantwortet die eine Frage, die Mobile-First offen lässt: Was passiert mit der Bottom-Navigation auf einem breiten Bildschirm (NFR-1.6)?

```
Erweitere die Canvas um zwei Artboards (je 1280 x 900) mit der Desktop-Fassung
von Coralkeeper. Gleiche Farben, Typografie und Komponenten wie bisher.

Regel fuer die Adaption: Aus der Bottom-Navigation wird eine feste linke
Seitenleiste, 240 breit, mit denselben vier Eintraegen (Icon + Text) und der
Wortmarke oben. Der Inhalt bekommt eine maximale Breite von 1040 und wird
zentriert. Keine neuen Funktionen, keine anderen Inhalte - nur Umverteilung.

ARTBOARD 16 - "Desktop - Bestand": Kachelraster mit vier Spalten, Suchfeld und
Filterleiste nebeneinander in einer Zeile, Primaerbutton "Koralle anlegen" oben
rechts statt als FAB.

ARTBOARD 17 - "Desktop - Korallen-Detail": zweispaltig - links in einer Spalte
von 400 das Heldenbild und die Stammdaten, rechts die Tabs mit dem
Steckbrief-Raster in drei Spalten.
```

---

## 8. Design-Review-Checkliste (nach jedem Prompt anwenden)

Jede Zeile ist aus einer Anforderung abgeleitet. Was hier durchfällt, geht in die nächste Iteration – nicht in die Umsetzung.

| # | Prüfung | Quelle |
| --- | --- | --- |
| 1 | Kein Icon steht ohne Textlabel – auch nicht in der Bottom-Navigation, auch nicht beim FAB. | NFR-1.4 |
| 2 | Jede tippbare Fläche ist mindestens 44 px hoch. Besonders prüfen: „Bearbeiten"/„Löschen" in Diary-Karten, Chips, Tabs. | NFR-1.3 |
| 3 | Nichts erscheint erst bei Hover. | NFR-1.3 |
| 4 | Das Layout hält 360 px aus: keine feste Breite, die das zweispaltige Raster sprengt. | NFR-1.6 |
| 5 | Jedes Feld hat ein sichtbares Label über dem Feld; Placeholder nennen nur Beispiele. | NFR-1.4 |
| 6 | Datums- und Zahlenformat durchgängig de-DE (12.03.2026 · 8,1 · 1.350). | NFR-1.5 |
| 7 | Alle Beschriftungen deutsch und in Klartext, keine unerklärten Kürzel. | NFR-1.8 |
| 8 | „Koralle anlegen" zeigt höchstens zwei Pflichtfelder, der Steckbrief ist eingeklappt. | NFR-1.1 |
| 9 | Jeder Screen führt die nächste sinnvolle Aktion sichtbar mit. | NFR-1.7 |
| 10 | Der leere Bestand ohne Becken bietet keine Korallenanlage an. | FR-1.15 |
| 11 | Historieneinträge zeigen keine Bearbeiten-/Löschen-Aktion; Diary-Einträge zeigen sie deutlich. | FR-3.3 vs. FR-5.10 |
| 12 | Mindestens ein Steckbriefwert steht als „keine Angabe", nicht leer. | FR-2.3 |
| 13 | Die Symbol-Legende ist auf der Detailseite vorhanden. | FR-2.3 |
| 14 | Der Hinweis „Eigenangabe, keine Rechtsauskunft" steht beim Schutzstatus. | FR-2.4 |
| 15 | Es existiert genau ein Muster für Bestätigungsdialoge beim Löschen. | FR-6.5 |
| 16 | Lade-, Leer- und Fehlerzustand sind für mindestens je einen Screen gestaltet. | FR-6.4 |
| 17 | Kein Screen zeigt Could-Features (Abstammungsbaum, QR-Code, Chat, Bewertungen). | Abschnitt 1.2 |
| 18 | Kontrast geprüft: Text sekundär #93A4BC auf Karte #141E2E, Text auf Akzent #FF7A59, alle vier Statusfarben auf #141E2E. | NFR-1.4 |
| 19 | „verendet" #FF4438 und der Akzent #FF7A59 stehen nie ohne Textlabel nebeneinander – sie sind rein farblich schwer zu trennen. | NFR-1.4 |

---

## 9. Was nach MS-1 vorliegen muss

Aus `Milestones.md`, Definition of Done für MS-1. Die Prompts decken die ersten vier Punkte ab, der fünfte ist Handarbeit:

- [x] Fünf ★-Screens gestaltet → P1 (Login/Register), P2 (Bestand), P3 (Koralle anlegen), P4 (Detail), P5 (Diary)
- [x] Bottom-Navigation festgelegt → Baustein A, in jedem Screen sichtbar
- [x] Farbschema und Typografie → P1, Artboard „Fundament"
- [x] Komponenteninventar → P1, Artboard „UI-Kit", mit shadcn-Namen beschriftet
- [ ] **10–20 Korallenfotos zusammenstellen** – nicht durch Claude Design abgedeckt. Eigene oder frei lizenzierte Bilder, Quadratformat, später Demo-Daten nach NFR-4.5.

Danach: Artboards als PNG für die Abgabedokumentation exportieren und in MS-4 die statische UI-Shell in React + shadcn/ui direkt aus dem UI-Kit-Artboard aufbauen.

---

## 10. Designentscheidungen, die dieses Dokument trifft

Die Anforderungsanalyse lässt diese Punkte bewusst offen; sie werden hier entschieden, damit die Prompts eindeutig sind. Bei Bedarf im Baustein A ändern – dann gilt die Änderung für alle Prompts.

| Entscheidung | Begründung |
| --- | --- |
| Statusfarben: Grasgrün #3FBF3F, Magenta #EC3FB0, Grau #93A4BC, Feuerwehrrot #FF4438 | Vorgabe des Auftraggebers. Die reinen Töne (#00FF00, #FF00FF, RAL 3000 #AF2B1E) sind auf der dunklen Kartenfläche entweder blendend oder zu dunkel für WCAG AA – die hier gesetzten Werte sind minimal angepasste Varianten derselben Farben und liegen bei 4,7:1 bis 6,7:1 Kontrast. Sie gelten ausschließlich für den Status, damit die Statuslogik eindeutig lesbar bleibt. |
| Warmes Korallenorange #FF7A59 als einzige Akzentfarbe | NFR-1.3 nennt Blaulicht als Nutzungskontext. Blaue oder türkise Akzente verlieren dort ihre Signalwirkung, warme Töne nicht. Türkis bleibt zweite Farbe für Diagramme, wo es nur um Unterscheidung geht. |
| Nur ein Dark Theme, kein Light Theme | NFR-1.3 nennt Dark als Standard. Ein zweites Theme kostet Zeit im Design und in jedem Screen der Umsetzung, ohne eine Anforderung zu erfüllen. |
| Erweiterter FAB mit Text statt rundem Plus-Button | Ein rundes Plus-Icon ohne Text verstößt gegen NFR-1.4. Die Pill-Form löst das, ohne den Bedienkomfort zu verlieren. |
| Bottom-Navigation entfällt in Formularen | Ein Formular ist ein abzuschließender Vorgang. Navigation daneben lädt zum Datenverlust ein; „Zurück" und „Abbrechen" sind die richtigen Ausgänge. |
| Steckbrief im Anlageformular eingeklappt | NFR-1.1 verlangt Neuanlage in 60 Sekunden. Aufgeklappt wirken die optionalen Felder wie Pflicht und bremsen genau das aus. |
| Keine Schatten, Ebenen über Flächenhelligkeit | Auf dunklem Grund sind Schatten wirkungslos. Helligkeitsstufen sind billiger in der Umsetzung und in Tailwind mit zwei Tokens erledigt. |
| Diary-Aktionen als sichtbare Textbuttons, nicht als Swipe | Swipe ist eine versteckte Geste (Konflikt mit NFR-1.3) und mit feuchten Händen unzuverlässig. Zugleich macht der sichtbare Unterschied zur Historie FR-3.3 im Mockup überprüfbar. |