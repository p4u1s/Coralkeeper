# TASK-08a-01 · Vorbereitung: Deploy-Stand, Testkonten, Ablauf

**Status:** erledigt (01.10.2026)
**Bezug:** MS-08a („am deployten Stand", „Ergebnis protokolliert") · Abschnitt 7, Einleitung („frischer Nutzer ohne
Vorwissen") · FR-6.1 (ohne E-Mail-Bestätigung)
**Voraussetzung:** MS-8 abgeschlossen (TASK-08-09)

---

## Worum geht es

Bevor die Kette läuft, muss feststehen, dass der deployte Stand der aktuelle ist, dass die Konten bereitstehen und
wie mit Befunden umgegangen wird. Danach wird während der Abnahme nichts mehr umgestellt.

## Vor dem Start klären

- [x] **Wer spielt den frischen Nutzer?**
  - **(a)** Der Nutzer selbst, streng nur über die Oberfläche: keine Pfade in die Adresszeile tippen, nur Buttons,
    Links und Bottom-Navigation. Jede Stelle, an der gezögert oder gesucht wurde, kommt als Notiz ins Protokoll.
  - **(b)** Eine dritte Person ohne Projektkenntnis bekommt nur die neun Schritte als Aufgabenliste; der Nutzer
    schaut zu und protokolliert.
    → Vorschlag: **(b)**, wenn jemand verfügbar ist – sonst (a). Das ehrlichste Signal für „ohne Vorwissen".
    → **Entschieden am 01.10.2026:** (a).
- [x] **Gerät.**
  - **(a)** Ganze Kette auf einem echten Smartphone
  - **(b)** Kette im Firefox in Desktop-Breite, erneute Anmeldung (TASK-08a-04) auf dem Smartphone
  - **(c)** Kette im Firefox mit Responsive-Ansicht 390 px
    → Vorschlag: **(b)** – die erneute Anmeldung auf einem anderen Gerät zeigt zugleich, dass die Daten am Konto hängen
    und nicht im Browser.
    → **Entschieden am 01.10.2026:** (a).
- [x] **Testnutzer C.** E-Mail-Adresse und Passwort nach dem Schema der Konten A und B; die Adresse darf noch nicht
      registriert sein.
      → **Entschieden am 01.10.2026:** `user_c@example.com`. Das Passwort wird nicht dokumentiert.
- [x] **Blocker oder Notiz?**
      → Vorschlag: **Blocker** ist alles, was einen der neun Schritte oder die erneute Anmeldung scheitern lässt, sowie
      ein Verstoß gegen eine harte Regel aus `CLAUDE.md` (z. B. fremde Daten sichtbar, Löschen ohne Dialog).
      **Notiz** ist alles andere (Wortwahl, Zögern, Optik). Blocker werden im Gate behoben (Fix-Task), Notizen in
      TASK-08a-05 einem späteren Meilenstein zugeordnet.
      → **Entschieden am 01.10.2026:** wie vorgeschlagen.

## Schritte

### A · Deploy-Stand (Nutzer und Claude)

1. [x] Claude: `git status` im Projektordner `Coralkeeper/` – keine offenen Änderungen unter `src/`.
2. [x] Claude: `npm run build`, `npm run lint`, `npm run format` ohne Fehler (nur die bekannte Chunk-Warnung).
3. [x] Nutzer: alle Commits auf `main` gepusht; im Reiter „Actions" ist der Lauf zum **letzten** Commit grün.
4. [x] Nutzer: Adresse <https://p4u1s.github.io/Coralkeeper/> lädt; im privaten Fenster erscheint die Anmeldeseite.

### B · Supabase (Nutzer)

5. [x] Authentication → E-Mail-Provider: „Confirm email" ist weiterhin **aus** (FR-6.1, TASK-03-08).
6. [x] Kontrollabfrage im SQL-Editor – die Adresse von C ist frei:

   ```sql
   select count(*) as vorhanden from auth.users where email = '<E-Mail von C>';
   ```

   Erwartet: `0`.

### C · Konto B (Nutzer)

7. [x] Mit B anmelden: Anmeldedaten stimmen, Bestand und Beckenliste sind leer. B darf keine eigenen Daten aus der App
       haben, sonst ist in TASK-08a-04 schwer zu unterscheiden, wessen Daten B sieht. Danach abmelden.

## Fertig, wenn

- [x] Alle vier Fragen unter „Vor dem Start klären" sind entschieden und hier vermerkt
- [x] Der deployte Stand entspricht dem letzten Commit auf `main`, der Lauf ist grün
- [x] Build, Lint und Format ohne Fehler
- [x] E-Mail-Bestätigung ist aus, die Adresse von C ist frei, B ist anmeldbar und ohne eigene Daten
- [x] Entscheidungen in der Tabelle in [`README.md`](README.md) eingetragen

## Hinweise

- Ab jetzt nicht mehr pushen, bis das Gate durch ist – sonst ist unklar, gegen welchen Stand abgenommen wurde.
  Ausnahme: ein Fix-Task aus TASK-08a-05.
- Reine Dokumentationsänderungen (Task-Dateien, `Milestones.md`) lösen zwar einen Deploy aus, ändern die App aber
  nicht. Wenn Commits während des Gates nötig sind, den Commit-Stand im Protokoll von TASK-08a-05 festhalten.

## Quellen

- [`../MS-08a_GATE_MVP-Abnahme.md`](../MS-08a_GATE_MVP-Abnahme.md)
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 7, FR-6.1
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-08_Registrierung-Anmeldung.md` – E-Mail-Bestätigung
- `Dokumentation/Meilensteine/MS-07_Ableger-Inserat/tasks/TASK-07-08_RLS-Nachweis-zweiter-Nutzer.md` – Konten A und B
