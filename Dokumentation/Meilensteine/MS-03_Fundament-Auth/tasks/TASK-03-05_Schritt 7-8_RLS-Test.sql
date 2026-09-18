-- TASK-03-05, Schritte 7 und 8 · Prüfung als Nutzer B und ohne Anmeldung
-- Voraussetzung: Testnutzer A und B (Schritt 5) und Testdaten von A mit den IDs aaaaaaaa-… (Schritt 6).
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLES zurück. Das Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a  uuid := 'ddd19768-7a5a-452a-b693-946e070c4f9c';
  nutzer_b  uuid := '094fa34b-5383-4e81-b212-8f2ba2858671';
  bk        uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  k1        uuid := 'aaaaaaaa-0000-0000-0000-000000000002';  -- inseriert, ohne Abgabe
  k2        uuid := 'aaaaaaaa-0000-0000-0000-000000000003';  -- abgegeben, ohne Inserat
  ang       uuid := 'aaaaaaaa-0000-0000-0000-000000000006';
  claims_b  text := json_build_object('sub', nutzer_b, 'role', 'authenticated')::text;
  tests     text[][];
  zeile     text[];
  liest     int;
  aendert   int;
  loescht   int;
  anon_liest int;
  legt_an   text;
  b_becken  uuid;
  b_koralle uuid;
  protokoll text := '';
begin
  -- je Tabelle: Name, ID des Datensatzes von A, Versuch "B legt für A an"
  tests := array[
    ['profil',           nutzer_a::text, format('insert into public.profil (id, anzeigename, kontakt_email) values (%L, %L, %L)', nutzer_a, 'fremd', 'fremd')],
    ['becken',           bk::text,       format('insert into public.becken (nutzer_id, name) values (%L, %L)', nutzer_a, 'fremd')],
    ['koralle',          k1::text,       format('insert into public.koralle (nutzer_id, becken_id, bezeichnung) values (%L, %L, %L)', nutzer_a, bk, 'fremd')],
    ['historieneintrag', 'aaaaaaaa-0000-0000-0000-000000000005', format('insert into public.historieneintrag (nutzer_id, koralle_id, datum, typ) values (%L, %L, current_date, %L)', nutzer_a, k1, 'journal')],
    ['angebot',          ang::text,      format('insert into public.angebot (nutzer_id, koralle_id, modus) values (%L, %L, %L)', nutzer_a, k2, 'verschenken')],
    ['anfrage',          'aaaaaaaa-0000-0000-0000-000000000007', format('insert into public.anfrage (interessent_id, angebot_id) values (%L, %L)', nutzer_a, ang)],
    ['messwert',         'aaaaaaaa-0000-0000-0000-000000000008', format('insert into public.messwert (nutzer_id, becken_id, datum, parameter, wert) values (%L, %L, current_date, %L, 8)', nutzer_a, bk, 'kh')],
    ['becken_ereignis',  'aaaaaaaa-0000-0000-0000-000000000009', format('insert into public.becken_ereignis (nutzer_id, becken_id, datum, typ) values (%L, %L, current_date, %L)', nutzer_a, bk, 'fuetterung')],
    ['bild_dokument',    'aaaaaaaa-0000-0000-0000-000000000004', format('insert into public.bild_dokument (nutzer_id, koralle_id, typ) values (%L, %L, %L)', nutzer_a, k1, 'bild')],
    ['abgabe',           'aaaaaaaa-0000-0000-0000-000000000010', format('insert into public.abgabe (nutzer_id, koralle_id) values (%L, %L)', nutzer_a, k1)]
  ];

  -- als Nutzer B anmelden
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', claims_b, true);
  if auth.uid() is distinct from nutzer_b then
    raise exception 'Abbruch: auth.uid() ist nicht Nutzer B';
  end if;

  -- Gegenprobe: B darf eigene Daten anlegen – sonst sagen die Tests unten nichts aus
  insert into public.becken (nutzer_id, name) values (nutzer_b, 'Becken B') returning id into b_becken;
  insert into public.koralle (nutzer_id, becken_id, bezeichnung) values (nutzer_b, b_becken, 'Koralle B') returning id into b_koralle;
  insert into public.angebot (nutzer_id, koralle_id, modus) values (nutzer_b, b_koralle, 'verschenken');
  protokoll := protokoll || E'Gegenprobe: B legt eigenes Becken, eigene Koralle und eigenes Inserat an → OK\n\n';

  foreach zeile slice 1 in array tests loop
    -- als B: lesen, ändern, löschen, für A anlegen
    execute format('select count(*) from public.%I where id = $1', zeile[1]) into liest using zeile[2]::uuid;
    execute format('update public.%I set id = id where id = $1', zeile[1]) using zeile[2]::uuid;
    get diagnostics aendert = row_count;
    execute format('delete from public.%I where id = $1', zeile[1]) using zeile[2]::uuid;
    get diagnostics loescht = row_count;
    begin
      execute zeile[3];
      legt_an := 'angelegt';
    exception
      when insufficient_privilege then legt_an := 'RLS-Fehler';
      when others then legt_an := sqlerrm;
    end;

    -- ohne Anmeldung: lesen
    perform set_config('role', 'anon', true);
    perform set_config('request.jwt.claims', '', true);
    begin
      execute format('select count(*) from public.%I where id = $1', zeile[1]) into anon_liest using zeile[2]::uuid;
    exception
      when insufficient_privilege then anon_liest := 0;  -- kein Tabellenrecht = auch kein Zugriff
    end;
    perform set_config('role', 'authenticated', true);
    perform set_config('request.jwt.claims', claims_b, true);

    protokoll := protokoll || format(E'%-17s liest %s · ändert %s · löscht %s · legt an: %s · anon liest %s → %s\n',
      zeile[1], liest, aendert, loescht, legt_an, anon_liest,
      case when liest = (case when zeile[1] = 'angebot' then 1 else 0 end)  -- sichtbares Inserat (FR-4.2)
            and aendert = 0 and loescht = 0 and legt_an = 'RLS-Fehler' and anon_liest = 0
           then 'OK' else 'ABWEICHUNG' end);
  end loop;

  -- Festlegung 12: B inseriert bzw. gibt eine Koralle von A ab – mit eigener nutzer_id
  begin
    insert into public.angebot (nutzer_id, koralle_id, modus) values (nutzer_b, k2, 'verschenken');
    legt_an := 'angelegt → ABWEICHUNG';
  exception
    when insufficient_privilege then legt_an := 'RLS-Fehler → OK';
    when others then legt_an := sqlerrm || ' → PRÜFEN';
  end;
  protokoll := protokoll || format(E'\nFestlegung 12: B inseriert Koralle von A: %s\n', legt_an);

  begin
    insert into public.abgabe (nutzer_id, koralle_id) values (nutzer_b, k1);
    legt_an := 'angelegt → ABWEICHUNG';
  exception
    when insufficient_privilege then legt_an := 'RLS-Fehler → OK';
    when others then legt_an := sqlerrm || ' → PRÜFEN';
  end;
  protokoll := protokoll || format(E'Festlegung 12: B gibt Koralle von A ab:   %s\n', legt_an);

  raise exception E'TEST-ENDE – alles zurückgerollt.\n\n%', protokoll;
end $$;
