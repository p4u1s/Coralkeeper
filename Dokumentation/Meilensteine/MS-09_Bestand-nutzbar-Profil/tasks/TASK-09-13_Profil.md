# TASK-09-13 · Profil ansehen und bearbeiten

**Status:** offen
**Bezug:** FR-6.8 („Anzeigename, Kontaktdaten für M4"), FR-6.4, FR-6.6, FR-6.10, NFR-1.3, NFR-1.4 · RLS-Matrix
`profil` UPDATE
**Voraussetzung:** TASK-09-02 (UPDATE-Policy `profil_update_eigenes`)

---

## Worum geht es

Die Profilseite zeigt Anzeigename, Kontakt-E-Mail und Telefon; eine eigene Seite ändert sie. Die Kontaktdaten sind für
die Vermittlung gedacht (FR-4.5, MS-11) – andere Nutzer sehen sie erst nach der Auswahl einer Anfrage.

## Vor dem Start klären

- [ ] **Anzeige auf `/profil`.** Mockup: Karte mit Avatar (Initialen, 56 × 56), Name und E-Mail, drei Kennzahlen
      (Korallen, Becken, Einträge), „Einheiten und Formate", „Daten exportieren", „Abmelden".
  - Vorschlag: Karte mit Initialen-Avatar, Anzeigename und Kontakt-E-Mail; darunter Telefon bzw. „keine Angabe";
    Button „Profil bearbeiten"; „Abmelden" bleibt.
  - Kennzahlen, „Einheiten und Formate" und „Daten exportieren" fordert keine Anforderung → Vorschlag: weglassen.
  - „Angemeldet als …" zeigt die Anmelde-E-Mail, die von der Kontakt-E-Mail abweichen kann → behalten, z. B. klein
    unter der Karte?
- [ ] **Felder und Prüfung.** Vorschlag:
  - Anzeigename * – höchstens 100 Zeichen
  - Kontakt-E-Mail * – Format wie bei der Anmeldung (`EMAIL_PATTERN`), Hinweis „Ändert nicht die E-Mail-Adresse für
    die Anmeldung."
  - Telefon (optional) – Ziffern, Leerzeichen und `+ - / ( )`, höchstens 30 Zeichen
- [ ] **Hinweis zu den Kontaktdaten.** Vorschlag im Formular: „Andere Nutzer sehen deine Kontaktdaten erst, wenn du
      eine Anfrage zu deinem Inserat auswählst." – stimmt auch, falls MS-11 entfällt (dann sieht sie nie jemand).
- [ ] **Dateinamen.** Vorschlag: `updateOwnProfile` in `src/services/profile.ts`, Hook `src/hooks/useProfile.ts`,
      `src/components/ProfileForm.tsx`, `src/pages/ProfileEditPage.tsx`.

## Schritte

1. [ ] **Service:** Eingabetyp per `Pick` auf `anzeigename`, `kontakt_email`, `kontakt_telefon`; `updateOwnProfile`
       schreibt nur diese drei (leeres Telefon → `null`), deutsche Fehlermeldung mit `cause`.
2. [ ] **Hook `useProfile()`** mit Lade- und Fehlerzustand, Muster `useTank` (ein Datensatz).
3. [ ] **Validierung** in `src/lib/validation.ts` nach Entscheidung.
4. [ ] **`ProfileForm`** und **`ProfileEditPage`** (Route `/profil/bearbeiten` außerhalb von `AppLayout`, Kommentarkopf
       in `App.tsx` ergänzen); nach dem Speichern zurück zu `/profil`.
5. [ ] **`ProfilePage`** nach Entscheidung umbauen.
6. [ ] Browser-Prüfung (Nutzer) nach „Fertig, wenn".

## Fertig, wenn

- [ ] `/profil` zeigt die gespeicherten Werte; bei einem frischen Konto steht die E-Mail als Anzeigename (FR-6.10)
- [ ] Änderungen erscheinen nach dem Speichern und bleiben nach Abmelden und Anmelden erhalten
- [ ] Leerer Anzeigename, ungültige Kontakt-E-Mail, ungültiges Telefon → Feldfehler, keine Anfrage (FR-6.6)
- [ ] Ladezustand und Fehlerzustand auf beiden Seiten (FR-6.4)
- [ ] Die Anmeldung funktioniert nach einer geänderten Kontakt-E-Mail weiter mit der alten Anmelde-E-Mail
- [ ] Bei 360 px kein waagerechtes Scrollen, lange E-Mail-Adressen umbrechen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Ein Profil gibt es immer (FR-6.10); „nicht gefunden" braucht die Seite nicht, ein Ladefehler ist ein Fehlerzustand.
- `getOwnProfile` nimmt `getUser`, die übrigen Services `getSession` – bestehender Code, hier nicht angleichen, nur
  benennen, falls es stört.
- Dass B das Profil von A nicht ändern kann, weist TASK-09-02 in der Datenbank nach.

## Quellen

- `src/pages/ProfilePage.tsx`, `src/services/profile.ts`, `src/pages/TankEditPage.tsx`, `src/lib/validation.ts`
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „PROFIL"
- `design.md` – Abschnitt 3 (Avatar Profil), Abschnitt 1 (Fehlerfarbe für „Abmelden")
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-4.5, FR-6.8, FR-6.10, NFR-3.3
