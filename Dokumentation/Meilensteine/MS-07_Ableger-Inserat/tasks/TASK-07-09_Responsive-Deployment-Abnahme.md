# TASK-07-09 · Responsive prüfen, deployen und am deployten Stand abnehmen

**Status:** offen
**Bezug:** Definition of Done MS-7 · NFR-1.3, NFR-1.4, NFR-1.6, NFR-1.7 · Abnahmekriterien Abschnitt 7 Punkte 7 und 9
**Voraussetzung:** TASK-07-01 bis 07-08

---

## Worum geht es

Alle neuen Screens werden einmal gemeinsam gegen die immer mitgeltenden Anforderungen geprüft, dann deployt.
MS-7 ist fertig, wenn die Definition of Done auf der GitHub-Pages-Adresse funktioniert.

## Schritte

### A · Querschnittsprüfung (lokal, Build-Stand mit `npm run build` und `npm run preview`)

1. [ ] Ableger-Formular, Inserat-Formular, Detailseite mit Status und Inserat-Karte sowie der Dialog „Inserat
       zurückziehen" bei **360 px**, **390 px** und Desktop-Breite: kein waagerechtes Scrollen, nichts abgeschnitten
       (NFR-1.6)
2. [ ] Trefferflächen ≥ 44 × 44 px, auch Auswahlfelder und Dialog-Buttons (NFR-1.3)
3. [ ] Kein Icon ohne Text, jedes Feld mit sichtbarem Label, Status nie nur als Farbe (NFR-1.4)
4. [ ] Kontrast mit DevTools oder Lighthouse, mindestens WCAG 2.1 AA (NFR-1.4)
5. [ ] Ableger erzeugen, inserieren und zurückziehen nur mit der Tastatur bedienbar, Fokus immer sichtbar
6. [ ] Alle UI-Texte deutsch, Datum im de-DE-Format, Modus und Status in Klartext (NFR-1.5, NFR-1.8)

### B · Deployment

7. [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler.
8. [ ] Auf `main` pushen (Nutzer), im Reiter „Actions" prüfen, dass der Lauf grün ist.

### C · Abnahme am deployten Stand

9. [ ] Protokoll unten auf der GitHub-Pages-Adresse durchspielen, einmal davon auf einem echten Smartphone.
10. [ ] TASK-07-01 bis 07-09 in [`../Tasks.md`](../Tasks.md) abhaken.

## Abnahmeprotokoll

Datum: · Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Test                                                                     | Erwartet                                                               | Ergebnis |
| --- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | -------- |
| 1   | Koralle mit ausgefülltem Steckbrief öffnen, „Ableger erzeugen"           | Formular, Becken vorbelegt                                             |          |
| 2   | Ableger in einem anderen Becken speichern                                | Ableger erscheint im Bestand, im gewählten Becken (**Abnahme 7**)      |          |
| 3   | Steckbrief-Tab des Ablegers                                              | Werte wie bei der Ursprungskoralle (FR-1.7)                            |          |
| 4   | Historie von Ableger und Ursprungskoralle                                | Systemeinträge nach TASK-07-01 (FR-3.4)                                |          |
| 5   | Steckbrief des Ablegers ändern                                           | Ursprungskoralle unverändert (Snapshot)                                |          |
| 6   | Ableger inserieren ohne Modus                                            | Feldfehler, kein Inserat                                               |          |
| 7   | Ableger inserieren mit Modus, Preis bzw. Tauschwunsch, Größe             | Status „Zur Abgabe", Inserat-Karte sichtbar (**Abnahme 7**)            |          |
| 8   | Historie des Ablegers                                                    | „Status geändert: Im Bestand → Zur Abgabe"                             |          |
| 9   | Inserat zurückziehen, Dialog bestätigen                                  | Status „Im Bestand", Karte weg, Eintrag in der Historie (FR-4.2)       |          |
| 10  | Erneut inserieren und stehen lassen                                      | Status „Zur Abgabe"                                                    |          |
| 11  | Neue Formularseiten neu laden (F5)                                       | Seite erscheint erneut, kein 404                                       |          |
| 12  | Ohne Verbindung Ableger bzw. Inserat speichern                           | Deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)               |          |
| 13  | Als Testnutzer B anmelden                                                | Keine Becken, keine Korallen von A; Direktaufrufe „nicht gefunden" (**DoD**, **Abnahme 9**) |          |
| 14  | Ansicht bei 360 px Breite                                                | kein waagerechtes Scrollen, alles bedienbar                            |          |

Der Datenbank-Nachweis zur Definition of Done liegt im Protokoll von TASK-07-08.

## Fertig, wenn

- [ ] Alle Punkte aus A sind geprüft
- [ ] Der Deploy-Lauf ist grün
- [ ] Das Abnahmeprotokoll ist vollständig und alle Tests sind bestanden
- [ ] **Definition of Done MS-7:** RLS-Test mit zweitem Testnutzer bestanden (TASK-07-08); B sieht auf dem deployten
      Stand keine Daten von A

## Hinweise

- Datumsfeld ohne Kalender in der Responsive-Ansicht von Firefox ist eine Eigenheit der DevTools, kein Fehler der App.

## Quellen

- [`../MS-07_Ableger-Inserat.md`](../MS-07_Ableger-Inserat.md) – Immer mitgeltend, Definition of Done
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.7, FR-3.4, FR-4.1, FR-4.2, FR-6.2, FR-6.4,
  NFR-1.3 bis NFR-1.8, Abschnitt 7 Punkte 7 und 9
- `design.md` – Abschnitt 5 (Harte Regeln)
