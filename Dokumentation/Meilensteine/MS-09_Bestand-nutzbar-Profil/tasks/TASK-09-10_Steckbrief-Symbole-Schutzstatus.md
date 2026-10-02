# TASK-09-10 · Steckbrief mit Symbolen, Legende und Schutzstatus

**Status:** offen
**Bezug:** FR-2.3 („Icons **mit** Textlabel; Legende auf der Detailseite … ‚keine Angabe'"), FR-2.4 („mit sichtbarem
Hinweis, dass dies eine Eigenangabe und keine Rechtsauskunft ist"), NFR-1.4, NFR-1.8, NFR-4.2
**Voraussetzung:** TASK-09-01

---

## Worum geht es

Jeder Steckbriefwert bekommt ein Symbol neben dem Text, eine Legende auf der Detailseite erklärt die Symbole. Neu ist
das Feld Schutzstatus – im Formular und in der Anzeige, jeweils mit dem Hinweis auf die Eigenangabe. Leere Felder
zeigen weiter „keine Angabe".

## Vor dem Start klären

- [ ] **Symbol je Feld oder je Wert?**
  - **(a)** ein Symbol je Feld, der Wert steht als Text daneben („☀ Lichtbedarf – Hoch") – wie Design-Prompt P4
  - **(b)** der Wert als Anzahl Symbole (ein bis drei Sonnen für gering bis hoch), Text zusätzlich
  → Vorschlag: **(a)** (KISS). Symbole aus `lucide-react` wie im übrigen Projekt, angelehnt an P4:
  Lichtbedarf `Sun` · Strömung `Waves` · Platzierung `ArrowUpDown` · Nesselkraft `Zap` · Wuchsform `GitBranch` ·
  Schwierigkeitsgrad `Gauge` · Fütterung `Beef` (wie im Diary) · Besonderheiten `Sparkles` · Schutzstatus `Shield`.
- [ ] **Legende.**
  - Form: **(a)** aufklappbar mit shadcn `collapsible` (über die CLI, Befehl vorher zeigen), **(b)** aufklappbar mit
    HTML `details`/`summary`, **(c)** immer sichtbar
  - Inhalt: je Zeile Symbol, Feldname und ein Satz, z. B. „Lichtbedarf – wie viel Licht die Koralle braucht."
  - Ort: im Steckbrief-Tab unter den Kacheln, Titel „Legende: Was bedeuten die Symbole?" (P4)
  → Vorschlag: **(a)** wegen NFR-4.2, eingeklappt; die Sätze je Feld vorher vorlegen.
- [ ] **Schutzstatus.**
  - Beschriftungen: Unbekannt · Kein Schutzstatus · CITES II · CITES I; leer → „keine Angabe" (die Spalte ist nullable
    ohne Standardwert)
  - Hinweis: „Eigenangabe, keine Rechtsauskunft." – in der Anzeige mit Info-Symbol in derselben Kachel, im Formular
    unter dem Auswahlfeld
  - Kachel über die volle Breite, als letzte im Raster
  → Vorschlag: alle drei wie aufgeführt.

## Schritte

1. [ ] **Beschriftungen** in `src/lib/labels.ts`: Wertliste aus `Constants`, Record aus dem Enum `schutzstatus` (ein
       neuer Enum-Wert lässt den Build scheitern); `CORAL_PROFILE_LABELS` um „Schutzstatus" ergänzen.
2. [ ] **`CoralProfileInput`** und `toProfileRow` in `coral.ts` um `schutzstatus` erweitern; Kommentar
       „Schutzstatus bleibt MS-9" ersetzen.
3. [ ] **`CoralProfileForm`**: Auswahlfeld „Schutzstatus" mit „keine Angabe" als leerer Option (Muster `toLevel`),
       Hinweis darunter.
4. [ ] **`CoralProfile`**: Symbol je Feld (Record über alle Felder wie `PROFILE_LAYOUT`, damit keins vergessen wird),
       `aria-hidden` am Symbol, Text bleibt sichtbar; Schutzstatus-Kachel mit Hinweis.
5. [ ] **Legende** nach Entscheidung.
6. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] Jede Kachel zeigt Symbol, Feldname und Wert bzw. „keine Angabe" – nie ein Symbol allein (FR-2.3, NFR-1.4)
- [ ] Die Legende erklärt jedes verwendete Symbol und ist mit Tastatur auf- und zuklappbar
- [ ] Schutzstatus lässt sich wählen, ändern und auf „keine Angabe" zurücksetzen; der Hinweis ist in Formular und
      Anzeige sichtbar (FR-2.4)
- [ ] Eine Koralle ohne Steckbrief zeigt weiterhin bei jedem Feld „keine Angabe" (Abnahmekriterium 5)
- [ ] Ein neuer Ableger übernimmt den Schutzstatus (`toFragRow` kopiert ihn schon)
- [ ] Bei 360 px kein waagerechtes Scrollen, lange Werte umbrechen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- design.md legt die Steckbrief-Symbole nicht fest; Quelle ist der Design-Prompt P4 aus MS-1. design.md gilt für Farben
  (Symbole in `currentColor`, Text sekundär für Feldnamen) und Regel 2.
- Der Hinweis im Ableger-Formular nennt „Art, Handelsname und Steckbrief" – der Schutzstatus ist damit erfasst, der
  Text muss nicht geändert werden.
- `CoralProfileForm` hat bisher keine Pflichtfelder und keine Legende „* Pflichtfeld" – bleibt so.

## Quellen

- `src/components/CoralProfile.tsx`, `src/components/CoralProfileForm.tsx`, `src/services/coral.ts`,
  `src/lib/labels.ts`, `src/components/DiaryEntryCard.tsx` (Symbol `Beef`)
- `Dokumentation/Design/MS-1_Design-Prompts.md` – Prompt 4, Artboard 11
- `design.md` – Abschnitt 5 Regel 2
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-2.2, FR-2.3, FR-2.4, NFR-1.8
