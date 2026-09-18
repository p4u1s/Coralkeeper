# TASK-03-05 · RLS-Policies anlegen und mit einem zweiten Nutzer prüfen

**Status:** erledigt
**Bezug:** FR-6.2 (kein Zugriff auf fremde Daten), NFR-3.1 (RLS auf jeder Tabelle), FR-3.3 (Historie append-only), FR-5.10 (Diary korrigierbar)
**Voraussetzung:** TASK-03-03 · TASK-02-04 (RLS-Matrix)

---

## Worum geht es

Row Level Security (RLS) ist die einzige echte Schutzschicht der App: Der öffentliche Supabase-Schlüssel steckt
im Frontend und ist für jeden lesbar (NFR-3.2). Was ein Nutzer sehen und ändern darf, entscheidet deshalb
allein die Datenbank. Jede Tabelle braucht RLS, und jede Operation (lesen, anlegen, ändern, löschen) eine bewusste Regel.

Das Grundmuster ist durch das ER-Modell festgelegt und bleibt einzeilig: `nutzer_id = auth.uid()`.

## Vor dem Start klären

- [x] **RLS-Matrix fertigstellen (TASK-02-04).** Je Tabelle und Operation die Bedingung. Das ER-Modell legt bisher nur fest:
  - Historie ohne UPDATE und DELETE (Festlegung 7, FR-3.3)
  - `messwert` und `becken_ereignis` mit UPDATE und DELETE (Festlegung 8, FR-5.10)
  - zwei Ausnahmen: sichtbare Inserate (FR-4.2) und freigegebene Kontakte (FR-4.5)
- [x] **Umfang festlegen:** Welche Policies entstehen jetzt in MS-3, welche erst im Meilenstein, der sie braucht?
      MS-3 sagt „RLS-Policies auf allen Tabellen nach der RLS-Matrix". Mindestens gilt: **RLS ist auf jeder Tabelle eingeschaltet.**

## Schritte

1. [x] **Ist-Stand holen:**

   ```sql
   -- Ist RLS je Tabelle eingeschaltet?
   select relname as tabelle, relrowsecurity as rls_an
   from pg_class
   where relnamespace = 'public'::regnamespace and relkind = 'r'
   order by 1;

   -- Welche Policies gibt es?
   select tablename, policyname, cmd, roles, qual, with_check
   from pg_policies
   where schemaname = 'public'
   order by tablename, cmd;
   ```

   **Ergebnis (15.09.2026):** RLS auf allen zehn Tabellen an. Policies wie in der SQL-Datei, außer
   `koralle`, `historieneintrag` und `abgabe`: dort keine Policy (in der Datei je SELECT + INSERT eigene).

2. [x] **RLS auf jeder Tabelle einschalten**, wo es fehlt: – nicht nötig, überall an (15.09.2026)
       `alter table public.<tabelle> enable row level security;`
3. [x] **Fehlende Policies nach der RLS-Matrix anlegen.** Muster (wie in der SQL-Datei).
       Bei `anfrage` steht `interessent_id` statt `nutzer_id`, bei `profil` steht `id`.

   ```sql
   create policy "<tabelle>_<operation>_eigene"
     on public.<tabelle> for <select|insert|update|delete>
     to authenticated
     using (nutzer_id = auth.uid())          -- für select, update, delete
     with check (nutzer_id = auth.uid());    -- für insert, update
   ```

