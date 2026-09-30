# TASK-08-09 · Responsive prüfen, deployen und am deployten Stand abnehmen

**Status:** offen
**Bezug:** Definition of Done MS-8 · FR-6.2, FR-6.4, FR-6.5, FR-6.6 · NFR-1.3 bis NFR-1.7 · Abnahmekriterien
Abschnitt 7 Punkte 8 und 9
**Voraussetzung:** TASK-08-01 bis 08-08

---

## Worum geht es

Alle neuen Screens werden einmal gemeinsam gegen die immer mitgeltenden Anforderungen geprüft, dann deployt.
MS-8 ist fertig, wenn die Definition of Done auf der GitHub-Pages-Adresse funktioniert. Danach folgt das
MVP-Gate (MS-08a).

## Schritte

### A · Querschnittsprüfung (lokal, Build-Stand mit `npm run build` und `npm run preview`)

1. [ ] Diary-Übersicht, die drei Anlegen-Formulare, beide Bearbeiten-Seiten und der Löschdialog bei **360 px**,
       **390 px** und Desktop-Breite: kein waagerechtes Scrollen, nichts abgeschnitten, lange Texte umbrechen (NFR-1.6)
2. [ ] Trefferflächen ≥ 44 × 44 px, auch Wertzeilen, Auswahlfelder und Dialog-Buttons (NFR-1.3)
3. [ ] Kein Symbol ohne Text, jedes Feld mit sichtbarem Label (NFR-1.4)
4. [ ] Kontrast mit DevTools oder Lighthouse, mindestens WCAG 2.1 AA (NFR-1.4)
5. [ ] Anlegen, Bearbeiten und Löschen nur mit der Tastatur bedienbar, Fokus immer sichtbar
6. [ ] Alle UI-Texte deutsch, Datum `TT.MM.JJJJ`, Zahlen mit Komma und Tausenderpunkt, Einheiten immer dabei
       (NFR-1.5, NFR-1.8)
7. [ ] Vom Bestand aus jedes Diary-Formular in höchstens drei Interaktionen erreichbar (NFR-1.2)

### B · Deployment

8. [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler.
9. [ ] Auf `main` pushen (Nutzer), im Reiter „Actions" prüfen, dass der Lauf grün ist.

### C · Abnahme am deployten Stand

10. [ ] Protokoll unten auf der GitHub-Pages-Adresse durchspielen, einmal davon auf einem echten Smartphone.
11. [ ] TASK-08-01 bis 08-09 in [`../Tasks.md`](../Tasks.md) abhaken.

## Abnahmeprotokoll

Datum: · Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Test                                                             | Erwartet                                                                 | Ergebnis |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ | -------- |
| 1   | Diary über die Bottom-Navigation öffnen                          | Übersicht mit Anlegen-Buttons, bestehende Einträge nach Datum            |          |
| 2   | Messwerte erfassen ohne Wert                                     | Hinweis, kein Eintrag                                                    |          |
| 3   | Messwerte KH 8,1 und Ca 425 erfassen                             | beide Werte unter dem Datum, `8,1 °dKH` und `425 mg/l` (**Abnahme 8**)   |          |
| 4   | Wasserwechsel mit Menge „30 l" und Notiz                         | Eintrag in der Übersicht (**Abnahme 8**)                                 |          |
| 5   | Ereignis mit Text und betroffener Koralle                        | Eintrag mit Korallenbezeichnung (**Abnahme 8**)                          |          |
| 6   | KH auf 8,4 korrigieren                                           | Übersicht zeigt `8,4 °dKH` (**Abnahme 8**)                               |          |
| 7   | Wasserwechsel löschen, zuerst abbrechen, dann bestätigen         | nach Abbrechen noch da, nach Bestätigen weg (**Abnahme 8**, FR-6.5)      |          |
| 8   | Abmelden, neu anmelden                                           | Einträge unverändert (Abschnitt 7, Einleitung)                           |          |
| 9   | Neue Formularseiten neu laden (F5)                               | Seite erscheint erneut, kein 404                                         |          |
| 10  | Ohne Verbindung speichern bzw. löschen                           | deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)                 |          |
| 11  | Als Testnutzer B: Diary öffnen                                   | keine Einträge von A (**Abnahme 9**)                                     |          |
| 12  | Als B: Bearbeiten-Pfade mit Messwert …08 und Ereignis …09 von A  | „nicht gefunden" (**Abnahme 9**, FR-6.2)                                 |          |
| 13  | Ansicht bei 360 px Breite                                        | kein waagerechtes Scrollen, alles bedienbar                              |          |

Der Datenbank-Nachweis, dass B Messwerte und Ereignisse von A weder lesen noch ändern noch löschen kann, liegt in
TASK-03-05 und – für das Lesen – in TASK-07-08 (Protokollzeile 6).

## Fertig, wenn

- [ ] Alle Punkte aus A sind geprüft
- [ ] Der Deploy-Lauf ist grün
- [ ] Das Abnahmeprotokoll ist vollständig und alle Tests sind bestanden
- [ ] **Definition of Done MS-8:** Messwert, Wasserwechsel und Ereignis lassen sich anlegen, einer korrigieren, einer
      löschen – am deployten Stand

## Hinweise

- Datumsfeld ohne Kalender in der Responsive-Ansicht von Firefox ist eine Eigenheit der DevTools, kein Fehler der App.
- Mit MS-8 ist der MVP-Umfang aus Abschnitt 1.1 vollständig. Das Gate (MS-08a) spielt alle neun Abnahmeschritte am
  deployten Stand durch – kein Ausbau vorher.

## Quellen

- [`../MS-08_Diary.md`](../MS-08_Diary.md) – Immer mitgeltend, Definition of Done
- `Dokumentation/Meilensteine/MS-08a_GATE_MVP-Abnahme.md`
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-5.1, FR-5.3, FR-5.4, FR-5.10, FR-6.2, FR-6.4,
  FR-6.5, NFR-1.2 bis NFR-1.8, Abschnitt 7 Punkte 8 und 9
- `design.md` – Abschnitt 5 (Harte Regeln)
