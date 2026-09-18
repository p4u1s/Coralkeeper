# TASK-03-01 · Projekt aufsetzen

**Status:** erledigt (laut `Tasks.md`)
**Bezug:** NFR-4.1 (TypeScript Strict), NFR-4.2 (shadcn/ui)
**Voraussetzung:** keine

---

## Worum geht es

Das leere Grundgerüst der App: Vite, React, TypeScript im Strict-Modus, Tailwind und shadcn/ui.
Auf diesem Gerüst bauen alle weiteren Tasks auf.

## Was bereits steht (Durchsicht 11.09.2026)

- Vite 8, React 19, TypeScript 6, Tailwind 4, shadcn/ui (Stil `base-lyra`, Icons `lucide`)
- `"strict": true` in `tsconfig.app.json`
- Pfad-Alias `@/` → `src/` in `vite.config.ts` und `tsconfig.app.json`
- ESLint mit `typescript-eslint` (Empfehlungsregeln), Prettier mit Tailwind-Plugin
- Erste shadcn-Komponente: `src/components/ui/button.tsx`
- Schriften DM Sans und Inter als `@fontsource`-Pakete

## Vor dem Start klären (Nacharbeiten)

Die folgenden Punkte sind bei der Durchsicht aufgefallen. Keiner blockiert den nächsten Task,
aber Punkt 1 betrifft die Prüfbarkeit von NFR-4.1 in allen weiteren Tasks.

- [x] **1. `npm run lint` schlägt fehl.**
      `src/components/ui/button.tsx:55` – Regel `react-refresh/only-export-components`, weil neben der
      Komponente auch `buttonVariants` exportiert wird. Das betrifft erfahrungsgemäß mehrere shadcn-Komponenten.
      → Entscheiden: Regel für `src/components/ui/` abschwächen, oder den Ordner vom Lint ausnehmen.
- [x] **2. Der Theme-Provider erlaubt ein Light Theme.**
      `src/components/theme-provider.tsx` startet mit `"system"` und schaltet mit der Taste `d` zwischen Hell und Dunkel um.
      `design.md` (Abschnitt 7) und `CLAUDE.md` schließen ein Light Theme aus.
      Laut `Milestones.md` gehört das Dark Theme zum Umfang von **MS-4** – entscheiden, ob es dort oder schon jetzt bereinigt wird.
- [x] **3. `src/App.tsx` ist noch der Vorlagen-Platzhalter** („Project ready!"). Wird in TASK-03-09 ersetzt – hier nichts tun.

## Schritte

- [x] Vite-Projekt mit React und TypeScript anlegen
- [x] Tailwind einbinden
- [x] shadcn/ui initialisieren (`components.json`)
- [x] Strict-Modus aktiv
- [x] Nacharbeiten 1 und 2 entscheiden und ggf. umsetzen (jeweils mit Freigabe)

## Fertig, wenn

- [x] `npm run dev` startet die App
- [x] `npm run build` läuft ohne Fehler durch (prüft über `tsc -b` auch die Typen)
- [x] `npm run lint` läuft ohne Fehler durch
- [x] `tsconfig.app.json` enthält `"strict": true`

## Hinweise

- **Zurückgestellt (11.09.2026):** `npm run typecheck` ruft `tsc --noEmit` auf der Root-`tsconfig.json` auf.
  Die enthält `"files": []`, dadurch werden derzeit 0 Dateien geprüft. Bis das geklärt ist,
  gilt `npm run build` als Typprüfung.
- `typescript-eslint` meldet in den Empfehlungsregeln `any` als Fehler – damit ist NFR-4.1 („kein `any`") über den Lint prüfbar, **sobald** der Lint grün ist.
- Git: Im Repo gibt es noch **keinen Commit** und **keinen Remote**. Das wird spätestens in TASK-03-10 (Deployment) gebraucht.
- Die `README.md` im Projektwurzel ist noch der Vorlagentext von shadcn – nicht Teil von MS-3.

## Quellen

- [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) – Umfang, erster Punkt
- `CLAUDE.md` – Harte Regeln NFR-4.1, NFR-4.2; Dark Theme als Standard
- `design.md` – Abschnitt 7 „Nicht im Umfang: Light Theme"
