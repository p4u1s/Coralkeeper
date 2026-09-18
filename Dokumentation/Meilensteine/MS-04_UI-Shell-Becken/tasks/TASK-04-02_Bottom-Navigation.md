# TASK-04-02 · Bottom-Navigation

**Status:** offen
**Bezug:** NFR-1.2 (Kernfunktionen in höchstens drei Interaktionen), NFR-1.3, NFR-1.4, NFR-1.6
**Voraussetzung:** TASK-04-01

---

## Worum geht es

Die vier Hauptbereiche **Bestand · Becken · Diary · Profil** sind von jedem Screen nach der Anmeldung mit einem Tipp
erreichbar (NFR-1.2). Aussehen und Maße sind in `design.md` Abschnitt 4 vollständig festgelegt.

## Vor dem Start klären

- [ ] **Icons.** Das Mockup nutzt eigene SVGs; `components.json` setzt `lucide` als Icon-Bibliothek.
      Vorschlag: lucide-Icons, die den Mockup-Symbolen nahekommen (z. B. `LayoutGrid`, `Box`/`Container`,
      `NotebookText`, `User`). Alternative: die vier SVGs aus `Coralkeeper.dc.html` übernehmen.
      → Entscheiden.

## Schritte

1. [ ] Komponente `BottomNav` (z. B. `src/components/BottomNav.tsx`) mit `<nav aria-label="Hauptnavigation">`
       und vier `NavLink`-Einträgen auf die Pfade aus TASK-04-01.
2. [ ] Jeder Eintrag: Icon 20 px mit `aria-hidden="true"`, darunter Textlabel 12/16/500 (`text-caption font-medium`).
       Aktiv `accent`, inaktiv `ink-2` – über den `isActive`-Wert von `NavLink`.
3. [ ] **Aktiv-Logik prüfen:**
   - „Bestand" (`/`) mit `end`, sonst ist der Eintrag auf jeder Seite aktiv
   - „Becken" muss auch auf `/becken/:id` aktiv sein – `NavLink` erledigt das ohne `end` von selbst
4. [ ] **Position und Maße:** `fixed` am unteren Rand, Höhe 64, Fläche `surface`, Oberkante 1 px `border`.
       Die vier Einträge teilen sich die Breite gleichmäßig (`flex-1 min-w-0`), jeder Eintrag volle Höhe.
5. [ ] **Breite am Desktop:** `#root` hat `max-w-md`, das wirkt auf `fixed`-Elemente nicht. Die Navigation selbst
       auf dieselbe Breite begrenzen und zentrieren (z. B. `inset-x-0 mx-auto max-w-md`).
6. [ ] `BottomNav` in `AppLayout` aus TASK-04-01 einsetzen.
7. [ ] Sichtbarer Fokusrahmen für Tastaturbedienung (`focus-visible`).

## Fertig, wenn

- [ ] Vier Einträge mit Icon **und** Text, der aktive Eintrag ist farbig hervorgehoben (NFR-1.4)
- [ ] Auf `/becken/:id` ist „Becken" aktiv, auf `/` nur „Bestand"
- [ ] Jeder Eintrag ist mindestens 44 × 44 px groß (NFR-1.3); bei 360 px Breite kein Umbruch der Labels (NFR-1.6)
- [ ] Die Navigation fehlt auf Anmeldung, Registrierung und den Formularseiten
- [ ] Der letzte Inhalt einer langen Seite lässt sich über die Navigation hinaus scrollen und ist lesbar
- [ ] Am Desktop ist die Navigation so breit wie die Inhaltsspalte
- [ ] Mit Tab erreichbar, aktiver Eintrag hat `aria-current="page"` (setzt `NavLink` automatisch)
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Keine Hover-Effekte als einzige Rückmeldung (NFR-1.3) – der Aktivzustand kommt allein aus der Route.
- Verdeckt auf dem iPhone die Home-Leiste die Labels, hilft ein unterer Innenabstand mit `env(safe-area-inset-bottom)`.
  Nur umsetzen, wenn es am echten Gerät auffällt.

## Quellen

- `design.md` – Abschnitt 1 (Farben), Abschnitt 3 (Bottom-Navigation Höhe 64), Abschnitt 4 (Bottom-Navigation)
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Block „BOTTOM NAVIGATION"
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – NFR-1.2, NFR-1.3, NFR-1.4, NFR-1.6
