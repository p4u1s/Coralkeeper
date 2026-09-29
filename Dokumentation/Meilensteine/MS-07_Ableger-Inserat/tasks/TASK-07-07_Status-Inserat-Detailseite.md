# TASK-07-07 · Status und Inserat auf der Detailseite, Inserat zurückziehen

**Status:** erledigt
**Bezug:** FR-4.1, FR-4.2 (Inserat jederzeit zurückziehbar), FR-6.4, FR-6.5 (Bestätigungsdialog), NFR-1.4 (Status nie
Farbe allein), NFR-1.9 (Zustand des Inserats erkennbar), design.md Statusfarben
**Voraussetzung:** TASK-07-06

---

## Worum geht es

Die Detailseite zeigt ab jetzt den Status der Koralle und – falls vorhanden – ihr Inserat. Von dort lässt sich das
Inserat nach Rückfrage zurückziehen: Es wird gelöscht, die Koralle geht zurück auf `im Bestand`.

## Vor dem Start klären

- [x] **Status-Anzeige.** Vorschlag: dritte Kachel „Status" im Stammdaten-Raster (neben „Becken" und „Zugang am"),
      Statuspunkt 10 × 10 in der Statusfarbe **plus** Text (design.md, Statusfarben). Tokens `bg-status-bestand`,
      `bg-status-abgabe`, … vorher gegen `src/index.css` prüfen.
  → **Entschieden am 29.09.2026:** statt der Kachel eine Plakette wie im Mockup (`Coralkeeper.dc.html`, Block
  „KORALLE DETAIL") direkt unter Titel und Art: Statuspunkt 10 × 10 in der Statusfarbe plus Text 13/18/500, Fläche
  erhöht mit Rahmen, Radius 999. Tokens `status-bestand`, `status-abgabe`, `status-abgegeben`, `status-verendet` in
  `src/index.css` geprüft.
- [x] **Inserat-Anzeige.**
  - **(a)** Karte „Inserat" zwischen Stammdaten und Tab-Leiste, nur wenn ein Inserat existiert
  - **(b)** dritter Tab „Inserat"
  → Vorschlag: **(a)** – ein Tab ohne Inhalt bei den meisten Korallen wäre leerer Platz.
  Inhalt: Modus, Preis bzw. Tauschwunsch, Größe („keine Angabe", wenn leer), „Sichtbar für andere Nutzer" (NFR-1.9 –
  in MS-7 immer sichtbar), „Inseriert am".
  → **Entschieden am 29.09.2026:** (a), Karte unter den Buttons und über der Tab-Leiste. Zeilen: Modus; „Preis" bzw.
  „Tauschwunsch" nur bei Verkaufen bzw. Tauschen („keine Angabe", wenn leer); Größe („keine Angabe", wenn leer);
  Sichtbarkeit aus `sichtbar`; „Inseriert am". Darunter „Inserat zurückziehen".
- [x] **Neu laden nach dem Zurückziehen.** Status, Inserat und Historie ändern sich auf derselben Seite. `useCoral` hat
      bewusst kein `reload` (TASK-06-05).
  - **(a)** `reload` in `useCoral` ergänzen (Muster `useTanks`)
  - **(b)** Seite nach dem Zurückziehen komplett neu laden
  → Vorschlag: **(a)**. Zusätzlich prüfen, ob der Historie-Tab beim Wechsel neu lädt; sonst dort ebenfalls neu laden.
  → **Entschieden am 29.09.2026:** (a). `reload` setzt `status` auf `loading`; der Detailbereich wird dadurch neu
  aufgebaut, Inserat und Historie laden mit – im Historie-Tab ist keine eigene Änderung nötig.
- [x] **Wortlaut des Dialogs.** Vorschlag: Titel „Inserat zurückziehen?", Text „Das Inserat wird gelöscht und ist für
      andere nicht mehr sichtbar. „Green Slimer" steht danach wieder im Bestand.", Buttons „Abbrechen" und
      „Zurückziehen".
  → **Entschieden am 29.09.2026:** wie vorgeschlagen, mit der Bezeichnung der Koralle; während des Vorgangs
  „Wird zurückgezogen …".
- [x] **Aufbau der Komponenten** (beim Start ergänzt). `useOffer` direkt auf der Seite mit leerer ID vor dem Laden der
      Koralle ließe „Zur Abgabe markieren" kurz aufblitzen, bevor die Karte erscheint.
  → **Entschieden am 29.09.2026:** eigene Komponente `src/components/CoralOffer.tsx` (benannt wie `CoralHistory`),
  erst eingebunden, wenn die Koralle geladen ist. Sie ruft `useOffer(coral.id)` selbst auf und zeigt Laden, Fehler mit
  „Erneut versuchen", die Inserat-Karte mit Dialog oder – ohne Inserat und bei `im_bestand` – den Button „Zur Abgabe
  markieren", der dafür von der Seite hierher umzieht. Props `coral` und `onWithdrawn` (`reload` aus `useCoral`).
- [x] **Datum „Inseriert am"** (beim Start ergänzt). `angebot.erstellt_am` ist `timestamptz`, `formatDate` erwartet
      `YYYY-MM-DD`.
  → **Entschieden am 29.09.2026:** neue Hilfsfunktion `formatTimestampDate` in `src/lib/format.ts` mit
  `toLocaleDateString("de-DE", …)` – lokales Datum statt UTC-Datum.

## Schritte

1. [x] **Status-Kachel** nach Entscheidung, Beschriftung aus `CORAL_STATUS_LABELS` (TASK-07-05). Farbe je Status über
       ein `Record<Enums<"koralle_status">, string>` mit den Token-Klassen.
2. [x] **Inserat laden** mit `useOffer(coral.id)` – erst wenn die Koralle gefunden ist. Lade- und Fehlerzustand
       (Fehler mit `role="alert"` und „Erneut versuchen", FR-6.4).
3. [x] **Inserat-Karte** als eigene Komponente, z. B. `src/components/OfferCard.tsx`, Beschriftungen aus
       `OFFER_MODE_LABELS`, Datum über `formatDate`.
4. [x] **Buttons:** „Zur Abgabe markieren" (TASK-07-06) nur ohne Inserat und bei `im_bestand`; „Inserat zurückziehen"
       in der Inserat-Karte als Sekundärbutton in Fehlerfarbe wie „Löschen" auf `TankDetailPage`.
5. [x] **Zurückziehen** mit `AlertDialog` (Muster `TankDetailPage`): während des Vorgangs bleibt der Dialog offen und
       die Buttons sind deaktiviert; ein Fehler erscheint im Dialog mit `role="alert"`; nach Erfolg Dialog schließen und
       Koralle, Inserat und Historie neu laden.

## Fertig, wenn

- [x] Koralle ohne Inserat: Status „Im Bestand" mit grünem Punkt und Text, keine Inserat-Karte, Button zum Inserieren
      sichtbar
- [x] Koralle mit Inserat: Status „Zur Abgabe" mit magentafarbenem Punkt und Text, Karte mit den Inseratsdaten, kein
      Button zum Inserieren
- [x] „Inserat zurückziehen" fragt nach (FR-6.5); „Abbrechen" ändert nichts
- [x] Nach dem Zurückziehen ohne manuelles Neuladen: Status „Im Bestand", Karte weg, Historie zeigt
      „Status geändert: Zur Abgabe → Im Bestand" (FR-4.2)
- [x] Kontrollabfrage (Nutzer): zu dieser Koralle existiert kein `angebot` mehr
- [x] Ohne Verbindung zurückziehen → deutsche Fehlermeldung im Dialog, Inserat bleibt bestehen (FR-6.4)
- [x] Dialog nur mit der Tastatur bedienbar, Fokus sichtbar
- [x] Alle Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

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
