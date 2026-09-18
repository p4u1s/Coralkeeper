# TASK-02-03 · Fremdschlüssel und deren Löschverhalten festlegen

**Status:** in Arbeit
**Bezug:** NFR-4.7 (referenzielle Integrität in der Datenbank), FR-1.1, FR-1.10, FR-1.14, FR-3.3
**Voraussetzung:** keine (kommt mit dem heutigen Stand des ER-Modells aus) · **entsperrt:** TASK-03-04

---

## Worum geht es

Jeder Fremdschlüssel braucht eine bewusste Antwort auf die Frage: _Was passiert mit diesem Datensatz, wenn der Datensatz gelöscht wird,
auf den er verweist?_ Drei Antworten gibt NFR-4.7 vor, sechs weitere hat das ER-Modell bereits festgelegt. Offen ist der Rest – vor allem
alle `nutzer_id`-Spalten.

Ergebnis ist **eine vollständige Tabelle aller Fremdschlüssel im ER-Modell**, aus der TASK-03-04 die Constraints ohne Rückfrage bauen kann.

## Vor dem Start klären

- [x] **Soll ein Nutzerkonto samt aller Daten löschbar sein?** Das entscheidet Nr. 10 bis 19 in einem Zug.
  - Mit `CASCADE`: Konto im Supabase-Dashboard löschen → Profil und alle Daten sind weg. Das passt zu FR-6.9
    (ausgelagert, „Löschung erfolgt bei Bedarf direkt in Supabase") und macht das Aufräumen von Testnutzern (TASK-03-05) zu einem Klick.
  - Mit `NO ACTION`: Ein Konto lässt sich erst löschen, wenn vorher alle Daten in allen Tabellen von Hand entfernt sind.
  - **Vorschlag:** `CASCADE`, und zwar einheitlich. Uneinheitliche Regeln sind das Schlechteste aus beiden Welten (siehe Hinweise).
  - → **Entschieden am 15.09.2026:** `CASCADE`, einheitlich.
- [x] **Nr. 20 bis 23 einzeln entscheiden** (Tabelle unten). → **Entschieden am 15.09.2026:** jeweils wie in der Spalte „Vorschlag".
- [x] **`angebot.koralle_id` `NOT NULL`?** Im ER-Modell und in der SQL-Datei ist die Spalte nullable, das Diagramm (`koralle ||--o| angebot`)
      sagt aber „genau eine Koralle je Inserat". Ein Inserat ohne Koralle ergibt keinen Sinn. **Vorschlag:** `NOT NULL`.
      → **Entschieden am 15.09.2026:** `NOT NULL`, umgesetzt in TASK-03-07.
- [ ] **`CHECK`-Constraints für Zahlenbereiche?** Kandidaten: `becken.volumen_liter > 0`, `abgabe.stueckzahl > 0`, `abgabe.preis >= 0`.
      **Vorschlag:** keine – FR-6.6 verlangt die Prüfung im Formular, das reicht (KISS).

## Arbeitsvorlage: alle 23 Fremdschlüssel

Ist = Stand der Datenbank, abgefragt mit Schritt 1 aus TASK-03-04 am 15.09.2026. Ohne Angabe einer Regel gilt `NO ACTION`.

> **Stand 15.09.2026, nach der Korrektur:** Alle Vorschläge aus Gruppe B sind in der Datenbank umgesetzt (TASK-03-04, Schritt 4).
> Die Spalte „Ist" zeigt den Stand davor.

### Gruppe A · bereits festgelegt

Durch NFR-4.7, die Festlegungen 1, 2, 6 und Abschnitt 1 des ER-Modells festgelegt und so in der Datenbank umgesetzt:

1 `koralle.becken_id` → `RESTRICT` · 2 `koralle.mutter_id` → `SET NULL` · 3 `anfrage.angebot_id` → `CASCADE` ·
4 `historieneintrag.koralle_id` → `CASCADE` · 5 `angebot.koralle_id` → `CASCADE` · 6 `messwert.becken_id` → `CASCADE` ·
7 `becken_ereignis.becken_id` → `CASCADE` · 8 `becken_ereignis.koralle_id` → `SET NULL` · 9 `bild_dokument.koralle_id` → `CASCADE`

### Gruppe B · zu entscheiden

| #     | Fremdschlüssel                                                                                                               | → Ziel          | Ist                                                                                                                                         | Möglich                                                                             | Folge                                                                                                                                                                                              | Vorschlag   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 10    | `profil.id`                                                                                                                  | `auth.users`    | **fehlt** – kein Fremdschlüssel                                                                                                             | `CASCADE` · `NO ACTION`                                                             | Ohne Fremdschlüssel bleibt ein Profil als Waise stehen, wenn das Auth-Konto gelöscht wird. Mit `NO ACTION` ließe sich ein Auth-Konto nicht löschen, solange sein Profil existiert                  | `CASCADE`   |
| 11–18 | `nutzer_id` auf `becken`, `koralle`, `historieneintrag`, `angebot`, `messwert`, `becken_ereignis`, `bild_dokument`, `abgabe` | `profil`        | `CASCADE` auf `becken`, `koralle`, `historieneintrag`, `abgabe` · `NO ACTION` auf `angebot`, `messwert`, `becken_ereignis`, `bild_dokument` | einheitlich `CASCADE` · einheitlich `NO ACTION`                                     | Nur im Paket mit Nr. 10 sinnvoll                                                                                                                                                                   | `CASCADE`   |
| 19    | `anfrage.interessent_id`                                                                                                     | `profil`        | `NO ACTION`                                                                                                                                 | wie 11–18                                                                           | Wie 11–18: Die Anfragen eines gelöschten Kontos verschwinden                                                                                                                                       | `CASCADE`   |
| 20    | `abgabe.empfaenger_nutzer_id`                                                                                                | `profil`        | `SET NULL`                                                                                                                                  | `SET NULL` · `NO ACTION`                                                            | `SET NULL`: Die Abgabe bleibt beim Züchter erhalten, `empfaenger_name` und `empfaenger_kontakt` stehen weiter als Text da. `NO ACTION`: Wer irgendwo Empfänger ist, kann sein Konto nicht löschen  | `SET NULL`  |
| 21    | `abgabe.koralle_id`                                                                                                          | `koralle`       | `RESTRICT`                                                                                                                                  | `CASCADE` · `RESTRICT`                                                              | `RESTRICT`: Eine abgegebene Koralle lässt sich nicht mehr löschen – FR-1.10 muss den Fehler abfangen. `CASCADE`: Der Abgabedatensatz verschwindet mit der Koralle, genau wie ihre Historie (Nr. 4) | `CASCADE`   |
| 22    | `koralle.primaerbild`                                                                                                        | `bild_dokument` | `NO ACTION`                                                                                                                                 | `SET NULL` · `NO ACTION`                                                            | `SET NULL`: Bild löschen leert das Primärbild. `NO ACTION`: Das Primärbild muss erst abgewählt werden, dann lässt es sich löschen                                                                  | `SET NULL`  |
| 23    | `historieneintrag.bild_id`                                                                                                   | `bild_dokument` | `NO ACTION`                                                                                                                                 | `SET NULL` · `NO ACTION` – **nicht** `CASCADE`, das würde Historie löschen (FR-3.3) | `SET NULL` ändert einen append-only-Eintrag nachträglich (das Bild ist weg, der Text bleibt). `NO ACTION`: Ein Bild mit Historienbezug bleibt als Nachweis erhalten und ist nicht löschbar         | `NO ACTION` |

## Schritte

1. [ ] **Fragen aus „Vor dem Start klären" beantworten.**
2. [x] **Gruppe B Zeile für Zeile entscheiden**, zu jeder Entscheidung ein Satz Begründung.
3. [ ] **Löschfälle einmal im Kopf durchspielen** – mit den gewählten Regeln: Was verschwindet, was bleibt, was wird abgelehnt?
   - [ ] Becken löschen, dem noch Korallen zugeordnet sind → abgelehnt (FR-1.1)
   - [ ] Becken ohne Korallen löschen → Messwerte und Becken-Ereignisse sind weg
   - [ ] Koralle löschen, die Ableger, Primärbild, Historie mit Bild, Inserat mit Anfragen und eine Abgabe hat
   - [ ] Bild löschen, das Primärbild ist bzw. in der Historie verwendet wird
   - [ ] Konto löschen, zu dem Becken, Korallen und Diary-Einträge gehören
4. [ ] **Diese Löschfälle als Testliste für TASK-03-04 notieren** – dort werden sie in der echten Datenbank geprüft.
5. [x] **Im ER-Modell nachtragen:**
   - [x] neuer Unterabschnitt „Fremdschlüssel und Löschverhalten" in Abschnitt 3 mit allen 23 Zeilen (Spalte, Ziel, Regel, Begründung)
   - [x] die Kommentare im Mermaid-Diagramm in Abschnitt 1 angleichen – dort steht die Löschregel bisher nur bei einigen Spalten
   - [ ] ggf. `NOT NULL` bei `angebot.koralle_id` (und das Diagramm aus TASK-02-01 prüfen)
         → hängt an der offenen Frage unter „Vor dem Start klären" und wird dort nachverfolgt.
6. [ ] **In TASK-03-04 den Punkt „Vor dem Start klären" abhaken.**

## Fertig, wenn

- [ ] Jeder der 23 Fremdschlüssel hat im ER-Modell eine Löschregel und eine kurze Begründung
- [ ] Keine Regel löscht oder ändert Historie über einen Umweg entgegen FR-3.3 (Nr. 23 ist nicht `CASCADE`)
- [ ] `NOT NULL` für `angebot.koralle_id` und die `CHECK`-Frage sind entschieden
- [ ] TASK-03-04 kann seine Soll-Tabelle vollständig aus dem ER-Modell ablesen

## Hinweise

- **Uneinheitliche Regeln auf `nutzer_id`:** Heute kaskadieren nur `becken`, `koralle`, `historieneintrag` und `abgabe`. Eine
  Profil-Löschung scheitert an der ersten Tabelle mit `NO ACTION` – gelöscht wird dann gar nichts. Deshalb einheitlich entscheiden.
  → **Behoben am 15.09.2026:** alle `nutzer_id` und `anfrage.interessent_id` einheitlich `CASCADE`.
- **Befund:** Datenbank und SQL-Datei weichen bei den Löschregeln voneinander ab, im ER-Modell steht zu den meisten gar nichts.
  In der Datenbank, aber nicht in der SQL-Datei: `CASCADE` auf `becken.nutzer_id`, `historieneintrag.nutzer_id` und `abgabe.nutzer_id`,
  `SET NULL` auf `abgabe.empfaenger_nutzer_id`, `RESTRICT` auf `abgabe.koralle_id`. In der SQL-Datei, aber nicht in der Datenbank:
  der Fremdschlüssel `profil.id` → `auth.users` und `UNIQUE (abgabe.koralle_id)`. Aufgelöst wird das mit Gruppe B; die SQL-Datei zieht TASK-03-04 nach.
  → **Datenbank korrigiert am 15.09.2026.** Offen sind noch die SQL-Datei (TASK-03-04, Schritt 7) und das ER-Modell (Schritt 5 oben).
- **Befund:** In der Datenbank fehlt `UNIQUE (abgabe.koralle_id)` (Festlegung 5) – eine Koralle könnte mehrfach abgegeben werden. Ergänzt wird es in TASK-03-04.
  → **Behoben am 15.09.2026.**
- **Kaskaden gehen an RLS vorbei.** Wird eine Koralle gelöscht, verschwinden ihre Historieneinträge mit (Nr. 4), obwohl `historieneintrag`
  keine DELETE-Policy hat – referenzielle Aktionen prüft Postgres nicht gegen RLS. Das ist gewollt: FR-3.3 verbietet das Ändern einzelner
  Einträge, nicht das Löschen der ganzen Koralle (FR-1.10). In TASK-03-04 mit einem Test bestätigen.
- Außerhalb des Umfangs bemerkt: FR-4.3 („je Inserat genau eine Anfrage je Interessent") legt `UNIQUE (angebot_id, interessent_id)` nahe.
  Das betrifft MS-11 und lässt sich ohne Umbau nachrüsten – hier nur vormerken.
- Nichts in der Datenbank oder in der SQL-Datei ändern – das ist TASK-03-04.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Abschnitt 1 (Diagramm), Abschnitt 3 (Festlegungen 1–6, 9)
- TASK-03-04, Schritt 1 – Abfrage der Constraints in der Datenbank vom 15.09.2026 (Ist-Stand)
- `Dokumentation/Datenmodell/Coralkeeper_database_migration.sql` – SQL-Quelle im Repo
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-4.7, FR-1.1, FR-1.10, FR-1.14, FR-3.3, FR-6.9 (Vermerk unter M6)
- [`../MS-02_Datenmodell-Schema-Entwurf.md`](../MS-02_Datenmodell-Schema-Entwurf.md) – Ergebnis „Fremdschlüssel mit Löschverhalten"
- `Dokumentation/Meilensteine/MS-03_Fundament-Auth/tasks/TASK-03-04_Fremdschluessel-Loeschverhalten.md` – Abnehmer dieses Tasks
