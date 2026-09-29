-- TASK-07-04, Schritt 4 · Inserat und Status koppeln (FR-4.1, FR-4.2)
-- Voraussetzung: Testnutzer A und sein Becken aaaaaaaa-…-000000000001 (TASK-03-05, Schritte 5 und 6),
-- Funktion angebot_status_setzen mit beiden Triggern auf public.angebot.
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a  uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  bk        uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  claims_a  text := json_build_object('sub', nutzer_a, 'role', 'authenticated')::text;
  k         uuid;
  a         uuid;
  st        public.koralle_status;
  anzahl    int;
  treffer   int;
  eintraege text;
  protokoll text := '';
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer A';
  end if;

  -- Ausgangslage: Koralle im Bestand, ein Eintrag "Koralle angelegt"
  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
  values (nutzer_a, bk, 'Testkoralle TASK-07-04')
  returning id into k;

  -- 1. Inserat anlegen → zur_abgabe, genau ein Statuswechsel-Eintrag
  insert into public.angebot (nutzer_id, koralle_id, modus)
  values (nutzer_a, k, 'verschenken')
  returning id into a;

  select status into st from public.koralle where id = k;
  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Status geändert: Im Bestand → Zur Abgabe')
    into anzahl, treffer
  from public.historieneintrag h
  where h.koralle_id = k;

  protokoll := protokoll || format(E'1 Inserat angelegt:          Status %s · %s Einträge · Statuswechsel-Text: %s → %s\n',
    st, anzahl, treffer,
    case when st = 'zur_abgabe' and anzahl = 2 and treffer = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 2. Inserat löschen → im_bestand, genau ein weiterer Eintrag
  delete from public.angebot where id = a;

  select status into st from public.koralle where id = k;
  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Status geändert: Zur Abgabe → Im Bestand')
    into anzahl, treffer
  from public.historieneintrag h
  where h.koralle_id = k;

  protokoll := protokoll || format(E'2 Inserat gelöscht:          Status %s · %s Einträge · Statuswechsel-Text: %s → %s\n',
    st, anzahl, treffer,
    case when st = 'im_bestand' and anzahl = 3 and treffer = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 3. erneut inserieren, auf abgegeben setzen, Inserat löschen → bleibt abgegeben, kein weiterer Eintrag
  insert into public.angebot (nutzer_id, koralle_id, modus)
  values (nutzer_a, k, 'verschenken')
  returning id into a;

  update public.koralle set status = 'abgegeben' where id = k;
  delete from public.angebot where id = a;

  select status into st from public.koralle where id = k;
  select count(*) into anzahl from public.historieneintrag h where h.koralle_id = k;

  protokoll := protokoll || format(E'3 Abgegeben, dann gelöscht:  Status %s · %s Einträge → %s\n',
    st, anzahl,
    case when st = 'abgegeben' and anzahl = 5 then 'OK' else 'ABWEICHUNG' end);

  select string_agg(format('%s · %s · %s', h.datum, h.typ, h.text), E'\n  ')
    into eintraege
  from public.historieneintrag h
  where h.koralle_id = k;

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%\nEinträge:\n  %', protokoll, eintraege;
end $$;
