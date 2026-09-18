/*
/ Einzige Stelle, an der der Supabase-Client entsteht (NFR-4.3).
/ - Datenzugriff nur über Funktionen in src/services/*; Komponenten und Hooks
/   importieren weder diesen Client noch @supabase/*.
/ - Services geben Daten zurück oder werfen einen Error mit deutscher Meldung
/   (Original als `cause`); der aufrufende Hook fängt ihn und setzt den Fehlerzustand.
/ - Typen: src/types/database.types.ts, neu erzeugen mit `npm run gen:types`, nie von Hand ändern.
*/

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types.ts"

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error(
    "Supabase ist nicht konfiguriert: VITE_SUPABASE_URL und " +
      "VITE_SUPABASE_PUBLISHABLE_KEY müssen in .env.local gesetzt sein. " +
      "Danach den Dev-Server neu starten."
  )
}

export const supabase = createClient<Database>(url, publishableKey)
