# TASK-03-08 · Registrierung, Anmeldung, Abmeldung und Session

**Status:** erledigt
**Bezug:** FR-6.1 (Registrierung, Anmeldung, Abmelden mit E-Mail und Passwort), MVP-Punkt 1 „Nutzer anlegen"
**Voraussetzung:** TASK-03-06 (Trigger, E-Mail-Bestätigung aus), TASK-03-07 (Service-Schicht) · Mockup Login/Register aus MS-1

---

## Worum geht es

Der erste Ablauf, den ein Nutzer sieht: ein Konto anlegen, sich anmelden, sich abmelden. Dazu gehört, dass die App
weiß, ob gerade jemand angemeldet ist – auch nach dem Neuladen der Seite.

Dieser Task baut den **funktionierenden Grundablauf**. Routenschutz sowie ausgearbeitete Lade-, Fehler- und
Validierungszustände folgen in TASK-03-09.

## Vor dem Start klären

- [x] **Formularvalidierung: eigene Lösung oder Bibliothek?** Die Entscheidung gilt für **alle** späteren Formulare
      (MS-1: „Koralle anlegen" ist das Formularmuster für alle weiteren).
  - **Eigene Lösung:** `useState` je Feld und eine kleine Prüffunktion. Keine neue Abhängigkeit, leicht nachvollziehbar.
  - **Bibliothek** (z. B. `react-hook-form` mit `zod`, wie in den shadcn-Beispielen): weniger Eigenbau bei großen Formularen, aber zwei neue Abhängigkeiten.

  Empfehlung nach KISS: eigene Lösung, solange die Formulare überschaubar bleiben.
  → **Entschieden:** eigene Lösung (16.09.2026).

- [x] **Was passiert nach der Registrierung?** Die Anforderungen lassen es offen. Mit ausgeschalteter E-Mail-Bestätigung
      liefert Supabase direkt eine Session zurück.
  - **(a)** Nutzer ist sofort angemeldet und landet auf dem Bestand.
  - **(b)** Nutzer landet auf der Anmeldeseite und meldet sich selbst an.
  → **Entschieden:** (a) (16.09.2026).
- [x] **Passwort wiederholen** im Registrierungsformular – ja oder nein? (nicht festgelegt)
      → **Entschieden:** ja (16.09.2026).
- [x] **Vorläufiger Ort für „Abmelden"**: Bottom-Navigation (MS-4) und Profil (MS-9) gibt es noch nicht.
      Vorschlag: vorläufig auf der Platzhalterseite aus TASK-03-09.
      → **Entschieden:** Der Router kommt erst in TASK-03-09. Bis dahin schaltet `App.tsx` per `useState` zwischen Anmeldung,
      Registrierung und einer schlichten Angemeldet-Ansicht mit Abmelden-Button; TASK-03-09 ersetzt das durch den Router (16.09.2026).
- [x] **Welche shadcn-Komponenten?** Das Komponenteninventar aus MS-1 (TASK-01-02) ist noch offen.
      Für die Formulare werden mindestens Eingabefeld und Label gebraucht (`npx shadcn@latest add input label`).
      → **Entschieden:** `input` und `label` hinzugefügt (16.09.2026). Dafür vorgezogen aus MS-4: Farb- und Schrifttokens
      aus `design.md` in `src/index.css` (nur Dark Theme, `.dark`- und `sidebar`-Variablen entfernt, Fokusrahmen `#E8963A`,
      `color-scheme: dark`). `button`, `input` und `label` in `src/components/ui/` an `design.md` angepasst.
      „Text gedämpft" für WCAG AA auf `#808FA2` angehoben, auch in `design.md`; das Mockup behält `#6B7C93`.

## Schritte

### A · Auth-Service

1. [x] In `src/services/auth.ts` je eine schmale Funktion anlegen, die nur Supabase aufruft und das Fehlermuster aus TASK-03-07 anwendet:
   - `signUp(email, password)` → `supabase.auth.signUp`
   - `signIn(email, password)` → `supabase.auth.signInWithPassword`
   - `signOut()` → `supabase.auth.signOut`
   - `getSession()` → `supabase.auth.getSession`
   - `onAuthChange(callback)` → `supabase.auth.onAuthStateChange`; gibt eine Abmeldefunktion für den Listener zurück

   → `signOut()` ohne `scope`, also Standard `global`: beendet alle Sessions des Kontos (entschieden 16.09.2026).

### B · Session-Zustand für die ganze App

2. [x] Einen **Auth-Kontext** mit Hook `useAuth()` anlegen (Ordner `src/hooks/` oder eigener Kontext-Ordner – festlegen). Er stellt bereit:
   - `status`: `'loading' | 'authenticated' | 'unauthenticated'`
   - `user` bzw. `session` (oder `null`)

   → Ort `src/hooks/`, aufgeteilt in `useAuth.ts` (Kontext, Typen, Hook) und `AuthProvider.tsx` (wegen der Regel
   `react-refresh/only-export-components`). Bereitgestellt wird `session`, der Nutzer steckt in `session.user` (entschieden 16.09.2026).
3. [x] Beim Start einmal `getSession()` aufrufen und danach über `onAuthChange` auf Änderungen hören.
       Den Listener beim Aufräumen des Effekts wieder abmelden.
       → `getSession()` und Listener, wie beschrieben (entschieden 16.09.2026).
4. [x] Den Provider in `src/main.tsx` um die App legen.

### C · Formulare

5. [x] **Anmeldeseite**: Felder E-Mail und Passwort, Primärbutton „Anmelden", Link zur Registrierung.
       → `src/pages/LoginPage.tsx`. Statt Link ein Sekundärbutton „Neues Konto erstellen" wie im Mockup; Untertitel
       „Bestand, Becken und Logbuch für Korallenzüchter." (entschieden 16.09.2026). Serverfehler vorläufig als eine
       Meldung oben im Formular; Feldfehler (FR-6.6) folgen in TASK-03-09.
6. [x] **Registrierungsseite**: Felder E-Mail und Passwort (ggf. Wiederholung), Primärbutton „Registrieren", Link zur Anmeldung.
       → `src/pages/RegisterPage.tsx`, Aufbau wie die Anmeldeseite. Überschrift „Neues Konto erstellen" (`h2`), Feld
       „Passwort wiederholen \*", Sekundärbutton „Zur Anmeldung" (17.09.2026). Die Wiederholung wird noch nicht verglichen,
       das folgt mit der Validierung in TASK-03-09.
7. [x] Gestaltung nach **Mockup** (`Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html`) und `design.md`:
   - Eingabefeld: Höhe 48, Radius 10, sichtbares Label **über** dem Feld (13/18/500)
   - Pflichtfelder mit `*`, Legende „\* Pflichtfeld" am Formularkopf
   - Primärbutton: Höhe 48, Radius 10, `#E8963A`, Text `#1A0F0A`
   - **keine** Bottom-Navigation auf Login und Register

   → Maße über die angepassten Komponenten `button`, `input` und `label` (siehe „Vor dem Start klären"), Seitenabstände
   nach Mockup-Screen „Login". Sichtprüfung im Browser am 17.09.2026: Farben und Abstände passen. Am Desktop waren
   Felder und Buttons fensterbreit → `#root` in `src/index.css` auf `max-w-md` (448 px) begrenzt und zentriert (entschieden 17.09.2026).
8. [x] Für Mobilgeräte die passenden HTML-Attribute setzen:
       `type="email"` und `autoComplete="email"`; Passwort `autoComplete="current-password"` (Anmeldung) bzw. `"new-password"` (Registrierung).
9. [x] **Abmelden-Button** am vorläufigen Ort (siehe „Vor dem Start klären") mit sichtbarem Text.
       → `src/pages/HomeScreen.tsx`: Überschrift „Angemeldet", Zeile „Angemeldet als …", Sekundärbutton „Abmelden" in
       `#F2685E` wie im Profil-Screen des Mockups. `src/App.tsx` schaltet vorläufig nach `status` um (17.09.2026).

### D · Durchspielen

10. [x] Neues Konto registrieren → in Supabase stehen Auth-Konto **und** `profil`-Datensatz.
11. [x] Abmelden → Anmelden mit denselben Daten gelingt **ohne** E-Mail-Bestätigung.
12. [x] Seite neu laden → Nutzer bleibt angemeldet.

    → 10–12 am 17.09.2026 im Dev-Server durchgespielt, alle erfolgreich.

## Fertig, wenn

- [x] Registrierung legt Konto und Profil an (FR-6.1, FR-6.10)
- [x] Anmeldung ist unmittelbar nach der Registrierung möglich
- [x] Abmelden beendet die Session; nach dem Neuladen ist niemand mehr angemeldet
- [x] Die Session übersteht ein Neuladen der Seite
- [x] Keine Komponente ruft Supabase direkt auf (NFR-4.3)
      → Geprüft am 17.09.2026: Außerhalb von `src/services/` nur ein Kommentar in `AuthProvider.tsx` und die
      Variablennamen `VITE_SUPABASE_*` in `src/vite-env.d.ts`, kein Import.
- [x] Alle Felder haben sichtbare Labels, alle Buttons einen Text (NFR-1.4), Trefferflächen ≥ 44 px (NFR-1.3)
      → Im Code geprüft: jedes Feld mit `Label` über `htmlFor`, Buttons und Felder 48 px hoch (`h-12`).

## Hinweise

- **Im Callback von `onAuthStateChange` keine weiteren Supabase-Aufrufe mit `await` ausführen.** Supabase warnt davor,
  weil sich die Aufrufe gegenseitig blockieren können. Im Callback nur den Zustand setzen.
- Supabase liefert Fehler mit einem `code` (z. B. `invalid_credentials`, `user_already_exists`, `weak_password`).
  Für die deutschen Fehlermeldungen in TASK-03-09 den `code` auswerten, nicht den englischen Meldungstext.
- Passwort zurücksetzen (FR-6.7) ist **Should** und nicht Teil von MS-3.
- Gibt es einen Schalter „Passwort anzeigen", braucht er ein Textlabel – ein reines Augen-Icon verstößt gegen NFR-1.4.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-6.1, FR-6.10, Abschnitt 7 Punkte 1 und 2
- `design.md` – Abschnitt 4 (Eingabefeld, Primärbutton, Bottom-Navigation), Abschnitt 5 (Harte Regeln)
- `Dokumentation/Meilensteine/MS-01_Design-Mockup/MS-01_Design-Mockup.md` – Screen 5 „Login / Register"
