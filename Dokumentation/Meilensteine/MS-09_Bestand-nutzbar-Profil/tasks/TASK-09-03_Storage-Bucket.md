# TASK-09-03 · Storage-Bucket und Storage-Policies

**Status:** erledigt
**Bezug:** NFR-2.5, NFR-3.1, FR-6.2 · TASK-02-05 Abschnitt D · TASK-02-06 (Storage für MS-9 vorgesehen) ·
Festlegung „Bildablage" aus TASK-09-01
**Voraussetzung:** TASK-09-01 (Bucket-Layout entschieden)

---

## Worum geht es

Der Bucket wird so angelegt, wie TASK-09-01 es festlegt, mit Größen- und Typbegrenzung. Die Storage-Policies lassen
jeden Nutzer nur in seinem eigenen Ordner lesen, hochladen und löschen. Danach kann die App Bilder ablegen (TASK-09-08).

## Vor dem Start klären

- [x] **Bucket-Name.** Vorschlag: `medien` – neutral, weil später auch Belege hineinkommen können (FR-3.8).
      → **Entschieden am 02.10.2026:** `medien`.
- [x] **Anlage per SQL oder im Dashboard?** Vorschlag: per SQL (`insert into storage.buckets …`), damit der Bucket
      wie alles andere in der Migrationsdatei steht.
      → **Entschieden am 02.10.2026:** per SQL.
- [x] **Welche Operationen bekommen eine Policy?** Vorschlag: SELECT (signierte URL erzeugen), INSERT (hochladen),
      DELETE (Bild ersetzen, Koralle löschen). **Kein UPDATE** – ein neues Bild ist eine neue Datei mit neuer ID.
      → **Entschieden am 02.10.2026:** SELECT, INSERT, DELETE, kein UPDATE (volles CRUD verworfen: kein
      Anwendungsfall, `bild_dokument` hat ebenfalls kein UPDATE). Laut storage-js braucht `upload()` ohne Upsert nur
      INSERT, `createSignedUrl()` SELECT, `remove()` DELETE **und** SELECT. TASK-09-08 lädt darum mit `upsert: false`.
- [x] **Nachweis der Policies.**
  - **(a)** SQL-Testblock auf `storage.objects` als A und B – vorher prüfen, ob Supabase direkte Zeilen in
    `storage.objects` im Testblock zulässt
  - **(b)** in der App nach TASK-09-08: A lädt hoch, B ruft den Pfad von A ab und bekommt nichts
  → Vorschlag: (a), wenn es geht; sonst (b) – dann als Zeile im Abnahmeprotokoll von TASK-09-14.
  → **Entschieden am 02.10.2026:** (a). Jeder Schritt wird einzeln abgefangen; scheitert ein Teil an Supabase selbst
    (Delete-Sperre auf `storage.objects`, Insert ohne Datei), wird dieser Teil nach (b) geprüft.
- [x] **Größengrenze und Policy-Namen** (nachträglich geklärt) → **Entschieden am 02.10.2026:** 5 MB =
      5 242 880 Byte (5 × 1024 × 1024), dieselbe Grenze in der Formularprüfung (TASK-09-08); Policies
      `medien_select_eigene`, `medien_insert_eigene`, `medien_delete_eigene`.

## Schritte

1. [x] **Bucket anlegen:** privat (`public = false`), `file_size_limit` 5 MB, `allowed_mime_types` nach TASK-09-01.
2. [x] **Storage-Policies** auf `storage.objects` für `authenticated`, je Operation nach Entscheidung, mit der
       Bedingung `bucket_id = '<name>' and (storage.foldername(name))[1] = auth.uid()::text`. Namen nach Konvention,
       z. B. `medien_select_eigene`.
3. [x] **SQL im SQL-Editor ausführen** (Nutzer), Kontrollabfrage auf `storage.buckets` (Name, privat, Limit, Typen)
       und auf die Policies im Schema `storage`.
       → 02.10.2026: `medien` privat, 5 242 880 Byte, JPEG/PNG/WebP; drei Policies für `authenticated` wie erwartet.
4. [x] **Nachweis** nach Entscheidung; bei (a) als `TASK-09-03_Schritt 4_Storage-Test.sql` ablegen.
       → 02.10.2026: 9/9 OK. Insert ohne Datei und Delete (mit `storage.allow_delete_query`) gehen im Testblock –
       Weg (b) nicht nötig.
5. [x] **Security Advisor** im Dashboard prüfen. → 02.10.2026: keine neue Warnung, kein Fehler.
6. [x] **Dokumentation nachziehen** (nach Freigabe): Migrationsdatei, neuer Abschnitt „Storage" am Ende;
       ER-Modell, Festlegung „Bildablage" um Bucket-Name und Policies ergänzen, offenen Punkt 1 schließen.

## Fertig, wenn

- [x] Der Bucket ist privat, begrenzt auf 5 MB und die festgelegten Dateitypen
- [x] A kann im eigenen Ordner hochladen, lesen und löschen; im Ordner von B nichts davon (Nachweis nach Entscheidung)
- [x] Security Advisor ohne neue Warnung
- [x] Migrationsdatei und ER-Modell sind nachgezogen

## Hinweise

- Die Bucket-Grenze ist die zweite Sicherung. Die Meldung für den Nutzer kommt aus der Formularprüfung (NFR-2.5,
  TASK-09-08), nicht aus einem Storage-Fehler.
- Dateien bleiben liegen, wenn nur der Datensatz in `bild_dokument` verschwindet – auch bei der Kaskade beim Löschen
  einer Koralle. Darum kümmert sich der Service (TASK-09-04, TASK-09-08).

## Quellen

- `Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-05_Konventionen-Snapshot-Bilder.md` –
  Abschnitt D (Policy-Bedingung, Pfadschema)
- `Dokumentation/Meilensteine/MS-02_Datenmodell-Schema-Entwurf/tasks/TASK-02-06_Migrationsreihenfolge-Abnahme.md` –
  Storage als letzter Abschnitt
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – offener Punkt 1, Festlegung aus TASK-09-01
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-2.5, NFR-3.1
