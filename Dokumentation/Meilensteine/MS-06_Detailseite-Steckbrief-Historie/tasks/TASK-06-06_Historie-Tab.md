# TASK-06-06 · Historie-Tab

**Status:** offen
**Bezug:** FR-3.4 (Systemeinträge sichtbar), FR-3.3 (keine Bearbeiten- oder Löschen-Aktion), FR-6.4 (Lade-, Leer- und
Fehlerzustand), NFR-1.4, Definition of Done MS-6
**Voraussetzung:** TASK-06-04

---

## Worum geht es

Der Historie-Tab zeigt alle Einträge der Koralle – Systemeinträge und Journaleinträge in einer gemeinsamen Liste.
Damit wird die Definition of Done sichtbar: Die Anlage der Koralle steht als Systemeintrag in der Historie.

## Vor dem Start klären

- [ ] **Darstellung eines Eintrags.** Vorschlag nach dem Diary-Eintrag im Mockup: Karte mit Typ-Chip („System" bzw.
      „Journal"), daneben das Datum `TT.MM.JJJJ`, darunter der Text. Symbole im Chip nur zusammen mit dem Text
      (design.md, Diary-Typ-Chip); ohne passendes Symbol reicht der Text. → Festlegen.
- [ ] **Leerzustand.** Tritt nur bei Korallen ohne Systemeintrag auf (Testdaten, Korallen aus MS-5). Vorschlag:
      „Noch keine Einträge." → Festlegen.

## Schritte

1. [ ] **Eigene Komponente**, z. B. `src/components/CoralHistory.tsx`, mit `useHistory(coralId)` aus TASK-06-02:
   - `loading` → „Wird geladen …"
   - `error` → Meldung mit `role="alert"` und „Erneut versuchen"
   - leer → Text nach Entscheidung
   - Einträge → Liste in der Sortierung des Service
2. [ ] **Typ-Beschriftung** („System", „Journal", vorsorglich „Abgabe") in `src/lib/labels.ts` aus TASK-06-03.
3. [ ] **Datum** über `formatDate` aus `src/lib/format.ts`.
4. [ ] Platzhalter aus TASK-06-04 durch die Komponente ersetzen.
5. [ ] **Keine** Bearbeiten- oder Löschen-Aktion am Eintrag, auch kein Wischen oder Langdruck (FR-3.3).

## Fertig, wenn

- [ ] Eine nach TASK-06-01 neu angelegte Koralle zeigt „Koralle angelegt" als Systemeintrag (**Definition of Done**)
- [ ] Lade-, Leer- und Fehlerzustand sind sichtbar (FR-6.4) – Fehler z. B. mit abgeschalteter Verbindung prüfen
- [ ] Datum im Format `TT.MM.JJJJ`, Typ als Text erkennbar
- [ ] Kein Eintrag bietet eine Aktion zum Ändern oder Löschen
- [ ] Bei 360 px bricht langer Text um, kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Historienfilter nach Typ (FR-3.9) ist MS-10 (Should) – nicht einbauen.
- Der Button „Journaleintrag hinzufügen" kommt in TASK-06-07.

## Quellen

- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „DIARY" (Eintragskarte mit Typ-Chip)
- `design.md` – Abschnitt 4 (Karte, Diary-Typ-Chip), Abschnitt 5
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-3.2, FR-3.3, FR-3.4, FR-6.4
- `src/lib/format.ts`
