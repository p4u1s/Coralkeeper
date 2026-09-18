# Coralkeeper – Anforderungsanalyse

**Version 2.2** · Stand: 03.09.2026 · Vorfassungen: 2.1, 2.0 (03.09.2026), 1.0 (02.09.2026)

> **Vermerk – gekürzte Arbeitsfassung.** Dieses Dokument ist die verschlankte Fassung für die weitere Arbeit. Die **Vollfassung liegt unverändert in `Claude-Reefkeeper-Requirements-v2.2.md`** – alle unten aufgeführten Teile sind dort nachzulesen und können jederzeit zurückgeholt werden. Es wurde nur gekürzt, nichts inhaltlich geändert: Die verbliebenen Abschnitte sind wortgleich mit der Vollfassung.


**Hier entfernt – dort nachzulesen:**

| Entfernter Teil                                   | Inhalt                                                                                                                                                                                         | Fundstelle in der Vollfassung |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Kopfblock „Neu in dieser Fassung"                 | Fünf Änderungspunkte 2.1 → 2.2 sowie der Hinweis zur Nummerierung (ausgelagerte IDs bleiben frei: FR-1.8, FR-1.13, FR-2.5, FR-5.8, FR-5.9, FR-6.9, kein Nachrücken)                            | vor Abschnitt 1               |
| **1.2 Was dieses Projekt ausdrücklich nicht ist** | Vier Abgrenzungen: keine Korallen-Bibliothek/kein Lexikon, kein vollwertiger Marktplatz, keine rechtsverbindliche CITES-Dokumentation, keine Offline-Fähigkeit/native App/Mehrsprachigkeit     | Abschnitt 1.2                 |
| **7. Bildschirme (Mockup und Routing)**           | Routenliste mit 13 Routen, MVP-Markierung und Zuordnung zu den FRs; dazu die Aufgabe „10–20 Korallenfotos zusammenstellen"                                                                     | Abschnitt 7                   |
| **8. Umsetzungsreihenfolge**                      | Stufe 0 mit den sieben MVP-Schritten, fünf Ausbaustufen und das Abbruchkriterium für M4                                                                                                        | Abschnitt 8                   |
| **10. Getroffene Entscheidungen**                 | Sieben Entscheidungen: Produktname, E-Mail-Bestätigung deaktiviert, Profilanlage per DB-Trigger, freie Textfelder für Art/Handelsname, M4-Umfang, keine Bildkomprimierung, kein TanStack Query | Abschnitt 10                  |
| **11. Änderungsprotokoll**                        | Vollständige Versionshistorie 2.2 / 2.1 / 2.0 / 1.0                                                                                                                                            | Abschnitt 11                  |

**Was das für dieses Dokument bedeutet:**

- **Keine Anforderung wurde gestrichen.** M1–M6 (FR) und alle NFR sind vollständig; Could-Anforderungen stehen weiterhin in `Claude-Reefkeeper-Could-Backlog.md`.
- Die **Abnahmekriterien MVP** sind hier Abschnitt **7**, in der Vollfassung Abschnitt **9** – inhaltlich identisch.
- Die Querverweise in 1.1 auf „Abschnitt 8, Stufe 0" (Umsetzungsreihenfolge) und „Abschnitt 9" (Abnahme) zielen auf die **Vollfassung**; hier entspricht Abschnitt 9 dem Abschnitt 7.

---

## 1. Projektrahmen

| Punkt                | Festlegung                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Produktname          | **Coralkeeper** (entschieden). Das Modul heißt schlicht **Diary**, nicht „Reefkeeper Diary".                                                                                                                                                                       |
| Zweck                | Abschlussprojekt der Weiterbildung zum Frontend-Developer                                                                                                                                                                                                          |
| Kein Produktivsystem | Keine Rechtsverbindlichkeit, kein Zahlungsverkehr, keine Moderation, kein Support, keine Datenmigration                                                                                                                                                            |
| Leitprinzip          | KISS – im Zweifel die einfachere Lösung, lieber ein Feature weniger als ein halbes Feature mehr                                                                                                                                                                    |
| **MVP-Umfang**       | **Nutzer anlegen · Becken anlegen · Koralle anlegen · Steckbrief anlegen · Historieneintrag anlegen · Ableger zur Abgabe freischalten · Diary-Eintrag anlegen und editieren.** Diese sieben Punkte müssen vollständig funktionieren; alles Weitere ist nachrangig. |
| Stack                | TypeScript, React (Vite), shadcn/ui + Tailwind, Supabase (Auth, Postgres, Storage, RLS)                                                                                                                                                                            |
| Zielplattform        | Mobile-First-Webapp im Browser, Dark Theme als Standard                                                                                                                                                                                                            |
| Sprache              | Deutsch (UI und Daten)                                                                                                                                                                                                                                             |
| Nutzerkreis          | Ein Nutzertyp (Züchter). Keine Admin- oder Redaktionsrolle.                                                                                                                                                                                                        |

