<!-- ================================================================= -->
<!--  AB HIER: VORSCHLAG CLAUDE, 09.09.2026 - noch nicht uebernommen   -->
<!--  Der Text oberhalb dieser Linie ist der bisherige Stand.          -->
<!-- ================================================================= -->

> **▼ Vorschlag Claude (09.09.2026) — zur Prüfung, noch nicht in Kraft ▼**
> Ersetzt bei Freigabe den gesamten Text oberhalb dieser Markierung.

# Coralkeeper

Mobile-First-Webapp zur Verwaltung von Korallenbeständen für Züchter.
Abschlussprojekt einer Weiterbildung zum Frontend-Developer — **kein Produktivsystem**:
keine Rechtsverbindlichkeit, kein Zahlungsverkehr, keine Moderation, keine Datenmigration.

**Leitprinzip KISS:** im Zweifel die einfachere Lösung. Lieber ein Feature weniger
als ein halbes Feature mehr. Code muss menschenlesbar, wartbar und testbar sein.

## Stack

TypeScript (strict) · React mit Vite · Tailwind + shadcn/ui · Supabase (Auth, Postgres, Storage, RLS)
Deployment: Github Pages. Sprache Deutsch, Formate de-DE (`12.03.2026` · `8,1 dKH` · `250 l`).

## Dokumente und ihre Rangfolge

Bei Widerspruch gilt von oben nach unten:

1. `design.md` — Designsystem, hat Vorrang vor allen anderen Dokumenten
2. `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` — Anforderungen (FR-/NFR-IDs)
3. `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` — verbindliches Schema, Typen, RLS-Matrix
4. `Dokumentation/Meilensteine/Milestones.md` + `Dokumentation/Meilensteine/MS-*.md` — Reihenfolge, Umfang, Definition of Done

`Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` ist die visuelle Referenz zu `design.md`.

## Namensschema — nicht verwechseln

- `MS-1` … `MS-12` = **Meilensteine** (Reihenfolge der Umsetzung). Präfix `MS-` ist Pflicht.
- `M1` … `M6` = **Module** der Anforderungsanalyse (M1 Bestand & Becken, …).
- `FR-x.y` / `NFR-x.y` = einzelne Anforderungen. Ausgelagerte IDs bleiben frei, es wird nicht nachgerückt.

Änderungen immer gegen die betroffene FR-/NFR-ID begründen.

## Harte Regeln (gelten in jedem Meilenstein, nicht verschiebbar)

| ID      | Regel                                                                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-4.1 | TypeScript strict, kein `any` im eigenen Code                                                                                                           |
| NFR-4.2 | UI-Komponenten aus shadcn/ui, keine zweite UI-Bibliothek                                                                                                |
| NFR-4.3 | Datenzugriff nur über `src/services/*`, nie Supabase direkt in Komponenten. Serverstate über eigene Hooks — kein TanStack Query, keine State-Bibliothek |
| NFR-4.4 | Datenbanktypen aus dem Supabase-Schema generieren, nicht handschreiben                                                                                  |
| FR-6.2  | RLS auf jeder neuen Tabelle, kein Zugriff auf fremde Daten                                                                                              |
| FR-6.4  | Lade-, Leer- und Fehlerzustand in jeder Liste und jedem Formular                                                                                        |
| FR-6.5  | Bestätigungsdialog vor jeder löschenden Aktion                                                                                                          |
| FR-6.6  | Formularvalidierung mit Feldfehlern                                                                                                                     |
| NFR-1.3 | Trefferflächen ≥ 44 × 44 px, keine Hover-abhängige Funktion                                                                                             |
| NFR-1.4 | Kein Icon ohne Textlabel, sichtbare Labels, Kontrast WCAG 2.1 AA                                                                                        |
| NFR-1.6 | Nutzbar ab 360 px Breite                                                                                                                                |

Drei fachliche Invarianten:

- **Keine Koralle ohne Becken** (`koralle.becken_id NOT NULL`)
- **Keine Daten ohne Profil** (`nutzer_id` auf jeder fachlichen Tabelle, per RLS abgesichert)
- **Diary editierbar, Historie nicht** — Historieneinträge sind append-only (FR-3.3)

## Konventionen

- Datenbank: deutsch, `snake_case` (`becken_ereignis`, `nutzer_id`) — siehe ER-Modell
- Frontend: englische Bezeichner im Code, deutsche Strings in der UI
- Dark Theme ist der Standard, ein Light Theme ist ausdrücklich nicht im Umfang
- Farben, Maße und Komponentenregeln kommen aus `design.md`, nicht aus eigenem Ermessen

## Arbeitsweise

Es wird meilensteinweise gearbeitet. Vor Änderungen den aktuellen `MS-*.md` lesen —
Umfang und Definition of Done stehen dort. Umfang eines Meilensteins nicht eigenmächtig
erweitern; Auffälligkeiten außerhalb des Umfangs benennen, nicht miterledigen.

## Befehle

<!-- ergänzen, sobald das Projekt in MS-3 aufgesetzt ist: dev, build, typecheck, test, supabase gen types -->

<!-- ================================================================= -->
<!--  ENDE VORSCHLAG CLAUDE                                            -->
<!-- ================================================================= -->

## Wichtig

- Code muss menschenlesbar, wartbar, testbar sein

- Keine Annahmen oder erfundene Tatsachen treffen, bei Unklaheiten immer nachfragen.

- Als Validierung für Fehler etc. nach CODEÄNDERUNGEN, führe nur build lint und format aus. Keine Tests, auch keine Smoke-Tests!
