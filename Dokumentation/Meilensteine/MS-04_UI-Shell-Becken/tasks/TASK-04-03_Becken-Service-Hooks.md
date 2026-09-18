# TASK-04-03 · Becken-Service und Hooks

**Status:** offen
**Bezug:** FR-1.1 (Becken anlegen, bearbeiten, löschen), NFR-4.3 (Datenzugriff nur über `src/services/*`, eigene Hooks),
NFR-4.1, NFR-4.7 (Löschsperre per `RESTRICT`)
**Voraussetzung:** TASK-04-01

---

## Worum geht es

Alle Becken-Zugriffe laufen über eine Service-Datei; die Seiten bekommen die Daten über eigene Hooks mit Lade- und
Fehlerzustand. Das Fehlermuster steht seit TASK-03-07 fest: Service gibt Daten zurück oder wirft einen `Error` mit
deutscher Meldung, das Original als `cause`.

## Vor dem Start klären

- [ ] **Dateiname.** Vorschlag `src/services/tank.ts` (englisch wie `profile.ts`, `auth.ts`). → Festlegen.
- [ ] **Löschsperre (FR-1.1).** `koralle.becken_id` ist `ON DELETE RESTRICT`; die Datenbank lehnt das Löschen eines
      Beckens mit Korallen mit Fehlercode `23503` ab.
  - **(a)** nur diesen Fehler auswerten und verständlich melden – einfach, und die Sperre greift in jedem Fall
  - **(b)** zusätzlich vorher die Korallen des Beckens zählen und „Löschen" gar nicht erst anbieten, mit Hinweis
  → Entscheiden. (a) reicht für FR-1.1, (b) ist die freundlichere Bedienung bei mehr Code.

## Schritte

1. [ ] **Typen** aus den generierten Datenbanktypen ableiten, nicht handschreiben (NFR-4.4):
       Zeile = `Tables<"becken">`; Eingabe für Anlegen/Ändern = die vier Fachfelder ohne `id` und `nutzer_id`.
2. [ ] **Funktionen** im Service:
   - `listTanks()` – alle eigenen Becken, sortiert nach Name (die Tabelle hat keine Anlagezeit-Spalte)
   - `getTank(id)` – ein Becken oder `null`, wenn es nicht existiert **oder einem anderen Nutzer gehört** (RLS liefert dann keine Zeile)
   - `createTank(input)` – `nutzer_id` aus der Session setzen (wie in `getOwnProfile`), nie aus dem Formular
   - `updateTank(id, input)`
   - `deleteTank(id)` – Fehlercode `23503` auf eine eigene Meldung abbilden, z. B.
     „In diesem Becken sind noch Korallen. Setze sie zuerst um oder lösche sie."
   - bei Entscheidung (b) zusätzlich eine Zählfunktion für Korallen je Becken
3. [ ] **Hooks** in `src/hooks/`:
   - `useTanks()` – Liste, Status (`loading` / `success` / `error`), Fehlermeldung, `reload()`
   - `useTank(id)` – ein Becken, dazu der Fall „nicht gefunden"
   Statusnamen im Stil von `useAuth` halten.
4. [ ] Leere optionale Felder als `null` speichern, nicht als leere Zeichenkette.

## Fertig, wenn

- [ ] Kein Import von `@supabase/*` außerhalb von `src/services/` (die ESLint-Regel aus TASK-03-07 meldet nichts)
- [ ] Kein `any`, keine handgeschriebenen Tabellentypen
- [ ] Jede Funktion wirft bei Fehlern eine deutsche Meldung mit `cause`
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `getTank` mit `.maybeSingle()` statt `.single()` – `.single()` wirft bei null Zeilen einen Fehler, und „nicht gefunden"
  soll ein eigener Zustand sein, kein Fehler.
- Im Dev-Modus laufen Effekte wegen `StrictMode` zweimal; eine doppelte Leseanfrage ist harmlos. Nach dem Verlassen
  der Seite keinen State mehr setzen (Abbruch-Flag im Effekt).
- Kein TanStack Query, keine State-Bibliothek (NFR-4.3) – nach Anlegen/Ändern/Löschen lädt die Zielseite einfach neu.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `becken`, Festlegung 1, Löschregeln
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Tabelle und Policies `becken`
- `src/services/profile.ts` – bestehendes Muster
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.1, NFR-4.3, NFR-4.4, NFR-4.7