### 1.1 MVP-Umfang (Pflichtumfang)

Die sieben Punkte sind die Mindestfunktion des Projekts. Sie bestimmen die Umsetzungsreihenfolge (Abschnitt 8, Stufe 0) und die Abnahme (Abschnitt 9). Anforderungen, die dazugehören, sind im Anforderungsteil mit **★** markiert.

| #   | MVP-Funktion                                                                                                                                                       | Anforderungen                   | Datenwirkung                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------- |
| 1   | **Nutzer anlegen** – Registrierung mit E-Mail und Passwort; zum Auth-Konto entsteht automatisch ein Profildatensatz. Anmeldung und geschützte Routen gehören dazu. | FR-6.1, FR-6.3, FR-6.10         | `profil`                           |
| 2   | **Becken anlegen** – mindestens ein Becken ist Voraussetzung für alles Weitere.                                                                                    | FR-1.1, FR-1.15                 | `becken`                           |
| 3   | **Koralle anlegen** – als eigenständige Koralle, mit Pflichtzuordnung zu einem Becken.                                                                             | FR-1.2, FR-1.14                 | `koralle`                          |
| 4   | **Steckbrief anlegen** – Haltungsdaten zur Koralle erfassen und ändern.                                                                                            | FR-2.1, FR-2.2                  | `koralle`                       |
| 5   | **Historieneintrag anlegen** – Journaleintrag zur Koralle; Systemeinträge entstehen zusätzlich automatisch.                                                        | FR-3.4, FR-3.5                  | `historieneintrag`                 |
| 6   | **Ableger anlegen und zur Abgabe freischalten** – Ableger aus einer bestehenden Koralle erzeugen und als Inserat veröffentlichen.                                  | FR-1.7, FR-4.1, FR-4.2          | `koralle` (`mutter_id`), `angebot` |
| 7   | **Diary-Eintrag anlegen und editieren** – Messwerte, Wasserwechsel und Ereignisse je Becken erfassen, korrigieren und löschen.                                     | FR-5.1, FR-5.3, FR-5.4, FR-5.10 | `messwert`, `becken_ereignis`      |

Daraus folgen drei harte Regeln:

- **Keine Koralle ohne Becken.** `koralle.becken_id` ist `NOT NULL`. Die UI bietet die Korallenanlage erst an, wenn mindestens ein Becken existiert.
- **Keine Daten ohne Profil.** Jeder fachliche Datensatz hängt über `nutzer_id` am angemeldeten Nutzer und wird per RLS abgesichert.
- **Diary editierbar, Historie nicht.** Diary-Einträge sind Messdaten und dürfen korrigiert werden (FR-5.10). Historieneinträge sind Nachweis und bleiben append-only (FR-3.3). Dieser Unterschied ist beabsichtigt.

---

## 2. Kernidee in einem Satz

Coralkeeper ist eine private, mobile Verwaltung für den eigenen Korallenbestand: **Bestand sehen, Haltungsdaten nachschlagen, Herkunft lückenlos nachweisen, Beckenwerte protokollieren** – ergänzt um eine schlanke Vermittlung von Ablegern.

Die fünf Probleme aus der Ideenphase werden wie folgt zugeordnet:

| Problem (Ideenphase)                               | Modul                         |
| -------------------------------------------------- | ----------------------------- |
| 1 – Überblick über Arten und Farbmorphen verlieren | M1 Bestand & Becken           |
| 2 – Haltungsanforderungen nicht präsent            | M2 Steckbrief & Haltungsdaten |
| 3 – Herkunfts- und Abgabenachweis                  | M3 Herkunft & Historie        |
| 4 – Ableger anbieten und tauschen                  | M4 Abgabe & Vermittlung       |
| 5 – Wasserwerte und Ereignisse festhalten          | M5 Diary                      |

---

## 3. Grundsatzentscheidungen (tragen das Datenmodell)

