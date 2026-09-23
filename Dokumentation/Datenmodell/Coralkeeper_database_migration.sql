-- Coralkeeper – komplettes Schema nach ER-Modell v1.0
-- Legt die RLS-Automatik, alle Aufzählungstypen, Tabellen, RLS-Policies und den Profil-Trigger in einem Durchgang an.
-- Voraussetzung: leeres public-Schema (neues Supabase-Projekt), im SQL-Editor als Ganzes ausführen.
--
-- Reihenfolge: jede Tabelle steht nach den Tabellen, auf die sie verweist.
-- Einzige Ausnahme ist der Kreisbezug koralle.primaerbild <-> bild_dokument.koralle_id,
-- dieser Fremdschlüssel wird direkt nach bild_dokument ergänzt.


-- ============================================================
-- RLS automatisch einschalten
-- ============================================================


-- Sicherheitsnetz (FR-6.2, NFR-3.1): jede neue Tabelle in public bekommt sofort RLS,
-- auch wenn "enable row level security" vergessen wird
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

create event trigger ensure_rls
  on ddl_command_end
  when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  execute function public.rls_auto_enable();

-- nicht per RPC aufrufbar (Security Advisor, Lint 0028/0029); der Event-Trigger braucht das Recht nicht
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;


-- ============================================================
-- Profil
-- ============================================================


-- Tabelle profil (ER-Modell v1.0, Abschnitt 1)
create table public.profil (
  -- = auth.uid, 1:1 zu auth.users
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  -- vorbelegt vom Trigger profil_anlegen (FR-6.10)
  anzeigename text not null,
  kontakt_email text not null,
  kontakt_telefon text,

  erstellt_am timestamptz not null default now()
);

-- RLS (FR-6.2): nur der eigene Datensatz (ER-Modell Abschnitt 2)
alter table public.profil enable row level security;

create policy "profil_select_eigenes"
  on public.profil for select
  to authenticated
  using (id = auth.uid());

-- bewusst ohne INSERT-Policy: Profile legt allein der Trigger an, das Frontend nie (Festlegung 14)

-- Profil zu jedem neuen Auth-Konto, vorbelegt mit der Konto-E-Mail (FR-6.10)
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

create trigger bei_registrierung_profil_anlegen
  after insert on auth.users
  for each row execute function public.profil_anlegen();

-- nicht per RPC aufrufbar (Security Advisor, Lint 0028/0029); der Trigger braucht das Recht nicht
revoke execute on function public.profil_anlegen() from public, anon, authenticated;

-- Auth-Einstellungen stehen nicht im SQL (Dashboard: Authentication → Sign In / Providers → Email):
--   "Confirm email" aus – Anmeldung direkt nach der Registrierung (FR-6.1)
--   Mindestlänge Passwort: 6 Zeichen – das Registrierungsformular prüft gegen denselben Wert (TASK-03-08)


-- ============================================================
-- Becken
-- ============================================================


-- Tabelle becken (ER-Modell v1.0, Abschnitt 1)
create table public.becken (
  id uuid primary key default gen_random_uuid(),

  nutzer_id uuid not null
    references public.profil(id)
    on update cascade
    on delete cascade,

  name text not null,
  volumen_liter int,
  beschreibung text,
  startdatum date
);

-- RLS (FR-6.2)
alter table public.becken enable row level security;

create policy "becken_select_eigene"
  on public.becken for select
  to authenticated
  using (nutzer_id = auth.uid());

create policy "becken_insert_eigene"
  on public.becken for insert
  to authenticated
  with check (nutzer_id = auth.uid());

-- Becken bearbeiten und löschen (FR-1.1)
create policy "becken_update_eigene"
  on public.becken for update
  to authenticated
  using (nutzer_id = auth.uid())
  with check (nutzer_id = auth.uid());

create policy "becken_delete_eigene"
  on public.becken for delete
  to authenticated
  using (nutzer_id = auth.uid());


-- ============================================================
-- Koralle
-- ============================================================


