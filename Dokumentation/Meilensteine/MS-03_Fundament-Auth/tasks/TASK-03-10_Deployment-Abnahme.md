# TASK-03-10 · Responsive prüfen, deployen und am deployten Stand testen

**Status:** erledigt
**Bezug:** Definition of Done MS-3 · NFR-4.5 (lauffähiges Deployment) · NFR-1.3, NFR-1.4, NFR-1.6
**Voraussetzung:** TASK-03-09
**Ziel-Plattform:** GitHub Pages (festgelegt am 11.09.2026)

---

## Worum geht es

Der Stand aus TASK-03-08 und 03-09 soll **im Netz** laufen, nicht nur lokal. Das erste Deployment gehört bewusst in MS-3
und nicht ans Projektende: Probleme mit Pfaden, Umgebungsvariablen oder Routing fallen so auf, solange die App noch klein ist.

Erst wenn der Auth-Ablauf auf dem **deployten** Stand funktioniert, ist MS-3 fertig.

## Vor dem Start klären

- [x] **Repo-Name auf GitHub.** GitHub Pages liefert die App unter `https://<nutzername>.github.io/<repo-name>/` aus.
      Der Repo-Name bestimmt den `base`-Pfad in `vite.config.ts`.
      → **Entschieden:** bestehendes Repo `p4u1s/Coralkeeper`, `base: "/Coralkeeper/"` (18.09.2026).
- [x] **Öffentlich oder privat?** GitHub Pages für private Repos ist nur mit kostenpflichtigem GitHub-Plan verfügbar.
      → **Entschieden:** öffentlich (18.09.2026).
- [x] **Branch:** Lokal heißt der Branch `master`, als Hauptbranch ist `main` eingestellt. Festlegen, von welchem Branch deployt wird.
      → **Entschieden:** `master` in `main` umbenannt, deployt wird von `main` (18.09.2026).
- [x] **Was kommt in den ersten Commit?** Im Repo gibt es noch keinen Commit. Unter anderem liegt `.claude/` noch unversioniert im Projekt.
      → **Entschieden:** alles außer `.claude/`, `Learnings/` und `supabase/.temp/` (per `.gitignore` ausgeschlossen) (18.09.2026).

## Schritte

### A · Responsive und Bedienbarkeit (vor dem Deployment, lokal)

1. [x] In den Browser-DevTools Anmelde- und Registrierungsseite bei **360 px**, **390 px** und Desktop-Breite ansehen:
   - [x] kein waagerechtes Scrollen
   - [x] alle Felder und Buttons vollständig sichtbar
2. [x] Trefferflächen ≥ 44 × 44 px (Eingabefelder und Buttons sind laut `design.md` 48 hoch; Links prüfen) (NFR-1.3)
3. [x] Jedes Feld hat ein sichtbares Label, kein Icon ohne Text (NFR-1.4)
4. [x] Kontrast mit den DevTools oder Lighthouse prüfen – mindestens WCAG 2.1 AA (NFR-1.4)
5. [x] Bedienung nur mit der Tastatur: Tab-Reihenfolge sinnvoll, Absenden mit Enter
6. [x] Nichts funktioniert nur per Hover (NFR-1.3)

### B · Repo und GitHub

7. [x] Prüfen, dass `.env.local` **nicht** im Commit landet (`git status` vor dem ersten Commit).
8. [x] Ersten Commit anlegen, Repo auf GitHub erstellen, Remote eintragen, pushen.
       → Auf GitHub lag bereits ein „Initial commit" mit `README.md`; per `git pull --allow-unrelated-histories` zusammengeführt, `README.md` aus GitHub übernommen.

### C · Build für GitHub Pages vorbereiten

9. [x] In `vite.config.ts` `base: '/<repo-name>/'` setzen. Der Router nutzt dafür bereits `import.meta.env.BASE_URL` (TASK-03-09).
10. [x] Deep-Link-Lösung aus TASK-03-09 umsetzen:
    - bei **Hash-Routing:** nichts weiter nötig
    - bei **`404.html`-Fallback:** nach dem Build `dist/index.html` nach `dist/404.html` kopieren (im Workflow oder als Build-Schritt)
    → Kopie im Workflow (`cp`), nicht im Build-Script – `cp` läuft in npm-Scripts unter Windows nicht.
11. [x] Lokal testen: `npm run build`, dann `npm run preview` – die App muss unter dem Unterpfad laufen.

### D · Automatisches Deployment

12. [x] **Secrets hinterlegen:** GitHub-Repo → Settings → Secrets and variables → Actions:
        `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` (dieselben Werte wie in `.env.local`).
