-- TASK-07-08, Schritt 2 · Inserat und MS-7-Daten von A als Nutzer B und ohne Anmeldung
-- Voraussetzung: Testnutzer A und B, Testdaten von A (aaaaaaaa-…), ein Ableger von A mit sichtbarem Inserat.
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a      uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  nutzer_b      uuid := '094fa34b-5383-4e81-b212-8f2ba2858671';
  bk            uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  ang_fest      uuid := 'aaaaaaaa-0000-0000-0000-000000000006';  -- wird für Prüfung 9 unsichtbar gesetzt
  messwert_a    uuid := 'aaaaaaaa-0000-0000-0000-000000000008';
  ereignis_a    uuid := 'aaaaaaaa-0000-0000-0000-000000000009';
  claims_b      text := json_build_object('sub', nutzer_b, 'role', 'authenticated')::text;
  ableger       uuid;
  ableger_name  text;
  ursprung      uuid;
  ang_ableger   uuid;
  historie_a    int;
  b_becken      uuid;
  b_koralle     uuid;
  n             int;
  n_becken      int;
  n_messwert    int;
  n_ereignis    int;
  aendert       int;
  loescht       int;
  art_da        boolean;
  legt_an       text;
  protokoll     text := '';
begin
  -- als postgres: Ableger von A mit sichtbarem Inserat suchen
  select k.id, k.bezeichnung, k.mutter_id, a.id
    into ableger, ableger_name, ursprung, ang_ableger
    from public.koralle k
    join public.angebot a on a.koralle_id = k.id
   where k.nutzer_id = nutzer_a
     and k.mutter_id is not null
     and a.sichtbar
   limit 1;
  if ableger is null then
    raise exception 'Abbruch: kein Ableger von A mit sichtbarem Inserat gefunden';
  end if;

  -- als postgres: Historieneinträge zählen – sonst sagt "B liest 0" nichts aus
  select count(*) into historie_a from public.historieneintrag where koralle_id in (ableger, ursprung);

  -- als postgres: festes Test-Inserat unsichtbar setzen
  update public.angebot set sichtbar = false where id = ang_fest;

  protokoll := format(E'Ableger "%s" (%s), Ursprung %s, Inserat %s, Historieneinträge von A: %s\n\n',
    ableger_name, ableger, ursprung, ang_ableger, historie_a);

  -- als Nutzer B anmelden
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', claims_b, true);
  if auth.uid() is distinct from nutzer_b then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer B';
  end if;

  -- 2 · Gegenprobe: B legt eigene Daten an und liest sie
  insert into public.becken (nutzer_id, name) values (nutzer_b, 'Becken B') returning id into b_becken;
  insert into public.koralle (nutzer_id, becken_id, bezeichnung) values (nutzer_b, b_becken, 'Koralle B') returning id into b_koralle;
  insert into public.angebot (nutzer_id, koralle_id, modus) values (nutzer_b, b_koralle, 'verschenken');
  select count(*) into n from public.angebot where koralle_id = b_koralle;
  protokoll := protokoll || format(E' 2 Gegenprobe: B legt an und liest eigenes Inserat: %s → %s\n',
    n, case when n = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 3 · sichtbares Inserat des Ablegers mit Art und Handelsname (Festlegung 13)
  select count(*), coalesce(bool_and(art is not null and handelsname is not null), false)
    into n, art_da
    from public.angebot where id = ang_ableger;
  protokoll := protokoll || format(E' 3 B liest Inserat des Ablegers: %s Zeile(n), Art und Handelsname: %s → %s\n',
    n, case when art_da then 'gefüllt' else 'LEER' end,
    case when n = 1 and art_da then 'OK' else 'ABWEICHUNG' end);

  -- 4 · Ableger und Ursprungskoralle
  select count(*) into n from public.koralle where id in (ableger, ursprung);
  protokoll := protokoll || format(E' 4 B liest Ableger und Ursprungskoralle: %s → %s\n',
    n, case when n = 0 then 'OK' else 'ABWEICHUNG' end);

  -- 5 · Historieneinträge von Ableger und Ursprungskoralle
  select count(*) into n from public.historieneintrag where koralle_id in (ableger, ursprung);
  protokoll := protokoll || format(E' 5 B liest deren Historieneinträge: %s (A hat %s) → %s\n',
    n, historie_a, case when n = 0 and historie_a > 0 then 'OK' else 'ABWEICHUNG' end);

  -- 6 · Becken, Messwert, Ereignis
  select count(*) into n_becken   from public.becken          where id = bk;
  select count(*) into n_messwert from public.messwert        where id = messwert_a;
  select count(*) into n_ereignis from public.becken_ereignis where id = ereignis_a;
  protokoll := protokoll || format(E' 6 B liest Becken %s · Messwert %s · Ereignis %s → %s\n',
    n_becken, n_messwert, n_ereignis,
    case when n_becken + n_messwert + n_ereignis = 0 then 'OK' else 'ABWEICHUNG' end);

  -- 7 · Inserat des Ablegers ändern und löschen
  update public.angebot set sichtbar = false where id = ang_ableger;
  get diagnostics aendert = row_count;
  delete from public.angebot where id = ang_ableger;
  get diagnostics loescht = row_count;
  select count(*) into n from public.angebot where id = ang_ableger and sichtbar;
  protokoll := protokoll || format(E' 7 B ändert %s · löscht %s · Inserat noch sichtbar vorhanden: %s → %s\n',
    aendert, loescht, n,
    case when aendert = 0 and loescht = 0 and n = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 8 · B inseriert die Ursprungskoralle von A mit eigener nutzer_id (Festlegung 12)
  begin
    insert into public.angebot (nutzer_id, koralle_id, modus) values (nutzer_b, ursprung, 'verschenken');
    legt_an := 'angelegt → ABWEICHUNG';
  exception
    when insufficient_privilege then legt_an := 'RLS-Fehler → OK';
    when others then legt_an := sqlerrm || ' → PRÜFEN';
  end;
  protokoll := protokoll || format(E' 8 B inseriert Koralle von A: %s\n', legt_an);

  -- 9 · unsichtbares Inserat …06
  select count(*) into n from public.angebot where id = ang_fest;
  protokoll := protokoll || format(E' 9 B liest unsichtbares Inserat: %s → %s\n',
    n, case when n = 0 then 'OK' else 'ABWEICHUNG' end);

  -- 10 · ohne Anmeldung: ganze Tabelle angebot
  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', '', true);
  begin
    select count(*) into n from public.angebot;
  exception
    when insufficient_privilege then n := 0;  -- kein Tabellenrecht = auch kein Zugriff
  end;
  protokoll := protokoll || format(E'10 anon liest angebot: %s → %s\n',
    n, case when n = 0 then 'OK' else 'ABWEICHUNG' end);

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%', protokoll;
end $$;
