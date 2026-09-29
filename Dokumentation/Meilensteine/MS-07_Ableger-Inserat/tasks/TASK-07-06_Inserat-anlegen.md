# TASK-07-06 · Inserat anlegen

**Status:** erledigt
**Bezug:** FR-4.1 (Modus, Preis bzw. Tauschwunsch, Größe; Status `zur Abgabe`; Inserat `sichtbar`), FR-6.4, FR-6.6,
NFR-1.3, NFR-1.4, NFR-1.7, Abnahmekriterium Abschnitt 7 Punkt 7 („als Inserat freischalten; die Koralle steht auf
`zur Abgabe`")
**Voraussetzung:** TASK-07-05

---

## Worum geht es

Von der Detailseite aus wird eine Koralle zur Abgabe freigeschaltet: Ein kurzes Formular legt das Inserat an, die
Koralle wechselt dabei auf `zur Abgabe` und der Statuswechsel steht in ihrer Historie.

## Vor dem Start klären

- [x] **Welche Korallen dürfen inseriert werden?** FR-4.1 spricht vom „Ableger", Grundsatzentscheidung 3 kennt aber
      keinen Ableger-Typ, und das Mockup zeigt „Zur Abgabe markieren" bei jeder Koralle.
  - **(a)** Jede Koralle mit Status `im_bestand`
  - **(b)** Nur Korallen mit `mutter_id` – ein Ableger verliert diese Eigenschaft allerdings, sobald seine
    Ursprungskoralle gelöscht wird (`ON DELETE SET NULL`, ab MS-9)
  → Vorschlag: **(a)**.
  → **Entschieden am 29.09.2026:** (a).
- [x] **Pfad.** Vorschlag: `/koralle/:id/inserat/neu`, eigene Seite ohne Bottom-Navigation.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.
- [x] **Beschriftung des Buttons auf der Detailseite.** „Zur Abgabe markieren" (Mockup), „Zur Abgabe freischalten"
      (Anforderungen 1.1) oder „Inserieren". Vorschlag: Mockup-Wortlaut „Zur Abgabe markieren" als Primärbutton,
      Seitentitel „Inserat erstellen".
  → **Entschieden am 29.09.2026:** „Zur Abgabe markieren", aber als **Sekundärbutton** wie im Mockup
  (`Coralkeeper.dc.html`, Block „KORALLE DETAIL"), volle Breite, ohne Symbol, unter „Ableger erzeugen"; Seitentitel
  „Inserat erstellen". Vorläufig – wird bei Bedarf später korrigiert.
- [x] **Modus.** `NativeSelect` mit erster Option „Modus wählen" wie die Beckenauswahl (Pflicht) – oder drei
      Optionsfelder (shadcn `radio-group` müsste neu installiert werden). → Vorschlag: `NativeSelect`.
  → **Entschieden am 29.09.2026:** `NativeSelect`, erste Option „Modus wählen" mit Wert `""`.
- [x] **Preis bzw. Tauschwunsch.** Eine Textspalte `preis_oder_tauschwunsch`. Vorschlag: Label wechselt mit dem Modus
      („Preis" bzw. „Tauschwunsch"), bei „Verschenken" ausgeblendet und als `null` gespeichert; optional, freier Text
      (kein Zahlungsverkehr), höchstens 100 Zeichen.
  → **Entschieden am 29.09.2026:** wie vorgeschlagen; das Feld erscheint nur bei „Tauschen" und „Verkaufen" (vor der
  Modus-Wahl ausgeblendet), Platzhalter „z. B. 15 €" bzw. „z. B. gegen eine Zoanthus". Bei „Verschenken" setzt das
  Formular den Wert beim Speichern auf `null`, auch wenn vorher etwas eingetippt wurde.
- [x] **Größe.** Freitext wie im Mockup („6,5 cm", „12 Polypen"), optional, höchstens 50 Zeichen, Platzhalter
      „z. B. 3 cm".
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.
- [x] **Hinweis auf die Sichtbarkeit.** Vorschlag: ein Satz über dem Speichern-Button – „Das Inserat ist für alle
      angemeldeten Nutzer sichtbar. Dein übriger Bestand bleibt privat." (wie der Hinweis in TASK-06-07)
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.
- [x] **Ziel nach dem Speichern.** Vorschlag: zurück zur Detailseite der Koralle, Steckbrief-Tab.
  → **Entschieden am 29.09.2026:** `/koralle/:id` mit `navigate(…, { replace: true })`, damit „Zurück" im Browser
  nicht ins Formular führt; Abbrechen ohne `replace` zur Detailseite.
- [x] **Direktaufruf bei Status ≠ `im_bestand`.**
  → **Entschieden am 29.09.2026:** statt des Formulars „Diese Koralle kann nicht inseriert werden. Status: …"
  (Wortlaut aus `CORAL_STATUS_LABELS`) und Sekundär-Link „Zur Koralle". Vorläufig – wird bei Bedarf später korrigiert.

## Schritte

1. [x] **Route** in `src/App.tsx` **außerhalb** von `AppLayout` eintragen und im Kopfkommentar als
       „Festgelegt in TASK-07-06" ergänzen.
2. [x] **Validierung** `validateOffer` in `src/lib/validation.ts`: Modus Pflicht, Höchstlängen als Konstanten wie
       `MAX_JOURNAL_TEXT_LENGTH`.
3. [x] **Seite**, z. B. `src/pages/OfferCreatePage.tsx`: lädt die Koralle mit `useCoral(id)`, Zustände wie
       `CoralProfileEditPage`. Steht die Koralle nicht auf `im_bestand` (Direktaufruf), statt des Formulars ein Hinweis
       mit Link zurück zur Detailseite.
4. [x] **Formular** als eigene Komponente, z. B. `src/components/OfferForm.tsx`: Modus \*, Preis bzw. Tauschwunsch,
       Größe; Label über dem Feld, `*` und Legende „\* Pflichtfeld", Feldfehler unter dem Feld; Hinweistext nach
       Entscheidung.
5. [x] **Speichern** über `createOffer`; Button während des Speicherns deaktiviert; Serverfehler als deutsche Meldung
       mit `role="alert"`, Eingaben bleiben stehen. Nach Erfolg Weiterleitung nach Entscheidung.
6. [x] **Button** auf der `CoralDetailPage`, nur bei Status `im_bestand`. Die Anzeige des Status und des bestehenden
       Inserats folgt in TASK-07-07.

## Fertig, wenn

- [x] Inserat speichern → im Historie-Tab steht „Status geändert: Im Bestand → Zur Abgabe" (**Abnahme Punkt 7**)
- [x] Kontrollabfrage (Nutzer): `angebot` mit Modus, Preis bzw. Tauschwunsch, Größe, kopierter Art und Handelsname,
      `sichtbar = true`; `koralle.status = 'zur_abgabe'`
- [x] Ohne Modus speichern → Feldfehler, keine Anfrage (FR-6.6)
- [x] Zu lange Texte → Feldfehler, keine Anfrage
- [x] Bei „Verschenken" wird kein Preis bzw. Tauschwunsch gespeichert
- [x] Direktaufruf des Formulars für eine Koralle, die schon zur Abgabe steht → Hinweis, kein zweites Inserat
- [x] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [x] Als Testnutzer B zeigt der Pfad für `aaaaaaaa-0000-0000-0000-000000000002` „nicht gefunden" (FR-6.2)
- [x] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Kein Bildfeld: Bild-Upload kommt mit MS-9 (NFR-2.5).
- Doppeltes Antippen von „Speichern": Der deaktivierte Button verhindert es, `UNIQUE` auf `angebot.koralle_id`
  zusätzlich.
- Eine Liste aller sichtbaren Inserate für andere Nutzer ist FR-4.3 (MS-11) und gehört nicht hierher.

## Quellen

- `design.md` – Abschnitt 4 (Eingabefeld, Primärbutton), Abschnitt 5 (Pflichtfelder mit `*`)
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „KORALLE DETAIL" (Button „Zur Abgabe
  markieren", Kachel „Größe")
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Grundsatzentscheidungen 3 und 8, FR-4.1, FR-4.2,
  FR-4.3, Abschnitt 7 Punkt 7
- `src/pages/JournalEntryCreatePage.tsx`, `src/components/JournalEntryForm.tsx`, `src/lib/validation.ts` – bestehendes
  Muster
