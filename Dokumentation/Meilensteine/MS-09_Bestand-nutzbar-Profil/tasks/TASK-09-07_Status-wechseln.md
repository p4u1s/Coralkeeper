# TASK-09-07 · Status wechseln mit optionaler Notiz

**Status:** offen
**Bezug:** FR-1.9, FR-3.4, FR-3.5, FR-6.4, FR-6.6 · NFR-1.3, NFR-1.4 · Festlegung vom 23.09.2026 (kein Datumsfeld,
Notiz als Journaleintrag)
**Voraussetzung:** TASK-09-04

---

## Worum geht es

Auf einer eigenen Seite wird der Status einer Koralle gewechselt, optional mit einer Notiz. Den Systemeintrag
„Status geändert: … → …" schreibt der vorhandene Trigger, die Notiz wird ein zusätzlicher Journaleintrag. Ein
Datumsfeld gibt es nicht – das Datum ist immer der Tag der Änderung.

## Vor dem Start klären

- [ ] **Auswahlelement.**
  - **(a)** shadcn `radio-group` (über die CLI, Befehl vorher zeigen) – je Option Statuspunkt plus Text wie die
    Status-Auswahl im Mockup-Formular „Koralle anlegen"
  - **(b)** `NativeSelect` wie im übrigen Projekt – ohne Statuspunkt
  → Vorschlag: **(a)**.
- [ ] **Aktueller Status in der Auswahl?** Vorschlag: aktueller Status steht als Plakette über dem Formular und fehlt
      in der Auswahl – so kann kein „Wechsel" auf denselben Wert entstehen. Optionen sonst nach TASK-09-01.
- [ ] **Notiz.** Vorschlag: Textarea „Notiz", optional, höchstens 1.000 Zeichen wie der Journaleintrag
      (`MAX_JOURNAL_TEXT_LENGTH`); darüber der Hinweis „Die Notiz wird als Journaleintrag gespeichert und lässt sich
      danach nicht mehr ändern." (wie TASK-06-07, Entscheidung 13).
- [ ] **Button auf der Detailseite und Inserat-Sperre.** `useOffer` steckt heute in `CoralOffer`; die Detailseite
      weiß nicht, ob ein Inserat besteht.
  - **(a)** Button „Status ändern" immer zeigen; die Statusseite prüft das Inserat selbst und zeigt bei bestehendem
    Inserat nur den Hinweis aus TASK-09-01 mit Link zurück
  - **(b)** `useOffer` in die Detailseite heben und den Button bei Inserat ausblenden – ändert `CoralOffer`
  → Vorschlag: **(a)**. Sekundärbutton; Ort klärt TASK-09-09.
- [ ] **Ziel nach dem Speichern.** Vorschlag: Detailseite mit `?tab=historie` und `replace` – der neue Systemeintrag
      ist sofort sichtbar.

## Schritte

1. [ ] Bei (a): shadcn `radio-group` hinzufügen; Optik gegen design.md (Trefferfläche ≥ 44 px, Fokusring wie im
       Projekt festgelegt).
2. [ ] **Validierung** in `src/lib/validation.ts`: Status gewählt, Notiz höchstens 1.000 Zeichen.
3. [ ] **Formular** als eigene Komponente, z. B. `CoralStatusForm`, und **Seite** `CoralStatusPage` mit Laden,
       „nicht gefunden", Fehler und Inserat-Prüfung nach Entscheidung.
4. [ ] **Route** `/koralle/:id/status` außerhalb von `AppLayout`; Kommentarkopf in `App.tsx` ergänzen.
5. [ ] **Button** auf der Detailseite.
6. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] Wechsel ohne Notiz → genau ein Systemeintrag „Status geändert: Im Bestand → Verendet", kein Journaleintrag
- [ ] Wechsel mit Notiz → Systemeintrag **und** Journaleintrag mit heutigem Datum
- [ ] Die Plakette auf der Detailseite zeigt den neuen Status
- [ ] „Zur Abgabe" ist nicht wählbar; bei bestehendem Inserat ist kein Wechsel möglich (bei Entscheidung „sperren")
- [ ] Ohne Auswahl bzw. mit zu langer Notiz → Feldfehler, keine Anfrage (FR-6.6)
- [ ] Ladezustand, „nicht gefunden" und Fehler beim Speichern sind sichtbar (FR-6.4)
- [ ] Jede Option ist mindestens 44 px hoch und mit Tastatur bedienbar; Status nie nur über die Farbe erkennbar
- [ ] Bei 360 px kein waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- FR-1.9 nennt „Datum und optionale Notiz". Festgelegt ist die einfache Lesart ohne Datumsfeld (MS-6 README,
  Anmerkung zu Nr. 1) – nicht erneut aufmachen.
- `abgegeben` von Hand erzeugt keinen Abgabedatensatz; das macht erst FR-3.7 (MS-10).
- Die Sichtbarkeit von „Ableger erzeugen" und „Journaleintrag hinzufügen" bei `abgegeben`/`verendet` klärt
  TASK-09-09.

## Quellen

- `Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/tasks/README.md` – Anmerkung zu Nr. 1
- `Dokumentation/Meilensteine/MS-06_Detailseite-Steckbrief-Historie/tasks/TASK-06-07_Journaleintrag-anlegen.md` –
  Hinweistext, Textlänge
- `src/components/JournalEntryForm.tsx`, `src/components/CoralOffer.tsx`, `src/lib/labels.ts`
  (`CORAL_STATUS_LABELS`), `src/pages/CoralDetailPage.tsx` (`STATUS_DOT_CLASSES`)
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Formular „NEUE KORALLE", Feld „Status"
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.9, FR-3.4
