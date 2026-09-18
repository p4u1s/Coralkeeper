# TASK-03-09 · Geschützte Routen sowie Lade-, Fehler- und Validierungszustände

**Status:** erledigt
**Bezug:** FR-6.3 (geschützte Routen), FR-6.4 (Lade-, Leer-, Fehlerzustände), FR-6.6 (Feldfehler)
**Voraussetzung:** TASK-03-08

---

## Worum geht es

**Routenschutz (FR-6.3):** Wer nicht angemeldet ist, landet auf der Anmeldung – egal welche Adresse er aufruft.
Wer angemeldet ist und die Anmeldeseite aufruft, landet auf dem Bestand. Genau das prüft die Definition of Done von MS-3.

**Zustände (FR-6.4, FR-6.6):** Die Auth-Formulare zeigen, dass sie arbeiten, was schiefging und welches Feld falsch ist – auf Deutsch.

## Vor dem Start klären

- [x] **Routenpfade.** Die verbindliche Routenliste („Abschnitt 7 · Bildschirme") steht nicht im aktiven Dokumentenbestand;
      die Entscheidung, sie zurückzuholen, ist noch offen. MS-3 braucht mindestens drei Pfade:
      Anmeldung, Registrierung und eine geschützte Startseite (Bestand, vorerst Platzhalter).
      → Pfade festlegen, bevor der Router angelegt wird, damit sie in MS-4 nicht umbenannt werden müssen.
      → **Entschieden:** `/login`, `/register`, `/` (Bestand) aus Abschnitt 7 der alten Requirements v2.2 (17.09.2026).
- [x] **Deep-Links auf GitHub Pages.** GitHub Pages kennt keine Umleitung aller Pfade auf `index.html`.
      Ruft man `…/bestand` direkt auf, liefert der Server zunächst einen 404. Zwei übliche Lösungen:
  - **(a) Hash-Routing** (`createHashRouter`): Adressen sehen aus wie `…/#/bestand`. Funktioniert ohne jede Serverkonfiguration.
  - **(b) Browser-Routing mit `404.html`-Fallback:** Beim Build wird `index.html` zusätzlich als `404.html` abgelegt.
    Saubere Adressen; der Server antwortet bei Direktaufrufen formal mit Status 404, die App lädt aber normal.

  Beide Wege sind einfach. Die Wahl beeinflusst den Router hier und das Deployment in TASK-03-10.
  → **Entschieden:** (b) Browser-Routing mit `404.html`-Fallback (17.09.2026).

- [x] **`@react-router/fs-routes` ist installiert**, wird aber nur im Framework-Modus von React Router gebraucht –
      der ist nicht eingerichtet (kein `@react-router/dev`, `vite.config.ts` nutzt das normale React-Plugin).
      → Klären, ob das Paket entfernt werden soll.
      → **Entschieden:** Paket bleibt installiert (17.09.2026).

## Schritte

### A · Router und Routenschutz

1. [x] Router in `src/App.tsx` (oder eigener Datei) anlegen – React Router ist in Version 8 bereits installiert.
       `basename` auf `import.meta.env.BASE_URL` setzen, damit die App auch unter dem Unterpfad von GitHub Pages läuft (TASK-03-10).
2. [x] **Geschützter Bereich:** eine Layout-Route, die `useAuth()` abfragt:
   - `status === 'loading'` → Ladeanzeige (**nicht** umleiten, sonst springt die Seite beim Neuladen kurz zur Anmeldung)
   - `'unauthenticated'` → `<Navigate to="<Anmeldung>" replace />`
   - `'authenticated'` → Inhalt anzeigen
3. [x] **Nur-für-Gäste-Bereich** für Anmeldung und Registrierung: angemeldet → `<Navigate to="<Bestand>" replace />`.
4. [x] **Platzhalterseite Bestand** im geschützten Bereich: Überschrift „Bestand", Hinweis „Angemeldet als …", Button „Abmelden".
       Wird in MS-4/MS-5 durch die echte Seite ersetzt.
5. [x] **Unbekannte Pfade** auf die Startseite leiten (die Umleitung zur Anmeldung übernimmt dann Schritt 2).
6. [x] Den Vorlagen-Inhalt aus `src/App.tsx` („Project ready!") entfernen.

### B · Validierung (FR-6.6)

7. [x] Prüfung **vor** dem Absenden, Fehler **unter** dem jeweiligen Feld:
   - E-Mail: Pflichtfeld, gültiges Format
   - Passwort: Pflichtfeld; bei der Registrierung Mindestlänge = Wert aus den Supabase-Auth-Einstellungen (TASK-03-06, Schritt 8)
   - ggf. Passwort-Wiederholung: muss übereinstimmen
8. [x] Feldfehler zugänglich machen: `aria-invalid` am Feld, Fehlertext per `aria-describedby` verknüpft.
9. [x] Fehler verschwinden, sobald das Feld korrigiert ist.

### C · Lade- und Fehlerzustand (FR-6.4)

10. [x] **Laden:** Während der Anfrage ist der Button deaktiviert und zeigt z. B. „Wird angemeldet …". Doppeltes Absenden ist nicht möglich.
11. [x] **Fehler vom Server** als Meldung über dem Formular, auf Deutsch, anhand des Supabase-Fehlercodes. Vorschläge:

    | Code / Fall           | Meldung                                                       |
    | --------------------- | ------------------------------------------------------------- |
    | `invalid_credentials` | „E-Mail oder Passwort ist falsch."                            |
    | `user_already_exists` | „Für diese E-Mail gibt es bereits ein Konto."                 |
    | `weak_password`       | „Das Passwort ist zu kurz oder zu einfach."                   |
    | keine Verbindung      | „Keine Verbindung zum Server. Bitte später erneut versuchen." |
    | alles andere          | „Das hat nicht geklappt. Bitte erneut versuchen."             |

12. [x] **Leerzustand:** In MS-3 gibt es noch keine Liste – entfällt hier.

## Fertig, wenn

- [x] Direkter Aufruf der geschützten Startseite ohne Session → Anmeldeseite (FR-6.3, Definition of Done MS-3)
- [x] Aufruf der Anmeldeseite mit Session → Bestand (FR-6.3)
- [x] Neuladen einer geschützten Seite mit Session → kein kurzes Aufblitzen der Anmeldeseite
- [x] Absenden mit leeren oder ungültigen Feldern zeigt Feldfehler unter dem Feld, es geht keine Anfrage raus
- [x] Falsches Passwort und bereits vergebene E-Mail zeigen verständliche deutsche Meldungen
- [x] Während einer Anfrage ist der Button deaktiviert und beschriftet
- [x] Lokal mit `npm run build` und `npm run preview` geprüft (Build-Stand, nicht nur Dev-Server)

Abnahme am 17.09.2026 am Build-Stand durchgespielt, alle sieben Punkte bestanden.

## Hinweise

- **Browser-Prüfung abschalten:** Ohne `noValidate` am `<form>` prüft der Browser `type="email"` selbst und bricht das
  Absenden bei ungültigem Format ab – `handleSubmit` läuft dann nicht, und die Browser-Sprechblase wird am Desktop
  oft vom Passwortmanager („Passwörter verwalten") verdeckt. Beobachtet in TASK-03-08 (17.09.2026). Für die eigenen
  Feldfehler (Schritt 7) deshalb `noValidate` an beiden Auth-Formularen setzen; `type="email"` bleibt wegen der
  Handy-Tastatur.
- `Navigate` immer mit `replace`, sonst führt der Zurück-Button des Browsers wieder auf die umgeleitete Seite.
- Den Zielpfad nach der Anmeldung (dorthin zurück, wo der Nutzer hinwollte) verlangt FR-6.3 nicht – FR-6.3 nennt ausdrücklich den Bestand.
- Die Bottom-Navigation kommt in MS-4. In MS-3 keine Navigation vorwegnehmen.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-6.3, FR-6.4, FR-6.6, Abschnitt 7 Punkt 2
- [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) – Definition of Done
- `design.md` – Abschnitt 4 (Eingabefeld), Abschnitt 5 (Harte Regeln)
