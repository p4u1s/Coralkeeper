-- TASK-07-01, Schritt 4 · Systemeinträge bei der Ablegererzeugung (FR-3.4, Festlegung 17)
-- Voraussetzung: Testnutzer A und sein Becken aaaaaaaa-…-000000000001, Testnutzer B (TASK-03-05),
-- Funktion systemeintrag_anlegen in der Fassung aus TASK-07-01.
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a      uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  nutzer_b      uuid := '094fa34b-5383-4e81-b212-8f2ba2858671';
  bk            uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  claims_a      text := json_build_object('sub', nutzer_a, 'role', 'authenticated')::text;
  claims_b      text := json_build_object('sub', nutzer_b, 'role', 'authenticated')::text;
  heute         date := (now() at time zone 'Europe/Berlin')::date;
  mutter        uuid;
  ableger       uuid;
  b_becken      uuid;
  b_koralle     uuid;
  fremd_ableger uuid;
  anzahl        int;
  treffer       int;
  angelegt      int;
  mit_datum     int;
  mutter_anzahl int;
  fremd_anzahl  int;
  eintraege     text;
  protokoll     text := '';
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer A';
  end if;

  -- 1. Koralle ohne mutter_id → genau ein Eintrag "Koralle angelegt"
  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
  values (nutzer_a, bk, 'Testmutter TASK-07-01')
  returning id into mutter;

  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Koralle angelegt')
    into anzahl, treffer
  from public.historieneintrag h
  where h.koralle_id = mutter;

  protokoll := protokoll || format(E'1 ohne Ursprung:     %s Eintrag/Einträge · "Koralle angelegt": %s → %s\n',
    anzahl, treffer,
    case when anzahl = 1 and treffer = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 2. Ableger → genau ein Eintrag "Ableger von „…“ angelegt", kein "Koralle angelegt"
  insert into public.koralle (nutzer_id, becken_id, mutter_id, bezeichnung)
  values (nutzer_a, bk, mutter, 'Testableger TASK-07-01')
  returning id into ableger;

  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Ableger von „Testmutter TASK-07-01“ angelegt'),
         count(*) filter (where h.text = 'Koralle angelegt'),
         count(*) filter (where h.datum = heute)
    into anzahl, treffer, angelegt, mit_datum
  from public.historieneintrag h
  where h.koralle_id = ableger;

  protokoll := protokoll || format(E'2 Ableger:           %s Eintrag/Einträge · Ableger-Text: %s · "Koralle angelegt": %s · Datum %s: %s → %s\n',
    anzahl, treffer, angelegt, heute, mit_datum,
    case when anzahl = 1 and treffer = 1 and angelegt = 0 and mit_datum = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 3. Ursprungskoralle → genau ein neuer Eintrag "Ableger „…“ erzeugt"
  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Ableger „Testableger TASK-07-01“ erzeugt'),
         count(*) filter (where h.datum = heute)
    into anzahl, treffer, mit_datum
  from public.historieneintrag h
  where h.koralle_id = mutter;

  protokoll := protokoll || format(E'3 Ursprungskoralle:  %s Einträge · Erzeugt-Text: %s · Datum %s: %s → %s\n',
    anzahl, treffer, heute, mit_datum,
    case when anzahl = 2 and treffer = 1 and mit_datum = 2 then 'OK' else 'ABWEICHUNG' end);

  -- 4. Statuswechsel am Ableger → weiterhin "Status geändert: …", bei der Ursprungskoralle nichts Neues
  update public.koralle set status = 'zur_abgabe' where id = ableger;

  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Status geändert: Im Bestand → Zur Abgabe')
    into anzahl, treffer
  from public.historieneintrag h
  where h.koralle_id = ableger;

  select count(*) into mutter_anzahl from public.historieneintrag h where h.koralle_id = mutter;

  protokoll := protokoll || format(E'4 Statuswechsel:     %s Einträge · Statuswechsel-Text: %s · Ursprungskoralle %s Einträge → %s\n',
    anzahl, treffer, mutter_anzahl,
    case when anzahl = 2 and treffer = 1 and mutter_anzahl = 2 then 'OK' else 'ABWEICHUNG' end);

  -- 5. fremde mutter_id → "Ableger angelegt", kein Eintrag bei der fremden Koralle
  perform set_config('request.jwt.claims', claims_b, true);
  insert into public.becken (nutzer_id, name)
  values (nutzer_b, 'Testbecken B TASK-07-01')
  returning id into b_becken;
  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
  values (nutzer_b, b_becken, 'Koralle B TASK-07-01')
  returning id into b_koralle;

  perform set_config('request.jwt.claims', claims_a, true);
  insert into public.koralle (nutzer_id, becken_id, mutter_id, bezeichnung)
  values (nutzer_a, bk, b_koralle, 'Testableger fremd TASK-07-01')
  returning id into fremd_ableger;

  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = 'Ableger angelegt')
    into anzahl, treffer
  from public.historieneintrag h
  where h.koralle_id = fremd_ableger;

  -- A sieht nur Einträge mit eigener nutzer_id – also genau den unerwünschten Eintrag, falls es ihn gibt
  select count(*) into fremd_anzahl from public.historieneintrag h where h.koralle_id = b_koralle;

  protokoll := protokoll || format(E'5 fremde mutter_id:  %s Eintrag/Einträge · "Ableger angelegt": %s · Einträge von A bei Koralle B: %s → %s\n',
    anzahl, treffer, fremd_anzahl,
    case when anzahl = 1 and treffer = 1 and fremd_anzahl = 0 then 'OK' else 'ABWEICHUNG' end);

  select string_agg(format('%s · %s · %s', h.datum, h.typ, h.text), E'\n  ')
    into eintraege
  from public.historieneintrag h
  where h.koralle_id in (mutter, ableger, fremd_ableger);

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%\nEinträge:\n  %', protokoll, eintraege;
end $$;
