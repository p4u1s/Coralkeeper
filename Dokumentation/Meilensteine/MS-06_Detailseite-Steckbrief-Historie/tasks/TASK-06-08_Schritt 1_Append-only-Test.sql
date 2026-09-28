-- TASK-06-08, Schritt 1 · Historie ist append-only (FR-3.3, Festlegung 7)
-- Voraussetzung: Testnutzer A und sein Historieneintrag aaaaaaaa-…-000000000005 (TASK-03-05, Schritt 6).
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a     uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  h_alt        uuid := 'aaaaaaaa-0000-0000-0000-000000000005';
  claims_a     text := json_build_object('sub', nutzer_a, 'role', 'authenticated')::text;
  k            uuid;
  h_neu        uuid;
  eintrag      uuid;
  liest        int;
  text_vorher  text;
  text_nachher text;
  aendert      int;
  loescht      int;
  vorhanden    int;
  protokoll    text := '';
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer A';
  end if;

  -- Gegenprobe 1: A liest den eigenen Eintrag – sonst sagen die Tests unten nichts aus
  select count(*) into liest from public.historieneintrag he where he.id = h_alt;
  protokoll := protokoll || format(E'1 Gegenprobe lesen:   %s Zeile → %s\n',
    liest, case when liest = 1 then 'OK' else 'ABWEICHUNG' end);
  if liest <> 1 then
    raise exception E'Abbruch: A sieht den eigenen Eintrag nicht.\n\n%', protokoll;
  end if;

  -- Gegenprobe 2: A legt einen eigenen Journaleintrag zur selben Koralle an
  select he.koralle_id into k from public.historieneintrag he where he.id = h_alt;
  insert into public.historieneintrag (nutzer_id, koralle_id, datum, typ, text)
  values (nutzer_a, k, current_date, 'journal', 'Testeintrag TASK-06-08')
  returning id into h_neu;
  protokoll := protokoll || E'2 Gegenprobe anlegen: gelingt → OK\n\n';

  -- 3 und 4: ändern und löschen, je für den alten und den neuen Eintrag
  foreach eintrag in array array[h_alt, h_neu] loop
    select he.text into text_vorher from public.historieneintrag he where he.id = eintrag;

    update public.historieneintrag set text = 'geändert' where id = eintrag;
    get diagnostics aendert = row_count;
    select he.text into text_nachher from public.historieneintrag he where he.id = eintrag;

    delete from public.historieneintrag where id = eintrag;
    get diagnostics loescht = row_count;
    select count(*) into vorhanden from public.historieneintrag he where he.id = eintrag;

    protokoll := protokoll || format(E'%s\n  3 ändern:  %s Zeilen · Text unverändert: %s → %s\n  4 löschen: %s Zeilen · noch vorhanden: %s → %s\n',
      case when eintrag = h_alt then 'Eintrag …000000000005' else 'neuer Journaleintrag' end,
      aendert, text_nachher is not distinct from text_vorher,
      case when aendert = 0 and text_nachher is not distinct from text_vorher then 'OK' else 'ABWEICHUNG' end,
      loescht, vorhanden = 1,
      case when loescht = 0 and vorhanden = 1 then 'OK' else 'ABWEICHUNG' end);
  end loop;

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%', protokoll;
end $$;
