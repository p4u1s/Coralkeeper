# Coralkeeper – Meilensteinplan

**Stand: 08.09.2026** · Grundlage: `Coralkeeper-Requirements-v2.2.md`

> Dieses Dokument ergänzt die Anforderungsanalyse, es ersetzt sie nicht. Die Anforderungsanalyse bleibt unverändert bei **Version 2.2**. Der Plan überführt die dort bereits festgelegte Umsetzungsreihenfolge (Stufe 0 mit sieben Schritten, danach fünf Ausbaustufen) in abnehmbare Meilensteine mit Definition of Done.

---

## 1. Zwei Festlegungen vorab

### 1.1 Namensschema: `MS-1` … `MS-12`, das Präfix ist Pflicht

Meilensteine sind fortlaufend von `MS-1` bis `MS-12` nummeriert, in genau der Reihenfolge, in der sie bearbeitet werden. Die Nummer ist damit gleichzeitig die Position im Plan.

`M1`–`M6` sind die **Module** der Anforderungsanalyse (M1 Bestand & Becken, M2 Steckbrief & Haltungsdaten, …) und haben mit den Meilensteinnummern nichts zu tun. Unterschieden werden beide allein durch das Präfix `MS-`. Deshalb gilt: **Meilensteine werden nie ohne Präfix geschrieben.** „M4" ist immer das Modul, „MS-4" immer der Meilenstein.

### 1.2 Querschnittsanforderungen sind kein Meilenstein, sondern Definition of Done

Die folgenden Anforderungen gelten **in jedem Meilenstein** für die dort gebauten Screens und werden nicht in einen späteren Meilenstein verschoben:

| ID | Gilt in jedem Meilenstein |
| --- | --- |
| FR-6.2 | RLS auf jeder neu angelegten Tabelle, kein Zugriff auf fremde Daten |
| FR-6.4 | Lade-, Leer- und Fehlerzustände in jeder neuen Liste und jedem neuen Formular |
| FR-6.5 | Bestätigungsdialog vor jeder löschenden Aktion |
| FR-6.6 | Formularvalidierung mit Feldfehlern |
| NFR-1.3 | Trefferflächen ≥ 44 px, keine Hover-abhängige Funktion |
| NFR-1.4 | Kein Icon ohne Textalternative, sichtbare Labels, Kontrast WCAG 2.1 AA |
| NFR-1.6 | Nutzbar ab 360 px Breite |
| NFR-4.1 | TypeScript Strict, kein `any` |
| NFR-4.3 | Datenzugriff ausschließlich über `src/services/*` |

Begründung: Ein nachgelagerter „Nacharbeits-Meilenstein" für diese Punkte wird erfahrungsgemäß zu klein geschätzt und fällt bei Zeitdruck als Erstes weg.

---

## 2. Meilensteinübersicht