1. **Profil ist die Wurzel aller Daten.** Zu jedem Auth-Konto existiert genau ein `profil`. Becken, Korallen und alle abhängigen Daten hängen daran.
2. **Becken ist eine eigene Entität.** Jede Koralle gehört zu genau einem Becken (`NOT NULL`). Ein Nutzer kann mehrere Becken haben.
3. **Es gibt nur den Typ „Koralle".** Kein Muttertier-Typ, kein Ableger-Typ, kein Typfeld. Eine Koralle kann optional auf ihre **Ursprungskoralle** verweisen (`mutter_id`); dieser Verweis entsteht beim Anlegen eines Ablegers. Beim Anlegen einer Koralle wird nicht gefragt, ob sie Muttertier ist – sie ist einfach eine Koralle.
4. **Ableger erben per Snapshot.** Art, Morphe, Steckbrief und Herkunftsnachweis werden bei der Ablegererzeugung **kopiert**, nicht referenziert. Dadurch bleibt die Herkunft erhalten, auch wenn die Ursprungskoralle gelöscht oder abgegeben wird. Das ist der einzige Fall, in dem Steckbriefwerte automatisch entstehen.
5. **Status statt eigener Ansichten.** Jede Koralle hat genau einen Status: `im Bestand` · `zur Abgabe` · `abgegeben` · `verendet`. Jede weitere Übersicht ist nur ein Filter auf diesem Feld.
6. **Historie ist append-only, Diary nicht.** Historieneinträge sind nach dem Speichern weder bearbeitbar noch löschbar – sie sind der Herkunftsnachweis. Diary-Einträge sind Messdaten und bleiben korrigierbar.
7. **Kein Artenkatalog und keine Vorlagen.** Weder Stammdatenbank noch mitgelieferter Startdatensatz. Die App liefert Struktur und Symbolik, den Inhalt liefert der Nutzer.
8. **Ein Inserat ist ein eigener, kurzlebiger Datensatz.** Es entsteht beim Freischalten, wird bei der Auswahl eines Interessenten unsichtbar geschaltet und nach erfolgter Abgabe gelöscht. Der dauerhafte Nachweis der Weitergabe steht in der Historie, nicht im Inserat.

---

## 4. Kernentitäten (Grundlage für das Datenmodell)

Die <u>**fett und unterstrichen**</u> gesetzten Entitäten tragen den MVP-Umfang aus 1.1 und müssen im Datenmodell zuerst stehen.

| Entität                       | Zweck                                                                            | Wichtigste Felder                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <u>**`profil`**</u>           | Nutzerstammdaten zum Supabase-Auth-Konto (1:1, gleiche ID)                       | id (= auth.uid), anzeigename, kontakt_email, kontakt_telefon (optional), erstellt_am                                                                                  |
| <u>**`becken`**</u>           | Aquarium bzw. Zuchtsystem                                                        | nutzer_id, name, volumen_liter, beschreibung, startdatum                                                                                                              |
| <u>**`koralle`**</u>          | Koralle – eigenständig (`mutter_id IS NULL`) oder Ableger einer Ursprungskoralle | nutzer_id, becken_id (NOT NULL), mutter_id (nullable), bezeichnung, art, handelsname, status, erwerbsdatum, primaerbild – dazu die eingebetteten Feldgruppen **Steckbrief** und **Herkunft**, siehe 4.1 |
| <u>**`historieneintrag`**</u> | Unveränderliche Chronik je Koralle                                               | nutzer_id, koralle_id, datum, typ (system / journal / abgabe), text, bild_id                                                                                          |
| <u>**`angebot`**</u>          | Inserat zu einer Koralle (M4)                                                    | nutzer_id, koralle_id, modus, preis_oder_tauschwunsch, groesse, sichtbar (bool), erstellt_am                                                                          |
| <u>**`messwert`**</u>         | Wasserwert-Messung je Becken                                                     | nutzer_id, becken_id, datum, parameter, wert, einheit                                                                                                                 |
| <u>**`becken_ereignis`**</u>  | Wasserwechsel, Fütterung, Vorfall                                                | nutzer_id, becken_id, datum, typ, menge (Freitext), text, koralle_id (optional)                                                                    |
| `bild_dokument`               | Foto oder Beleg zu einer Koralle (PDF oder Bild)                                 | nutzer_id, koralle_id, storage_pfad, typ (`bild` / `pdf`), bezeichnung, aufnahmedatum                                                                                 |
| `abgabe`                      | Weitergabe an Dritte                                                             | nutzer_id, koralle_id, empfaenger_name, empfaenger_kontakt, empfaenger_nutzer_id (optional), datum, stueckzahl, preis, notiz                                          |
| `anfrage`                     | Interessensanfrage zu einem Inserat (M4)                                         | nutzer_id (= interessent_id), angebot_id, status (`offen` / `ausgewaehlt` / `abgelehnt` / `zurueckgezogen`), erstellt_am                                              |

### 4.1 Eingebettete Feldgruppen in `koralle`

Steckbrief (M2) und Herkunft (M3) sind **keine eigenen Tabellen**, sondern Spaltengruppen in `koralle`. Beide wären 1:1 zur Koralle; eine eigene Tabelle brächte je einen Join, ein zweites Formular-Speichern und eine zweite RLS-Policy, ohne fachlichen Gewinn. `erwerbsdatum` steht ohnehin schon an der Koralle. Alle Felder sind optional und blockieren die Anlage nach FR-1.2 nicht.

| Feldgruppe     | Felder                                                                                                                                                                                                                                                            | Bezug          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **Steckbrief** | licht, stroemung, nesselkraft, schwierigkeit (je `gering` / `mittel` / `hoch`), platzierung (`unten` / `mitte` / `oben`), wuchsform, fuetterung (Freitext), schutzstatus (`unbekannt` / `kein` / `CITES II` / `CITES I`)                                          | FR-2.1, FR-2.2, FR-2.4 |
| **Herkunft**   | quelle_typ (`Händler` / `Privat` / `Eigene Nachzucht`), quelle_name, belegnummer, cites_nr, herkunft_notiz, herkunftskette (Snapshot-Text)                                                                                                                        | FR-3.1, FR-3.6 |