4. [x] **Keine UPDATE- und keine DELETE-Policy auf `historieneintrag`** – das ist Absicht (FR-3.3).
5. [x] **Zwei Testnutzer anlegen** (Dashboard → Authentication → Users → „Add user", oder später über die Registrierung aus TASK-03-08).
       Nur erfundene Daten verwenden (NFR-3.4).
6. [x] **Testdaten für Nutzer A anlegen** (im SQL-Editor – der umgeht RLS): ein Becken, eine Koralle, ein Messwert.
7. [x] **Als Nutzer B prüfen.** Im SQL-Editor lässt sich ein angemeldeter Nutzer simulieren
       (neuere Dashboards bieten dafür auch eine Rollenauswahl neben dem „Run"-Knopf):

   ```sql
   begin;
     set local role authenticated;
     set local request.jwt.claims to '{"sub":"<UUID von Nutzer B>","role":"authenticated"}';

     -- erwartet: kein Becken von A
     select * from public.becken;
     -- erwartet: 0 Zeilen
     select * from public.koralle where id = '<ID der Koralle von A>';
     -- erwartet: UPDATE 0
     update public.becken set name = 'geändert' where id = '<ID des Beckens von A>';
     -- erwartet: Fehler "new row violates row-level security policy"
     insert into public.becken (nutzer_id, name) values ('<UUID von Nutzer A>', 'fremd');
   rollback;
   ```

   Durchgeführt mit [`TASK-03-05_Schritt 7-8_RLS-Test.sql`](TASK-03-05_Schritt%207-8_RLS-Test.sql) – deckt auch Schritt 8 und Festlegung 12 ab.

8. [x] **Ohne Anmeldung prüfen:** Dasselbe mit `set local role anon;` (ohne `request.jwt.claims`) – erwartet: nirgends Daten.
9. [x] **Ergebnisse ins Testprotokoll** (unten) eintragen.
10. [x] **SQL-Quelle im Repo nachziehen** (siehe TASK-03-03).
    Stand 15.09.2026: nachgezogen nach RLS-Matrix (TASK-02-04) und um die RLS-Automatik `rls_auto_enable()`
    ergänzt (Ausführungsrecht entzogen, Security Advisor), Datei und Datenbank stimmen überein.

## Testprotokoll

Datum: 15.09.2026 · Nutzer A: `user_a@example.com` · Nutzer B: `userb@example.com`

| Tabelle            | B liest A            | B ändert A | B legt für A an | B löscht A | anon liest | Ergebnis |
| ------------------ | -------------------- | ---------- | --------------- | ---------- | ---------- | -------- |
| `profil`           | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `becken`           | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `koralle`          | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `historieneintrag` | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `angebot`          | 1 (sichtbar, FR-4.2) | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `anfrage`          | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `messwert`         | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `becken_ereignis`  | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `bild_dokument`    | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |
| `abgabe`           | 0                    | 0          | RLS-Fehler      | 0          | 0          | ✔        |

Zahlen = betroffene bzw. gelesene Zeilen. Gegenprobe (B legt eigenes Becken, eigene Koralle und eigenes Inserat an) ✔ ·
Festlegung 12: B inseriert Koralle von A → RLS-Fehler ✔ · B gibt Koralle von A ab → RLS-Fehler ✔

Erwartet ist überall „kein Zugriff" – mit **einer** Ausnahme: Ein Inserat von A mit `sichtbar = true` darf B lesen (FR-4.2).

## Fertig, wenn

- [x] RLS ist auf **allen zehn** Tabellen eingeschaltet (Schritt 1 zeigt überall `true`)
- [x] Die Policies entsprechen der RLS-Matrix aus MS-2 – bis auf `profil_insert_eigenes` → TASK-03-06
- [x] `historieneintrag` hat nachweislich keine UPDATE- und keine DELETE-Policy
- [x] Das Testprotokoll ist ausgefüllt, alle Ergebnisse wie erwartet
- [x] Die Datenbank-Übersicht im Supabase-Dashboard meldet keine Tabelle ohne RLS

## Hinweise

- Eine Tabelle mit eingeschaltetem RLS und **ohne** Policy ist komplett gesperrt – das ist der sichere Ausgangszustand.
- `update` ohne passende Policy wirft keinen Fehler, sondern ändert einfach 0 Zeilen. Beim Testen auf die Zeilenzahl achten.
- Der vollständige Test mit zweitem Nutzer über die App ist Definition of Done von **MS-7**. Hier geht es darum, die Grundlage früh abzusichern.
- Storage-Buckets pro Nutzer (NFR-3.1) sind nicht Teil von MS-3 – Bild-Upload kommt in MS-9.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 2 (Eigentümerschaft, Ausnahmen), Festlegungen 7 und 8
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-6.2, NFR-3.1, NFR-3.2, FR-3.3, FR-5.10, Abschnitt 7 Punkt 9
- `Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/Tasks.md` – TASK-02-04
