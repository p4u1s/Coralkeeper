# TASK-08a-02 · Abnahmelauf Teil 1: Schritte 1–4

**Status:** erledigt (02.10.2026)
**Bezug:** Abschnitt 7 Schritte 1–4 · MVP 1–3 · FR-6.1, FR-6.3, FR-6.10, FR-1.1, FR-1.15, FR-1.2, FR-1.14
**Voraussetzung:** TASK-08a-01

---

## Worum geht es

Der frische Nutzer C registriert sich, meldet sich an, wird zur Beckenanlage geführt und legt seine erste Koralle an.
Alles am deployten Stand, auf dem in TASK-08a-01 festgelegten Gerät.

## Schritte

1. [x] Protokoll unten Zeile für Zeile durchspielen. Wer spielt, nutzt nur die Oberfläche (Entscheidung 1).
2. [x] Beim Durchspielen die **IDs aus der Adresszeile** notieren – sie werden in TASK-08a-04 für die Direktaufrufe
       von B gebraucht:
   - Becken: `…/becken/<ID>` → `29555823-b6ce-4063-a410-e1e9f7172281` („Becken 1“)
   - Koralle: `…/koralle/<ID>` → `b4dd9cf2-44a6-41b4-8700-3e462ffc7a34` („testkorall1“)
   - Nutzer C: `1d72c3d7-fcd9-41dd-a1e1-4ea1cd574602`
3. [x] Für Zeile 2 die Kontrollabfrage im SQL-Editor ausführen:

   ```sql
   select p.*
     from public.profil p
     join auth.users u on u.id = p.id
    where u.email = '<E-Mail von C>';
   ```

   Erwartet: genau **eine** Zeile.

4. [x] Jede Stelle, an der gezögert, gesucht oder nachgefragt wurde, als Notiz unter das Protokoll.

## Protokoll

Datum: 01.10.2026 (Zeilen 1–2), 02.10.2026 (Zeilen 3–8) · Gerät: Smartphone, Firefox · Gespielt von: Nutzer selbst ·
Adresse: <https://p4u1s.github.io/Coralkeeper/>

| #   | Test                                                       | Erwartet                                                                  | Ergebnis  |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------------------- | --------- |
| 1   | Registrierung mit E-Mail und Passwort von C                | Konto angelegt, ohne Bestätigungsmail anmeldbar (**Abnahme 1**, FR-6.1)   | bestanden |
| 2   | Kontrollabfrage `profil`                                   | genau eine Zeile für C (**Abnahme 1**, FR-6.10)                           | bestanden |
| 3   | Abmelden; im privaten Fenster `/Coralkeeper/becken` öffnen | Anmeldeseite statt Beckenliste (**Abnahme 2**, FR-6.3)                    | bestanden |
| 4   | Als C anmelden                                             | Weiterleitung auf den Bestand (**Abnahme 2**)                             | bestanden |
| 5   | Bestand ohne Becken                                        | Hinweis „Lege zuerst ein Becken an" mit Button (**Abnahme 3**, FR-1.15)   | bestanden |
| 6   | Becken über den Hinweis anlegen                            | gelingt in einem Formular, Becken in der Beckenliste (**Abnahme 3**)      | bestanden |
| 7   | Koralle anlegen, Becken leer lassen, speichern             | Feldfehler am Becken, nichts gespeichert (**Abnahme 4**, FR-1.14, FR-6.6) | bestanden |
| 8   | Becken wählen, speichern                                   | Koralle im Bestand, anklickbar (**Abnahme 4**)                            | bestanden |

Notizen: keine

## Fertig, wenn

- [x] Alle acht Zeilen haben ein Ergebnis
- [x] Die IDs von Becken und Koralle sind notiert
- [x] Notizen festgehalten (auch „keine")
- [x] Ein nicht bestandener Test ist als Befund vermerkt – **nicht** behoben (Auswertung in TASK-08a-05)

## Hinweise

- Scheitert ein Schritt, so dass die Kette nicht weitergeht (z. B. Koralle lässt sich nicht speichern): abbrechen,
  Befund notieren, direkt mit TASK-08a-05 weitermachen.
- Konto C danach **nicht** verändern – TASK-08a-03 baut auf genau diesem Stand auf.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 7 Schritte 1–4, Abschnitt 1.1
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-10_Deployment-Abnahme.md`
- `Dokumentation/Meilensteine/MS-04_UI-Shell-Becken/tasks/TASK-04-09_Responsive-Deployment-Abnahme.md`
- `Dokumentation/Meilensteine/MS-05_Koralle-Bestand/tasks/TASK-05-05_Responsive-Deployment-Abnahme.md`
