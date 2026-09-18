# TASK-03-07 · Datenbanktypen generieren und Service-Schicht anlegen

**Status:** erledigt
**Bezug:** NFR-4.4 (Typen aus dem Schema generiert), NFR-4.3 (Datenzugriff nur über `src/services/*`, Serverstate über eigene Hooks), NFR-4.1 (kein `any`)
**Voraussetzung:** TASK-03-02 (Client), TASK-03-03 bis 03-06 (Schema steht)

---

## Worum geht es

Zwei Grundlagen, auf denen jeder spätere Meilenstein aufbaut:

1. **Generierte Typen.** TypeScript soll wissen, welche Tabellen und Spalten es gibt. Diese Typen werden aus der
   Datenbank erzeugt, nicht von Hand geschrieben (NFR-4.4). Ändert sich das Schema, wird neu generiert.
2. **Die Service-Schicht.** Komponenten sprechen nie direkt mit Supabase. Dazwischen liegen kleine Funktionen in
   `src/services/`, darüber eigene React-Hooks, die Lade- und Fehlerzustand verwalten (NFR-4.3).
   Keine Zusatzbibliothek wie TanStack Query.

„Skelett" heißt hier: Struktur und Muster stehen, gefüllt wird nur, was MS-3 braucht. Keine leeren Dateien für spätere Meilensteine.

## Vor dem Start klären

- [x] **Wie melden Services Fehler?** Diese Entscheidung prägt jede spätere Service-Funktion:
  - **(a) Werfen:** Service gibt die Daten zurück oder wirft einen `Error` mit deutscher Meldung; der Hook fängt ihn und setzt den Fehlerzustand.
  - **(b) Zurückgeben:** Service gibt immer `{ data, error }` zurück, wie Supabase selbst.

  Empfehlung: (a) – die Komponenten und Hooks bleiben kürzer, und ein vergessener Fehlerfall fällt auf statt still durchzurutschen.
  → **Entschieden:** (a) Werfen (15.09.2026).

- [x] **Ablageort der generierten Typen:** Vorschlag `src/types/database.types.ts` (übliche Supabase-Konvention).

- [x] **`NOT NULL` für `angebot.koralle_id` und `bild_dokument.storage_pfad`?** Offen aus TASK-02-03 und TASK-02-05; vor dem Generieren
      der Typen zu klären, weil die Typen die Nullbarkeit übernehmen.
      → **Entschieden:** beide `NOT NULL` (15.09.2026). Datenbank, SQL-Quelle und ER-Modell angepasst.

## Schritte

### A · Typen generieren

1. [x] **Einmalig bei der Supabase CLI anmelden:** `npx supabase login` (öffnet den Browser, erzeugt ein Zugriffstoken lokal).
       → Geprüft am 15.09.2026: CLI 2.117.0 ist angemeldet.
2. [x] **Projekt-Referenz nachsehen:** Das ist der Teil `<projekt-ref>` in der Projekt-URL `https://<projekt-ref>.supabase.co`.
       → `ihgpghcilgfdvilcaqbi` (Projekt „Coralkeeper“)
3. [x] **Typen erzeugen:**

   ```bash
   npx supabase gen types typescript --project-id <projekt-ref> --schema public > src/types/database.types.ts
   ```

4. [x] **Als npm-Skript festhalten**, damit das Neu-Generieren nach jeder Schemaänderung ein Befehl ist, z. B. `"gen:types"` in `package.json`.
5. [x] **Kontrolle:** Die Datei enthält alle zehn Tabellen und die elf Aufzählungstypen aus TASK-03-03.
       → Geprüft am 15.09.2026: stimmt.
6. [x] **Client typisieren:** In `src/services/supabase.ts` `createClient<Database>(…)` verwenden.

### B · Service-Schicht

7. [x] **Ordner und Zuständigkeiten festlegen.** Bezeichner im Code englisch, Tabellen- und Spaltennamen bleiben deutsch, wie sie in der Datenbank heißen.

   ```text
   src/services/supabase.ts   Client (aus TASK-03-02) – einzige Stelle mit createClient
   src/services/auth.ts       Registrieren, Anmelden, Abmelden, Session (Inhalt in TASK-03-08)
   src/services/profile.ts    Eigenes Profil lesen
   src/hooks/                 Eigene Hooks über den Services (Alias @/hooks laut components.json)
   ```

   → Angelegt; `auth.ts` enthält bisher nur einen Kommentar, `src/hooks/` ist leer – Inhalt folgt in TASK-03-08.

8. [x] **Hilfstypen nutzen statt nachbauen:** Die generierte Datei liefert `Tables<'profil'>`, `TablesInsert<…>`, `TablesUpdate<…>` und `Enums<…>`.
       Eigene Typen nur, wo die UI etwas anderes braucht als die Tabelle.
9. [x] **Erste Service-Funktion als Muster:** `getOwnProfile()` in `profile.ts` – liest das Profil des angemeldeten Nutzers.
       Sie zeigt das gewählte Fehlermuster und dient allen späteren Services als Vorlage.
10. [x] **Regel absichern (optional, empfohlen):** Eine ESLint-Regel `no-restricted-imports`, die den Import von
        `@supabase/supabase-js` und `@/services/supabase` außerhalb von `src/services/` verbietet. So fällt ein Verstoß gegen NFR-4.3 sofort auf.
        → In `eslint.config.js`, deckt auch Importe mit `.ts`-Endung ab. Geprüft am 15.09.2026 per stdin-Test.
11. [x] **Kurze Konvention festhalten** – drei, vier Sätze als Kopfkommentar in `src/services/supabase.ts`
        oder als eigener Abschnitt in einer Doku-Datei: Wo liegen Services, wie melden sie Fehler, wer darf den Client importieren.
        → Als Kopfkommentar in `src/services/supabase.ts`.

## Fertig, wenn

- [x] `src/types/database.types.ts` ist generiert und enthält alle Tabellen und Aufzählungstypen
- [x] Ein npm-Skript erzeugt die Typen neu
- [x] Der Client ist mit `Database` typisiert
- [x] Außerhalb von `src/services/` importiert keine Datei den Supabase-Client
      (Kontrolle: Suche nach `supabase` außerhalb von `src/services/` und `src/types/` liefert keinen Treffer)
      → Einzige Treffer: die Variablennamen `VITE_SUPABASE_*` in `src/vite-env.d.ts` (kein Import).
- [x] Kein `any` im eigenen Code; `npm run build` und `npm run lint` laufen fehlerfrei

## Hinweise

- **Die generierte Datei nie von Hand bearbeiten.** Änderungen gehen beim nächsten Generieren verloren.
- Nach **jeder** Schemaänderung (auch in späteren Meilensteinen) neu generieren – sonst passen Typen und Datenbank nicht mehr zusammen.
- Ob die generierte Datei vom Lint ausgenommen werden sollte, zeigt sich beim ersten Lint-Lauf.
  → Erster Lauf am 15.09.2026: fehlerfrei, keine Ausnahme nötig.

## Quellen

- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-4.1, NFR-4.3, NFR-4.4
- `CLAUDE.md` – Harte Regel NFR-4.3; Konvention „englische Bezeichner im Code"
- [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) – Umfang, fünfter Punkt