Der Ableger-Snapshot nach FR-1.7 und FR-3.6 wird dadurch zum einfachen Kopieren dieser Spalten beim Anlegen des Ablegers – ohne zusätzliche Datensätze.

### 4.2 `nutzer_id` auf jeder Tabelle

Jede fachliche Tabelle führt eine eigene Spalte `nutzer_id` mit Verweis auf `profil.id` (`NOT NULL`), auch wenn der Eigentümer über die Elternbeziehung ableitbar wäre. Damit bleibt jede RLS-Policy einzeilig (`nutzer_id = auth.uid()`) statt verschachtelte Unterabfragen über zwei bis drei Tabellen zu benötigen – das setzt die Regel „Keine Daten ohne Profil" aus 1.1 um und folgt dem KISS-Leitprinzip. Bei `anfrage` erfüllt `interessent_id` diese Rolle; eine zusätzliche Spalte entfällt. `profil` selbst braucht keine, dort ist `id` bereits die Nutzerkennung.

Beziehungen des MVP: `profil 1—n becken`, `becken 1—n koralle`, `koralle 0..1—n koralle` (Ursprungskoralle zu Ablegern), `koralle 1—n historieneintrag`, `koralle 0..1 angebot`, `angebot 1—n anfrage`, `becken 1—n messwert`, `becken 1—n becken_ereignis`.

Es gibt bewusst **keine** Entität für Arten, Morphen oder Vorlagen. Art und Handelsname sind Textfelder an der Koralle. Ebenso gibt es keine eigene Entität `steckbrief` und keine eigene Entität `herkunft` – beide sind nach 4.1 in `koralle` eingebettet.

---

## 5. Funktionale Anforderungen

Priorisierung: **M** = Must · **S** = Should (wenn Zeit bleibt). Could-Anforderungen stehen nicht mehr in diesem Dokument, sondern in `Claude-Reefkeeper-Could-Backlog.md`.
Anforderungen des MVP-Umfangs sind mit **★** markiert.

### M1 – Bestand & Becken

| ID        | Anforderung                                                                                                                                                                                                                                                                                                                                                                                | Prio |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| FR-1.1 ★  | Nutzer kann Becken anlegen, bearbeiten und löschen (Name, Volumen, Beschreibung, Startdatum). Ein Becken mit Korallen kann erst gelöscht werden, wenn diese umgesetzt oder gelöscht wurden.                                                                                                                                                                                                | M    |
| FR-1.2 ★  | Nutzer kann eine Koralle anlegen: Bezeichnung und Becken sind Pflicht; Art, Handelsname/Morphe, Erwerbsdatum und ein Bild sind optional. Art und Handelsname sind freie Textfelder.                                                                                                                                                                                                        | M    |
| FR-1.3    | Bestandsliste als Kachelansicht mit Primärbild, Bezeichnung und Becken-Kennzeichnung.                                                                                                                                                                                                                                                                                                      | M    |
| FR-1.4    | Filtern nach Becken, Art und Status; Sortieren nach Bezeichnung und Erwerbsdatum.                                                                                                                                                                                                                                                                                                          | M    |
| FR-1.5    | Suche über Bezeichnung, Handelsname und Notiz.                                                                                                                                                                                                                                                                                                                                             | M    |
| FR-1.6    | Detailansicht einer Koralle mit Bild, Stammdaten und Tab-Navigation: Steckbrief · Historie.                                                                                                                                                                                                                                                                                                | M    |
| FR-1.7 ★  | Nutzer kann aus einer bestehenden Koralle einen **Ableger** erzeugen: neuer Datensatz mit `mutter_id`; Art, Morphe, Steckbrief und Herkunftskette werden aus der Ursprungskoralle kopiert. Das Becken ist vorbelegt und änderbar. Die Aktion liegt in der Detailansicht der Ursprungskoralle; die **Darstellung** der Abstammung ist nicht Teil des Umfangs (siehe Could-Backlog, FR-1.8). | M    |
| FR-1.9    | Statuswechsel (`im Bestand` / `zur Abgabe` / `abgegeben` / `verendet`) mit Datum und optionaler Notiz; erzeugt automatisch einen Historieneintrag.                                                                                                                                                                                                                                         | M    |
| FR-1.10   | Koralle bearbeiten und löschen mit Bestätigungsdialog. Ableger bleiben erhalten (Snapshot), der Verweis auf die Ursprungskoralle wird geleert.                                                                                                                                                                                                                                             | M    |
| FR-1.11   | Umsetzen einer Koralle in ein anderes Becken wird als Historieneintrag protokolliert.                                                                                                                                                                                                                                                                                                      | S    |
| FR-1.12   | Mehrere Bilder pro Koralle mit Aufnahmedatum als chronologische Wachstumsgalerie.                                                                                                                                                                                                                                                                                                          | S    |
| FR-1.14 ★ | Jede Koralle ist genau einem Becken zugeordnet. Die Zuordnung ist Pflichtfeld im Formular und `NOT NULL` in der Datenbank; eine Koralle ohne Becken kann nicht entstehen.                                                                                                                                                                                                                  | M    |
| FR-1.15 ★ | Geführter Erstlauf: Solange kein Becken existiert, zeigt der leere Bestand den Hinweis „Lege zuerst ein Becken an" mit direkter Aktion. Die Korallenanlage ist bis dahin nicht erreichbar.                                                                                                                                                                                                 | M    |

