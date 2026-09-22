# TASK-05-02 · Korallenformular und Validierung

**Status:** offen
**Bezug:** FR-1.2 (Bezeichnung und Becken Pflicht, Art/Handelsname/Erwerbsdatum optional), FR-1.14 (Becken Pflichtfeld im
Formular), FR-6.6 (Feldfehler), NFR-1.3, NFR-1.4, NFR-4.2
**Voraussetzung:** TASK-05-01

---

## Worum geht es

Das Formular wird als eigene Komponente gebaut wie `TankForm.tsx`, damit das Bearbeiten in MS-9 (FR-1.10) es mit
vorbelegten Werten wiederverwenden kann. Kern des Meilensteins ist die Beckenauswahl: Speichern ohne Becken wird mit
einem Feldfehler abgelehnt (Definition of Done).

## Vor dem Start klären

- [x] **Felder: FR-1.2 oder Mockup?** Das Mockup „FORMULAR NEUE KORALLE" weicht von FR-1.2 ab: Art ist dort Pflicht,
      es gibt Status, „Zugang am \*", Größe, Notiz und Bild – aber kein Feld „Bezeichnung".
      → **Entschieden (22.09.2026):** Felder nach FR-1.2, Formularmuster (Labels, Reihenfolge der Buttons) aus dem Mockup.

  | Feld          | Pflicht | Spalte         |
  | ------------- | ------- | -------------- |
  | Bezeichnung   | ja      | `bezeichnung`  |
  | Becken        | ja      | `becken_id`    |
  | Art           | nein    | `art`          |
  | Handelsname   | nein    | `handelsname`  |
  | Erwerbsdatum  | nein    | `erwerbsdatum` |

  Bild entfällt (Bild-Upload folgt laut MS-5 in MS-9), Status entfällt (Standardwert `im_bestand`).
- [ ] **Labeltexte.** Z. B. „Art (wissenschaftlicher Name)" wie im Mockup, „Handelsname / Morphe" wie in FR-1.2.
      → Festlegen.
- [ ] **Auswahlfeld für das Becken** (NFR-4.2 verlangt shadcn/ui):
  - **(a)** shadcn `native-select` – echtes `<select>`, auf dem Smartphone öffnet die Systemauswahl, wie im Mockup
  - **(b)** shadcn `select` (Radix) – eigene Auswahlliste, einheitliches Aussehen, mehr Code und eigenes Tastaturverhalten
  → Entscheiden. Vorab prüfen, ob `npx shadcn@latest add native-select` in der installierten shadcn-Version verfügbar ist.
- [ ] **Vorbelegung.** Vorschlag: kein Becken vorbelegt, erste Option „Becken wählen" ohne Wert. Nur so ist „Speichern
      ohne Becken" überhaupt möglich und die Definition of Done prüfbar. Alternative: bei genau einem Becken vorbelegen.
      → Festlegen.
- [ ] **Validierungsregeln.** Vorschlag in Anlehnung an `validateTank`:

  | Feld         | Regel (Vorschlag)                                            |
  | ------------ | ------------------------------------------------------------ |
  | Bezeichnung  | nicht leer nach Entfernen der Leerzeichen, höchstens 100 Zeichen |
  | Becken       | ein Becken ist gewählt                                       |
  | Art          | höchstens 100 Zeichen                                        |
  | Handelsname  | höchstens 100 Zeichen                                        |
  | Erwerbsdatum | nicht in der Zukunft                                         |

  → Festlegen.

## Schritte

1. [ ] **Auswahlkomponente** per shadcn hinzufügen (nach Entscheidung) und wie `input.tsx` an `design.md` anpassen:
       Fläche `bg-card`, Rahmen 1 px, Radius 10, Höhe 48, `text-body`.
2. [ ] **Validierung** in `src/lib/validation.ts`: `validateCoral(...)` mit eigenem Fehlertyp `CoralErrors`.
       Die Prüfung „nicht in der Zukunft" ist für das Startdatum schon da (`checkStartDate`, `todayIso`) –
       wiederverwenden statt kopieren, ggf. mit neutralem Namen.
3. [ ] **Formular-Komponente** `src/components/CoralForm.tsx` mit Props: Becken-Liste, Anfangswerte, Beschriftung des
       Speichern-Buttons, `cancelTo`, `onSubmit` – Aufbau wie `TankForm.tsx`:
   - Kopf: Legende „\* Pflichtfeld"
   - Felder in der festgelegten Reihenfolge, sichtbare Labels über dem Feld
   - Becken-Optionen zeigen den Beckennamen
   - Erwerbsdatum mit `type="date"`
   - `noValidate`, `aria-invalid`, Fehlertext per `aria-describedby`, Fehler verschwinden nach Korrektur
   - Primärbutton „Speichern", darunter Sekundärbutton „Abbrechen", beide volle Breite
4. [ ] **Laden und Fehler beim Speichern:** Button deaktiviert mit „Wird gespeichert …"; Serverfehler als Meldung über dem
       Formular (`role="alert"`), Eingaben bleiben erhalten.

## Fertig, wenn

- [ ] Die Komponente ist fertig und typisiert; eingebunden wird sie erst in TASK-05-03
- [ ] Speichern ohne Becken und/oder ohne Bezeichnung liefert Feldfehler, `onSubmit` wird nicht aufgerufen (FR-6.6, FR-1.14)
- [ ] Jedes Feld hat ein sichtbares Label, Auswahlfeld mindestens 44 px hoch (NFR-1.3, NFR-1.4)
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `becken_id` ist im Formular ein String; die leere Option hat den Wert `""` und wird von der Validierung als „nicht
  gewählt" erkannt – nie `""` an die Datenbank schicken.
- Keine allgemeine `FormField`-Komponente einführen – die ist bewusst für MS-12 vorgemerkt.
- Steckbrief- und Herkunftsfelder (FR-2.2, FR-3.1) gehören nicht in dieses Formular, auch wenn die Routenliste
  (Abschnitt 7, alt) sie bei `/koralle/neu` nennt – Steckbrief ist MS-6, Herkunft MS-10.

## Quellen

- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „FORMULAR NEUE KORALLE"
- `design.md` – Abschnitt 4 (Eingabefeld, Buttons), Abschnitt 5 (Regeln 1, 4, 8)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.2, FR-1.14, FR-6.6
- `src/components/TankForm.tsx`, `src/lib/validation.ts` – bestehendes Muster
