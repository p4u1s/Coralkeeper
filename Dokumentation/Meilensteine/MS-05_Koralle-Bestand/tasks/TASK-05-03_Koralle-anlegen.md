# TASK-05-03 · Seite „Koralle anlegen"

**Status:** offen
**Bezug:** FR-1.2, FR-1.14, FR-1.15 (Korallenanlage ohne Becken nicht erreichbar), FR-6.4 (Lade-, Leer- und Fehlerzustand),
Abnahmekriterium Abschnitt 7 Punkt 4
**Voraussetzung:** TASK-05-02

---

## Worum geht es

Die Seite `/koralle/neu` lädt die eigenen Becken, zeigt das Formular aus TASK-05-02 und legt die Koralle an. Existiert
noch kein Becken, darf das Formular nicht erscheinen – auch nicht bei Direktaufruf der Adresse (FR-1.15).

## Vor dem Start klären

- [ ] **Ohne Becken.** Wer `/koralle/neu` direkt aufruft, ohne ein Becken zu haben:
  - **(a)** Hinweis „Lege zuerst ein Becken an" mit Aktion „Becken anlegen" direkt auf der Seite
  - **(b)** Umleitung auf `/`, dort steht der Hinweis bereits
  → Entscheiden. (a) erklärt sich selbst; (b) ist kürzer, springt aber kommentarlos weg.
  Bei (a): Hinweiskarte aus `HomeScreen.tsx` kopieren oder als kleine Komponente herausziehen? → Festlegen.
- [ ] **Ziel nach „Speichern".** Vorschlag: Bestand `/` – dort ist die neue Koralle sofort in der Liste zu sehen (Definition
      of Done). Die Detailseite kommt erst in MS-6.
      **Ziel von „Abbrechen":** Vorschlag `/`, fester Pfad statt „zurück" (wie beim Becken).
      → Festlegen.

## Schritte

1. [ ] **Route** `/koralle/neu` in `src/App.tsx` **außerhalb** von `AppLayout` eintragen, neben `/becken/neu` – Formulare
       ohne Bottom-Navigation (design.md, Abschnitt 4). Der Pfad steht in der Routenliste (Abschnitt 7, alt), der
       Kommentar über dem Router braucht keinen Zusatz.
2. [ ] **Seite** `src/pages/CoralCreatePage.tsx`, Überschrift „Koralle anlegen", Becken über `useTanks()` laden:
   - `loading` → „Wird geladen …"
   - `error` → Meldung mit `role="alert"` und „Erneut versuchen"
   - keine Becken → Verhalten nach Entscheidung
   - Becken vorhanden → `CoralForm` mit der Beckenliste
3. [ ] **Speichern:** `createCoral` aufrufen, danach zum festgelegten Ziel navigieren.

## Fertig, wenn

- [ ] Speichern ohne Becken zeigt einen Feldfehler unter „Becken", es geht keine Anfrage raus (**Definition of Done**)
- [ ] Speichern mit leerer Bezeichnung zeigt einen Feldfehler
- [ ] Eine Koralle nur mit Bezeichnung und Becken lässt sich speichern; in Supabase sind `art`, `handelsname`,
      `erwerbsdatum` `null`, `status` ist `im_bestand`, `nutzer_id` ist die eigene
- [ ] Ohne Becken erscheint das Formular nicht, auch nicht bei Direktaufruf von `/koralle/neu` (FR-1.15)
- [ ] Ohne Verbindung erscheint eine verständliche deutsche Meldung, die Eingaben bleiben stehen (FR-6.4)
- [ ] Keine Bottom-Navigation; Bedienung mit Tastatur und Enter möglich; bei 360 px vollständig sichtbar
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Der Einstieg „Koralle hinzufügen" auf dem Bestand entsteht erst in TASK-05-04. Bis dahin die Seite über die Adresse
  aufrufen.
- Nach dem Speichern zeigt `/` bis TASK-05-04 noch „Die Korallenliste folgt in Kürze." – die Anlage in Supabase prüfen.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.2, FR-1.14, FR-1.15, FR-6.4, Abschnitt 7 Punkt 4
- `15_Modul/Dokumentation_alt/depricated/Claude-Coralkeeper-Requirements-v2.2.md` – Abschnitt 7, Route `/koralle/neu`
- `src/pages/TankCreatePage.tsx`, `src/pages/HomeScreen.tsx` – bestehendes Muster
- `design.md` – Abschnitt 4 (Bottom-Navigation: nicht in Formularen)
