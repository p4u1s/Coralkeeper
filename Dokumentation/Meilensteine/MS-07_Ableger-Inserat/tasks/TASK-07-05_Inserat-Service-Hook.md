# TASK-07-05 · Inserat-Service und Hook

**Status:** erledigt
**Bezug:** FR-4.1, FR-4.2, NFR-4.3 (Datenzugriff nur über `src/services/*`, eigene Hooks), NFR-4.4, NFR-4.1,
ER-Modell Festlegung 13
**Voraussetzung:** TASK-07-04

---

## Worum geht es

Alle Zugriffe auf `angebot` laufen über eine eigene Service-Datei: Inserat zu einer Koralle lesen, anlegen und
zurückziehen. Die Detailseite bekommt das Inserat über einen Hook mit Lade- und Fehlerzustand. Dazu kommen die
deutschen Beschriftungen für Modus und Korallenstatus.

## Vor dem Start klären

- [x] **Dateinamen.** Vorschlag: `src/services/offer.ts` und `src/hooks/useOffer.ts` (englisch wie `tank.ts`,
      `history.ts`).
  → **Entschieden am 29.09.2026:** wie vorgeschlagen.

## Schritte

1. [x] **Typen** aus den generierten Datenbanktypen (NFR-4.4):
   - Zeile = `Tables<"angebot">` → `Offer`
   - Eingabe = `modus`, `preis_oder_tauschwunsch`, `groesse` → `OfferInput`
2. [x] **`getOfferForCoral(coralId)`** – das Inserat einer Koralle oder `null` (`maybeSingle`); 22P02 wie in
       `getCoral` als „nicht vorhanden" behandeln.
3. [x] **`createOffer(coral, input)`**:
   - `nutzer_id` aus `getSession()`, `koralle_id = coral.id`
   - `art` und `handelsname` aus der Koralle kopieren (Festlegung 13) – für Fremde ist `koralle` nicht lesbar
   - `sichtbar` nicht setzen (Standardwert `true`, FR-4.1)
   - leere Texte getrimmt als `null` (eigene `toRow`-Funktion)
   - `23505` (Verstoß gegen `UNIQUE`) → „Für diese Koralle gibt es bereits ein Inserat.", sonst
     „Inserat konnte nicht angelegt werden." – jeweils mit `cause`
   - bei Entscheidung (a) in TASK-07-04: danach den Status setzen; bei (c): Funktion per `rpc` aufrufen
4. [x] **`withdrawOffer(offerId)`** – löscht das Inserat; Fehler „Inserat konnte nicht zurückgezogen werden."
       Bei Entscheidung (a) in TASK-07-04 zusätzlich den Status zurücksetzen.
5. [x] **Hook** `useOffer(coralId)` – Inserat oder `null`, Status (`loading` / `success` / `error`), Fehlermeldung,
       `reload()`; Statusnamen und Abbruch-Flag wie in `useTanks`.
6. [x] **Beschriftungen** in `src/lib/labels.ts`, Wertelisten aus `Constants`:
   - `OFFER_MODE_VALUES`, `OFFER_MODE_LABELS`: Verschenken · Tauschen · Verkaufen
   - `CORAL_STATUS_LABELS`: Im Bestand · Zur Abgabe · Abgegeben · Verendet – derselbe Wortlaut wie im Trigger
     `systemeintrag_anlegen` und in der Statusfarben-Tabelle von design.md

## Fertig, wenn

- [x] Der Service exportiert **keine** Update-Funktion für Inserate (UPDATE-Policy erst mit MS-11)
- [x] `art` und `handelsname` werden beim Anlegen aus der Koralle übernommen
- [x] Zu jedem Wert von `angebot_modus` und `koralle_status` gibt es eine Beschriftung, TypeScript meldet fehlende Werte
- [x] Kein `any`, keine handgeschriebenen Tabellentypen, kein Import von `@supabase/*` außerhalb von `src/services/`
- [x] Jede Funktion wirft bei Fehlern eine deutsche Meldung mit `cause`
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `getOfferForCoral` liefert wegen `angebot_select_sichtbar` auch das sichtbare Inserat einer **fremden** Koralle, wenn
  deren ID bekannt ist. Die Detailseite ruft den Hook erst auf, wenn die Koralle selbst gefunden wurde – eine fremde
  Koralle endet vorher in „nicht gefunden".
- `sichtbar` wird in MS-7 nie umgeschaltet; Auswahl und Rückabwicklung (FR-4.4, FR-4.6) sind MS-11.
- Bild am Inserat (FR-4.1 „Bild") kommt mit dem Bild-Upload in MS-9 (NFR-2.5, RLS-Matrix „Inseratbild für Fremde").

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Entität `angebot`, RLS-Matrix, Festlegungen 4, 12, 13
- `src/services/coral.ts`, `src/services/history.ts`, `src/hooks/useTanks.ts`, `src/lib/labels.ts` – bestehendes Muster
- `design.md` – Abschnitt 1, Statusfarben Koralle