> Ausgelagert in den Could-Backlog: **FR-1.8** (Darstellung der Abstammung in Liste und Detail), **FR-1.13** (druckbare ID/QR-Code). Die Nummern bleiben frei.

### M2 – Steckbrief & Haltungsdaten

> Bewusst **keine** Bibliothek und **keine** Vorlagen: Die Haltungsdaten hängen am eigenen Exemplar und werden vom Nutzer erfasst. Die App liefert die Feldstruktur und die Symbolik, sonst nichts. Wiederverwendung entsteht ausschließlich über den Ableger-Snapshot (FR-1.7).

| ID       | Anforderung                                                                                                                                                                                                                                                                                                         | Prio |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| FR-2.1 ★ | Jede Koralle besitzt einen Steckbrief, den der Nutzer selbst anlegt und jederzeit ändern kann. Es gibt keine zentrale Artendatenbank und keinen mitgelieferten Startdatensatz.                                                                                                                                      | M    |
| FR-2.2 ★ | Steckbrieffelder mit festen Auswahllisten: Lichtbedarf, Strömung, Platzierung, Nesselkraft, Wuchsform, Schwierigkeitsgrad (je `gering` / `mittel` / `hoch` bzw. `unten` / `mitte` / `oben`), dazu Freitext für Fütterung und Besonderheiten. Alle Felder sind optional und blockieren die Anlage nach FR-1.2 nicht. | M    |
| FR-2.3   | Darstellung der Steckbriefwerte als Icons **mit** Textlabel; Legende auf der Detailseite. Kein Icon ohne Text. Nicht gefüllte Felder werden als „keine Angabe" dargestellt und nicht leer gelassen.                                                                                                                 | M    |
| FR-2.4   | Feld Schutzstatus je Koralle (`unbekannt` / `kein` / `CITES II` / `CITES I`) mit sichtbarem Hinweis, dass dies eine Eigenangabe und keine Rechtsauskunft ist.                                                                                                                                                       | M    |

> Ausgelagert in den Could-Backlog: **FR-2.5** (Placement-Suggestor).

### M3 – Herkunft & Historie

| ID       | Anforderung                                                                                                                                                                                                                                                                              | Prio |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| FR-3.1   | Herkunftsdaten je Koralle: Erwerbsdatum, Quelle (`Händler` / `Privat` / `Eigene Nachzucht`), Name der Quelle, Belegnummer, CITES-Nr., Notiz.                                                                                                                                             | M    |
| FR-3.2   | Historienansicht je Koralle, chronologisch absteigend, mit Eintragstyp und Datum.                                                                                                                                                                                                        | M    |
| FR-3.3   | **Historieneinträge sind nach dem Speichern nicht bearbeitbar und nicht löschbar.** Korrekturen erfolgen ausschließlich als neuer Eintrag.                                                                                                                                               | M    |
| FR-3.4 ★ | Systemeinträge werden automatisch erzeugt bei: Anlage, Statuswechsel, Beckenwechsel, Ablegererzeugung, Abgabe.                                                                                                                                                                           | M    |
| FR-3.5 ★ | Manueller Journaleintrag (Datum, Freitext, optional Bild) für Farbentwicklung, Wachstumsanomalien und eigene Erfahrungen.                                                                                                                                                                | M    |
| FR-3.6   | Bei Ablegererzeugung wird die Herkunftskette der Ursprungskoralle als unveränderlicher Snapshot in den Ableger kopiert.                                                                                                                                                                  | M    |
| FR-3.7   | Abgabevorgang erfassen: Empfänger (Name, Kontakt), Datum, Stückzahl, Preis (optional), Notiz. Erzeugt einen Historieneintrag „abgegeben an …" und setzt den Status auf `abgegeben`. Erfolgt die Abgabe über ein Inserat, wird zusätzlich der Interessenten-Nutzer referenziert (FR-4.7). | M    |
| FR-3.8   | Upload von Belegdokumenten (Bild oder PDF, max. 5 MB, max. 5 Dokumente je Koralle) mit Anzeige und Download.                                                                                                                                                                             | S    |
| FR-3.9   | Historie filterbar nach Eintragstyp.                                                                                                                                                                                                                                                     | S    |

