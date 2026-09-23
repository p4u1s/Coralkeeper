# TASK-06-03 · Steckbrief-Service und Beschriftungen

**Status:** erledigt (23.09.2026)
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

- [x] **Welche Felder?** FR-2.2 und Datenbank weichen ab. → am 23.09.2026 entschieden: **acht Felder**
  - **Wuchsform** – Freitext. FR-2.2 zählt sie zu den Auswahllisten, nennt aber keine Werte; in der Datenbank ist
    sie `text`, und die Datenbank ist verbindlich (Rangfolge in `CLAUDE.md`).
  - **Besonderheiten** – als eigene Spalte `besonderheiten` nachgetragen, damit FR-2.2 („Freitext für Fütterung und
    Besonderheiten") wörtlich erfüllt ist. Migration und neue Typgenerierung, siehe Schritt 0.
  - **Schutzstatus** – Spalte vorhanden, gehört aber zu FR-2.4 (MS-9, mit Pflichthinweis „Eigenangabe, keine
    Rechtsauskunft") und bleibt hier außen vor.
- [x] **Steckbrief schon beim Anlegen der Koralle?** → am 23.09.2026 entschieden: **nein**. Der Steckbrief wird auf
      der Detailseite angelegt, das Anlegeformular aus MS-5 bleibt unangetastet. Deckt FR-2.1 („jederzeit ändern")
      und FR-2.2 („blockieren die Anlage nicht").
- [x] **Ort der Beschriftungen.** → am 23.09.2026 entschieden: eigene Datei `src/lib/labels.ts` (Feldnamen, Stufen,
      Platzierung, später auch Status und Schutzstatus).

## Schritte

0. [x] **Migration** (Nutzer, Folge der Entscheidung zu „Besonderheiten"): `alter table public.koralle add column
       besonderheiten text;`, danach `npm run gen:types`. → am 23.09.2026 ausgeführt, Kontrollabfrage über
       `information_schema.columns` zeigt `besonderheiten | text | YES`; Spalte steht in `database.types.ts`.
       Keine RLS-Änderung nötig, `koralle_update_eigene` gilt zeilenweise.
1. [x] **Typ** für die Steckbrief-Eingabe per `Pick` aus `Tables<"koralle">` – nur die festgelegten Felder.
       → `CoralProfileInput` in `src/services/coral.ts`.
2. [x] **Funktion** im Korallen-Service (aus TASK-05-01): `updateCoralProfile(id, input)` – aktualisiert **nur** die
       Steckbrief-Spalten, keine Stammdaten, keinen Status.
3. [x] **Leere Werte** als `null` speichern: Auswahl „keine Angabe" → `null`, leere Texte → `null`, Texte getrimmt
       (eigene `toRow`-Funktion wie in `tank.ts`). → `toProfileRow` in `coral.ts`.
4. [x] **Beschriftungen** anlegen: → `src/lib/labels.ts`
   - Feldnamen: Lichtbedarf, Strömung, Platzierung, Nesselkraft, Wuchsform, Schwierigkeitsgrad, Fütterung,
     Besonderheiten (`CORAL_PROFILE_LABELS`, per `satisfies` gegen `CoralProfileInput` auf Vollständigkeit geprüft)
   - Werte `stufe`: Gering · Mittel · Hoch; Werte `platzierung`: Unten · Mitte · Oben
   - Wertelisten aus `Constants` der generierten Typen ableiten, nicht abtippen – so fällt ein neuer Enum-Wert beim
     Build auf. → `LEVEL_VALUES`, `PLACEMENT_VALUES`; die `Record<Enums<…>, string>`-Typen erzwingen jede Beschriftung.
5. [x] **Validierung** in `src/lib/validation.ts`: Höchstlänge für Wuchsform und Fütterung (Vorschlag 100 bzw. 500
       Zeichen, als Konstante wie `MAX_TANK_NAME_LENGTH`). Die Auswahlfelder brauchen keine Prüfung.
       → `MAX_GROWTH_FORM_LENGTH` (100) und `MAX_PROFILE_TEXT_LENGTH` (500, für Fütterung und Besonderheiten),
       `validateCoralProfile`; `checkCoralText` nimmt die Höchstlänge jetzt als Parameter entgegen.

## Fertig, wenn

- [x] `updateCoralProfile` ändert nachweislich keine anderen Spalten (nur Steckbrief-Felder im Update-Objekt)
- [x] Zu jedem Enum-Wert gibt es eine deutsche Beschriftung, TypeScript meldet fehlende Werte
- [x] Kein `any`, keine handgeschriebenen Tabellentypen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Eine Migration war ursprünglich nicht vorgesehen. Die Entscheidung für eine eigene Spalte `besonderheiten`
  (23.09.2026) hat eine nötig gemacht – siehe Schritt 0 und ER-Modell, Festlegung 16.
  Unverändert gilt: für den Steckbrief selbst ist keine Policy-Änderung nötig, die UPDATE-Policy auf `koralle`
  besteht seit MS-3 („Steckbrief, Status").
- Icons zu den Steckbriefwerten und die Legende (FR-2.3) kommen mit MS-9 – hier nur Text.
- Ein Steckbrief-Update erzeugt **keinen** Historieneintrag (FR-3.4 nennt nur Anlage, Status, Becken, Ableger,
  Abgabe). Der Trigger aus TASK-06-01 reagiert nur auf `status`.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-2.1, FR-2.2, FR-2.4, NFR-1.8, Abschnitt 4.1
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `koralle`, Festlegung 3, Aufzählungstypen
- `15_Modul/Dokumentation_alt/depricated/Claude-Coralkeeper-Requirements-v2.2.md` – Abschnitt 7, Route `/koralle/neu`
- `src/services/tank.ts`, `src/lib/validation.ts` – bestehendes Muster
