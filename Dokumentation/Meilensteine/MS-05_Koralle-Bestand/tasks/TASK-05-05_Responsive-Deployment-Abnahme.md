# TASK-05-05 · Responsive prüfen, deployen und am deployten Stand abnehmen

**Status:** offen
**Bezug:** Definition of Done MS-5 · FR-1.1 (Löschsperre jetzt über die UI prüfbar) · FR-6.2 · NFR-1.3, NFR-1.4, NFR-1.6 ·
Abnahmekriterium Abschnitt 7 Punkt 4
**Voraussetzung:** TASK-05-01 bis 05-04

---

## Worum geht es

Alle neuen Screens werden einmal gemeinsam gegen die immer mitgeltenden Anforderungen geprüft, dann deployt.
MS-5 ist fertig, wenn die Definition of Done auf der GitHub-Pages-Adresse funktioniert.

## Schritte

### A · Querschnittsprüfung (lokal, Build-Stand mit `npm run build` und `npm run preview`)

1. [x] Bestand (alle Zustände) und Koralle anlegen bei **360 px**, **390 px** und Desktop-Breite:
       kein waagerechtes Scrollen, nichts abgeschnitten (NFR-1.6)
2. [x] Trefferflächen ≥ 44 × 44 px, auch das Becken-Auswahlfeld (NFR-1.3)
3. [x] Kein Icon ohne Text, jedes Feld mit sichtbarem Label (NFR-1.4)
4. [x] Kontrast mit DevTools oder Lighthouse, mindestens WCAG 2.1 AA (NFR-1.4)
5. [x] Vom Bestand über „Koralle hinzufügen" bis zum Speichern nur mit der Tastatur bedienbar, Fokus immer sichtbar
6. [x] Alle UI-Texte deutsch (NFR-1.5)

### B · Deployment

7. [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler.
8. [ ] Auf `main` pushen, im Reiter „Actions" prüfen, dass der Lauf grün ist.

### C · Abnahme am deployten Stand

9. [ ] Protokoll unten auf der GitHub-Pages-Adresse durchspielen, einmal davon auf einem echten Smartphone.
10. [ ] TASK-05-01 bis 05-05 in [`../Tasks.md`](../Tasks.md) abhaken.

## Abnahmeprotokoll

Datum: \_\_\_\_ · Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Test                                                                  | Erwartet                                                   | Ergebnis |
| --- | --------------------------------------------------------------------- | ---------------------------------------------------------- | -------- |
| 1   | Neuer Nutzer ohne Becken: `…/Coralkeeper/koralle/neu` direkt aufrufen | Kein Formular, Weg zur Beckenanlage (FR-1.15)              |          |
| 2   | Becken anlegen, zurück zum Bestand                                    | „Noch keine Korallen angelegt." mit „Koralle hinzufügen"   |          |
| 3   | „Koralle hinzufügen" antippen                                         | Formular ohne Bottom-Navigation, kein Becken vorgewählt\*  |          |
| 4   | Bezeichnung eingeben, **ohne Becken** speichern                       | Feldfehler unter „Becken", keine Anfrage (**DoD**)         |          |
| 5   | Becken wählen, Bezeichnung leeren, speichern                          | Feldfehler unter „Bezeichnung"                             |          |
| 6   | Koralle nur mit Bezeichnung und Becken speichern                      | Koralle erscheint in der Liste (**DoD**)                   |          |
| 7   | Zweite Koralle mit allen Feldern speichern                            | Erscheint in der Liste mit Art/Handelsname und Beckenname  |          |
| 8   | `…/Coralkeeper/koralle/neu` direkt aufrufen und neu laden (F5)        | Formular erscheint, kein 404                               |          |
| 9   | Becken mit Korallen löschen                                           | Löschen wird verhindert, verständliche Meldung (FR-1.1)    |          |
| 10  | Als Testnutzer B den Bestand öffnen                                   | Keine Korallen von Testnutzer A sichtbar (FR-6.2)          |          |
| 11  | Ohne Verbindung eine Koralle speichern                                | Deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)   |          |
| 12  | Ansicht bei 360 px Breite                                             | kein waagerechtes Scrollen, alles bedienbar                |          |

\* entschieden in TASK-05-02: keine Vorbelegung, erste Option „Becken wählen".

## Fertig, wenn

- [ ] Alle Punkte aus A sind geprüft
- [ ] Der Deploy-Lauf ist grün
- [ ] Das Abnahmeprotokoll ist vollständig und alle Tests sind bestanden
- [ ] **Definition of Done MS-5:** Speichern ohne Becken wird mit einem Feldfehler abgelehnt; angelegte Korallen
      erscheinen in der Liste – auf dem deployten Stand

## Quellen

- [`../MS-05_Koralle-Bestand.md`](../MS-05_Koralle-Bestand.md) – Immer mitgeltend, Definition of Done
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.1, FR-1.15, FR-6.2, FR-6.4, NFR-1.3 bis NFR-1.6,
  Abschnitt 7 Punkt 4
- `design.md` – Abschnitt 5 (Harte Regeln)