> Hinweis zur Abgabeart: Ob verschenkt, getauscht oder verkauft wird, ist eine Eigenschaft des **Inserats** (FR-4.1), nicht des Abgabedatensatzes. Der Abgabedatensatz dokumentiert nur die Weitergabe selbst.

### M4 – Abgabe & Vermittlung

Der Ablauf ist bewusst schlank: Coralkeeper führt zwei Nutzer zusammen und dokumentiert das Ergebnis. Alles zwischen Kontaktaufnahme und Übergabe passiert außerhalb der App.

**Ablauf**

1. Nutzer inseriert einen Ableger.
2. Ein oder mehrere Interessenten wählen das Inserat aus und stellen eine Interessensanfrage.
3. Der Züchter wählt eine Anfrage aus; das Inserat wird unsichtbar geschaltet.
4. Die Kontaktdaten beider Seiten werden gegenseitig freigegeben.
5. Kommt keine Abgabe zustande, wird das Inserat wieder sichtbar geschaltet.
6. Kommt die Abgabe zustande, wird die Koralle als `abgegeben` markiert und der Interessenten-Nutzer als „abgegeben an" in die Historie eingetragen.
7. Das Inserat wird gelöscht.

| ID       | Anforderung                                                                                                                                                                                                                                                                                      | Prio |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| FR-4.1 ★ | **Inserieren:** Nutzer kann einen Ableger als Inserat veröffentlichen – Modus (`verschenken` / `tauschen` / `verkaufen`), Preis bzw. Tauschwunsch, Größe, Bild. Die Koralle erhält den Status `zur Abgabe`, das Inserat ist `sichtbar`.                                                          | M    |
| FR-4.2 ★ | **Sichtbarkeit:** Nur sichtbare Inserate sind für andere Nutzer lesbar; der übrige Bestand bleibt privat. Technisch über RLS erzwungen, nicht nur über die UI. Inserat jederzeit zurückziehbar – die Koralle geht zurück auf `im Bestand`, das Inserat wird gelöscht.                            | M    |
| FR-4.3   | **Finden und anfragen:** Öffentliche Liste sichtbarer Inserate mit Filter nach Art und Modus. Ein Interessent kann je Inserat genau eine Interessensanfrage stellen (optional mit kurzer Nachricht). Eigene Inserate können nicht angefragt werden.                                              | S    |
| FR-4.4   | **Auswählen:** Der Züchter sieht alle offenen Anfragen zu seinem Inserat und wählt eine aus. Mit der Auswahl wird das Inserat unsichtbar geschaltet (nicht gelöscht); die übrigen Anfragen bleiben als `offen` erhalten.                                                                         | S    |
| FR-4.5   | **Kontaktaustausch:** Nach der Auswahl werden die hinterlegten Kontaktdaten (Anzeigename, E-Mail, optional Telefon) beider Seiten gegenseitig sichtbar – vorher niemals.                                                                                                                         | S    |
| FR-4.6   | **Rückabwicklung:** Kommt keine Abgabe zustande, kann der Züchter die Auswahl zurücknehmen. Die Anfrage wird `abgelehnt`, das Inserat wieder `sichtbar`, die Kontaktfreigabe endet. Ein Interessent kann seine Anfrage jederzeit selbst zurückziehen.                                            | S    |
| FR-4.7   | **Abschluss:** Bestätigt der Züchter die erfolgte Abgabe, wird in einem Schritt: die Koralle auf `abgegeben` gesetzt, ein Abgabedatensatz nach FR-3.7 mit Referenz auf den Interessenten-Nutzer erzeugt, ein Historieneintrag „abgegeben an <Anzeigename>" geschrieben und das Inserat gelöscht. | S    |

> Nicht im Projekt: Reservierung, Chat, Bewertungen, Zahlungsabwicklung, Meldefunktion, Moderation. Siehe Could-Backlog, Abschnitt „Ausdrücklich ausgeschlossen".

### M5 – Diary (Becken-Tagebuch)

| ID        | Anforderung                                                                                                                                                                                                            | Prio |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| FR-5.1 ★  | Messwerte je Becken erfassen mit Datum: KH, Ca, Mg, NO₃, PO₄, Temperatur, Salinität. Alle Werte optional, mindestens einer muss gefüllt sein. Einheiten sind fest vorgegeben.                                          | M    |
| FR-5.2    | Verlaufsdiagramm je Parameter mit wählbarem Zeitraum (30 Tage / 90 Tage / gesamt).                                                                                                                                     | M    |
| FR-5.3 ★  | Wasserwechsel protokollieren (Datum, Menge als Freitext, Notiz).                                                                                                                                                          | M    |
| FR-5.4 ★  | Ereignisse protokollieren (Datum, Typ wie Bleaching, Schädling, Vernesselung; Freitext, optional betroffene Koralle).                                                                                                  | M    |
| FR-5.5    | Fütterung und Düngung protokollieren (Datum, Mittel, Menge).                                                                                                                                                           | S    |
| FR-5.6    | Soll-Bereiche je Parameter mit sinnvollen Standardwerten; Abweichungen werden im Diagramm und in der Liste farblich markiert.                                                                                          | S    |
| FR-5.7    | Gemeinsamer Zeitstrahl je Becken über Messwerte, Wasserwechsel und Ereignisse.                                                                                                                                         | S    |
| FR-5.10 ★ | Diary-Einträge (Messwerte, Wasserwechsel, Ereignisse) können bearbeitet und gelöscht werden – mit Bestätigungsdialog beim Löschen. Bewusster Unterschied zur Historie nach FR-3.3: Messdaten dürfen korrigiert werden. | M    |

