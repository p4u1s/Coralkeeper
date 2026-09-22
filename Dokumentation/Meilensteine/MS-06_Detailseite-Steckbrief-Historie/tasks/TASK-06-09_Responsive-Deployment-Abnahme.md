# TASK-06-09 · Responsive prüfen, deployen und am deployten Stand abnehmen

**Status:** offen
**Bezug:** Definition of Done MS-6 · NFR-1.3, NFR-1.4, NFR-1.6 · Abnahmekriterien Abschnitt 7 Punkte 5 und 6
**Voraussetzung:** TASK-06-01 bis 06-08

---

## Worum geht es

Alle neuen Screens werden einmal gemeinsam gegen die immer mitgeltenden Anforderungen geprüft, dann deployt.
MS-6 ist fertig, wenn die Definition of Done auf der GitHub-Pages-Adresse funktioniert.

## Schritte

### A · Querschnittsprüfung (lokal, Build-Stand mit `npm run build` und `npm run preview`)

1. [ ] Detailseite mit beiden Tabs, Steckbrief-Formular und Journal-Formular bei **360 px**, **390 px** und
       Desktop-Breite: kein waagerechtes Scrollen, nichts abgeschnitten (NFR-1.6)
2. [ ] Trefferflächen ≥ 44 × 44 px, auch Tabs und Auswahlfelder (NFR-1.3)
3. [ ] Kein Icon ohne Text, jedes Feld mit sichtbarem Label (NFR-1.4)
4. [ ] Kontrast mit DevTools oder Lighthouse, mindestens WCAG 2.1 AA (NFR-1.4)
5. [ ] Tabs, Steckbrief speichern und Journaleintrag anlegen nur mit der Tastatur bedienbar, Fokus immer sichtbar
6. [ ] Alle UI-Texte deutsch, Datum im de-DE-Format, Auswahlwerte in Klartext (NFR-1.5, NFR-1.8)

### B · Deployment

7. [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler.
8. [ ] Auf `main` pushen, im Reiter „Actions" prüfen, dass der Lauf grün ist.

### C · Abnahme am deployten Stand

9. [ ] Protokoll unten auf der GitHub-Pages-Adresse durchspielen, einmal davon auf einem echten Smartphone.
10. [ ] TASK-06-01 bis 06-09 in [`../Tasks.md`](../Tasks.md) abhaken.

## Abnahmeprotokoll

Datum: \_\_\_\_ · Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Test                                                                       | Erwartet                                                         | Ergebnis |
| --- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| 1   | Neue Koralle anlegen, Detailseite öffnen                                   | Tabs „Steckbrief" · „Historie" sichtbar                          |          |
| 2   | Steckbrief-Tab der neuen Koralle                                           | Jedes Feld zeigt „keine Angabe" (**Abnahme 5**)                  |          |
| 3   | Steckbrief teilweise ausfüllen, speichern                                  | Werte in Klartext im Tab, übrige Felder „keine Angabe"           |          |
| 4   | Steckbrief erneut ändern, einen Wert auf „keine Angabe" zurücksetzen       | Änderung sichtbar (**FR-2.1**)                                   |          |
| 5   | Historie-Tab der neuen Koralle                                             | Systemeintrag „Koralle angelegt" mit heutigem Datum (**DoD**)    |          |
| 6   | Journaleintrag ohne Text speichern                                         | Feldfehler, kein Eintrag                                         |          |
| 7   | Journaleintrag mit Datum und Text speichern                                | Erscheint in der Historie neben dem Systemeintrag (**Abnahme 6**) |          |
| 8   | Gespeicherten Eintrag ansehen                                              | Keine Aktion zum Ändern oder Löschen (**DoD**, FR-3.3)           |          |
| 9   | Detailseite im Historie-Tab neu laden (F5)                                 | Seite erscheint erneut, kein 404                                 |          |
| 10  | Ohne Verbindung Steckbrief bzw. Journaleintrag speichern                   | Deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)         |          |
| 11  | Als Testnutzer B Formular-Pfade zu `aaaaaaaa-0000-0000-0000-000000000002`  | „nicht gefunden", keine Daten von A (FR-6.2)                     |          |
| 12  | Ansicht bei 360 px Breite                                                  | kein waagerechtes Scrollen, alles bedienbar                      |          |

Der Datenbank-Nachweis zu FR-3.3 liegt im Protokoll von TASK-06-08.

## Fertig, wenn

- [ ] Alle Punkte aus A sind geprüft
- [ ] Der Deploy-Lauf ist grün
- [ ] Das Abnahmeprotokoll ist vollständig und alle Tests sind bestanden
- [ ] **Definition of Done MS-6:** Ein gespeicherter Historieneintrag ist nachweislich weder bearbeitbar noch löschbar
      (TASK-06-08); die Anlage der Koralle steht als Systemeintrag in derselben Historie – auf dem deployten Stand

## Quellen

- [`../MS-06_Detailseite-Steckbrief-Historie.md`](../MS-06_Detailseite-Steckbrief-Historie.md) – Immer mitgeltend,
  Definition of Done
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-2.1, FR-3.3, FR-3.4, FR-3.5, FR-6.2, FR-6.4,
  NFR-1.3 bis NFR-1.8, Abschnitt 7 Punkte 5 und 6
- `design.md` – Abschnitt 5 (Harte Regeln)