create type public.koralle_status as enum (
  'im_bestand',
  'zur_abgabe',
  'abgegeben',
  'verendet'
);

create type public.stufe as enum (
  'gering',
  'mittel',
  'hoch'
);

create type public.platzierung as enum (
  'unten',
  'mitte',
  'oben'
);

create type public.schutzstatus as enum (
  'unbekannt',
  'kein',
  'cites_ii',
  'cites_i'
);

create type public.quelle_typ as enum (
  'haendler',
  'privat',
  'eigene_nachzucht'
);

-- Tabelle koralle (ER-Modell v1.0, Abschnitt 1)
create table public.koralle (
  id uuid primary key default gen_random_uuid(),

  nutzer_id uuid not null
    references public.profil(id)
    on delete cascade,

  -- keine Koralle ohne Becken (Festlegung Nr. 1, FR-1.14)
  becken_id uuid not null
    references public.becken(id)
    on delete restrict,

  -- Ableger bleiben erhalten (Festlegung Nr. 2, FR-1.10)
  mutter_id uuid
    references public.koralle(id)
    on delete set null,

  bezeichnung text not null,
  art text,
  handelsname text,

  status public.koralle_status not null
    default 'im_bestand',

  erwerbsdatum date,

  -- Primärbild (Festlegung Nr. 9; FR-1.3, FR-1.12)
  -- Fremdschlüssel auf bild_dokument folgt nach dessen Anlage (Kreisbezug)
  primaerbild uuid,

  licht public.stufe,
  stroemung public.stufe,
  platzierung public.platzierung,
  nesselkraft public.stufe,
  wuchsform text,
  schwierigkeit public.stufe,
  fuetterung text,

  schutzstatus public.schutzstatus,

  quelle_typ public.quelle_typ,
  quelle_name text,
  belegnummer text,
  cites_nr text,
  herkunft_notiz text,
  herkunftskette text
);

-- RLS (FR-6.2)
alter table public.koralle enable row level security;

create policy "koralle_select_eigene"
  on public.koralle for select
  to authenticated
  using (nutzer_id = auth.uid());

create policy "koralle_insert_eigene"
  on public.koralle for insert
  to authenticated
  with check (nutzer_id = auth.uid());

-- Koralle bearbeiten: Steckbrief, Status (FR-2.1, FR-4.1, FR-4.2)
create policy "koralle_update_eigene"
  on public.koralle for update
  to authenticated
  using (nutzer_id = auth.uid())
  with check (nutzer_id = auth.uid());


-- ============================================================
-- Bild-Dokument
-- ============================================================


-- Aufzählungstyp für bild_dokument.typ (ER-Modell, Aufzählungstypen; FR-1.12, FR-3.8)
create type public.medien_typ as enum (
  'bild',
  'pdf'
);

-- Tabelle bild_dokument (ER-Modell v1.0, Abschnitt 1)
create table public.bild_dokument (
  id uuid primary key default gen_random_uuid(),

  nutzer_id uuid not null
    references public.profil(id)
    on delete cascade,

  koralle_id uuid not null
    references public.koralle(id)
    on delete cascade,

  -- Bucket-Pfad, max. 5 MB (NFR-2.5, FR-3.8)
  storage_pfad text not null,

  aufnahmedatum date,
  typ public.medien_typ not null,
  bezeichnung text
);

-- Kreisbezug auflösen: Primärbild der Koralle (Festlegung Nr. 9)
alter table public.koralle
  add constraint koralle_primaerbild_fkey
    foreign key (primaerbild)
    references public.bild_dokument(id)
    on delete set null;

-- RLS (FR-6.2)
alter table public.bild_dokument enable row level security;

create policy "bild_dokument_select_eigene"
  on public.bild_dokument for select
  to authenticated
  using (nutzer_id = auth.uid());

create policy "bild_dokument_insert_eigene"
  on public.bild_dokument for insert
  to authenticated
  with check (nutzer_id = auth.uid());


