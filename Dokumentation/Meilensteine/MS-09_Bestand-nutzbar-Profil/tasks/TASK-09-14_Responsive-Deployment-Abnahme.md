# TASK-09-14 · Responsive prüfen, deployen und am deployten Stand abnehmen

**Status:** offen
**Bezug:** Definition of Done MS-9 (aus TASK-09-01) · FR-1.3 bis FR-1.6, FR-1.9 bis FR-1.11, FR-2.3, FR-2.4, FR-6.8 ·
FR-6.2, FR-6.4, FR-6.5, FR-6.6 · NFR-1.3 bis NFR-1.7, NFR-2.2, NFR-2.3, NFR-2.5, NFR-3.1
**Voraussetzung:** TASK-09-01 bis 09-13

---

## Worum geht es

Alle neuen und geänderten Screens werden gemeinsam gegen die immer mitgeltenden Anforderungen geprüft, dann deployt.
MS-9 ist fertig, wenn die Definition of Done auf der GitHub-Pages-Adresse funktioniert.

## Schritte

### A · Querschnittsprüfung (lokal, Build-Stand mit `npm run build` und `npm run preview`)

1. [ ] Bestand mit Filtern und Suche, Detailseite, Bearbeiten, Statuswechsel, Steckbrief-Formular, Löschdialog, Profil
       und Profil bearbeiten bei **360 px**, **390 px** und Desktop-Breite: kein waagerechtes Scrollen, nichts
       abgeschnitten, lange Texte umbrechen (NFR-1.6)
2. [ ] Trefferflächen ≥ 44 × 44 px, auch Filterchips, Lupe, Statusauswahl, Bildauswahl und Dialog-Buttons (NFR-1.3)
3. [ ] Kein Symbol ohne Text außer der Lupe, jedes Feld mit sichtbarem Label, Status nie nur über die Farbe (NFR-1.4)
4. [ ] Kontrast mit DevTools oder Lighthouse, mindestens WCAG 2.1 AA (NFR-1.4)
5. [ ] Alles nur mit der Tastatur bedienbar, Fokus immer sichtbar; Legende auf- und zuklappbar
6. [ ] UI-Texte deutsch, Datum `TT.MM.JJJJ` (NFR-1.5, NFR-1.8)
7. [ ] Vom Bestand aus Bearbeiten, Statuswechsel und Profil in höchstens drei Interaktionen erreichbar (NFR-1.2)

### B · Deployment

8. [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler.
9. [ ] Auf `main` pushen (Nutzer), im Reiter „Actions" prüfen, dass der Lauf grün ist.

### C · Abnahme am deployten Stand

10. [ ] Protokoll unten auf der GitHub-Pages-Adresse durchspielen, einmal davon auf einem echten Smartphone.
11. [ ] TASK-09-01 bis 09-14 in [`../Tasks.md`](../Tasks.md) abhaken, ✅ für MS-9 in `Milestones.md`.

## Abnahmeprotokoll

Datum: … · Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Test                                                                   | Erwartet                                                                      | Ergebnis |
| --- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| 1   | Bestand öffnen                                                         | Kacheln mit Bild bzw. Platzhalter, Statusrahmen, Status als Text, Legende, Anzahl (FR-1.3) |          |
| 2   | Koralle mit einem JPEG um 3 MB anlegen                                 | Bild in Kachel und Detailseite, Datei im Bucket unverändert groß (NFR-2.5)     |          |
| 3   | Bild über 5 MB wählen                                                  | Feldfehler, kein Upload (NFR-2.5)                                              |          |
| 4   | Filterchip „Archiv", Becken- und Art-Filter, Sortierung nach Erwerbsdatum | passende Auswahl, Anzahl „x von y" (FR-1.4)                                 |          |
| 5   | Suche nach einem Teil des Handelsnamens; Suche ohne Treffer            | Treffer bzw. Leerzustand mit „Filter zurücksetzen" (FR-1.5, FR-6.4)            |          |
| 6   | Koralle bearbeiten, Becken wechseln                                    | Werte geändert, Systemeintrag zum Beckenwechsel in der Historie (FR-1.10, FR-1.11) |      |
| 7   | Status auf „Verendet" mit Notiz                                        | Systemeintrag und Journaleintrag, Plakette und Rahmen rot (FR-1.9)            |          |
| 8   | Statuswechsel bei inserierter Koralle                                  | nach Entscheidung aus TASK-09-01 (Hinweis statt Formular)                      |          |
| 9   | Steckbrief ansehen und Schutzstatus setzen                             | Symbole mit Text, Legende, „keine Angabe", Hinweis „Eigenangabe" (FR-2.3, FR-2.4) |       |
| 10  | Ursprungskoralle mit Ableger und Bild löschen, erst abbrechen, dann bestätigen | nach Abbrechen da, danach weg; Ableger bleibt; Ordner im Bucket leer (FR-1.10, FR-6.5) | |
| 11  | Koralle mit Inserat löschen                                            | gelöscht, kein Fehler                                                          |          |
| 12  | Profil ändern, abmelden, anmelden                                      | Änderungen erhalten (FR-6.8)                                                   |          |
| 13  | Als B: `/koralle/<ID von A>/bearbeiten` und `/status`                  | „Koralle nicht gefunden." (FR-6.2)                                             |          |
| 14  | Als B: Bildpfad von A abrufen (falls nicht in TASK-09-03 nachgewiesen) | kein Zugriff (NFR-3.1)                                                         |          |
| 15  | Neue Seiten neu laden (F5)                                             | Seite erscheint erneut, kein 404                                               |          |
| 16  | Ohne Verbindung speichern bzw. löschen                                 | deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)                       |          |
| 17  | Ansicht bei 360 px                                                     | kein waagerechtes Scrollen, alles bedienbar                                    |          |

## Fertig, wenn

- [ ] Alle Punkte aus A sind geprüft
- [ ] Der Deploy-Lauf ist grün
- [ ] Das Abnahmeprotokoll ist vollständig und alle Tests sind bestanden
- [ ] **Definition of Done MS-9** (Wortlaut aus TASK-09-01) ist am deployten Stand erfüllt

## Hinweise

- Datumsfeld ohne Kalender in der Responsive-Ansicht von Firefox ist eine Eigenheit der DevTools, kein Fehler der App.
- Den Fehlerzustand prüft man im Network-Tab mit „Block request URL"; das DevTools-Offline hat beim Nutzer nicht
  zuverlässig gegriffen.
- Das Protokoll passt sich den Entscheidungen an – fällt z. B. die Inserat-Sperre anders aus, Zeile 8 anpassen.

## Quellen

- [`../MS-09_Bestand-nutzbar-Profil.md`](../MS-09_Bestand-nutzbar-Profil.md) – Immer mitgeltend, Definition of Done
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR- und NFR-IDs aus dem Bezug
- `design.md` – Abschnitt 5 (Harte Regeln)
- `Dokumentation/Meilensteine/MS-08_Diary/tasks/TASK-08-09_Responsive-Deployment-Abnahme.md` – Muster
