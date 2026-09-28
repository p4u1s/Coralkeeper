# TASK-07-07 · Status und Inserat auf der Detailseite, Inserat zurückziehen

**Status:** offen
**Bezug:** FR-4.1, FR-4.2 (Inserat jederzeit zurückziehbar), FR-6.4, FR-6.5 (Bestätigungsdialog), NFR-1.4 (Status nie
Farbe allein), NFR-1.9 (Zustand des Inserats erkennbar), design.md Statusfarben
**Voraussetzung:** TASK-07-06

---

## Worum geht es

Die Detailseite zeigt ab jetzt den Status der Koralle und – falls vorhanden – ihr Inserat. Von dort lässt sich das
Inserat nach Rückfrage zurückziehen: Es wird gelöscht, die Koralle geht zurück auf `im Bestand`.

## Vor dem Start klären

- [ ] **Status-Anzeige.** Vorschlag: dritte Kachel „Status" im Stammdaten-Raster (neben „Becken" und „Zugang am"),
      Statuspunkt 10 × 10 in der Statusfarbe **plus** Text (design.md, Statusfarben). Tokens `bg-status-bestand`,
      `bg-status-abgabe`, … vorher gegen `src/index.css` prüfen.
- [ ] **Inserat-Anzeige.**
  - **(a)** Karte „Inserat" zwischen Stammdaten und Tab-Leiste, nur wenn ein Inserat existiert
  - **(b)** dritter Tab „Inserat"
  → Vorschlag: **(a)** – ein Tab ohne Inhalt bei den meisten Korallen wäre leerer Platz.
  Inhalt: Modus, Preis bzw. Tauschwunsch, Größe („keine Angabe", wenn leer), „Sichtbar für andere Nutzer" (NFR-1.9 –
  in MS-7 immer sichtbar), „Inseriert am".
- [ ] **Neu laden nach dem Zurückziehen.** Status, Inserat und Historie ändern sich auf derselben Seite. `useCoral` hat
      bewusst kein `reload` (TASK-06-05).
  - **(a)** `reload` in `useCoral` ergänzen (Muster `useTanks`)
  - **(b)** Seite nach dem Zurückziehen komplett neu laden
  → Vorschlag: **(a)**. Zusätzlich prüfen, ob der Historie-Tab beim Wechsel neu lädt; sonst dort ebenfalls neu laden.
- [ ] **Wortlaut des Dialogs.** Vorschlag: Titel „Inserat zurückziehen?", Text „Das Inserat wird gelöscht und ist für
      andere nicht mehr sichtbar. „Green Slimer" steht danach wieder im Bestand.", Buttons „Abbrechen" und
      „Zurückziehen".

## Schritte

1. [ ] **Status-Kachel** nach Entscheidung, Beschriftung aus `CORAL_STATUS_LABELS` (TASK-07-05). Farbe je Status über
       ein `Record<Enums<"koralle_status">, string>` mit den Token-Klassen.
2. [ ] **Inserat laden** mit `useOffer(coral.id)` – erst wenn die Koralle gefunden ist. Lade- und Fehlerzustand
       (Fehler mit `role="alert"` und „Erneut versuchen", FR-6.4).
3. [ ] **Inserat-Karte** als eigene Komponente, z. B. `src/components/OfferCard.tsx`, Beschriftungen aus
       `OFFER_MODE_LABELS`, Datum über `formatDate`.
4. [ ] **Buttons:** „Zur Abgabe markieren" (TASK-07-06) nur ohne Inserat und bei `im_bestand`; „Inserat zurückziehen"
       in der Inserat-Karte als Sekundärbutton in Fehlerfarbe wie „Löschen" auf `TankDetailPage`.
5. [ ] **Zurückziehen** mit `AlertDialog` (Muster `TankDetailPage`): während des Vorgangs bleibt der Dialog offen und
       die Buttons sind deaktiviert; ein Fehler erscheint im Dialog mit `role="alert"`; nach Erfolg Dialog schließen und
       Koralle, Inserat und Historie neu laden.

## Fertig, wenn

- [ ] Koralle ohne Inserat: Status „Im Bestand" mit grünem Punkt und Text, keine Inserat-Karte, Button zum Inserieren
      sichtbar
- [ ] Koralle mit Inserat: Status „Zur Abgabe" mit magentafarbenem Punkt und Text, Karte mit den Inseratsdaten, kein
      Button zum Inserieren
- [ ] „Inserat zurückziehen" fragt nach (FR-6.5); „Abbrechen" ändert nichts
- [ ] Nach dem Zurückziehen ohne manuelles Neuladen: Status „Im Bestand", Karte weg, Historie zeigt
      „Status geändert: Zur Abgabe → Im Bestand" (FR-4.2)
- [ ] Kontrollabfrage (Nutzer): zu dieser Koralle existiert kein `angebot` mehr
- [ ] Ohne Verbindung zurückziehen → deutsche Fehlermeldung im Dialog, Inserat bleibt bestehen (FR-6.4)
- [ ] Dialog nur mit der Tastatur bedienbar, Fokus sichtbar
- [ ] Alle Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Status und Legende in der **Bestandsliste** bleiben MS-9 (Entscheidung 22.09.2026), ebenso die allgemeine
  Statuswechsel-Oberfläche (FR-1.9).
- Die Testkoralle …02 von A hat ein Inserat, steht aber nicht zwingend auf `zur_abgabe` (TASK-07-04, Hinweise). Die
  Anzeige nimmt beides so, wie es in der Datenbank steht.
- Die Zustände „Interessent ausgewählt" und „abgeschlossen" aus NFR-1.9 entstehen erst mit MS-11.

## Quellen

- `design.md` – Abschnitt 1 (Statusfarben, „nie Farbe allein"), Abschnitt 3 (Statuspunkt), Abschnitt 4 (Karte,
  Sekundärbutton)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-4.1, FR-4.2, FR-6.5, NFR-1.9
- `src/pages/TankDetailPage.tsx` (Dialog), `src/pages/CoralDetailPage.tsx`, `src/hooks/useCoral.ts`,
  `src/hooks/useTanks.ts`, `src/index.css` – bestehendes Muster