-- ============================================================
-- Historieneintrag
-- ============================================================


-- Aufzählungstyp für historieneintrag.typ (ER-Modell, Aufzählungstypen; FR-3.4/FR-3.5)
create type public.historie_typ as enum (
  'system',
  'journal',
  'abgabe'
);

-- Tabelle historieneintrag (ER-Modell v1.0, Abschnitt 1)
create table public.historieneintrag (
  id uuid primary key default gen_random_uuid(),

  nutzer_id uuid not null
    references public.profil(id)
    on delete cascade,

  koralle_id uuid not null
    references public.koralle(id)
    on delete cascade,

  datum date not null,
  typ public.historie_typ not null,
  text text,

  -- Bild zu einem Historieneintrag (ER-Modell Abschnitt 1);
  -- bewusst ohne Löschregel: ein Bild mit Historienbezug bleibt als Nachweis erhalten (FR-3.3)
  bild_id uuid
    references public.bild_dokument(id),

  erstellt_am timestamptz not null default now()
);

-- RLS (FR-6.2): append-only, bewusst ohne UPDATE- und DELETE-Policy (Festlegung Nr. 7, FR-3.3)
alter table public.historieneintrag enable row level security;

create policy "historieneintrag_select_eigene"
  on public.historieneintrag for select
  to authenticated
  using (nutzer_id = auth.uid());

create policy "historieneintrag_insert_eigene"
  on public.historieneintrag for insert
  to authenticated
  with check (nutzer_id = auth.uid());


-- Systemeinträge (FR-3.4): ein Eintrag je Anlage und je echtem Statuswechsel.
-- Bewusst ohne security definer: der Eintrag entsteht mit den Rechten des angemeldeten
-- Nutzers, die Policy historieneintrag_insert_eigene greift wie bei jedem anderen Eintrag.
create function public.systemeintrag_anlegen()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  eintrag_text text;
begin
  if tg_op = 'INSERT' then
    eintrag_text := 'Koralle angelegt';
  else
    eintrag_text := 'Status geändert: '
      || case old.status
           when 'im_bestand' then 'Im Bestand'
           when 'zur_abgabe' then 'Zur Abgabe'
           when 'abgegeben'  then 'Abgegeben'
           when 'verendet'   then 'Verendet'
         end
      || ' → '
      || case new.status
           when 'im_bestand' then 'Im Bestand'
           when 'zur_abgabe' then 'Zur Abgabe'
           when 'abgegeben'  then 'Abgegeben'
           when 'verendet'   then 'Verendet'
         end;
  end if;

  -- current_date wäre das UTC-Datum: zwischen 0 und 2 Uhr deutscher Zeit stünde der Vortag im Eintrag
  insert into public.historieneintrag (nutzer_id, koralle_id, datum, typ, text)
  values (
    new.nutzer_id,
    new.id,
    (now() at time zone 'Europe/Berlin')::date,
    'system',
    eintrag_text
  );

  return null;  -- after-Trigger: der Rückgabewert wird nicht ausgewertet
end;
$$;

create trigger bei_anlage_systemeintrag
  after insert on public.koralle
  for each row execute function public.systemeintrag_anlegen();

-- nur bei echtem Wechsel, ein Update auf denselben Wert erzeugt keinen Eintrag
create trigger bei_statuswechsel_systemeintrag
  after update of status on public.koralle
  for each row
  when (old.status is distinct from new.status)
  execute function public.systemeintrag_anlegen();

-- nicht per RPC aufrufbar (Security Advisor, Lint 0028/0029); der Trigger braucht das Recht nicht
revoke execute on function public.systemeintrag_anlegen() from public, anon, authenticated;


-- ============================================================
-- Abgabe
-- ============================================================


