# TASK-08a-03 · Abnahmelauf Teil 2: Schritte 5–8

**Status:** erledigt (02.10.2026)
**Bezug:** Abschnitt 7 Schritte 5–8 · MVP 4–7 · FR-2.1, FR-2.2, FR-3.3, FR-3.4, FR-3.5, FR-1.7, FR-4.1, FR-4.2,
FR-5.1, FR-5.3, FR-5.4, FR-5.10, FR-6.5
**Voraussetzung:** TASK-08a-02 (Konto C mit einem Becken und einer Koralle)

---

## Worum geht es

C arbeitet mit der Koralle aus Teil 1 weiter: Steckbrief, Journaleintrag, Ableger mit Inserat, danach das Diary.
Am Ende wird festgehalten, welche Daten C hat – das ist die Vergleichsliste für die erneute Anmeldung in TASK-08a-04.

## Vor dem Start klären

- [x] **Schritt 6 in der Datenbank.** „Nicht mehr bearbeitbar" ist in der App sichtbar (kein Bearbeiten, kein
      Löschen). Der Datenbank-Nachweis liegt in `MS-06_Detailseite-Steckbrief-Historie/tasks/TASK-06-08_Schritt 1_Append-only-Test.sql`.
  - **(a)** Nur die App prüfen, für die Datenbank auf TASK-06-08 verweisen
  - **(b)** Zusätzlich einen kurzen Testblock gegen den Journaleintrag von C (UPDATE und DELETE als C → 0 Zeilen,
    Eintrag unverändert), Ergebnis per `raise exception`, alles zurückgerollt
    → Vorschlag: **(a)** – die Policies gelten für alle Nutzer gleich, an ihnen hat sich seit TASK-06-08 nichts geändert.
    → **Entschieden am 02.10.2026:** (a).

## Schritte

1. [ ] Protokoll unten Zeile für Zeile durchspielen, als C und auf demselben Gerät wie in TASK-08a-02.
2. [ ] Weitere **IDs aus der Adresszeile** notieren:
   - Ableger: `…/koralle/<ID>`
   - ein Messwert: `…/diary/messwert/<ID>/bearbeiten`
   - ein Ereignis: `…/diary/ereignis/<ID>/bearbeiten`
3. [ ] Bei Entscheidung (b): Testblock ausführen, Ergebnis als Zeile 7b ins Protokoll.
4. [ ] Am Ende den **Datenstand von C** unten eintragen.
5. [ ] Notizen wie in TASK-08a-02.

## Protokoll

Datum: · Gerät: · Gespielt von:

| #   | Test                                                               | Erwartet                                                                   | Ergebnis |
| --- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------- |
| 1   | Koralle öffnen, Steckbrief: einige Felder füllen, speichern        | Werte sichtbar, leere Felder zeigen „keine Angabe" (**Abnahme 5**, FR-2.1) |          |
| 2   | Steckbrief erneut öffnen, einen Wert ändern                        | geänderter Wert sichtbar (**Abnahme 5**, FR-2.2)                           |          |
| 3   | Historie-Tab                                                       | Systemeintrag zur Anlage der Koralle vorhanden (**Abnahme 6**, FR-3.4)     |          |
| 4   | Journaleintrag mit Datum und Text anlegen                          | Eintrag in derselben Historie (**Abnahme 6**, FR-3.5)                      |          |
| 5   | Journaleintrag ansehen                                             | kein Bearbeiten, kein Löschen (**Abnahme 6**, FR-3.3)                      |          |
| 6   | Ableger aus der Koralle erzeugen                                   | Ableger erscheint im Bestand (**Abnahme 7**, FR-1.7)                       |          |
| 7   | Ableger als Inserat freischalten (Modus, Preis bzw. Tausch, Größe) | Status „Zur Abgabe", Inserat-Karte sichtbar (**Abnahme 7**, FR-4.1)        |          |
| 8   | Diary: Messwerte erfassen                                          | Eintrag in der Übersicht (**Abnahme 8**, FR-5.1)                           |          |
| 9   | Diary: Wasserwechsel protokollieren                                | Eintrag in der Übersicht (**Abnahme 8**, FR-5.3)                           |          |
| 10  | Diary: Ereignis protokollieren                                     | Eintrag in der Übersicht (**Abnahme 8**, FR-5.4)                           |          |
| 11  | Einen Eintrag korrigieren                                          | Übersicht zeigt den neuen Wert (**Abnahme 8**, FR-5.10)                    |          |
| 12  | Einen anderen Eintrag löschen: erst abbrechen, dann bestätigen     | nach Abbrechen noch da, nach Bestätigen weg (**Abnahme 8**, FR-6.5)        |          |

Notizen:

## Datenstand von C nach diesem Task

Vergleichsliste für TASK-08a-04. Konkrete Werte eintragen, nicht nur Anzahlen.

| Bereich        | Stand |
| -------------- | ----- |
| Becken         |       |
| Korallen       |       |
| Steckbrief     |       |
| Historie       |       |
| Inserat        |       |
| Diary-Einträge |       |

## Fertig, wenn

- [ ] Alle zwölf Zeilen haben ein Ergebnis
- [ ] Die IDs von Ableger, Messwert und Ereignis sind notiert
- [ ] Der Datenstand von C ist vollständig eingetragen
- [ ] Entscheidung zu Schritt 6 vermerkt, bei (b) Testblock ausgeführt und zurückgerollt
- [ ] Ein nicht bestandener Test ist als Befund vermerkt – **nicht** behoben

## Hinweise

- Das Inserat **stehen lassen** – TASK-08a-04 braucht ein sichtbares Inserat von C.
- Gelöscht wird ein Diary-Eintrag, nicht der Messwert oder das Ereignis, dessen ID notiert ist.
- Datumsfeld ohne Kalender in der Responsive-Ansicht von Firefox ist eine Eigenheit der DevTools, kein Befund.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 7 Schritte 5–8, Abschnitt 1.1
- `Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/tasks/TASK-06-08_Nachweis-append-only.md`
- `Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-09_Responsive-Deployment-Abnahme.md`
- `Dokumentation/Meilensteine/MS-08_Diary/tasks/TASK-08-09_Responsive-Deployment-Abnahme.md`
