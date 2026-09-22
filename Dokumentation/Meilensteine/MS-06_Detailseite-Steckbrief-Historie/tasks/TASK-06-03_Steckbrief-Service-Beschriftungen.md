# TASK-06-03 · Steckbrief-Service und Beschriftungen

**Status:** offen
**Bezug:** FR-2.1 (Steckbrief anlegen und ändern), FR-2.2 (feste Auswahllisten, alle Felder optional), NFR-1.8
(Klartext statt Fachkürzel), NFR-4.3, NFR-4.4
**Voraussetzung:** TASK-06-02

---

## Worum geht es

Der Steckbrief ist kein eigener Datensatz, sondern eine Spaltengruppe in `koralle` (ER-Modell, Festlegung 3).
„Steckbrief anlegen" und „Steckbrief ändern" sind deshalb derselbe Vorgang: ein Update dieser Spalten. Dazu kommen
die deutschen Beschriftungen für Feldnamen und Auswahlwerte, die Anzeige (TASK-06-04) und Formular (TASK-06-05)
gemeinsam nutzen.

## Vor dem Start klären

- [ ] **Welche Felder?** FR-2.2 und Datenbank weichen ab:
  - **Wuchsform** – FR-2.2 zählt sie zu den Auswahllisten, nennt aber keine Werte; in der Datenbank ist sie
    `text`. Vorschlag: Freitext (die Datenbank ist verbindlich, Rangfolge in `CLAUDE.md`).
  - **Besonderheiten** – FR-2.2 nennt Freitext „Fütterung und Besonderheiten", es gibt aber nur die Spalte
    `fuetterung`. Vorschlag: nur „Fütterung"; die Abweichung benennen, keine Migration in MS-6.
  - **Schutzstatus** – Spalte vorhanden, gehört aber zu FR-2.4 (MS-9, mit Pflichthinweis „Eigenangabe, keine
    Rechtsauskunft"). Vorschlag: nicht in MS-6.
  → Festlegen.
- [ ] **Steckbrief schon beim Anlegen der Koralle?** Die alte Routenliste nennt FR-2.2 auch bei `/koralle/neu`.
      Vorschlag: nein – der Steckbrief wird auf der Detailseite angelegt, das Anlegeformular aus MS-5 bleibt kurz.
      → Entscheiden.
- [ ] **Ort der Beschriftungen.** Vorschlag: eigene Datei `src/lib/labels.ts` (Feldnamen, Stufen, Platzierung, später
      auch Status). → Festlegen.

## Schritte

1. [ ] **Typ** für die Steckbrief-Eingabe per `Pick` aus `Tables<"koralle">` – nur die festgelegten Felder.
2. [ ] **Funktion** im Korallen-Service (aus TASK-05-01): `updateCoralProfile(id, input)` – aktualisiert **nur** die
       Steckbrief-Spalten, keine Stammdaten, keinen Status.
3. [ ] **Leere Werte** als `null` speichern: Auswahl „keine Angabe" → `null`, leere Texte → `null`, Texte getrimmt
       (eigene `toRow`-Funktion wie in `tank.ts`).
4. [ ] **Beschriftungen** anlegen:
   - Feldnamen: Lichtbedarf, Strömung, Platzierung, Nesselkraft, Wuchsform, Schwierigkeitsgrad, Fütterung
   - Werte `stufe`: Gering · Mittel · Hoch; Werte `platzierung`: Unten · Mitte · Oben
   - Wertelisten aus `Constants` der generierten Typen ableiten, nicht abtippen – so fällt ein neuer Enum-Wert beim
     Build auf.
5. [ ] **Validierung** in `src/lib/validation.ts`: Höchstlänge für Wuchsform und Fütterung (Vorschlag 100 bzw. 500
       Zeichen, als Konstante wie `MAX_TANK_NAME_LENGTH`). Die Auswahlfelder brauchen keine Prüfung.

## Fertig, wenn

- [ ] `updateCoralProfile` ändert nachweislich keine anderen Spalten (nur Steckbrief-Felder im Update-Objekt)
- [ ] Zu jedem Enum-Wert gibt es eine deutsche Beschriftung, TypeScript meldet fehlende Werte
- [ ] Kein `any`, keine handgeschriebenen Tabellentypen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Keine Migration: UPDATE-Policy auf `koralle` besteht seit MS-3 („Steckbrief, Status").
- Icons zu den Steckbriefwerten und die Legende (FR-2.3) kommen mit MS-9 – hier nur Text.
- Ein Steckbrief-Update erzeugt **keinen** Historieneintrag (FR-3.4 nennt nur Anlage, Status, Becken, Ableger,
  Abgabe). Der Trigger aus TASK-06-01 reagiert nur auf `status`.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-2.1, FR-2.2, FR-2.4, NFR-1.8, Abschnitt 4.1
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `koralle`, Festlegung 3, Aufzählungstypen
- `15_Modul/Dokumentation_alt/depricated/Claude-Coralkeeper-Requirements-v2.2.md` – Abschnitt 7, Route `/koralle/neu`
- `src/services/tank.ts`, `src/lib/validation.ts` – bestehendes Muster