-- Tabelle abgabe (ER-Modell v1.0, Abschnitt 1)
create table public.abgabe (
  id uuid primary key default gen_random_uuid(),

  -- der abgebende Züchter
  nutzer_id uuid not null
    references public.profil(id)
    on delete cascade,

  -- eine Koralle wird nur einmal weitergegeben (Festlegung Nr. 5)
  koralle_id uuid not null unique
    references public.koralle(id)
    on delete cascade,

  empfaenger_name text,
  empfaenger_kontakt text,

  -- Empfänger mit eigenem Profil (FR-4.7)
  empfaenger_nutzer_id uuid
    references public.profil(id)
    on delete set null,

  datum date,
  stueckzahl int,
  preis numeric,
  notiz text
);

-- RLS (FR-6.2): nur der abgebende Züchter hat Zugriff (ER-Modell Abschnitt 2)
alter table public.abgabe enable row level security;

create policy "abgabe_select_eigene"
  on public.abgabe for select
  to authenticated
  using (nutzer_id = auth.uid());

-- nur für eigene Korallen (Festlegung Nr. 12)
create policy "abgabe_insert_eigene"
  on public.abgabe for insert
  to authenticated
  with check (
    nutzer_id = auth.uid()
    and exists (select 1 from public.koralle k
                where k.id = abgabe.koralle_id and k.nutzer_id = auth.uid())
  );


-- ============================================================
-- Angebot
-- ============================================================


-- Aufzählungstyp für angebot.modus (ER-Modell, Aufzählungstypen; FR-4.1)
create type public.angebot_modus as enum (
  'verschenken',
  'tauschen',
  'verkaufen'
);

-- Tabelle angebot (ER-Modell v1.0, Abschnitt 1)
create table public.angebot (
  id uuid primary key default gen_random_uuid(),

  nutzer_id uuid not null
    references public.profil(id)
    on delete cascade,

  -- genau eine Koralle je Inserat, höchstens ein Inserat je Koralle (Festlegung Nr. 4)
  koralle_id uuid not null unique
    references public.koralle(id)
    on delete cascade,

  modus public.angebot_modus not null,
  preis_oder_tauschwunsch text,
  groesse text,

  -- Kopie aus koralle beim Inserieren, koralle bleibt privat (Festlegung Nr. 13)
  art text,
  handelsname text,

  -- steuert die RLS-Freigabe (FR-4.2), neues Inserat ist sichtbar (FR-4.1)
  sichtbar boolean not null default true,

  erstellt_am timestamptz not null default now()
);

-- RLS (FR-6.2)
alter table public.angebot enable row level security;

-- eigene Inserate (ER-Modell Abschnitt 2)
create policy "angebot_select_eigene"
  on public.angebot for select
  to authenticated
  using (nutzer_id = auth.uid());

-- Ausnahme: sichtbare Inserate für alle angemeldeten Nutzer (FR-4.2)
create policy "angebot_select_sichtbar"
  on public.angebot for select
  to authenticated
  using (sichtbar = true);

-- nur für eigene Korallen (Festlegung Nr. 12)
create policy "angebot_insert_eigene"
  on public.angebot for insert
  to authenticated
  with check (
    nutzer_id = auth.uid()
    and exists (select 1 from public.koralle k
                where k.id = angebot.koralle_id and k.nutzer_id = auth.uid())
  );

-- Inserat wird nach der Abgabe gelöscht (Festlegung Nr. 6)
create policy "angebot_delete_eigene"
  on public.angebot for delete
  to authenticated
  using (nutzer_id = auth.uid());


-- ============================================================
-- Anfrage
-- ============================================================


-- Aufzählungstyp für anfrage.status (ER-Modell, Aufzählungstypen; FR-4.4/FR-4.6)
create type public.anfrage_status as enum (
  'offen',
  'ausgewaehlt',
  'abgelehnt',
  'zurueckgezogen'
);

-- Tabelle anfrage (ER-Modell v1.0, Abschnitt 1)
create table public.anfrage (
  id uuid primary key default gen_random_uuid(),

  -- dient als nutzer_id (ER-Modell Abschnitt 2)
  interessent_id uuid not null
    references public.profil(id)
    on delete cascade,

  -- Anfragen verschwinden mit dem Inserat (Festlegung Nr. 6, NFR-4.7)
  angebot_id uuid not null
    references public.angebot(id)
    on delete cascade,

  status public.anfrage_status not null default 'offen',

  -- optional (FR-4.3)
  nachricht text,

  erstellt_am timestamptz not null default now()
);

