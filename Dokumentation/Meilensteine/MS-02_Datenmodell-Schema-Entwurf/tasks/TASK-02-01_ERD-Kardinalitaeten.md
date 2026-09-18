# TASK-02-01 · ERD der MVP-Entitäten mit Kardinalitäten prüfen und vervollständigen

**Status:** offen
**Bezug:** Anforderungen Abschnitt 3 (Grundsatzentscheidungen) und 4 (Kernentitäten, Beziehungen in 4.2), Entscheidung 1 aus MS-2, FR-1.14, NFR-4.7
**Voraussetzung:** keine

---

## Worum geht es

MS-2 verlangt ein **ER-Diagramm der MVP-Entitäten mit Kardinalitäten nach Abschnitt 4** der Anforderungen.
Ein Diagramm gibt es bereits: im ER-Modell als Mermaid-Code (Abschnitt 1, fachliche Beziehungen, und Abschnitt 2, Eigentümerschaft)
und zusätzlich als zwei PNG-Bilder.

Die acht Beziehungen aus Anforderungen 4.2 und die Anbindung der mitgedachten Tabellen sind geprüft (14.09.2026) und stimmen.
Offen sind die Befunde unten und die Frage, welche der drei Diagrammfassungen gilt. Nebenbei wird Entscheidung 1 bestätigt:
Der Steckbrief ist keine eigene Tabelle.

## Kurz erklärt: Kardinalitäten in Mermaid

Die Zeichen stehen jeweils an dem Ende der Linie, das sie beschreiben:

- `||` – genau eins
- `|o` bzw. `o|` – null oder eins
- `o{` bzw. `}o` – null bis viele

Beispiel: `becken ||--o{ koralle` heißt: Ein Becken hat null bis viele Korallen, jede Koralle gehört zu **genau einem** Becken.
Die „genau eins"-Seite entspricht in der Tabelle einer Fremdschlüsselspalte mit `NOT NULL`, „null oder eins" einer nullable Spalte.

## Vor dem Start klären

- [ ] **Sieben oder acht MVP-Entitäten? (Entscheidung 1)** MS-2 zählt acht auf, darunter `steckbrief`. Anforderungen 4.1 und das
      ER-Modell (Festlegung 3) betten den Steckbrief aber in `koralle` ein – es bleiben **sieben** Tabellen. Die Entscheidung steht damit
      schon in den Anforderungen; der Satz in MS-2 („Abschnitt 4 erlaubt beides") stammt aus einer älteren Fassung.
      → Bestätigen und im ER-Modell in einem Satz festhalten, warum es sieben sind.
- [ ] **Welche Diagrammquelle gilt?** Es gibt drei Fassungen, und sie stimmen nicht überein (siehe Befunde):
  - Mermaid-Code im ER-Modell
  - `Coralkeeper-ER-Modell-v1.0.png` – ein gerenderter Stand des Mermaid-Codes, aber älter
  - `Coralkeeper-ER-Modell-v1.0_Farbig.png` – eine eigene Zeichnung mit Abweichungen
  - **Vorschlag:** Der Mermaid-Code ist die einzige Quelle. Die Bilder werden am Ende von MS-2 neu erzeugt oder entfernt.
- [ ] **Mitgedachte Tabellen kennzeichnen?** Das Diagramm zeigt `bild_dokument`, `abgabe` und `anfrage` gleichrangig mit den MVP-Tabellen.
      MS-2 will sie nur „mitgedacht". **Vorschlag:** im Lesehinweis unter der Überschrift auflisten, welche Tabellen MVP sind und welche erst später gebraucht werden (mit Meilenstein).

## Befunde aus der Durchsicht (14.09.2026)

- [ ] **Eine Kante fehlt:** `koralle.primaerbild` ist ein Fremdschlüssel auf `bild_dokument` (Festlegung 9), im Diagramm aber nicht eingezeichnet.
      Sinngemäß: `bild_dokument |o--o| koralle : "ist Primaerbild von"`.
- [ ] **Kardinalität und Feldliste passen nicht zusammen:** `koralle ||--o| angebot` sagt „jedes Inserat hat genau eine Koralle",
      `angebot.koralle_id` ist aber nullable (ER-Modell und SQL-Datei). Entschieden wird das in TASK-02-03, hier danach angleichen.
- [ ] **Das einfache PNG ist veraltet.** Es zeigt z. B. `profil.erstellt_am`, `historieneintrag.typ` und `angebot.sichtbar` ohne `NOT NULL` –
      der Mermaid-Code hat diese Angaben seit TASK-03-03.
- [ ] **Das farbige PNG weicht ab:** Die Spalte heißt dort `primaerbild_id` (ER-Modell und SQL-Datei: `primaerbild`); die Linie „stellt"
      scheint von `profil` zu `angebot` zu führen statt zu `anfrage`; „illustriert" zeigt auf der Bildseite `1..1` statt `0..1`. Beim Abgleich genau prüfen.
- [ ] **MS-2 nennt `herkunft`, `bild` und `dokument` als eigene Entitäten.** Das ist überholt: Herkunft ist in `koralle` eingebettet (4.1),
      Bild und Dokument sind zu `bild_dokument` zusammengelegt (ER-Modell Abschnitt 4, Schlussvermerk). Ein Satz im Lesehinweis genügt.

## Schritte

1. [ ] **Fragen aus „Vor dem Start klären" beantworten.**
2. [ ] **Befunde entscheiden** und den Mermaid-Code anpassen (fehlende Kante, ggf. Kardinalität bei `angebot`).
3. [ ] **Lesehinweis ergänzen:** sieben MVP-Tabellen statt acht, welche Tabellen mitgedacht sind, was aus `herkunft`, `bild` und `dokument` wurde.
4. [ ] **Entscheidung 1 prüfen:** Festlegung 3 in Abschnitt 3 nennt die Begründung (Anforderungen 4.1, Ableger-Snapshot als Spaltenkopie). Bei Bedarf den Bezug auf MS-2 ergänzen.
5. [ ] **Bilder nach der Entscheidung behandeln** – neu erzeugen oder entfernen. Das kann bis TASK-02-06 warten, wenn sich das Diagramm dort noch ändert.

## Fertig, wenn

- [ ] Jeder Fremdschlüssel ist als Kante sichtbar – fachliche in Abschnitt 1, `nutzer_id` in Abschnitt 2
- [ ] Die Kardinalitäten passen zu `NOT NULL` in der Feldliste (Pflichtseite `||` ⇔ Spalte `NOT NULL`)
- [ ] Erkennbar ist, welche Tabellen MVP sind und welche nur mitgedacht
- [ ] Entscheidung 1 steht begründet im ER-Modell
- [ ] Es gibt genau eine gültige Diagrammfassung; die Bilder sind aktuell oder entfernt

## Hinweise

- Die `nutzer_id`-Kanten fehlen in Abschnitt 1 **absichtlich** (siehe Lesehinweis dort). Das ist kein Befund.
- Nichts in der Datenbank oder in der SQL-Datei ändern.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 1 (Diagramm), Abschnitt 2 (Eigentümerschaft), Festlegungen 3 und 9, Abschnitt 4
- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.png`, `Coralkeeper-ER-Modell-v1.0_Farbig.png`
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – Abschnitt 3, Abschnitt 4 mit 4.1 und 4.2
- [`../MS-02_Datenmodell-Schema-Entwurf.md`](../MS-02_Datenmodell-Schema-Entwurf.md) – Umfang, Ergebnis „ERD", Entscheidung 1
