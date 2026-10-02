-- TASK-09-02, Schritt 4 · Policies Koralle/Bild löschen und Profil ändern, Systemeintrag beim Beckenwechsel
-- (FR-1.10, FR-1.11, FR-6.2, FR-6.8)
-- Voraussetzung: Testnutzer A und B, Becken von A aaaaaaaa-…-000000000001 (TASK-03-05, Schritte 5 und 6),
-- Policies koralle_delete_eigene, bild_dokument_delete_eigene, profil_update_eigenes,
-- Funktion beckenwechsel_systemeintrag mit Trigger bei_beckenwechsel_systemeintrag.
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a      uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  nutzer_b      uuid := '094fa34b-5383-4e81-b212-8f2ba2858671';
  bk            uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  claims_a      text := json_build_object('sub', nutzer_a, 'role', 'authenticated')::text;
  claims_b      text := json_build_object('sub', nutzer_b, 'role', 'authenticated')::text;
  bk_name       text;
  bk2           uuid;
  k             uuid;
  ableger       uuid;
  bild_k        uuid;
  bild_ableger  uuid;
  b_becken      uuid;
  b_koralle     uuid;
  erwartet      text;
  anzahl        int;
  treffer       int;
  n             int;
  n_angebot     int;
  n_historie    int;
  n_bild        int;
  loescht       int;
  aendert       int;
  fehler        text;
  name_a        text;
  mutter        uuid;
  primaer       uuid;
  eintraege     text;
  protokoll     text := '';
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer A';
  end if;

  -- Ausgangslage: zweites Becken, Koralle im Becken …01
  select name into bk_name from public.becken where id = bk;

  insert into public.becken (nutzer_id, name)
  values (nutzer_a, 'Testbecken TASK-09-02')
  returning id into bk2;

  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
  values (nutzer_a, bk, 'Testkoralle TASK-09-02')
  returning id into k;

  -- 1 · Beckenwechsel → genau ein Eintrag mit beiden Namen
  erwartet := 'Becken gewechselt: ' || bk_name || ' → Testbecken TASK-09-02';

  update public.koralle set becken_id = bk2 where id = k;

  select count(*),
         count(*) filter (where h.typ = 'system' and h.text = erwartet)
    into anzahl, treffer
  from public.historieneintrag h
  where h.koralle_id = k;

  protokoll := protokoll || format(E' 1 Beckenwechsel:                  %s Einträge · Wechsel-Text: %s → %s\n',
    anzahl, treffer,
    case when anzahl = 2 and treffer = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 2 · Änderung ohne Wechsel (becken_id auf denselben Wert) → kein weiterer Eintrag
  update public.koralle
     set bezeichnung = 'Testkoralle TASK-09-02 (geändert)',
         becken_id = bk2
   where id = k;

  select count(*) into anzahl from public.historieneintrag h where h.koralle_id = k;

  protokoll := protokoll || format(E' 2 Änderung ohne Beckenwechsel:    %s Einträge → %s\n',
    anzahl, case when anzahl = 2 then 'OK' else 'ABWEICHUNG' end);

  -- Vorbereitung Löschtest: Ableger, Inserat, Journaleintrag, je ein Primärbild bei Koralle und Ableger
  insert into public.koralle (nutzer_id, becken_id, mutter_id, bezeichnung)
  values (nutzer_a, bk2, k, 'Ableger TASK-09-02')
  returning id into ableger;

  insert into public.angebot (nutzer_id, koralle_id, modus)
  values (nutzer_a, k, 'verschenken');

  insert into public.historieneintrag (nutzer_id, koralle_id, datum, typ, text)
  values (nutzer_a, k, current_date, 'journal', 'Journaleintrag TASK-09-02');

  insert into public.bild_dokument (nutzer_id, koralle_id, storage_pfad, typ)
  values (nutzer_a, k, nutzer_a || '/' || k || '/test.jpg', 'bild')
  returning id into bild_k;
  update public.koralle set primaerbild = bild_k where id = k;

  insert into public.bild_dokument (nutzer_id, koralle_id, storage_pfad, typ)
  values (nutzer_a, ableger, nutzer_a || '/' || ableger || '/test.jpg', 'bild')
  returning id into bild_ableger;
  update public.koralle set primaerbild = bild_ableger where id = ableger;

  -- 3 · eigenes Profil ändern
  update public.profil set anzeigename = 'Profil A TASK-09-02' where id = nutzer_a;
  get diagnostics aendert = row_count;
  select anzeigename into name_a from public.profil where id = nutzer_a;

  protokoll := protokoll || format(E' 3 A ändert eigenes Profil:        %s Zeile(n) · Anzeigename "%s" → %s\n',
    aendert, name_a,
    case when aendert = 1 and name_a = 'Profil A TASK-09-02' then 'OK' else 'ABWEICHUNG' end);

  -- als Nutzer B anmelden
  perform set_config('request.jwt.claims', claims_b, true);
  if auth.uid() is distinct from nutzer_b then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer B';
  end if;

  -- 4 · Gegenprobe: B legt eigene Koralle an und löscht sie
  insert into public.becken (nutzer_id, name) values (nutzer_b, 'Becken B') returning id into b_becken;
  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
  values (nutzer_b, b_becken, 'Koralle B')
  returning id into b_koralle;

  delete from public.koralle where id = b_koralle;
  get diagnostics loescht = row_count;

  protokoll := protokoll || format(E' 4 Gegenprobe: B löscht eigene:    %s Zeile(n) → %s\n',
    loescht, case when loescht = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 5 · B löscht Koralle von A, Bilddatensatz von A und ändert Profil von A
  delete from public.koralle where id = k;
  get diagnostics loescht = row_count;
  delete from public.bild_dokument where id = bild_k;
  get diagnostics n = row_count;
  update public.profil set anzeigename = 'von B geändert' where id = nutzer_a;
  get diagnostics aendert = row_count;

  protokoll := protokoll || format(E' 5 B bei A: Koralle %s · Bild %s · Profil %s Zeile(n) → %s\n',
    loescht, n, aendert,
    case when loescht = 0 and n = 0 and aendert = 0 then 'OK' else 'ABWEICHUNG' end);

  -- zurück zu Nutzer A
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht wieder Nutzer A';
  end if;

  -- 6 · nach Schritt 5 ist bei A alles unverändert
  select count(*) into n from public.koralle where id = k;
  select count(*) into n_bild from public.bild_dokument where id = bild_k;
  select anzeigename into name_a from public.profil where id = nutzer_a;

  protokoll := protokoll || format(E' 6 A danach: Koralle %s · Bild %s · Anzeigename "%s" → %s\n',
    n, n_bild, name_a,
    case when n = 1 and n_bild = 1 and name_a = 'Profil A TASK-09-02' then 'OK' else 'ABWEICHUNG' end);

  -- 7 · A löscht den eigenen Bilddatensatz des Ablegers → Primärbild geleert
  delete from public.bild_dokument where id = bild_ableger;
  get diagnostics loescht = row_count;
  select primaerbild into primaer from public.koralle where id = ableger;

  protokoll := protokoll || format(E' 7 A löscht eigenes Bild:          %s Zeile(n) · Primärbild %s → %s\n',
    loescht, coalesce(primaer::text, 'leer'),
    case when loescht = 1 and primaer is null then 'OK' else 'ABWEICHUNG' end);

  -- 8 · A löscht die Ursprungskoralle mit Ableger, Inserat, Journaleintrag und Bild (Hinweis TASK-07-04)
  begin
    delete from public.koralle where id = k;
    get diagnostics loescht = row_count;
    fehler := 'kein Fehler';
  exception
    when others then
      loescht := 0;
      fehler := sqlerrm;
  end;

  select count(*) into n          from public.koralle          where id = k;
  select count(*) into n_angebot  from public.angebot          where koralle_id = k;
  select count(*) into n_historie from public.historieneintrag where koralle_id = k;
  select count(*) into n_bild     from public.bild_dokument    where koralle_id = k;

  protokoll := protokoll || format(E' 8 A löscht Ursprungskoralle:      %s Zeile(n) · %s\n'
                                   || E'   übrig: Koralle %s · Inserat %s · Historie %s · Bild %s → %s\n',
    loescht, fehler, n, n_angebot, n_historie, n_bild,
    case when loescht = 1 and fehler = 'kein Fehler'
          and n + n_angebot + n_historie + n_bild = 0 then 'OK' else 'ABWEICHUNG' end);

  -- 9 · Ableger besteht weiter, Verweis geleert (FR-1.10, Festlegung 2)
  select count(*) into n from public.koralle where id = ableger;
  select mutter_id into mutter from public.koralle where id = ableger;

  protokoll := protokoll || format(E' 9 Ableger:                        %s Zeile(n) · mutter_id %s → %s\n',
    n, coalesce(mutter::text, 'leer'),
    case when n = 1 and mutter is null then 'OK' else 'ABWEICHUNG' end);

  select string_agg(format('%s · %s · %s', h.datum, h.typ, h.text), E'\n  ')
    into eintraege
  from public.historieneintrag h
  where h.koralle_id = ableger;

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%\nEinträge des Ablegers:\n  %', protokoll, eintraege;
end $$;
