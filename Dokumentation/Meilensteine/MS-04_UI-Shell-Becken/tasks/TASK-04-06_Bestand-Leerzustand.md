# TASK-04-06 · Geführter Leerzustand im Bestand

**Status:** offen
**Bezug:** FR-1.15 (geführter Erstlauf), NFR-1.7 (nächste Aktion sichtbar), FR-6.4, Definition of Done MS-4,
Abnahmekriterium Abschnitt 7 Punkt 3
**Voraussetzung:** TASK-04-03, TASK-04-05

---

## Worum geht es

Der Kern der Definition of Done: Ein neu registrierter Nutzer landet auf dem leeren Bestand und wird von dort zur
Beckenanlage geführt. Solange kein Becken existiert, zeigt der Bestand den Hinweis **„Lege zuerst ein Becken an"**
(Wortlaut aus FR-1.15) mit einer direkten Aktion. Die Korallenanlage ist bis dahin nicht erreichbar.

## Vor dem Start klären

- [ ] **Bestand mit Becken, aber ohne Korallenliste.** Die Korallenliste und „Koralle hinzufügen" kommen erst in MS-5.
      Vorschlag für MS-4: Überschrift „Bestand" und ein neutraler Satz ohne Aktion; MS-5 ersetzt ihn.
      → Text festlegen.

## Schritte

1. [ ] Platzhalter-Inhalt in `src/pages/HomeScreen.tsx` ersetzen (Abmelden ist nach TASK-04-01 bereits umgezogen).
2. [ ] Mit `useTanks()` prüfen, ob Becken existieren:
   - **laden** → „Wird geladen …" (verhindert, dass der Leerzustand kurz aufblitzt)
   - **Fehler** → Meldung und „Erneut versuchen"
   - **keine Becken** → Karte mit „Lege zuerst ein Becken an", einem erklärenden Satz
     (z. B. „Jede Koralle gehört zu einem Becken.") und Primärbutton „Becken anlegen" → `/becken/neu`
   - **mindestens ein Becken** → Text aus „Vor dem Start klären"
3. [ ] Im Bestand erscheint in MS-4 **keine** Aktion „Koralle hinzufügen".

## Fertig, wenn

- [ ] Nach einer Registrierung mit neuer E-Mail steht sofort der Hinweis „Lege zuerst ein Becken an" mit Button da
- [ ] Der Button führt direkt ins Formular (eine Interaktion, NFR-1.2)
- [ ] Nach dem Anlegen des ersten Beckens ist der Hinweis im Bestand verschwunden
- [ ] Beim Neuladen blitzt der Leerzustand nicht auf, wenn Becken existieren
- [ ] Fehlerzustand ist sichtbar zu machen (Offline)
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Für die Entscheidung „gibt es Becken?" reicht die vorhandene Liste aus `useTanks()` – bei höchstens fünf Becken
  (NFR-2.1) ist eine eigene Zählabfrage unnötig.
- Die Sperre der Korallenanlage selbst (Aufruf von `/koralle/neu` ohne Becken) gehört zu MS-5, weil es die Route erst dann gibt.

## Quellen

- [`../MS-04_UI-Shell-Becken.md`](../MS-04_UI-Shell-Becken.md) – Definition of Done
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.15, NFR-1.2, NFR-1.7, Abschnitt 1.1 („Keine Koralle ohne Becken"), Abschnitt 7 Punkt 3
- `Dokumentation/Meilensteine/Milestones.md` – MS-1 Punkt 1 („Der Leerzustand ist der eigentlich schwierige Screen")
