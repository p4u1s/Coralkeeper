-- TASK-03-04, Schritt 5 · Löschtests (NFR-4.7 und Löschfälle aus TASK-02-03)
-- Am Ende steht absichtlich ein Fehler: Er rollt ALLE Testdaten zurück.
-- Ergebnis steht in der Fehlermeldung.

do $$
declare
  nutzer_a  uuid := gen_random_uuid();  -- Züchter
  nutzer_b  uuid := gen_random_uuid();  -- Interessent / Empfänger
  bk1       uuid;
  bk2       uuid;
  k_mutter  uuid;
  k_ableger uuid;
  k_rest    uuid;
  bild_p    uuid;
  bild_h    uuid;
  ang       uuid;
begin
  -- Testnutzer, frei erfunden (NFR-3.4). Legt ein Trigger schon Profile an, greift "on conflict".
  insert into auth.users (id, email) values
    (nutzer_a, 'test-a@example.invalid'),
    (nutzer_b, 'test-b@example.invalid');
  insert into public.profil (id, anzeigename, kontakt_email) values
    (nutzer_a, 'Test A', 'test-a@example.invalid'),
    (nutzer_b, 'Test B', 'test-b@example.invalid')
  on conflict (id) do nothing;

  insert into public.becken (nutzer_id, name) values (nutzer_a, 'Testbecken 1') returning id into bk1;
  insert into public.becken (nutzer_id, name) values (nutzer_a, 'Testbecken 2') returning id into bk2;

  -- TEST 1 · Koralle ohne Becken → abgelehnt (NFR-4.7, FR-1.14)
  begin
    insert into public.koralle (nutzer_id, bezeichnung) values (nutzer_a, 'ohne Becken');
    raise exception 'TEST 1 FEHLGESCHLAGEN: Koralle ohne Becken wurde gespeichert';
  exception when not_null_violation then null;
  end;

  -- TEST 2 · Becken mit Koralle löschen → abgelehnt (FR-1.1)
  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
    values (nutzer_a, bk1, 'Mutter') returning id into k_mutter;
  begin
    delete from public.becken where id = bk1;
    raise exception 'TEST 2 FEHLGESCHLAGEN: Becken mit Koralle wurde gelöscht';
  exception when foreign_key_violation then null;
  end;

  -- TEST 3 · Ursprungskoralle löschen → Ableger bleibt, mutter_id = null (NFR-4.7, FR-1.10)
  insert into public.koralle (nutzer_id, becken_id, mutter_id, bezeichnung)
    values (nutzer_a, bk1, k_mutter, 'Ableger') returning id into k_ableger;
  delete from public.koralle where id = k_mutter;
  if not exists (select 1 from public.koralle where id = k_ableger and mutter_id is null) then
    raise exception 'TEST 3 FEHLGESCHLAGEN: Ableger fehlt oder mutter_id ist nicht null';
  end if;

  -- TEST 4 · Inserat löschen → Anfragen weg (NFR-4.7)
  insert into public.angebot (nutzer_id, koralle_id, modus)
    values (nutzer_a, k_ableger, 'verschenken') returning id into ang;
  insert into public.anfrage (interessent_id, angebot_id) values (nutzer_b, ang);
  delete from public.angebot where id = ang;
  if exists (select 1 from public.anfrage where angebot_id = ang) then
    raise exception 'TEST 4 FEHLGESCHLAGEN: Anfrage besteht nach dem Löschen des Inserats';
  end if;

  -- TEST 5 · Becken ohne Korallen löschen → Messwerte und Ereignisse weg
  insert into public.messwert (nutzer_id, becken_id, datum, parameter, wert)
    values (nutzer_a, bk2, current_date, 'kh', 8.1);
  insert into public.becken_ereignis (nutzer_id, becken_id, datum, typ)
    values (nutzer_a, bk2, current_date, 'wasserwechsel');
  delete from public.becken where id = bk2;
  if exists (select 1 from public.messwert where becken_id = bk2)
     or exists (select 1 from public.becken_ereignis where becken_id = bk2) then
    raise exception 'TEST 5 FEHLGESCHLAGEN: Diary-Einträge bestehen nach dem Löschen des Beckens';
  end if;

  -- TEST 6 · Bild löschen, das Primärbild ist → primaerbild = null
  insert into public.bild_dokument (nutzer_id, koralle_id, storage_pfad, typ)
    values (nutzer_a, k_ableger, 'test/primaer.jpg', 'bild') returning id into bild_p;
  update public.koralle set primaerbild = bild_p where id = k_ableger;
  delete from public.bild_dokument where id = bild_p;
  if not exists (select 1 from public.koralle where id = k_ableger and primaerbild is null) then
    raise exception 'TEST 6 FEHLGESCHLAGEN: primaerbild wurde nicht geleert';
  end if;

  -- TEST 7 · Bild mit Historienbezug löschen → abgelehnt (FR-3.3)
  insert into public.bild_dokument (nutzer_id, koralle_id, storage_pfad, typ)
    values (nutzer_a, k_ableger, 'test/historie.jpg', 'bild') returning id into bild_h;
  insert into public.historieneintrag (nutzer_id, koralle_id, datum, typ, text, bild_id)
    values (nutzer_a, k_ableger, current_date, 'journal', 'Testeintrag', bild_h);
  begin
    delete from public.bild_dokument where id = bild_h;
    raise exception 'TEST 7 FEHLGESCHLAGEN: Bild mit Historienbezug wurde gelöscht';
  exception when foreign_key_violation then null;
  end;

  -- TEST 8 · Koralle mit allem löschen: Historie mit Bild, Primärbild, Inserat mit Anfrage,
  --          Abgabe, Becken-Ereignis → alles Abhängige weg, Ereignis bleibt ohne Koralle
  insert into public.bild_dokument (nutzer_id, koralle_id, storage_pfad, typ)
    values (nutzer_a, k_ableger, 'test/primaer2.jpg', 'bild') returning id into bild_p;
  update public.koralle set primaerbild = bild_p where id = k_ableger;
  insert into public.angebot (nutzer_id, koralle_id, modus)
    values (nutzer_a, k_ableger, 'tauschen') returning id into ang;
  insert into public.anfrage (interessent_id, angebot_id) values (nutzer_b, ang);
  insert into public.abgabe (nutzer_id, koralle_id, empfaenger_nutzer_id)
    values (nutzer_a, k_ableger, nutzer_b);
  insert into public.becken_ereignis (nutzer_id, becken_id, datum, typ, koralle_id)
    values (nutzer_a, bk1, current_date, 'vorfall', k_ableger);
  begin
    delete from public.koralle where id = k_ableger;
  exception when foreign_key_violation then
    raise exception 'TEST 8 FEHLGESCHLAGEN: Löschen der Koralle abgelehnt – %', sqlerrm;
  end;
  if exists (select 1 from public.historieneintrag where koralle_id = k_ableger)
     or exists (select 1 from public.bild_dokument where koralle_id = k_ableger)
     or exists (select 1 from public.angebot where koralle_id = k_ableger)
     or exists (select 1 from public.anfrage where angebot_id = ang)
     or exists (select 1 from public.abgabe where koralle_id = k_ableger) then
    raise exception 'TEST 8 FEHLGESCHLAGEN: Abhängige Datensätze der Koralle bestehen noch';
  end if;
  if not exists (select 1 from public.becken_ereignis where becken_id = bk1 and koralle_id is null) then
    raise exception 'TEST 8 FEHLGESCHLAGEN: Becken-Ereignis fehlt oder verweist noch auf die Koralle';
  end if;

  -- TEST 9 · Konto A löschen (Becken mit Koralle, Diary, Inserat mit Anfrage von B)
  --          → alles von A weg, Profil B bleibt. Prüft auch RESTRICT auf koralle.becken_id.
  insert into public.koralle (nutzer_id, becken_id, bezeichnung)
    values (nutzer_a, bk1, 'Restkoralle') returning id into k_rest;
  insert into public.messwert (nutzer_id, becken_id, datum, parameter, wert)
    values (nutzer_a, bk1, current_date, 'ca', 420);
  insert into public.angebot (nutzer_id, koralle_id, modus)
    values (nutzer_a, k_rest, 'verkaufen') returning id into ang;
  insert into public.anfrage (interessent_id, angebot_id) values (nutzer_b, ang);
  begin
    delete from auth.users where id = nutzer_a;
  exception when foreign_key_violation then
    raise exception 'TEST 9 FEHLGESCHLAGEN: Konto-Löschung abgelehnt – %', sqlerrm;
  end;
  if exists (select 1 from public.profil where id = nutzer_a)
     or exists (select 1 from public.becken where nutzer_id = nutzer_a)
     or exists (select 1 from public.koralle where nutzer_id = nutzer_a)
     or exists (select 1 from public.messwert where nutzer_id = nutzer_a)
     or exists (select 1 from public.becken_ereignis where nutzer_id = nutzer_a)
     or exists (select 1 from public.anfrage where angebot_id = ang) then
    raise exception 'TEST 9 FEHLGESCHLAGEN: Daten von Nutzer A bestehen nach der Konto-Löschung';
  end if;
  if not exists (select 1 from public.profil where id = nutzer_b) then
    raise exception 'TEST 9 FEHLGESCHLAGEN: Profil von Nutzer B wurde mitgelöscht';
  end if;

  raise exception 'ALLE 9 TESTS BESTANDEN – alle Testdaten wurden zurückgerollt';
end $$;
