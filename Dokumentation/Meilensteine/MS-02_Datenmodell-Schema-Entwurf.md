# MS-2 · Datenmodell & Schema-Entwurf

## Meilensteinübersicht

| MS | Name | Deckt ab | Aufwand |
| --- | --- | --- | --- |
| MS-1 | Design & Mockup | Vorbereitung Bildschirme und Routing, NFR-1.1 bis NFR-1.8 | ~10 % |
| **➤ MS-2** | **Datenmodell & Schema-Entwurf** *(parallel zu MS-1)* | **Abschnitt 3 und 4 der Anforderungsanalyse, NFR-4.7, NFR-4.4** | **~4 %** |
| MS-3 | Fundament & Auth | MVP 1 · FR-6.1, FR-6.3, FR-6.10, FR-6.2 | ~8 % |
| MS-4 | UI-Shell & Becken | MVP 2 · FR-1.1, FR-1.15, NFR-1.2 | ~8 % |
| MS-5 | Koralle & Bestand (Grundgerüst) | MVP 3 · FR-1.2, FR-1.14 | ~11 % |
| MS-6 | Detailseite: Steckbrief & Historie | MVP 4 + 5 · FR-2.1, FR-2.2, FR-3.3, FR-3.4, FR-3.5 | ~11 % |
| MS-7 | Ableger & Inserat | MVP 6 · FR-1.7, FR-3.6, FR-4.1, FR-4.2 | ~9 % |
| MS-8 | Diary | MVP 7 · FR-5.1, FR-5.3, FR-5.4, FR-5.10 | ~10 % |
| 🚦 | GATE: MVP-Abnahme | Abnahmekriterien, Abschnitt 7 | — |
| MS-9 | Bestand nutzbar & Profil | FR-1.3 bis FR-1.6, FR-1.9, FR-1.10, FR-2.3, FR-2.4, FR-6.8 | ~9 % |
| MS-10 | Herkunft, Historie & Diary-Ausbau | FR-3.1, FR-3.2, FR-3.7, FR-5.2 | ~7 % |
| MS-11 | Vermittlung *(optional, Abbruchkriterium)* | FR-4.3 bis FR-4.7 | ~8 % |
| MS-12 | Feinschliff & Abgabe | NFR-4.5, NFR-2.1 bis NFR-2.4 | ~5 % |

Der Aufwand ist als relativer Anteil am Gesamtprojekt angegeben, nicht in Wochen – so lässt er sich auf jeden Zeitrahmen abbilden. Bis zum MVP-Gate sind rund **71 %** verplant.

---

## MS-2 im Detail

*(läuft parallel zu MS-1)*

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
