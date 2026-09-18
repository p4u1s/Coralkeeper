# TASK-04-09 · Responsive prüfen, deployen und am deployten Stand abnehmen

**Status:** offen
**Bezug:** Definition of Done MS-4 · NFR-1.3, NFR-1.4, NFR-1.6 · Abnahmekriterium Abschnitt 7 Punkt 3
**Voraussetzung:** TASK-04-01 bis 04-08

---

## Worum geht es

Alle neuen Screens werden einmal gemeinsam gegen die immer mitgeltenden Anforderungen geprüft, dann deployt.
MS-4 ist fertig, wenn die Definition of Done auf der GitHub-Pages-Adresse funktioniert.

## Schritte

### A · Querschnittsprüfung (lokal, Build-Stand mit `npm run build` und `npm run preview`)

1. [ ] Bestand, Beckenliste, Beckendetail, Anlegen, Bearbeiten, Löschdialog, Diary- und Profil-Platzhalter
       bei **360 px**, **390 px** und Desktop-Breite: kein waagerechtes Scrollen, nichts abgeschnitten (NFR-1.6)
2. [ ] Trefferflächen ≥ 44 × 44 px (NFR-1.3). Nur die shadcn-Button-Größe `default` verwenden – `xs`, `sm`, `lg` und
       `icon*` liegen unter 44 px.
3. [ ] Kein Icon ohne Text, jedes Feld mit sichtbarem Label (NFR-1.4)
4. [ ] Kontrast mit DevTools oder Lighthouse, mindestens WCAG 2.1 AA (NFR-1.4)
5. [ ] Ganzer Ablauf nur mit der Tastatur bedienbar, Fokus immer sichtbar
6. [ ] Nichts funktioniert nur per Hover (NFR-1.3)
7. [ ] Alle UI-Texte deutsch, Datum und Zahlen im de-DE-Format (NFR-1.5)

### B · Deployment

8. [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler.
9. [ ] Auf `main` pushen, im Reiter „Actions" prüfen, dass der Lauf grün ist.

### C · Abnahme am deployten Stand

10. [ ] Protokoll unten auf der GitHub-Pages-Adresse durchspielen, einmal davon auf einem echten Smartphone.
11. [ ] TASK-04-01 bis 04-09 in [`../Tasks.md`](../Tasks.md) abhaken.

## Abnahmeprotokoll

Datum: \_\_\_\_\_\_\_\_\_\_ · Adresse: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

| #   | Test                                                                      | Erwartet                                                       | Ergebnis |
| --- | ------------------------------------------------------------------------- | -------------------------------------------------------------- | -------- |
| 1   | Registrierung mit neuer, erfundener E-Mail                                | Weiterleitung auf den Bestand mit „Lege zuerst ein Becken an"  |          |
| 2   | Im Leerzustand „Becken anlegen" antippen                                  | Formular öffnet sich direkt, ohne Bottom-Navigation            |          |
| 3   | Formular mit leerem Namen absenden                                        | Feldfehler unter „Name", keine Anfrage                         |          |
| 4   | Becken mit Name, Volumen, Startdatum, Beschreibung speichern              | Becken erscheint in der Liste, Werte im de-DE-Format           |          |
| 5   | Zurück zum Bestand                                                        | Hinweis „Lege zuerst ein Becken an" ist verschwunden           |          |
| 6   | Becken bearbeiten, Seite neu laden                                        | Änderung bleibt erhalten                                       |          |
| 7   | Leeres Becken löschen, im Dialog erst „Abbrechen", dann „Löschen"         | Erst nichts passiert, dann fehlt das Becken in der Liste       |          |
| 8   | Als Testnutzer A Becken …01 löschen                                       | Löschen wird verhindert, verständliche Meldung                 |          |
| 9   | Als Testnutzer B die Adresse von As Becken …01 direkt aufrufen            | „Becken nicht gefunden"                                        |          |
| 10  | Alle vier Einträge der Bottom-Navigation antippen                         | Jeder Bereich erreichbar, aktiver Eintrag hervorgehoben        |          |
| 11  | `…/Coralkeeper/becken` direkt im Browser aufrufen und neu laden (F5)      | Beckenliste erscheint, kein 404                                |          |
| 12  | Ansicht bei 360 px Breite                                                 | kein waagerechtes Scrollen, alles bedienbar                    |          |

## Fertig, wenn

- [ ] Alle Punkte aus A sind geprüft
- [ ] Der Deploy-Lauf ist grün
- [ ] Das Abnahmeprotokoll ist vollständig und alle Tests sind bestanden
- [ ] **Definition of Done MS-4:** Ein neu registrierter Nutzer landet auf dem leeren Bestand, wird zur Beckenanlage
      geführt und kann ein Becken in einem Formular anlegen – auf dem deployten Stand

## Quellen

- [`../MS-04_UI-Shell-Becken.md`](../MS-04_UI-Shell-Becken.md) – Immer mitgeltend, Definition of Done
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-1.3 bis NFR-1.6, Abschnitt 7 Punkt 3
- `design.md` – Abschnitt 5 (Harte Regeln)
