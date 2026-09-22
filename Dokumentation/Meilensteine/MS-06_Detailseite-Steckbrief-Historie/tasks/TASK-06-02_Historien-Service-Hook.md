# TASK-06-02 · Historien-Service und Hook

**Status:** offen
**Bezug:** FR-3.5 (Journaleintrag), FR-3.3 (append-only), NFR-4.3 (Datenzugriff nur über `src/services/*`, eigene Hooks),
NFR-4.4, NFR-4.1
**Voraussetzung:** TASK-06-01

---

## Worum geht es

Alle Zugriffe auf `historieneintrag` laufen über eine eigene Service-Datei. Sie kann **nur lesen und anlegen** – eine
Funktion zum Ändern oder Löschen gibt es bewusst nicht (FR-3.3). Die Detailseite bekommt die Einträge über einen Hook
mit Lade- und Fehlerzustand.

## Vor dem Start klären

- [ ] **Dateinamen.** Vorschlag `src/services/history.ts` und `src/hooks/useHistory.ts` (englisch wie `tank.ts`).
      → Festlegen.
- [ ] **Sortierung.** Absteigend nach `datum`, bei gleichem Datum nach `erstellt_am` absteigend – so steht der neueste
      Eintrag oben und die Reihenfolge ist eindeutig. FR-3.2 (chronologische Historienansicht) ist formal MS-10, die
      Sortierung kostet aber nur eine Zeile. → Bestätigen.

## Schritte

1. [ ] **Typen** aus den generierten Datenbanktypen ableiten (NFR-4.4):
   - Zeile = `Tables<"historieneintrag">`
   - Eingabe für den Journaleintrag = `koralle_id`, `datum`, `text` – **ohne** `nutzer_id`, `typ`, `bild_id`
2. [ ] **Funktionen** im Service:
   - `listHistory(coralId)` – alle Einträge einer Koralle, Sortierung nach Entscheidung
   - `createJournalEntry(input)` – setzt `typ = 'journal'` fest und `nutzer_id` aus `getSession()` (Muster
     `createTank`); Text getrimmt
3. [ ] **Hook** `useHistory(coralId)` – Liste, Status (`loading` / `success` / `error`), Fehlermeldung, `reload()`;
       Statusnamen und Abbruch-Flag wie in `useTanks`.
4. [ ] Kurzer Kommentar über dem Service, dass Ändern und Löschen **absichtlich fehlen** (FR-3.3, Festlegung 7).

## Fertig, wenn

- [ ] Der Service exportiert keine Update- oder Delete-Funktion für Historieneinträge
- [ ] Kein Import von `@supabase/*` außerhalb von `src/services/`
- [ ] Kein `any`, keine handgeschriebenen Tabellentypen
- [ ] Jede Funktion wirft bei Fehlern eine deutsche Meldung mit `cause`
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `koralle_id` wird im Frontend nicht gegen fremde Korallen geprüft – laut ER-Modell Festlegung 12 bewusst nicht.
- Kein Bild am Journaleintrag: FR-3.5 nennt „optional Bild", der Bild-Upload kommt aber erst mit MS-9 (NFR-2.5).
- Einträge vom Typ `abgabe` entstehen erst mit MS-10 (FR-3.7).

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `historieneintrag`, Festlegungen 7 und 12
- `src/services/tank.ts`, `src/hooks/useTanks.ts` – bestehendes Muster
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-3.2, FR-3.3, FR-3.5
