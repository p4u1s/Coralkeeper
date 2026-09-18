# TASK-02-04 · RLS-Regeln einschließlich Historie und sichtbarer Angebote dokumentieren

**Status:** erledigt
**Bezug:** Entscheidung 4 aus MS-2 · FR-6.2 (kein Zugriff auf fremde Daten), NFR-3.1, NFR-3.2, FR-3.3 (Historie append-only), FR-4.2 (sichtbare Inserate), FR-4.5 / NFR-3.3 (Kontaktfreigabe), FR-5.10 (Diary korrigierbar)
**Voraussetzung:** keine (kommt mit dem heutigen Stand des ER-Modells aus) · **entsperrt:** TASK-03-05 und Frage 2 in TASK-03-06

---

## Worum geht es

Der öffentliche Supabase-Schlüssel steckt im Frontend und ist für jeden lesbar (NFR-3.2). Was ein Nutzer sehen und ändern darf,
entscheidet deshalb allein Row Level Security in der Datenbank. Die **RLS-Matrix** legt für jede Tabelle und jede der vier Operationen fest,
unter welcher Bedingung sie erlaubt ist.

Das Grundmuster (Entscheidung 4) steht in Anforderungen 4.2 und ER-Modell Abschnitt 2: Jede Tabelle führt eine eigene `nutzer_id`,
jede Policy bleibt einzeilig – `nutzer_id = auth.uid()`. Offen sind die Lücken, die Ausnahmen und die Frage, welche Policy wann entsteht.

## Vor dem Start klären

- [x] **0 · Entscheidung 4 bestätigen:** `nutzer_id` auf jeder Tabelle statt Prüfung über Joins. Die Begründung steht in Anforderungen 4.2
      (einzeilige Policies, KISS). → Als Festlegung in Abschnitt 3 des ER-Modells aufnehmen, falls sie dort noch fehlt.
      → **Entschieden:** bestätigt, Festlegung 11 im ER-Modell.
- [x] **1 · Umfang: jetzt oder später?** MS-3 verlangt „RLS-Policies auf allen Tabellen nach der RLS-Matrix".
  - (a) MS-3 legt alle Policies an, die das MVP braucht (bis MS-8). Alles andere entsteht im Meilenstein, der es braucht.
  - (b) MS-3 legt alles auf einmal an, auch für MS-9 bis MS-11.
  - Unabhängig davon: **RLS ist auf allen zehn Tabellen eingeschaltet.**
  - **Vorschlag:** (a). Die Matrix bekommt eine Angabe „ab MS-x" je Zelle, damit spätere Meilensteine wissen, was sie nachziehen müssen.
  - → **Entschieden:** (a).
- [x] **2 · Verweise auf fremde Datensätze beim Schreiben.** Das ist die Kehrseite von Entscheidung 4: Die Policies prüfen nur die eigene
      `nutzer_id`, und die Fremdschlüssel-Prüfung selbst geht an RLS vorbei. Wer eine fremde ID kennt, könnte also z. B. eine eigene Koralle
      in ein **fremdes** Becken legen. Folge: Der Besitzer kann sein Becken nicht mehr löschen (`RESTRICT`, FR-1.1) – und sieht nicht, warum.
  - (a) Hinnehmen: UUIDs sind nicht erratbar, es ist ein Demo-Projekt, die Policies bleiben einzeilig.
  - (b) Bei INSERT und UPDATE zusätzlich prüfen, dass der verwiesene Datensatz dem Nutzer gehört, z. B.:

    ```sql
    with check (
      nutzer_id = auth.uid()
      and exists (select 1 from public.becken b
                  where b.id = koralle.becken_id and b.nutzer_id = auth.uid())
    )
    ```

  - Betroffen wären: `koralle.becken_id`, `koralle.mutter_id`, `koralle.primaerbild`, `historieneintrag.koralle_id`,
    `historieneintrag.bild_id`, `bild_dokument.koralle_id`, `angebot.koralle_id`, `abgabe.koralle_id`, `messwert.becken_id`,
    `becken_ereignis.becken_id`, `becken_ereignis.koralle_id`.
  - → **Entschieden:** gezielt – nur beim INSERT auf `angebot` und `abgabe` prüfen, dass die Koralle dem Nutzer gehört (Festlegung 12). Übrige Verweise hingenommen.