| MS | Name | Deckt ab | Aufwand |
| --- | --- | --- | --- |
| [**MS-1**](Meilensteine/MS-01_Design-Mockup.md) | Design & Mockup | Vorbereitung Bildschirme und Routing, NFR-1.1 bis NFR-1.8 | ~10 % |
| [**MS-2**](Meilensteine/MS-02_Datenmodell-Schema-Entwurf.md) | Datenmodell & Schema-Entwurf *(parallel zu MS-1)* | Abschnitt 3 und 4 der Anforderungsanalyse, NFR-4.7, NFR-4.4 | ~4 % |
| [**MS-3**](Meilensteine/MS-03_Fundament-Auth.md) | Fundament & Auth | MVP 1 · FR-6.1, FR-6.3, FR-6.10, FR-6.2 | ~8 % |
| [**MS-4**](Meilensteine/MS-04_UI-Shell-Becken.md) | UI-Shell & Becken | MVP 2 · FR-1.1, FR-1.15, NFR-1.2 | ~8 % |
| [**MS-5**](Meilensteine/MS-05_Koralle-Bestand.md) | Koralle & Bestand (Grundgerüst) | MVP 3 · FR-1.2, FR-1.14 | ~11 % |
| [**MS-6**](Meilensteine/MS-06_Detailseite-Steckbrief-Historie.md) | Detailseite: Steckbrief & Historie | MVP 4 + 5 · FR-2.1, FR-2.2, FR-3.3, FR-3.4, FR-3.5 | ~11 % |
| [**MS-7**](Meilensteine/MS-07_Ableger-Inserat.md) | Ableger & Inserat | MVP 6 · FR-1.7, FR-3.6, FR-4.1, FR-4.2 | ~9 % |
| [**MS-8**](Meilensteine/MS-08_Diary.md) | Diary | MVP 7 · FR-5.1, FR-5.3, FR-5.4, FR-5.10 | ~10 % |
| [🚦](Meilensteine/MS-08a_GATE_MVP-Abnahme.md) | **GATE: MVP-Abnahme** | Abnahmekriterien, Abschnitt 7 | — |
| [**MS-9**](Meilensteine/MS-09_Bestand-nutzbar-Profil.md) | Bestand nutzbar & Profil | FR-1.3 bis FR-1.6, FR-1.9, FR-1.10, FR-2.3, FR-2.4, FR-6.8 | ~9 % |
| [**MS-10**](Meilensteine/MS-10_Herkunft-Historie-Diary-Ausbau.md) | Herkunft, Historie & Diary-Ausbau | FR-3.1, FR-3.2, FR-3.7, FR-5.2 | ~7 % |
| [**MS-11**](Meilensteine/MS-11_Vermittlung.md) | Vermittlung *(optional, Abbruchkriterium)* | FR-4.3 bis FR-4.7 | ~8 % |
| [**MS-12**](Meilensteine/MS-12_Feinschliff-Abgabe.md) | Feinschliff & Abgabe | NFR-4.5, NFR-2.1 bis NFR-2.4 | ~5 % |

Der Aufwand ist als relativer Anteil am Gesamtprojekt angegeben, nicht in Wochen – so lässt er sich auf jeden Zeitrahmen abbilden. Bis zum MVP-Gate sind rund **71 %** verplant.

---

## 3. Die Meilensteine im Einzelnen

### MS-1 · Design & Mockup

**Ziel:** Das Aussehen der Anwendung steht fest, bevor Logik verdrahtet wird.

**Umfang – nur diese fünf ★-Screens werden gestaltet:**

1. **Bestand als Kachelliste** – einschließlich des geführten Leerzustands nach FR-1.15. Der Leerzustand ist der eigentlich schwierige Screen, nicht die gefüllte Liste.
2. **Koralle anlegen** – das Formularmuster, aus dem alle weiteren Formulare abgeleitet werden.
3. **Korallen-Detail mit Tabs** (Steckbrief · Historie) – inklusive Steckbrief-Icons **mit** Textlabel und Legende nach FR-2.3.
4. **Beckendetail / Diary mit Tabs** (Werte · Verlauf · Ereignisse) – das zweite Tab-Muster.
5. **Login / Register** – der kleinste Screen, setzt aber Typografie, Buttons und Feldabstände.

Alle übrigen Routen (Beckenliste, Ableger-Formular, Inserat, Profil, Angebotslisten) leiten sich aus diesen fünf ab und werden **nicht** separat gestaltet.

**Ergebnisse:**

- Dark-Theme-Farbtokens und Typografie, abgestimmt auf shadcn/ui und Tailwind
- Struktur der Bottom-Navigation: **Bestand · Becken · Diary · Profil** (NFR-1.2)
- Komponenteninventar: welche shadcn-Komponenten werden gebraucht
- 10–20 Korallenfotos zusammengestellt, für Mockup und später als Demo-Daten (NFR-4.5)

**Definition of Done:** Die fünf Screens sind gestaltet, die Bottom-Navigation ist festgelegt, das Farbschema steht, das Bildmaterial liegt vor.

**Empfohlener Weg:** Low-Fi-Wireframe (schnell, grob) → statische UI-Shell in React + shadcn mit Dummy-Daten → Verdrahtung. Die UI-Shell ist dann kein Wegwerfartefakt, sondern geht direkt in MS-4 und MS-5 über. Wird ein gestaltetes Mockup als eigenes Abgabeartefakt der Weiterbildung verlangt, tritt es vor die UI-Shell.

> **Timebox: harte Obergrenze ~10 % des Projekts.** Ohne Deckelung wird die Designphase in einem Projekt dieses Umfangs zuverlässig zur Hälfte des Projekts. Zweite Regel: **nur ★-Screens gestalten** – die größte Gefahr ist, die schönen Could-Features zu entwerfen statt der Pflicht.