> Ausgelagert in den Could-Backlog: **FR-5.8** (frei definierbare Parameter), **FR-5.9** (ICP-Import).

### M6 – Konto, Profil & Querschnitt

| ID        | Anforderung                                                                                                                                                                                                                                    | Prio |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| FR-6.1 ★  | Registrierung und Anmeldung mit E-Mail und Passwort über Supabase Auth, Abmelden. Die E-Mail-Bestätigung ist deaktiviert; die Anmeldung ist unmittelbar nach der Registrierung möglich.                                                        | M    |
| FR-6.2    | Alle Daten sind strikt nutzerbezogen. Kein Zugriff auf fremde Daten, auch nicht lesend über bekannte IDs. Durchgesetzt über Row Level Security in Supabase. Ausnahmen: sichtbare Inserate (FR-4.2) und freigegebene Kontaktdaten (FR-4.5).     | M    |
| FR-6.3 ★  | Geschützte Routen: nicht angemeldete Nutzer werden zur Anmeldung geleitet, angemeldete Nutzer von der Anmeldeseite zum Bestand.                                                                                                                | M    |
| FR-6.4    | Lade-, Leer- und Fehlerzustände in allen Listen und Formularen, z. B. „Noch keine Korallen angelegt" mit direkter Anlage-Aktion.                                                                                                               | M    |
| FR-6.5    | Bestätigungsdialog vor jeder löschenden Aktion.                                                                                                                                                                                                | M    |
| FR-6.6    | Formularvalidierung mit Feldfehlern (Pflichtfelder, Datumslogik, Zahlenbereiche).                                                                                                                                                              | M    |
| FR-6.7    | Passwort-Reset per E-Mail.                                                                                                                                                                                                                     | S    |
| FR-6.8    | Profil ansehen und bearbeiten (Anzeigename, Kontaktdaten für M4).                                                                                                                                                                              | M    |
| FR-6.10 ★ | Mit der Registrierung wird automatisch ein Profildatensatz zum Auth-Konto erzeugt – per Datenbank-Trigger auf `auth.users`, nicht im Frontend –, vorbelegt mit der E-Mail als Anzeigename. Ein angemeldeter Nutzer hat immer genau ein Profil. | M    |

> Ausgelagert in den Could-Backlog: **FR-6.9** (Kontolöschung). Löschung erfolgt bei Bedarf direkt in Supabase.

---

## 6. Nicht-funktionale Anforderungen

Die Zielwerte sind auf ein Abschlussprojekt und den Supabase-Free-Tier ausgelegt, nicht auf Produktivbetrieb.

### Benutzbarkeit

| ID      | Anforderung                                                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| NFR-1.1 | Neuanlage einer Koralle inklusive Foto in höchstens 60 Sekunden, mit maximal fünf Pflichteingaben in einem Formular.                                                           |
| NFR-1.2 | Alle Kernfunktionen sind vom Startbildschirm in höchstens drei Interaktionen erreichbar (Bottom-Navigation: Bestand · Becken · Diary · Profil).                                |
| NFR-1.3 | Bedienbar mit feuchten Händen und bei Blaulicht: Trefferflächen ≥ 44 px, dunkles Farbschema als Standard, keine Hover-abhängige Funktion.                                      |
| NFR-1.4 | Icons nie ohne Textalternative; Kontraste nach WCAG 2.1 AA; alle Formularfelder mit sichtbarem Label.                                                                          |
| NFR-1.5 | UI-Sprache Deutsch, Datums- und Zahlenformat de-DE.                                                                                                                            |
| NFR-1.6 | Mobile-First; nutzbar ab 360 px Breite, brauchbare Darstellung bis Desktop.                                                                                                    |
| NFR-1.7 | Der MVP-Umfang aus 1.1 ist ohne Anleitung durchführbar: Von der Registrierung bis zum ersten Inserat führt jede Seite die nächste Aktion sichtbar mit.                         |
| NFR-1.8 | Da alle Steckbriefwerte vom Nutzer stammen, sind die Auswahllisten selbsterklärend beschriftet (Klartext statt Fachkürzel) und der Steckbrief bleibt auch unausgefüllt lesbar. |
| NFR-1.9 | Der Zustand eines Inserats ist für beide Seiten jederzeit erkennbar (sichtbar / Interessent ausgewählt / abgeschlossen), ohne dass jemand nachfragen muss.                     |

