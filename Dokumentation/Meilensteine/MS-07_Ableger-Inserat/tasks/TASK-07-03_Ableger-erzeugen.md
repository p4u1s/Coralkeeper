# TASK-07-03 · Ableger erzeugen

**Status:** erledigt
**Bezug:** FR-1.7 (Aktion in der Detailansicht, Becken vorbelegt und änderbar), FR-1.14, FR-6.4, FR-6.6, NFR-1.3,
NFR-1.4, NFR-1.7, Abnahmekriterium Abschnitt 7 Punkt 7 („Ableger … erscheint im Bestand")
**Voraussetzung:** TASK-07-02

---

## Worum geht es

Auf der Detailseite einer Koralle startet „Ableger erzeugen" ein kurzes Formular. Gespeichert wird ein neuer Datensatz
mit den kopierten Daten der Ursprungskoralle, der danach im Bestand steht.

## Vor dem Start klären

- [x] **Pfad.** Vorschlag: `/koralle/:id/ableger/neu`, eigene Seite ohne Bottom-Navigation – wie
      `/koralle/:id/steckbrief`.
  → **Entschieden am 28.09.2026:** wie vorgeschlagen.
- [x] **Bezeichnung.**
  - **(a)** leeres Pflichtfeld
  - **(b)** vorbelegt mit der Bezeichnung der Ursprungskoralle, änderbar
  → Vorschlag: **(b)** – eine Eingabe weniger (NFR-1.1); gleiche Namen sind erlaubt.
  → **Entschieden am 28.09.2026:** (b).
  → **Geändert am 29.09.2026:** vorbelegt mit „{Bezeichnung} (Ableger)", änderbar – mit unveränderter Bezeichnung
  standen im Bestand zwei identische Karten. Eine Markierung als Ableger wäre FR-1.8 (Could-Backlog).
- [x] **Hinweis auf die übernommenen Daten.** Vorschlag: ein Satz über den Feldern, z. B. „Art, Handelsname und
      Steckbrief werden von „Green Slimer" übernommen."
  → **Entschieden am 28.09.2026:** wie vorgeschlagen, mit der Bezeichnung der Ursprungskoralle; Schutzstatus wird
  nicht genannt (erst ab MS-9 sichtbar).
- [x] **Button auf der Detailseite.** Vorschlag: Sekundärbutton „Ableger erzeugen" mit Symbol, volle Breite, unter den
      Stammdaten über der Tab-Leiste (Mockup: Aktionsbuttons unter den Detailkarten). Sichtbar bei jedem Status –
      `abgegeben` und `verendet` sind erst ab MS-9 erreichbar; dort erneut prüfen.
  → **Entschieden am 28.09.2026:** wie vorgeschlagen, Symbol `Plus` (wie die übrigen Anlegen-Buttons).
- [x] **Ziel nach dem Speichern.** Vorschlag: Detailseite des **neuen Ablegers** – dort ist die nächste Aktion
      (Inserieren, TASK-07-06) sofort sichtbar (NFR-1.7). „Abbrechen" führt zurück zur Ursprungskoralle.
  → **Entschieden am 28.09.2026:** wie vorgeschlagen, Weiterleitung mit `navigate(…, { replace: true })`, damit
  „Zurück" im Browser zur Ursprungskoralle statt ins leere Formular führt.
- [x] **Ladefehler.** Vorschlag: wie `CoralProfileEditPage` – Meldung bzw. „Koralle nicht gefunden." mit Link zurück;
      für die Beckenliste wie `CoralCreatePage` mit „Erneut versuchen".
  → **Entschieden am 28.09.2026:** wie vorgeschlagen; Link „Zum Bestand"; „Wird geladen …", solange eines von
  beiden lädt; kein Leerzustand für die Beckenliste (die Ursprungskoralle hat immer ein Becken).

## Schritte

1. [x] **Route** in `src/App.tsx` **außerhalb** von `AppLayout` eintragen und im Kopfkommentar als
       „Festgelegt in TASK-07-03" ergänzen.
2. [x] **Seite**, z. B. `src/pages/FragCreatePage.tsx`: lädt die Ursprungskoralle mit `useCoral(id)` und die
       Becken mit `useTanks()`; Lade-, Fehler- und Nicht-gefunden-Zustand nach Entscheidung (FR-6.4).
3. [x] **Formular** als eigene Komponente, z. B. `src/components/FragForm.tsx` (nicht in `components/ui/`):
   - Bezeichnung \* und Becken \* (`NativeSelect`, vorbelegt mit dem Becken der Ursprungskoralle)
   - Label über dem Feld, `*` und Legende „\* Pflichtfeld" am Formularkopf
   - Feldfehler aus `validateFrag` unter dem Feld, mit `aria-invalid` und `aria-describedby` wie in `CoralForm`
   - Hinweissatz nach Entscheidung
4. [x] **Speichern** über `createFrag(mother, input)`; Button während des Speicherns deaktiviert; Serverfehler als
       deutsche Meldung mit `role="alert"`, Eingaben bleiben stehen.
5. [x] **Weiterleitung** nach Entscheidung.
6. [x] **Button „Ableger erzeugen"** auf der `CoralDetailPage` nach Entscheidung.

## Fertig, wenn

- [x] Ableger aus einer Koralle mit ausgefülltem Steckbrief speichern → er erscheint im Bestand (**Abnahme Punkt 7**)
- [x] Art · Handelsname und alle Steckbriefwerte des Ablegers stimmen mit der Ursprungskoralle überein (FR-1.7)
- [x] Das Becken ist vorbelegt; ein anderes Becken lässt sich wählen und wird gespeichert
- [x] Steckbrief des Ablegers ändern → der Steckbrief der Ursprungskoralle bleibt unverändert (Snapshot, Grundsatz 4)
- [x] Die Historie von Ableger und Ursprungskoralle zeigt die Einträge nach TASK-07-01
- [x] Kontrollabfrage (Nutzer): `mutter_id`, `herkunftskette`, `erwerbsdatum` und `quelle_typ` des Ablegers
      entsprechen Festlegung 17
- [x] Ohne Bezeichnung oder ohne Becken speichern → Feldfehler, keine Anfrage (FR-6.6)
- [x] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [x] Als Testnutzer B zeigt der Pfad für `aaaaaaaa-0000-0000-0000-000000000002` „nicht gefunden" (FR-6.2)
- [x] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

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
