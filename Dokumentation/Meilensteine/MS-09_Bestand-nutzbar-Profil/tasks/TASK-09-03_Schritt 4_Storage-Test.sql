-- TASK-09-03, Schritt 4 · Storage-Policies im Bucket medien (FR-6.2, NFR-3.1)
-- Voraussetzung: Testnutzer A und B (TASK-03-05), Bucket medien mit den Policies
-- medien_select_eigene, medien_insert_eigene, medien_delete_eigene.
-- Es entstehen nur Zeilen in storage.objects, keine Dateien. Größe und Dateityp prüft die Storage-API,
-- nicht die Datenbank – sie sind hier nicht Teil des Tests.
-- Supabase sperrt direktes DELETE auf storage.objects; die Sperre wird nur für diese Transaktion
-- aufgehoben (storage.allow_delete_query). Die Policies greifen trotzdem.
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a   uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  nutzer_b   uuid := '094fa34b-5383-4e81-b212-8f2ba2858671';
  claims_a   text := json_build_object('sub', nutzer_a, 'role', 'authenticated')::text;
  claims_b   text := json_build_object('sub', nutzer_b, 'role', 'authenticated')::text;
  pfad_a     text := nutzer_a || '/test-task-09-03/a.jpg';
  pfad_b     text := nutzer_b || '/test-task-09-03/b.jpg';
  pfad_a_von_b text := nutzer_a || '/test-task-09-03/von-b.jpg';
  pfad_b_von_a text := nutzer_b || '/test-task-09-03/von-a.jpg';
  n          int;
  n2         int;
  fehler     text;
  protokoll  text := '';
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('storage.allow_delete_query', 'true', true);
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer A';
  end if;

  -- 1 · A lädt in den eigenen Ordner hoch und liest die Datei
  begin
    insert into storage.objects (bucket_id, name) values ('medien', pfad_a);
    get diagnostics n = row_count;
    fehler := 'kein Fehler';
  exception
    when others then
      n := 0;
      fehler := sqlstate || ' ' || sqlerrm;
  end;
  select count(*) into n2 from storage.objects where bucket_id = 'medien' and name = pfad_a;

  protokoll := protokoll || format(E' 1 A lädt eigene hoch:             %s Zeile(n) · %s · liest %s → %s\n',
    n, fehler, n2,
    case when n = 1 and n2 = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 2 · A lädt in den Ordner von B hoch → abgelehnt
  begin
    insert into storage.objects (bucket_id, name) values ('medien', pfad_b_von_a);
    fehler := 'kein Fehler';
  exception
    when others then
      fehler := sqlstate || ' ' || sqlerrm;
  end;

  protokoll := protokoll || format(E' 2 A lädt in Ordner von B:         %s → %s\n',
    fehler, case when fehler like '42501%' then 'OK' else 'ABWEICHUNG' end);

  -- 3 · A lädt ohne Nutzerordner in die Wurzel hoch → abgelehnt
  begin
    insert into storage.objects (bucket_id, name) values ('medien', 'test-task-09-03.jpg');
    fehler := 'kein Fehler';
  exception
    when others then
      fehler := sqlstate || ' ' || sqlerrm;
  end;

  protokoll := protokoll || format(E' 3 A lädt in die Wurzel:           %s → %s\n',
    fehler, case when fehler like '42501%' then 'OK' else 'ABWEICHUNG' end);

  -- als Nutzer B anmelden
  perform set_config('request.jwt.claims', claims_b, true);
  if auth.uid() is distinct from nutzer_b then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer B';
  end if;

  -- 4 · Gegenprobe: B lädt in den eigenen Ordner hoch und liest die Datei
  begin
    insert into storage.objects (bucket_id, name) values ('medien', pfad_b);
    get diagnostics n = row_count;
    fehler := 'kein Fehler';
  exception
    when others then
      n := 0;
      fehler := sqlstate || ' ' || sqlerrm;
  end;
  select count(*) into n2 from storage.objects where bucket_id = 'medien' and name = pfad_b;

  protokoll := protokoll || format(E' 4 Gegenprobe: B lädt eigene hoch: %s Zeile(n) · %s · liest %s → %s\n',
    n, fehler, n2,
    case when n = 1 and n2 = 1 then 'OK' else 'ABWEICHUNG' end);

  -- 5 · B liest die Datei von A → nichts
  select count(*) into n from storage.objects where bucket_id = 'medien' and name = pfad_a;

  protokoll := protokoll || format(E' 5 B liest Datei von A:            %s Zeile(n) → %s\n',
    n, case when n = 0 then 'OK' else 'ABWEICHUNG' end);

  -- 6 · B lädt in den Ordner von A hoch → abgelehnt
  begin
    insert into storage.objects (bucket_id, name) values ('medien', pfad_a_von_b);
    fehler := 'kein Fehler';
  exception
    when others then
      fehler := sqlstate || ' ' || sqlerrm;
  end;

  protokoll := protokoll || format(E' 6 B lädt in Ordner von A:         %s → %s\n',
    fehler, case when fehler like '42501%' then 'OK' else 'ABWEICHUNG' end);

  -- 7 · B löscht die Datei von A → keine Zeile
  begin
    delete from storage.objects where bucket_id = 'medien' and name = pfad_a;
    get diagnostics n = row_count;
    fehler := 'kein Fehler';
  exception
    when others then
      n := -1;
      fehler := sqlstate || ' ' || sqlerrm;
  end;

  protokoll := protokoll || format(E' 7 B löscht Datei von A:           %s Zeile(n) · %s → %s\n',
    n, fehler, case when n = 0 and fehler = 'kein Fehler' then 'OK' else 'ABWEICHUNG' end);

  -- zurück zu Nutzer A
  perform set_config('request.jwt.claims', claims_a, true);
  if auth.uid() is distinct from nutzer_a then
    raise exception 'Abbruch: auth.uid() ist nicht wieder Nutzer A';
  end if;

  -- 8 · bei A ist die eigene Datei noch da, die von B nicht sichtbar
  select count(*) into n  from storage.objects where bucket_id = 'medien' and name = pfad_a;
  select count(*) into n2 from storage.objects where bucket_id = 'medien' and name = pfad_b;

  protokoll := protokoll || format(E' 8 A danach: eigene %s · von B %s → %s\n',
    n, n2, case when n = 1 and n2 = 0 then 'OK' else 'ABWEICHUNG' end);

  -- 9 · A löscht die eigene Datei
  begin
    delete from storage.objects where bucket_id = 'medien' and name = pfad_a;
    get diagnostics n = row_count;
    fehler := 'kein Fehler';
  exception
    when others then
      n := 0;
      fehler := sqlstate || ' ' || sqlerrm;
  end;
  select count(*) into n2 from storage.objects where bucket_id = 'medien' and name = pfad_a;

  protokoll := protokoll || format(E' 9 A löscht eigene:                %s Zeile(n) · %s · übrig %s → %s\n',
    n, fehler, n2,
    case when n = 1 and n2 = 0 then 'OK' else 'ABWEICHUNG' end);

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%', protokoll;
end $$;