### Leistung und Mengengerüst

| ID      | Anforderung                                                                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| NFR-2.1 | Auslegung auf realistische Testmengen: bis 300 Korallen, 5 Becken, 1.000 Messwerte und 500 Bilder pro Konto.                                                             |
| NFR-2.2 | Bestandsliste mit 300 Einträgen: erste Darstellung unter 2 s bei üblicher Verbindung, Bilder werden verzögert nachgeladen (`loading="lazy"`).                            |
| NFR-2.3 | Detailansicht und Suchergebnis unter 1 s.                                                                                                                                |
| NFR-2.4 | Diagramm über 1.000 Messpunkte in unter 1 s.                                                                                                                             |
| NFR-2.5 | Bilder werden **unverändert** hochgeladen; keine clientseitige Komprimierung. Begrenzung auf 5 MB je Bild, im Formular validiert und mit klarer Fehlermeldung abgelehnt. |

### Sicherheit und Datenschutz

| ID      | Anforderung                                                                                                                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-3.1 | Mandantentrennung über Row Level Security auf jeder Tabelle; Storage-Buckets pro Nutzer abgesichert.                                                                                                  |
| NFR-3.2 | Kein Secret im Frontend außer dem öffentlichen Supabase-Anon-Key.                                                                                                                                     |
| NFR-3.3 | Kontaktdaten anderer Nutzer werden ausschließlich nach der Auswahl einer Anfrage sichtbar (FR-4.5) und nur den beiden beteiligten Nutzern. Die Freigabe endet mit der Rücknahme der Auswahl (FR-4.6). |
| NFR-3.4 | Testdaten sind frei erfunden; es werden keine echten personenbezogenen Daten Dritter erfasst.                                                                                                         |

### Technik und Wartbarkeit

| ID      | Anforderung                                                                                                                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-4.1 | TypeScript im Strict Mode, kein `any` im eigenen Code.                                                                                                                                                                |
| NFR-4.2 | UI-Komponenten aus shadcn/ui; keine zweite UI-Bibliothek.                                                                                                                                                             |
| NFR-4.3 | Datenzugriff ausschließlich über eine schmale Service-Schicht (`src/services/*`), keine Supabase-Aufrufe direkt in Komponenten. Serverstate über eigene Hooks auf dieser Schicht; keine zusätzliche State-Bibliothek. |
| NFR-4.4 | Datenbanktypen werden aus dem Supabase-Schema generiert und im Frontend verwendet.                                                                                                                                    |
| NFR-4.5 | Lauffähiges Deployment (GitHub Pages) mit Demo-Konto und Beispieldaten für die Abgabe, inklusive 10–20 Korallenfotos als Bildmaterial.                                                                   |
| NFR-4.6 | Unterstützte Browser: aktuelle Versionen von Chrome, Firefox und Safari (mobil und Desktop).                                                                                                                          |
| NFR-4.7 | Referenzielle Integrität in der Datenbank statt nur in der UI: `koralle.becken_id NOT NULL`, `mutter_id` mit `ON DELETE SET NULL`, `anfrage.angebot_id` mit `ON DELETE CASCADE`.                                      |

---

---

## 7. Abnahmekriterien MVP

Der MVP gilt als erfüllt, wenn ein frischer Nutzer ohne Vorwissen folgende Kette schafft und die Daten nach erneuter Anmeldung unverändert vorliegen:

1. Registrierung mit E-Mail und Passwort → Konto existiert, Profildatensatz ist automatisch angelegt, Anmeldung ohne E-Mail-Bestätigung möglich.
2. Anmeldung → Weiterleitung auf den Bestand; direkter Aufruf einer geschützten Route ohne Session führt zur Anmeldeseite.
3. Leerer Bestand zeigt den Hinweis, zuerst ein Becken anzulegen; Becken anlegen gelingt in einem Formular.
4. Koralle anlegen: Beckenauswahl ist Pflicht, Speichern ohne Becken wird mit Feldfehler abgelehnt.
5. Steckbrief zur Koralle ausfüllen und erneut ändern; unausgefüllte Felder zeigen „keine Angabe".
6. Journaleintrag zur Koralle anlegen; der Eintrag ist danach nicht mehr bearbeitbar, und die Anlage der Koralle steht als Systemeintrag in derselben Historie.
7. Ableger aus der Koralle erzeugen (erscheint im Bestand) und als Inserat freischalten; die Koralle steht auf `zur Abgabe`.
8. Diary: Messwert, Wasserwechsel und Ereignis anlegen, einen davon korrigieren und einen löschen.
9. Ein zweiter Testnutzer sieht ausschließlich das sichtbare Inserat – keine Becken, keine Korallen, keine Diary-Daten, auch nicht bei direktem Abruf über bekannte IDs.

---
v