---

### MS-2 · Datenmodell & Schema-Entwurf *(läuft parallel zu MS-1)*

**Ziel:** Das Datenmodell steht auf Papier, bevor die erste Migration geschrieben wird. Abschnitt 3 und 4 der Anforderungsanalyse benennen Entitäten und Beziehungen — sie legen aber weder Datentypen noch Constraints noch das RLS-Muster fest. Genau diese Lücke schließt MS-2.

**Umfang – nur die acht MVP-Entitäten** (`profil`, `becken`, `koralle`, `steckbrief`, `historieneintrag`, `angebot`, `messwert`, `becken_ereignis`). `herkunft`, `bild`, `dokument`, `abgabe` und `anfrage` werden nur so weit mitgedacht, dass sie später ohne Umbau andocken können.

**Ergebnisse:**

- **ERD** der acht MVP-Entitäten mit Kardinalitäten nach Abschnitt 4
- **Feldliste je Tabelle:** Name, Postgres-Typ, `NOT NULL`, Default, Constraint
- **Fremdschlüssel mit Löschverhalten**, mindestens die drei aus NFR-4.7 (`koralle.becken_id NOT NULL`, `mutter_id ON DELETE SET NULL`, `anfrage.angebot_id ON DELETE CASCADE`) plus die übrigen bewusst gesetzt
- **RLS-Matrix:** je Tabelle und je Operation (SELECT/INSERT/UPDATE/DELETE) die Bedingung – inklusive der beiden Sonderfälle: Historie ohne UPDATE/DELETE (FR-3.3) und Angebot mit Lesezugriff für Fremdnutzer bei `sichtbar = true` (FR-4.2)
- **Namenskonvention** (deutsch, `snake_case`) und Umgang mit Zeitstempeln
- **Migrationsreihenfolge** als nummerierte Liste, direkt abarbeitbar in MS-3 

**Zu entscheidende Punkte** – die Anforderungsanalyse lässt sie offen, MS-3 kann sie nicht offen lassen:

