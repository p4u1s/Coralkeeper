# TASK-04-07 · Beckendetail und Becken bearbeiten

**Status:** erledigt
**Bezug:** FR-1.1 (bearbeiten), FR-6.4, FR-6.6, FR-6.2 (kein Zugriff auf fremde Daten)
**Voraussetzung:** TASK-04-04, TASK-04-05

---

## Worum geht es

`/becken/:id` zeigt in MS-4 die Stammdaten eines Beckens und die Aktionen „Bearbeiten" und „Löschen" (Löschen folgt
in TASK-04-08). Die Diary-Tabs kommen in MS-8 auf dieselbe Seite. Bearbeitet wird im Formular aus TASK-04-05.

## Schritte

### A · Beckendetail

1. [x] Oben Sekundärbutton „Zurück zu Becken" → `/becken` (wie im Mockup).
2. [x] Name als Überschrift (Display), darunter Metazeile (Volumen, Startdatum) mit den Formatierern aus TASK-04-04,
       darunter die Beschreibung, falls vorhanden.
3. [x] Aktionen „Bearbeiten" (Link auf den Bearbeiten-Pfad) und Platz für „Löschen".
4. [x] Zustände über `useTank(id)`: laden, Fehler, **nicht gefunden** („Becken nicht gefunden." und Link zur Beckenliste).

### B · Becken bearbeiten

5. [x] Seite auf dem in TASK-04-01 festgelegten Pfad: Becken laden, dann `TankForm` mit den gespeicherten Werten
       vorbelegen. Überschrift „Becken bearbeiten".
6. [x] Speichern ruft `updateTank`, danach zurück zum Beckendetail. „Abbrechen" führt ohne Speichern zum Beckendetail.
7. [x] Lade-, Nicht-gefunden- und Fehlerzustand wie beim Detail; Speicherzustand wie in TASK-04-05.

## Fertig, wenn

- [x] Eine Änderung ist nach dem Neuladen der Seite noch da
- [x] Ein Feld leeren (z. B. Volumen) speichert `null`, die Metazeile zeigt den Wert nicht mehr
- [x] Validierung und Feldfehler verhalten sich wie beim Anlegen (FR-6.6)
- [x] Eine unbekannte ID in der Adresse zeigt „Becken nicht gefunden", keinen Absturz und keine leere Seite
- [x] Angemeldet als Testnutzer B zeigt die Adresse von As Becken (`/becken/aaaaaaaa-0000-0000-0000-000000000001`)
      „Becken nicht gefunden" (FR-6.2)
- [x] Beckendetail mit Bottom-Navigation („Becken" aktiv), Bearbeiten-Seite ohne
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Eine ungültige ID (kein UUID-Format, z. B. `/becken/abc`) lässt Postgres mit einem Typfehler antworten statt mit
  „keine Zeile". Auch dieser Fall soll als „nicht gefunden" oder verständlicher Fehler enden, nicht als Rohmeldung.
- **Nicht in MS-4:** Diary-Tabs (MS-8), Liste „Korallen in diesem Becken" (frühestens MS-5), Beckenbild (keine Spalte).

## Quellen

- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „BECKEN DETAIL" (nur Kopfbereich)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.1, FR-6.2, FR-6.4, FR-6.6
- `15_Modul/Dokumentation_alt/depricated/Claude-Coralkeeper-Requirements-v2.2.md` – Abschnitt 7, Route `/becken/:id`
