# TASK-03-02 · Supabase-Projekt, Umgebungsvariablen und Client

**Status:** erledigt
**Bezug:** NFR-3.2 (nur öffentlicher Schlüssel im Frontend), NFR-4.3 (Datenzugriff nur über `src/services/*`)
**Voraussetzung:** TASK-03-01

---

## Worum geht es

Die App soll mit dem bestehenden Supabase-Projekt sprechen können. Dazu braucht es drei Dinge:
die Zugangsdaten als Umgebungsvariablen, die Supabase-Bibliothek und **genau eine** Stelle im Code,
an der der Supabase-Client erzeugt wird. Diese Stelle liegt in `src/services/` – Komponenten
importieren den Client nie direkt (NFR-4.3).

## Vor dem Start klären

- [x] Im Supabase-Dashboard nachsehen, welche Art von öffentlichem Schlüssel das Projekt anbietet:
      den klassischen **anon key** oder den neueren **publishable key** (`sb_publishable_…`). Beide sind für das Frontend gedacht.
      **Niemals** den `service_role`- bzw. `secret`-Schlüssel verwenden.
      → **Entschieden:** publishable key (`sb_publishable_…`), Variable `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Schritte

1. [x] **Zugangsdaten holen:** Im Supabase-Dashboard unter den Projekteinstellungen (Bereich „API" bzw. „API Keys")
       die Projekt-URL und den öffentlichen Schlüssel kopieren.
2. [x] **Bibliothek installieren:** `npm install @supabase/supabase-js`.
3. [x] **Lokale Umgebungsdatei anlegen:** `.env.local` im Projektwurzel. Vite gibt nur Variablen mit Präfix `VITE_` an den Browser weiter.

   ```env
   VITE_SUPABASE_URL=https://<projekt-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<sb_publishable_…>
   ```

4. [x] **Prüfen, dass die Datei nicht ins Repo gelangt:** `.gitignore` enthält `*.local` – damit ist `.env.local` ausgeschlossen (am 11.09.2026 geprüft).
5. [x] **Vorlage ins Repo:** `.env.example` mit denselben Variablennamen und **leeren** Werten anlegen.
       Sie dokumentiert, welche Variablen gebraucht werden (auch für das Deployment in TASK-03-10).
6. [x] **Variablen typisieren:** In einer Typdeklaration (z. B. `src/vite-env.d.ts`) `ImportMetaEnv` um
       `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` als `string` erweitern. So meldet TypeScript Tippfehler im Variablennamen.
7. [x] **Client-Modul anlegen:** `src/services/supabase.ts`
   - liest beide Variablen aus `import.meta.env`
   - bricht mit einer verständlichen Fehlermeldung ab, wenn eine fehlt (statt später mit einem kryptischen Netzwerkfehler)
   - erzeugt den Client mit `createClient(...)` und exportiert ihn
   - den Typparameter `createClient<Database>` ergänzt TASK-03-07, sobald die Typen generiert sind
8. [x] **Kurztest:** Einmal `supabase.auth.getSession()` aufrufen (z. B. vorübergehend in `main.tsx`) –
       erwartet ist `session: null` ohne Fehler. Den Testaufruf danach wieder entfernen.
       Nachweis: [`TASK-03-02_Screenshot_Punkt-8.jpg`](TASK-03-02_Screenshot_Punkt-8.jpg)

## Fertig, wenn

- [x] `@supabase/supabase-js` steht in `package.json`
- [x] `.env.local` existiert lokal, `.env.example` liegt im Repo, **kein** Schlüssel steht in einer versionierten Datei
- [x] Der Supabase-Client wird ausschließlich in `src/services/supabase.ts` erzeugt
- [x] Fehlende Umgebungsvariablen führen zu einer klaren Fehlermeldung
- [x] `npm run build` und `npm run lint` laufen fehlerfrei

## Hinweise

- **Der öffentliche Schlüssel ist nicht geheim.** Er landet im gebauten JavaScript und ist für jeden sichtbar.
  Geschützt werden die Daten ausschließlich durch RLS (TASK-03-05). Deshalb ist NFR-3.2 so formuliert.
- Nach dem Anlegen oder Ändern von `.env.local` den Dev-Server neu starten – Vite liest die Datei nur beim Start.
- Für GitHub Pages werden dieselben Variablen in TASK-03-10 als Repository-Secrets hinterlegt.

## Quellen

- [`../MS-03_Fundament-Auth.md`](../MS-03_Fundament-Auth.md) – Umfang, zweiter Punkt
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-3.2, NFR-4.3
