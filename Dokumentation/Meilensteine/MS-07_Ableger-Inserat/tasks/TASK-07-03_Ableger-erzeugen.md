# TASK-07-03 · Ableger erzeugen

**Status:** offen
**Bezug:** FR-1.7 (Aktion in der Detailansicht, Becken vorbelegt und änderbar), FR-1.14, FR-6.4, FR-6.6, NFR-1.3,
NFR-1.4, NFR-1.7, Abnahmekriterium Abschnitt 7 Punkt 7 („Ableger … erscheint im Bestand")
**Voraussetzung:** TASK-07-02

---

## Worum geht es

Auf der Detailseite einer Koralle startet „Ableger erzeugen" ein kurzes Formular. Gespeichert wird ein neuer Datensatz
mit den kopierten Daten der Ursprungskoralle, der danach im Bestand steht.

## Vor dem Start klären

- [ ] **Pfad.** Vorschlag: `/koralle/:id/ableger/neu`, eigene Seite ohne Bottom-Navigation – wie
      `/koralle/:id/steckbrief`.
- [ ] **Bezeichnung.**
  - **(a)** leeres Pflichtfeld
  - **(b)** vorbelegt mit der Bezeichnung der Ursprungskoralle, änderbar
  → Vorschlag: **(b)** – eine Eingabe weniger (NFR-1.1); gleiche Namen sind erlaubt.
- [ ] **Hinweis auf die übernommenen Daten.** Vorschlag: ein Satz über den Feldern, z. B. „Art, Handelsname und
      Steckbrief werden von „Green Slimer" übernommen."
- [ ] **Button auf der Detailseite.** Vorschlag: Sekundärbutton „Ableger erzeugen" mit Symbol, volle Breite, unter den
      Stammdaten über der Tab-Leiste (Mockup: Aktionsbuttons unter den Detailkarten). Sichtbar bei jedem Status –
      `abgegeben` und `verendet` sind erst ab MS-9 erreichbar; dort erneut prüfen.
- [ ] **Ziel nach dem Speichern.** Vorschlag: Detailseite des **neuen Ablegers** – dort ist die nächste Aktion
      (Inserieren, TASK-07-06) sofort sichtbar (NFR-1.7). „Abbrechen" führt zurück zur Ursprungskoralle.
- [ ] **Ladefehler.** Vorschlag: wie `CoralProfileEditPage` – Meldung bzw. „Koralle nicht gefunden." mit Link zurück;
      für die Beckenliste wie `CoralCreatePage` mit „Erneut versuchen".

## Schritte

1. [ ] **Route** in `src/App.tsx` **außerhalb** von `AppLayout` eintragen und im Kopfkommentar als
       „Festgelegt in TASK-07-03" ergänzen.
2. [ ] **Seite**, z. B. `src/pages/OffshootCreatePage.tsx`: lädt die Ursprungskoralle mit `useCoral(id)` und die
       Becken mit `useTanks()`; Lade-, Fehler- und Nicht-gefunden-Zustand nach Entscheidung (FR-6.4).
3. [ ] **Formular** als eigene Komponente, z. B. `src/components/OffshootForm.tsx` (nicht in `components/ui/`):
   - Bezeichnung \* und Becken \* (`NativeSelect`, vorbelegt mit dem Becken der Ursprungskoralle)
   - Label über dem Feld, `*` und Legende „\* Pflichtfeld" am Formularkopf
   - Feldfehler aus `validateOffshoot` unter dem Feld, mit `aria-invalid` und `aria-describedby` wie in `CoralForm`
   - Hinweissatz nach Entscheidung
4. [ ] **Speichern** über `createOffshoot(mother, input)`; Button während des Speicherns deaktiviert; Serverfehler als
       deutsche Meldung mit `role="alert"`, Eingaben bleiben stehen.
5. [ ] **Weiterleitung** nach Entscheidung.
6. [ ] **Button „Ableger erzeugen"** auf der `CoralDetailPage` nach Entscheidung.

## Fertig, wenn

- [ ] Ableger aus einer Koralle mit ausgefülltem Steckbrief speichern → er erscheint im Bestand (**Abnahme Punkt 7**)
- [ ] Art · Handelsname und alle Steckbriefwerte des Ablegers stimmen mit der Ursprungskoralle überein (FR-1.7)
- [ ] Das Becken ist vorbelegt; ein anderes Becken lässt sich wählen und wird gespeichert
- [ ] Steckbrief des Ablegers ändern → der Steckbrief der Ursprungskoralle bleibt unverändert (Snapshot, Grundsatz 4)
- [ ] Die Historie von Ableger und Ursprungskoralle zeigt die Einträge nach TASK-07-01
- [ ] Kontrollabfrage (Nutzer): `mutter_id`, `herkunftskette`, `erwerbsdatum` und `quelle_typ` des Ablegers
      entsprechen Festlegung 17
- [ ] Ohne Bezeichnung oder ohne Becken speichern → Feldfehler, keine Anfrage (FR-6.6)
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Als Testnutzer B zeigt der Pfad für `aaaaaaaa-0000-0000-0000-000000000002` „nicht gefunden" (FR-6.2)
- [ ] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Das Bild der Ursprungskoralle wird nicht übernommen (Festlegung 17); Bild-Upload ist MS-9.
- Keine Anzeige „Ableger von …" auf der Detailseite und kein Zähler „Ableger insgesamt" wie im Mockup – Darstellung
  der Abstammung ist FR-1.8 (Could-Backlog).
- Doppeltes Antippen von „Speichern" würde zwei Ableger erzeugen – der deaktivierte Button verhindert das.

## Quellen

- `design.md` – Abschnitt 4 (Eingabefeld, Primär- und Sekundärbutton), Abschnitt 5
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „KORALLE DETAIL" (Aktionsbuttons)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.7, FR-1.8, NFR-1.7, Abschnitt 7 Punkt 7
- `src/pages/CoralProfileEditPage.tsx`, `src/pages/CoralCreatePage.tsx`, `src/components/CoralForm.tsx`,
  `src/App.tsx` – bestehendes Muster
