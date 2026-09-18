# TASK-03-06 · Profil-Trigger und deaktivierte E-Mail-Bestätigung

**Status:** erledigt
**Bezug:** FR-6.10 (Profil per Datenbank-Trigger), FR-6.1 (Anmeldung ohne E-Mail-Bestätigung)
**Voraussetzung:** TASK-03-03 (Tabelle `profil` existiert)

---

## Worum geht es

Zu jedem Auth-Konto gehört genau ein Datensatz in `profil` – alle anderen Daten hängen daran („Keine Daten ohne Profil").
Dieses Profil legt **nicht das Frontend** an, sondern ein Trigger in der Datenbank, der bei jeder Registrierung
automatisch läuft (FR-6.10). Vorbelegt wird der Anzeigename mit der E-Mail-Adresse.

Zweitens soll ein neuer Nutzer sich sofort anmelden können, ohne erst eine Bestätigungs-E-Mail zu öffnen (FR-6.1).

## Vor dem Start klären

- [x] **`kontakt_email` vorbelegen?** FR-6.10 nennt nur den Anzeigenamen. `profil.kontakt_email` ist aber `NOT NULL` –
      der Trigger muss dort also etwas eintragen. Naheliegend ist ebenfalls die E-Mail-Adresse des Kontos. Kurz bestätigen.
      → **Entschieden:** ja, mit der E-Mail-Adresse des Kontos (15.09.2026).
- [x] **Policy `profil_insert_eigenes` noch nötig?** Wenn nur der Trigger Profile anlegt, braucht das Frontend kein INSERT-Recht auf `profil`.
      Entfernen oder bewusst behalten – mit der RLS-Matrix (TASK-03-05) entscheiden.
      → **Entschieden:** entfernen (TASK-02-04, Frage 4).
- [x] **Defaults `''` auf `anzeigename` und `kontakt_email`** (aus TASK-03-03 hierher verschoben)
      → **Entschieden:** entfernt, wie im ER-Modell `NOT NULL` ohne Default (15.09.2026).

## Schritte

### A · Profil-Trigger

1. [x] **Prüfen, ob schon ein Trigger existiert:**

   ```sql
   select tgname, tgenabled
   from pg_trigger
   where tgrelid = 'auth.users'::regclass and not tgisinternal;
   ```

2. [x] **Trigger-Funktion anlegen** – Vorschlag, Namen nach DB-Konvention deutsch:

   ```sql
   create function public.profil_anlegen()
   returns trigger
   language plpgsql
   security definer
   set search_path = ''
   as $$
   begin
     insert into public.profil (id, anzeigename, kontakt_email)
     values (new.id, new.email, new.email);
     return new;
   end;
   $$;
   ```

   - `security definer`: Die Funktion läuft mit den Rechten ihres Erstellers. Nötig, weil in dem Moment noch niemand angemeldet ist und RLS das Einfügen sonst verhindern würde.
   - `set search_path = ''`: Sicherheitsempfehlung von Supabase für `security definer`-Funktionen. Deshalb steht `public.profil` voll ausgeschrieben.
   - Ausführungsrecht entzogen (`revoke execute … from public, anon, authenticated`) nach Security-Advisor-Warnung 0028/0029,
     wie bei `rls_auto_enable()`. Der Trigger feuert trotzdem (Schritt 5 danach ausgeführt).

3. [x] **Trigger anlegen:**

   ```sql
   create trigger bei_registrierung_profil_anlegen
     after insert on auth.users
     for each row execute function public.profil_anlegen();
   ```

4. [x] **Konten ohne Profil finden** – Testnutzer, die vor dem Trigger angelegt wurden, haben keins.
       Diese Konten löschen oder ihr Profil einmalig von Hand nachtragen.

   ```sql
   select u.id, u.email
   from auth.users u
   left join public.profil p on p.id = u.id
   where p.id is null;
   ```

   **Ergebnis (15.09.2026):** 0 Zeilen.

5. [x] **Testen:** Im Dashboard einen Nutzer anlegen (Authentication → Users → „Add user") und prüfen,
       dass in `profil` sofort ein Datensatz mit derselben `id` und der E-Mail als Anzeigename steht.
       **Ergebnis (15.09.2026):** ✔ mit `trigger_test@example.com`.
6. [x] **Funktion und Trigger in die SQL-Quelle im Repo aufnehmen** (siehe TASK-03-03).

### B · E-Mail-Bestätigung ausschalten

7. [x] Im Supabase-Dashboard unter Authentication beim Anbieter **Email** die Option **„Confirm email"** ausschalten
       (Menübezeichnungen können je nach Dashboard-Version leicht abweichen).
8. [x] **Mindestlänge des Passworts notieren**, die in den Auth-Einstellungen hinterlegt ist – das Registrierungsformular
       in TASK-03-08 prüft gegen denselben Wert. → **6 Zeichen** (15.09.2026)
9. [x] Die Einstellung kurz im Repo dokumentieren (z. B. als Kommentar in der SQL-Quelle), da sie nicht im SQL steht.

## Fertig, wenn

- [x] Jede neue Registrierung erzeugt automatisch genau einen `profil`-Datensatz mit gleicher `id`
- [x] `anzeigename` ist mit der E-Mail-Adresse vorbelegt
- [x] Es gibt kein Auth-Konto ohne Profil (Abfrage aus Schritt 4 liefert 0 Zeilen)
- [x] „Confirm email" ist aus – ein neuer Nutzer kann sich sofort anmelden (endgültig geprüft in TASK-03-08)
- [x] Trigger und Funktion stehen in der SQL-Quelle im Repo

## Hinweise

- **Wenn der Trigger fehlschlägt, schlägt die ganze Registrierung fehl.** Supabase meldet dann „Database error saving new user".
  Häufigste Ursache: eine `NOT NULL`-Spalte in `profil`, die der Trigger nicht befüllt.
- Das Frontend legt **niemals** selbst ein Profil an – auch nicht „zur Sicherheit", falls keins da ist.
- Profil ansehen und bearbeiten (FR-6.8) ist Umfang von MS-9.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-6.1, FR-6.10, Abschnitt 1.1 (Regel „Keine Daten ohne Profil")
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Tabelle `profil`
- [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) – Umfang, vierter Punkt
