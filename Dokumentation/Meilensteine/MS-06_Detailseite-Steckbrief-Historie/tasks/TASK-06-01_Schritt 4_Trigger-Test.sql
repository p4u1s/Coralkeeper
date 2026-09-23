-- TASK-06-01, Schritt 4 · Systemeinträge bei Anlage und Statuswechsel (FR-3.4)
-- Voraussetzung: Testnutzer A und sein Becken aaaaaaaa-…-000000000001 (TASK-03-05, Schritte 5 und 6),
-- Funktion systemeintrag_anlegen mit beiden Triggern auf public.koralle.
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a  uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  bk        uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  claims_a  text := json_build_object('sub', nutzer_a, 'role', 'authenticated')::text;
  heute     date := (now() at time zone 'Europe/Berlin')::date;
  k         uuid;
  anzahl    int;
  treffer   int;
  mit_datum int;
  eintraege text;
  protokoll text := '';
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer A';
  end if;

  -- 1. Anlage → genau ein Eintrag "Koralle angelegt" mit deutschem Datum
  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
  values (nutzer_a, bk, 'Testkoralle TASK-06-01')
  returning id into k;

  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Koralle angelegt'),
         count(*) filter (where h.datum = heute)
    into anzahl, treffer, mit_datum
  from public.historieneintrag h
  where h.koralle_id = k;

  protokoll := protokoll || format(E'1 Anlage:               %s Eintrag/Einträge · "Koralle angelegt": %s · Datum %s: %s → %s\n',
    anzahl, treffer, heute, mit_datum,
    case when anzahl = 1 and treffer = 1 and mit_datum = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 2. Statuswechsel → zweiter Eintrag
  update public.koralle set status = 'zur_abgabe' where id = k;

  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Status geändert: Im Bestand → Zur Abgabe')
    into anzahl, treffer
  from public.historieneintrag h
  where h.koralle_id = k;

  protokoll := protokoll || format(E'2 Statuswechsel:        %s Einträge · Statuswechsel-Text: %s → %s\n',
    anzahl, treffer,
    case when anzahl = 2 and treffer = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 3. derselbe Status noch einmal → kein weiterer Eintrag
  update public.koralle set status = 'zur_abgabe' where id = k;
  select count(*) into anzahl from public.historieneintrag h where h.koralle_id = k;
  protokoll := protokoll || format(E'3 Status unverändert:   %s Einträge → %s\n',
    anzahl, case when anzahl = 2 then 'OK' else 'ABWEICHUNG' end);

  -- 4. andere Spalte ändern → kein weiterer Eintrag
  update public.koralle set bezeichnung = 'Testkoralle umbenannt' where id = k;
  select count(*) into anzahl from public.historieneintrag h where h.koralle_id = k;
  protokoll := protokoll || format(E'4 Bezeichnung geändert: %s Einträge → %s\n',
    anzahl, case when anzahl = 2 then 'OK' else 'ABWEICHUNG' end);

  select string_agg(format('%s · %s · %s', h.datum, h.typ, h.text), E'\n  ')
    into eintraege
  from public.historieneintrag h
  where h.koralle_id = k;

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%\nEinträge:\n  %', protokoll, eintraege;
end $$;