13. [x] **Pages aktivieren:** GitHub-Repo → Settings → Pages → Source: „GitHub Actions".
14. [x] **Workflow anlegen:** `.github/workflows/deploy.yml`. Skizze der nötigen Bestandteile (aktuelle Hauptversionen der Actions prüfen):

    ```yaml
    name: Deploy
    on:
      push:
        branches: [main] # Branch aus „Vor dem Start klären"
    permissions:
      contents: read
      pages: write
      id-token: write
    jobs:
      deploy:
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: <gleiche Hauptversion wie lokal, siehe node -v>
              cache: npm
          - run: npm ci
          - run: npm run build
            env:
              VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
              VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
          # nur bei 404.html-Fallback:
          # - run: cp dist/index.html dist/404.html
          - uses: actions/upload-pages-artifact@v3
            with:
              path: dist
          - id: deployment
            uses: actions/deploy-pages@v4
    ```

    → Umgesetzt mit Node 24 und den Action-Versionen aus der Skizze (18.09.2026).

15. [x] Pushen und im Reiter „Actions" prüfen, dass der Lauf grün ist.
16. [x] **Supabase-URL-Einstellungen:** Unter Authentication → URL Configuration die **Site URL** auf die GitHub-Pages-Adresse setzen.
        Mit ausgeschalteter E-Mail-Bestätigung ist das für MS-3 noch nicht kritisch, wird aber z. B. für Passwort-Reset (FR-6.7) gebraucht.

### E · Abnahme am deployten Stand

17. [x] Die Tests aus dem Protokoll unten auf der **GitHub-Pages-Adresse** durchspielen, am besten auch einmal auf einem echten Smartphone.
18. [x] TASK-03-01 bis 03-10 in [`../Tasks.md`](../Tasks.md) abhaken.

## Abnahmeprotokoll

Datum: 18.09.2026 · Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Test                                                                         | Erwartet                                                     | Ergebnis  |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ | --------- |
| 1   | Registrierung mit neuer, erfundener E-Mail                                   | Konto angelegt, `profil`-Datensatz in Supabase               | bestanden |
| 2   | Abmelden, dann mit denselben Daten anmelden                                  | Anmeldung ohne E-Mail-Bestätigung, Weiterleitung auf Bestand | bestanden |
| 3   | Im privaten Fenster (ohne Session) die geschützte Startseite direkt aufrufen | Weiterleitung auf die Anmeldeseite                           | bestanden |
| 4   | Angemeldet die Anmeldeseite direkt aufrufen                                  | Weiterleitung auf den Bestand                                | bestanden |
| 5   | Angemeldet eine geschützte Seite neu laden (F5)                              | bleibt angemeldet, kein Aufblitzen der Anmeldung             | bestanden |
| 6   | Falsches Passwort                                                            | deutsche Fehlermeldung, Feld bleibt gefüllt                  | bestanden |
| 7   | Leeres Formular absenden                                                     | Feldfehler unter den Feldern                                 | bestanden |
| 8   | Ansicht bei 360 px Breite                                                    | kein waagerechtes Scrollen, alles bedienbar                  | bestanden |

## Fertig, wenn

- [x] Die App ist unter der GitHub-Pages-Adresse erreichbar
- [x] Jeder Push auf den festgelegten Branch deployt automatisch
- [x] Kein Schlüssel steht im Repo; die Werte kommen aus den GitHub-Secrets
- [x] Das Abnahmeprotokoll ist vollständig und alle Tests sind bestanden
- [x] **Definition of Done MS-3:** Registrierung → Anmeldung → geschützte Route funktioniert auf dem deployten Stand;
      ein direkter Aufruf einer geschützten Route ohne Session leitet zur Anmeldung

## Hinweise

- **Weiße Seite nach dem Deployment?** Fast immer ein falscher `base`-Pfad – die JavaScript-Dateien werden dann unter der falschen Adresse gesucht. In den DevTools im Reiter „Netzwerk" nachsehen.
- **„Supabase-Variablen fehlen" auf der deployten Seite?** Die Secrets sind nicht gesetzt oder heißen anders als im Code. Vite setzt die Werte **beim Build** ein – nach dem Korrigieren der Secrets den Workflow neu starten.

## Quellen

- [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) – Umfang letzter Punkt, Definition of Done
- `Dokumentation/Meilensteine/Milestones.md` – Abschnitt 4, Punkt 7 („Deployment in MS-3, nicht in MS-12")
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-1.3, NFR-1.4, NFR-1.6, NFR-4.5, Abschnitt 7 Punkte 1 und 2
- `CLAUDE.md` – Deployment: GitHub Pages
