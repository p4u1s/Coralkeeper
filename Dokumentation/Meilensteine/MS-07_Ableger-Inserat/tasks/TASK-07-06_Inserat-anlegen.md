# TASK-07-06 · Inserat anlegen

**Status:** offen
**Bezug:** FR-4.1 (Modus, Preis bzw. Tauschwunsch, Größe; Status `zur Abgabe`; Inserat `sichtbar`), FR-6.4, FR-6.6,
NFR-1.3, NFR-1.4, NFR-1.7, Abnahmekriterium Abschnitt 7 Punkt 7 („als Inserat freischalten; die Koralle steht auf
`zur Abgabe`")
**Voraussetzung:** TASK-07-05

---

## Worum geht es

Von der Detailseite aus wird eine Koralle zur Abgabe freigeschaltet: Ein kurzes Formular legt das Inserat an, die
Koralle wechselt dabei auf `zur Abgabe` und der Statuswechsel steht in ihrer Historie.

## Vor dem Start klären

- [ ] **Welche Korallen dürfen inseriert werden?** FR-4.1 spricht vom „Ableger", Grundsatzentscheidung 3 kennt aber
      keinen Ableger-Typ, und das Mockup zeigt „Zur Abgabe markieren" bei jeder Koralle.
  - **(a)** Jede Koralle mit Status `im_bestand`
  - **(b)** Nur Korallen mit `mutter_id` – ein Ableger verliert diese Eigenschaft allerdings, sobald seine
    Ursprungskoralle gelöscht wird (`ON DELETE SET NULL`, ab MS-9)
  → Vorschlag: **(a)**.
- [ ] **Pfad.** Vorschlag: `/koralle/:id/inserat/neu`, eigene Seite ohne Bottom-Navigation.
- [ ] **Beschriftung des Buttons auf der Detailseite.** „Zur Abgabe markieren" (Mockup), „Zur Abgabe freischalten"
      (Anforderungen 1.1) oder „Inserieren". Vorschlag: Mockup-Wortlaut „Zur Abgabe markieren" als Primärbutton,
      Seitentitel „Inserat erstellen".
- [ ] **Modus.** `NativeSelect` mit erster Option „Modus wählen" wie die Beckenauswahl (Pflicht) – oder drei
      Optionsfelder (shadcn `radio-group` müsste neu installiert werden). → Vorschlag: `NativeSelect`.
- [ ] **Preis bzw. Tauschwunsch.** Eine Textspalte `preis_oder_tauschwunsch`. Vorschlag: Label wechselt mit dem Modus
      („Preis" bzw. „Tauschwunsch"), bei „Verschenken" ausgeblendet und als `null` gespeichert; optional, freier Text
      (kein Zahlungsverkehr), höchstens 100 Zeichen.
- [ ] **Größe.** Freitext wie im Mockup („6,5 cm", „12 Polypen"), optional, höchstens 50 Zeichen, Platzhalter
      „z. B. 3 cm".
- [ ] **Hinweis auf die Sichtbarkeit.** Vorschlag: ein Satz über dem Speichern-Button – „Das Inserat ist für alle
      angemeldeten Nutzer sichtbar. Dein übriger Bestand bleibt privat." (wie der Hinweis in TASK-06-07)
- [ ] **Ziel nach dem Speichern.** Vorschlag: zurück zur Detailseite der Koralle, Steckbrief-Tab.

## Schritte

1. [ ] **Route** in `src/App.tsx` **außerhalb** von `AppLayout` eintragen und im Kopfkommentar als
       „Festgelegt in TASK-07-06" ergänzen.
2. [ ] **Validierung** `validateOffer` in `src/lib/validation.ts`: Modus Pflicht, Höchstlängen als Konstanten wie
       `MAX_JOURNAL_TEXT_LENGTH`.
3. [ ] **Seite**, z. B. `src/pages/OfferCreatePage.tsx`: lädt die Koralle mit `useCoral(id)`, Zustände wie
       `CoralProfileEditPage`. Steht die Koralle nicht auf `im_bestand` (Direktaufruf), statt des Formulars ein Hinweis
       mit Link zurück zur Detailseite.
4. [ ] **Formular** als eigene Komponente, z. B. `src/components/OfferForm.tsx`: Modus \*, Preis bzw. Tauschwunsch,
       Größe; Label über dem Feld, `*` und Legende „\* Pflichtfeld", Feldfehler unter dem Feld; Hinweistext nach
       Entscheidung.
5. [ ] **Speichern** über `createOffer`; Button während des Speicherns deaktiviert; Serverfehler als deutsche Meldung
       mit `role="alert"`, Eingaben bleiben stehen. Nach Erfolg Weiterleitung nach Entscheidung.
6. [ ] **Button** auf der `CoralDetailPage`, nur bei Status `im_bestand`. Die Anzeige des Status und des bestehenden
       Inserats folgt in TASK-07-07.

## Fertig, wenn

- [ ] Inserat speichern → im Historie-Tab steht „Status geändert: Im Bestand → Zur Abgabe" (**Abnahme Punkt 7**)
- [ ] Kontrollabfrage (Nutzer): `angebot` mit Modus, Preis bzw. Tauschwunsch, Größe, kopierter Art und Handelsname,
      `sichtbar = true`; `koralle.status = 'zur_abgabe'`
- [ ] Ohne Modus speichern → Feldfehler, keine Anfrage (FR-6.6)
- [ ] Zu lange Texte → Feldfehler, keine Anfrage
- [ ] Bei „Verschenken" wird kein Preis bzw. Tauschwunsch gespeichert
- [ ] Direktaufruf des Formulars für eine Koralle, die schon zur Abgabe steht → Hinweis, kein zweites Inserat
- [ ] Ohne Verbindung speichern → deutsche Fehlermeldung, Eingaben bleiben stehen (FR-6.4)
- [ ] Als Testnutzer B zeigt der Pfad für `aaaaaaaa-0000-0000-0000-000000000002` „nicht gefunden" (FR-6.2)
- [ ] Alle Felder und Buttons ≥ 44 px, bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

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