-- RLS (FR-6.2): nur der Interessent hat Zugriff (ER-Modell Abschnitt 2)
alter table public.anfrage enable row level security;

create policy "anfrage_select_eigene"
  on public.anfrage for select
  to authenticated
  using (interessent_id = auth.uid());

create policy "anfrage_insert_eigene"
  on public.anfrage for insert
  to authenticated
  with check (interessent_id = auth.uid());


-- ============================================================
-- Messwert
-- ============================================================


-- Aufzählungstyp für messwert.parameter (ER-Modell, Aufzählungstypen; FR-5.1)
create type public.messparameter as enum (
  'kh',
  'ca',
  'mg',
  'no3',
  'po4',
  'temperatur',
  'salinitaet'
);

-- Tabelle messwert (ER-Modell v1.0, Abschnitt 1)
create table public.messwert (
  id uuid primary key default gen_random_uuid(),

  nutzer_id uuid not null
    references public.profil(id)
    on delete cascade,

  becken_id uuid not null
    references public.becken(id)
    on delete cascade,

  datum date not null,
  parameter public.messparameter not null,
  wert numeric not null,

  -- fest je Parameter (FR-5.1)
  einheit text
);

-- RLS (FR-6.2): Diary-Einträge sind korrigierbar (Festlegung Nr. 8, FR-5.10)
alter table public.messwert enable row level security;

create policy "messwert_select_eigene"
  on public.messwert for select
  to authenticated
  using (nutzer_id = auth.uid());

create policy "messwert_insert_eigene"
  on public.messwert for insert
  to authenticated
  with check (nutzer_id = auth.uid());

create policy "messwert_update_eigene"
  on public.messwert for update
  to authenticated
  using (nutzer_id = auth.uid())
  with check (nutzer_id = auth.uid());

create policy "messwert_delete_eigene"
  on public.messwert for delete
  to authenticated
  using (nutzer_id = auth.uid());


-- ============================================================
-- Becken-Ereignis
-- ============================================================


-- Aufzählungstyp für becken_ereignis.typ (ER-Modell, Aufzählungstypen; FR-5.4, FR-5.5)
create type public.ereignis_typ as enum (
  'wasserwechsel',
  'fuetterung',
  'vorfall'
);

-- Tabelle becken_ereignis (ER-Modell v1.0, Abschnitt 1)
create table public.becken_ereignis (
  id uuid primary key default gen_random_uuid(),

  nutzer_id uuid not null
    references public.profil(id)
    on delete cascade,

  becken_id uuid not null
    references public.becken(id)
    on delete cascade,

  datum date not null,
  typ public.ereignis_typ not null,

  -- Freitext, z. B. 30 l (FR-5.3)
  menge text,
  text text,

  -- betroffene Koralle, bleibt beim Löschen der Koralle als Eintrag erhalten
  koralle_id uuid
    references public.koralle(id)
    on delete set null
);

-- RLS (FR-6.2): Diary-Einträge sind korrigierbar (Festlegung Nr. 8, FR-5.10)
alter table public.becken_ereignis enable row level security;

create policy "becken_ereignis_select_eigene"
  on public.becken_ereignis for select
  to authenticated
  using (nutzer_id = auth.uid());

create policy "becken_ereignis_insert_eigene"
  on public.becken_ereignis for insert
  to authenticated
  with check (nutzer_id = auth.uid());

create policy "becken_ereignis_update_eigene"
  on public.becken_ereignis for update
  to authenticated
  using (nutzer_id = auth.uid())
  with check (nutzer_id = auth.uid());

create policy "becken_ereignis_delete_eigene"
  on public.becken_ereignis for delete
  to authenticated
  using (nutzer_id = auth.uid());

  