1. **`steckbrief` eigene 1:1-Tabelle oder Spalten in `koralle`?** Abschnitt 4 erlaubt beides ausdrücklich („kann in `koralle` eingebettet werden"). KISS spricht für Einbettung, der Ableger-Snapshot nach Grundsatz 4 ebenfalls.
2. **`messwert`: eine Zeile je Parameter oder eine Zeile je Messung?** Abschnitt 4 beschreibt das Langformat (`parameter`, `wert`, `einheit`), FR-5.1 beschreibt faktisch das Breitformat (sieben feste Parameter, alle optional, mindestens einer gefüllt, feste Einheiten). **Das ist ein Widerspruch in der Anforderungsanalyse und muss hier aufgelöst werden**, weil FR-5.2 (Verlaufsdiagramm je Parameter) an der Entscheidung hängt.
3. **Status und Typfelder als Postgres-Enum oder Text mit CHECK?** Betrifft `koralle.status`, `historieneintrag.typ`, `becken_ereignis.typ`, `angebot.modus`.
4. **RLS-Muster:** `nutzer_id` auf jeder Kindtabelle mitführen (einfache Policy, kleine Redundanz) oder über Joins prüfen (normalisiert, aufwendigere Policy).
5. **Wo entsteht der Ableger-Snapshot** nach Grundsatz 4 und FR-1.7 – in der Service-Schicht oder als Datenbankfunktion? KISS und NFR-4.3 sprechen für die Service-Schicht.
6. **Bilder:** reicht im MVP die Spalte `koralle.primaerbild`, oder kommt die `bild`-Tabelle sofort mit? Bucket-Layout und Pfadschema gehören in dieselbe Entscheidung.

**Definition of Done:** Das Dokument liegt vor, alle sechs Punkte sind entschieden und begründet, die Migrationsreihenfolge ist so konkret, dass MS-3 sie ohne Rückfragen abarbeiten kann.

> **Timebox: ~4 % des Projekts.** MS-2 ist bewusst klein. Es geht nicht um ein vollständiges Enterprise-Datenmodell, sondern darum, die sechs Entscheidungen einmal bewusst zu treffen statt dreimal beiläufig in einer Migration. Was das Dokument nicht enthält, entscheidet MS-3 pragmatisch weiter – es blockiert nicht.

---

### MS-3 · Fundament & Auth

**Ziel:** Das technische Fundament trägt, das größte technische Risiko ist ausgeräumt.

**Umfang:**

- Vite, TypeScript (Strict), Tailwind, shadcn/ui aufgesetzt
- Supabase-Projekt; Schema **aller** MVP-Tabellen nach dem Entwurf aus MS-2 angelegt – in einem Zug, nicht schrittweise
- RLS-Policies auf allen Tabellen nach der RLS-Matrix aus MS-2; referenzielle Integrität nach NFR-4.7
- Profil-Trigger auf `auth.users` (FR-6.10); E-Mail-Bestätigung deaktiviert (FR-6.1)
- Datenbanktypen generiert (NFR-4.4), Skelett der Service-Schicht `src/services/*` (NFR-4.3)
- Registrierung, Anmeldung, Abmelden, geschützte Routen (FR-6.1, FR-6.3)
- **Erstes Deployment live** (GitHub Pages)

**Definition of Done:** Registrierung → Anmeldung → geschützte Route funktioniert auf dem deployten Stand; ein direkter Aufruf einer geschützten Route ohne Session leitet zur Anmeldung.

**Abhängigkeit:** Schema, RLS und Trigger setzen **MS-2** voraus, hängen aber **nicht** am Mockup. Nur die Auth-Screens warten auf MS-1. Läuft MS-1 länger als geplant, kann MS-3 bis auf die Auth-Screens vollständig fertig werden.

---

### MS-4 · UI-Shell & Becken

**Ziel:** Das Mockup wird zur laufenden Anwendung mit echten Daten.

**Umfang:** Routing, Bottom-Navigation, Dark Theme; Becken anlegen, bearbeiten, löschen (FR-1.1); Löschsperre, solange dem Becken Korallen zugeordnet sind; geführter Leerzustand „Lege zuerst ein Becken an" mit direkter Aktion (FR-1.15).

**Definition of Done:** Ein neu registrierter Nutzer landet auf dem leeren Bestand, wird zur Beckenanlage geführt und kann ein Becken in einem Formular anlegen.

---

### MS-5 · Koralle & Bestand (Grundgerüst)

**Ziel:** Der zentrale Datensatz entsteht.

**Umfang:** Koralle anlegen mit Bezeichnung und Pflicht-Beckenauswahl (FR-1.2, FR-1.14); einfache Bestandsliste als Navigation.

**Bewusst noch nicht enthalten:** Kachelansicht, Filter, Sortierung, Suche, Bild-Upload. Das folgt in MS-9.

**Definition of Done:** Speichern ohne Becken wird mit einem Feldfehler abgelehnt; angelegte Korallen erscheinen in der Liste und sind anklickbar.

---

### MS-6 · Detailseite: Steckbrief & Historie

**Ziel:** Die Detailseite trägt die beiden fachlichen Kernfunktionen.

**Umfang:** Detailseite mit Tab-Navigation; Steckbrief anlegen und ändern, alle Felder optional (FR-2.1, FR-2.2); manueller Journaleintrag mit Datum und Freitext (FR-3.5); Systemeinträge bei Anlage und Statuswechsel (FR-3.4).

**Definition of Done:** Ein gespeicherter Historieneintrag ist nachweislich weder bearbeitbar noch löschbar (FR-3.3); die Anlage der Koralle steht als Systemeintrag in derselben Historie.

> MS-6 fasst die MVP-Schritte 4 und 5 zusammen, weil beide dieselbe Detailseite bauen. Falls kleinere Schritte gewünscht sind, ist das die naheliegende Teilungsstelle.

---

### MS-7 · Ableger & Inserat

**Ziel:** Der fachlich anspruchsvollste Vorgang des Projekts funktioniert.

**Umfang:** Ableger aus einer bestehenden Koralle erzeugen; Art, Morphe, Steckbrief und Herkunftskette werden als **Snapshot kopiert**, nicht referenziert (FR-1.7, FR-3.6); Becken vorbelegt und änderbar; Inserat veröffentlichen mit Modus, Preis bzw. Tauschwunsch, Größe (FR-4.1); Koralle erhält Status `zur Abgabe`.

**Definition of Done:** **RLS-Test mit einem zweiten Testnutzer bestanden** – der zweite Nutzer sieht ausschließlich das sichtbare Inserat, keine Becken, keine Korallen, keine Diary-Daten, auch nicht bei direktem Abruf über bekannte IDs (FR-4.2).

---

### MS-8 · Diary

**Ziel:** Der letzte MVP-Baustein.

**Umfang:** Messwerte je Becken mit Datum erfassen, mindestens ein Wert gefüllt (FR-5.1); Wasserwechsel protokollieren (FR-5.3); Ereignisse protokollieren (FR-5.4); alle drei Eintragsarten bearbeiten und löschen mit Bestätigungsdialog (FR-5.10).

**Definition of Done:** Messwert, Wasserwechsel und Ereignis lassen sich anlegen, einer korrigieren, einer löschen.

---

### 🚦 GATE: MVP-Abnahme *(nach MS-8, vor MS-9)*

**Kein Ausbau, bevor dieses Gate steht.**

Die neun Abnahmeschritte aus Abschnitt 7 der Anforderungsanalyse werden **am deployten Stand** durchgespielt und das Ergebnis protokolliert. Erst danach beginnt MS-9.

Dieses Gate ist gleichzeitig der ehrliche Abbruchpunkt: Wird die Zeit knapp, ist der Pflichtumfang aus Abschnitt 1.1 nachweisbar erfüllt und alles Weitere sichtbar als Ausbau markiert.

---

### MS-9 · Bestand nutzbar & Profil

**Umfang:** Kachelansicht mit Primärbild (FR-1.3); Filter nach Becken, Art, Status und Sortierung (FR-1.4); Suche (FR-1.5); Detailansicht vervollständigen (FR-1.6); Statuswechsel mit Datum und Notiz, erzeugt Historieneintrag (FR-1.9); Koralle bearbeiten und löschen, Ableger bleiben erhalten (FR-1.10); Steckbriefwerte als Icons mit Textlabel und Legende, „keine Angabe" für leere Felder (FR-2.3); Schutzstatus mit Hinweis auf Eigenangabe (FR-2.4); Bild-Upload, unkomprimiert, max. 5 MB (NFR-2.5); Profil ansehen und bearbeiten (FR-6.8).

---

### MS-10 · Herkunft, Historie & Diary-Ausbau

**Umfang (Must):** Herkunftsdaten je Koralle (FR-3.1); Historienansicht chronologisch absteigend (FR-3.2); Abgabevorgang erfassen (FR-3.7); Verlaufsdiagramm je Parameter mit wählbarem Zeitraum (FR-5.2).

**Wenn Zeit bleibt (Should):** Belegdokumente (FR-3.8), Historienfilter (FR-3.9), Umsetzen zwischen Becken protokollieren (FR-1.11), Wachstumsgalerie (FR-1.12), Fütterung und Düngung (FR-5.5), Soll-Bereiche (FR-5.6), gemeinsamer Zeitstrahl (FR-5.7).

---

### MS-11 · Vermittlung *(optional)*

**Umfang:** Öffentliche Inseratsliste mit Filter (FR-4.3); Interessensanfrage (FR-4.3); Auswahl einer Anfrage, Inserat wird unsichtbar (FR-4.4); gegenseitiger Kontaktaustausch (FR-4.5, NFR-3.3); Rückabwicklung (FR-4.6); Abschluss mit Statuswechsel, Abgabedatensatz, Historieneintrag und Löschen des Inserats (FR-4.7).

> **Abbruchkriterium (bereits in der Anforderungsanalyse festgelegt):** Ist MS-11 zeitlich nicht sicher erreichbar, bleibt es beim Inserieren nach FR-4.1 und FR-4.2. Die Kontaktaufnahme läuft dann offline; Status und Historie bleiben trotzdem vollständig. Alle Anforderungen dieses Meilensteins haben Priorität **S**.

---

### MS-12 · Feinschliff & Abgabe

**Umfang:** Demo-Konto mit Beispieldaten und den in MS-1 zusammengestellten 10–20 Korallenfotos (NFR-4.5); Durchsicht aller Leer- und Fehlerzustände; Performance-Check gegen das Mengengerüst (NFR-2.1 bis NFR-2.4); Browsertest Chrome, Firefox, Safari (NFR-4.6); Abgabedokumentation.

---

## 4. Begründung des Zuschnitts

1. **Design vor Logik.** Vier NFRs sind gegen eine Spezifikation nicht prüfbar, sondern nur gegen ein Layout: NFR-1.1 (Neuanlage in 60 s, max. fünf Pflichteingaben in einem Formular), NFR-1.2 (drei Interaktionen, Bottom-Nav), NFR-1.3 (44 px, Blaulicht) und NFR-1.7 (jede Seite führt die nächste Aktion mit). Die Bottom-Navigation legt außerdem den Aufbau jedes einzelnen Screens fest – diese Entscheidung im Mockup zu treffen kostet Stunden, sie nach MS-6 zu revidieren kostet jede bereits gebaute Seite.

2. **MS-1 und MS-2 laufen parallel, MS-3 folgt beiden.** Mockup und Datenmodell blockieren sich gegenseitig nicht – das Datenmodell folgt aus Abschnitt 3 und 4 der Anforderungsanalyse, nicht aus dem Layout. Damit kosten die beiden Planungsphasen zusammen nur die Zeit der längeren von beiden.

3. **Datenmodell entwerfen und Datenmodell bauen sind zwei Schritte.** MS-3 legt nach Punkt 6 bewusst das komplette MVP-Schema an. Ein Schema in einem Zug anzulegen setzt aber voraus, dass es vorher einmal ganz durchdacht wurde – sonst entstehen die Entscheidungen zu Typen, Constraints und RLS-Muster beiläufig beim Schreiben der ersten Migration und werden bei der dritten Tabelle inkonsistent fortgeführt. MS-2 ist die kleinste Form, das zu verhindern.

4. **Vertikale Schnitte, kein reiner Backend-Meilenstein.** Jeder Meilenstein ab MS-4 endet mit etwas, das im Browser vorführbar ist. Das ist bei einem Abschlussprojekt der beste Schutz gegen „viel gebaut, nichts fertig".

5. **Ein hartes Gate nach MS-8.** Der MVP-Umfang aus Abschnitt 1.1 ist Pflicht, alles danach ist verhandelbar. Das Gate macht sichtbar, wann die Pflicht erledigt ist.

6. **Das komplette MVP-Schema in MS-3, nicht nur `profil`.** Migrationen nachträglich zu erweitern ist Reibung ohne Nutzen; RLS-Policies gehören von Anfang an dazu, weil sie sonst nie kommen.

7. **Deployment in MS-3, nicht in MS-12.** NFR-4.5 ist Abgabebedingung. Ein Deployment, das erst am Ende zum ersten Mal versucht wird, ist das klassische Risiko in dieser Projektphase.

8. **KISS bleibt Leitprinzip.** Im Zweifel der einfachere Meilenstein und ein Feature weniger – nicht ein halbes Feature mehr.

---

## 5. Zuordnung zur Umsetzungsreihenfolge der Anforderungsanalyse

| Umsetzungsreihenfolge | Meilenstein |
| --- | --- |
| Stufe 0, Schritt 1 (MVP 1) | MS-3 |
| Stufe 0, Schritt 2 (MVP 2) | MS-4 |
| Stufe 0, Schritt 3 (MVP 3) | MS-5 |
| Stufe 0, Schritt 4 und 5 (MVP 4, MVP 5) | MS-6 |
| Stufe 0, Schritt 6 (MVP 6) | MS-7 |
| Stufe 0, Schritt 7 (MVP 7) | MS-8 |
| Ausbaustufe 1 – Bestand nutzbar machen | MS-9 |
| Ausbaustufe 2 – Herkunft und Historie vervollständigen | MS-10 |
| Ausbaustufe 3 – Diary ausbauen | MS-10 |
| Ausbaustufe 4 – Vermittlung | MS-11 |
| Ausbaustufe 5 – Feinschliff | MS-12 |
| *(neu, ohne Entsprechung)* | MS-1 |
| *(neu, ohne Entsprechung)* | MS-2 |

Die Vorbereitungsaufgabe „10–20 Korallenfotos zusammenstellen" ist jetzt Bestandteil von MS-1 und wird in MS-12 als Demo-Daten verwendet (NFR-4.5).