- [x] **3 · Wie lesen Fremde die Korallenfelder eines Inserats? (FR-4.2, gebraucht in MS-7)** Laut ER-Modell Abschnitt 2 dürfen Fremde die
      Koralle „nur in den Feldern, die das Inserat zeigt" lesen. **RLS wirkt aber nur auf ganze Zeilen, nicht auf einzelne Spalten.**
      Mindestens `art` wird gebraucht, weil FR-4.3 nach Art filtert.
  - (a) SELECT-Policy auf `koralle`: „es gibt ein sichtbares Inserat dazu". Dann sehen Fremde die **ganze** Zeile – auch Herkunft,
    Belegnummer und CITES-Nr. Außerdem widerspricht das dem Wortlaut der DoD von MS-7 („keine Korallen").
  - (b) Die angezeigten Felder (z. B. `bezeichnung`, `art`, `handelsname`) beim Inserieren nach `angebot` kopieren. Fremde brauchen dann
    keinen Zugriff auf `koralle`. Das kostet zusätzliche Spalten in `angebot`, also eine Schemaänderung (→ TASK-02-02).
  - (c) Eine View, die nur die Inseratfelder enthält. Views haben eigene Rechte-Regeln – das ist mehr Technik als (a) oder (b).
  - Dazu gehört auch: **Welche Felder zeigt ein Inserat überhaupt?** Das legen die Anforderungen nicht fest (FR-4.1 nennt Modus,
    Preis bzw. Tauschwunsch, Größe, Bild).
  - → **Entschieden:** (b) mit `art` und `handelsname` (Festlegung 13).
- [x] **4 · Policy `profil_insert_eigenes` noch nötig?** (Frage 2 aus TASK-03-06) Profile legt allein der Trigger an. Er läuft mit
      `security definer` und braucht keine Policy. Das Frontend legt nie ein Profil an. **Vorschlag:** entfernen – was niemand braucht, kann auch niemand missbrauchen.
      → **Entschieden:** entfernen, zusammen mit dem Trigger in TASK-03-06 (Festlegung 14).

### Nur vormerken – wird im jeweiligen Meilenstein entschieden

- **Kontaktfreigabe (FR-4.5, NFR-3.3, MS-11):** `profil` wird für die Gegenseite lesbar, solange eine `anfrage` mit Status `ausgewaehlt`
  beide verbindet. Das geht zeilenweise, weil `profil` nur Name, Kontakt und `erstellt_am` enthält.
- **`anfrage` (MS-11, optional):** Der Züchter muss Anfragen zu seinem Inserat sehen (FR-4.4). Den Status ändern zwei Seiten: Der Züchter
  setzt `ausgewaehlt` bzw. `abgelehnt`, der Interessent `zurueckgezogen`. Eigene Inserate dürfen nicht angefragt werden (FR-4.3).
- **`abgabe` UPDATE/DELETE (MS-10):** Ist der Abgabedatensatz ein Nachweis wie die Historie (keine Änderung) oder korrigierbar?
- **Inseratbild für Fremde (ab MS-9):** hängt an Frage 3 und an TASK-02-05, Abschnitt D (privater oder öffentlicher Bucket).

## Arbeitsvorlage: Matrix-Entwurf

„eigene" = `nutzer_id = auth.uid()` · ✔ = in der SQL-Datei vorhanden · ➕ = fehlt, wird gebraucht · ✘ = bewusst keine · ? = zu entscheiden

| Tabelle            | SELECT                                                     | INSERT                                                           | UPDATE                                                  | DELETE                               |
| ------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------ |
| `profil`           | ✔ `id = auth.uid()` · später + Kontaktfreigabe (MS-11)     | ✔ `id = auth.uid()` · ? entbehrlich (Frage 4)                    | ➕ eigenes – FR-6.8, **MS-9**                           | ✘ – FR-6.9 ausgelagert               |
| `becken`           | ✔ eigene                                                   | ✔ eigene                                                         | ➕ eigene – FR-1.1, **MS-4**                            | ➕ eigene – FR-1.1, **MS-4**         |
| `koralle`          | ✔ eigene · ? Inseratfelder für Fremde (Frage 3, MS-7)      | ✔ eigene                                                         | ➕ eigene – FR-2.1 **MS-6**, FR-4.1 Status, FR-1.9/1.10 | ➕ eigene – FR-1.10, **MS-9**        |
| `historieneintrag` | ✔ eigene                                                   | ✔ eigene                                                         | ✘ **bewusst keine – FR-3.3**                            | ✘ **bewusst keine – FR-3.3**         |
| `angebot`          | ✔ eigene **ODER ✔ `sichtbar = true` – FR-4.2**             | ✔ eigene                                                         | ? eigene – `sichtbar` umschalten, FR-4.4/4.6, MS-11     | ✔ eigene – FR-4.2 zurückziehen, MS-7 |
| `anfrage`          | ✔ `interessent_id = auth.uid()` · später + Züchter (MS-11) | ✔ `interessent_id = auth.uid()` · später + nicht eigenes Inserat | ? MS-11                                                 | ? MS-11                              |
| `messwert`         | ✔ eigene                                                   | ✔ eigene                                                         | ✔ eigene – FR-5.10                                      | ✔ eigene – FR-5.10                   |
| `becken_ereignis`  | ✔ eigene                                                   | ✔ eigene                                                         | ✔ eigene – FR-5.10                                      | ✔ eigene – FR-5.10                   |
| `bild_dokument`    | ✔ eigene · ? Inseratbild für Fremde                        | ✔ eigene                                                         | ? keine Anforderung bekannt                             | ➕ eigene – ab MS-9                  |
| `abgabe`           | ✔ eigene                                                   | ✔ eigene                                                         | ? MS-10                                                 | ? MS-10                              |

## Schritte

1. [x] **Fragen 0 bis 4 entscheiden.**
2. [x] **Jede Zelle mit ➕ oder ? auflösen:** Bedingung in Klartext, dazu der Meilenstein, ab dem sie gebraucht wird – oder „✘ bewusst keine" mit Begründung.
3. [x] **Matrix ins ER-Modell übernehmen.** Vorschlag: Abschnitt 2 („Eigentümerschaft") um eine Tabelle „RLS-Matrix" ergänzen –
       Zeilen = Tabellen, Spalten = SELECT / INSERT / UPDATE / DELETE, Zelle = Bedingung und „ab MS-x".
4. [x] **Die beiden Sonderfälle aus MS-2 sichtbar kennzeichnen:** Historie ohne UPDATE/DELETE (FR-3.3), Angebot lesbar bei `sichtbar = true` (FR-4.2).
5. [x] **Erwartungswerte für das Testprotokoll in TASK-03-05 prüfen:** Lässt sich für jede Tabelle aus der Matrix ablesen, was bei
       „B liest / ändert / legt an / löscht Daten von A" und „anon liest" herauskommen muss?
6. [x] **In TASK-03-05 und TASK-03-06 die „Vor dem Start klären"-Punkte abhaken**, die hiermit entschieden sind.

## Fertig, wenn

- [x] Entscheidung 4 steht begründet im ER-Modell
- [x] Die Matrix im ER-Modell hat für alle zehn Tabellen und alle vier Operationen eine Zelle: Bedingung, „✘ bewusst keine" oder „ab MS-x"
- [x] Die Sonderfälle FR-3.3 und FR-4.2 sind sichtbar gekennzeichnet
- [x] Fragen 1 bis 4 sind entschieden und begründet; die vorgemerkten Punkte stehen mit Zielmeilenstein unter „Offene Punkte"
- [x] TASK-03-05 kann Policies und Testprotokoll ohne Rückfrage aus der Matrix ableiten

## Hinweise

- **Befund:** TASK-03-05 meldet RLS auf `koralle` und `historieneintrag` als ausgeschaltet. Das bezog sich auf die alte `database_migration.sql`.
  Die zusammengeführte SQL-Datei schaltet RLS auf allen zehn Tabellen ein. Den echten Datenbankstand prüft TASK-03-05 in Schritt 1.
- `update` ohne passende Policy wirft keinen Fehler, es ändert einfach 0 Zeilen. Für den Nachweis „Historie nicht bearbeitbar" (DoD MS-6)
  heißt das: auf die Zeilenzahl achten, nicht auf eine Fehlermeldung.
- Storage-Policies für Bilder gehören zu TASK-02-05, Abschnitt D.
- Nichts in der Datenbank oder in der SQL-Datei ändern – das ist TASK-03-05.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 2 (Eigentümerschaft, Ausnahmen), Festlegungen 7 und 8
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – Ist-Stand der Policies
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – 4.2, FR-3.3, FR-4.1 bis FR-4.6, FR-5.10, FR-6.2, NFR-3.1 bis NFR-3.3, Abschnitt 7 Punkt 9
- [`../MS-02_Datenmodell-Schema-Entwurf.md`](../MS-02_Datenmodell-Schema-Entwurf.md) – Ergebnis „RLS-Matrix", Entscheidung 4
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-05_RLS-Policies.md`, `TASK-03-06_Profil-Trigger.md` – Abnehmer dieses Tasks
