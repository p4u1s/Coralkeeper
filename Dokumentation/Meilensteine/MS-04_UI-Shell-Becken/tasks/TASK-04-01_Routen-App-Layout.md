# TASK-04-01 · Routen für MS-4 und App-Layout

**Status:** erledigt
**Bezug:** NFR-1.2 (Bottom-Navigation), FR-1.1 (Becken-Screens), FR-6.3 (geschützte Routen)
**Voraussetzung:** MS-3 abgeschlossen (TASK-03-10)

---

## Worum geht es

Der Router aus TASK-03-09 kennt nur `/login`, `/register` und `/`. MS-4 braucht die Becken-Screens und einen gemeinsamen
Rahmen für alle Seiten nach der Anmeldung, in den TASK-04-02 die Bottom-Navigation setzt.
Laut `design.md` (Abschnitt 4, Bottom-Navigation) erscheint die Navigation **nicht** in Formularen – Formularseiten
liegen deshalb außerhalb dieses Rahmens.

## Vor dem Start klären

- [x] **Routen.** Aus Abschnitt 7 der alten Requirements v2.2 gehören zu MS-4:

  | Route          | Bildschirm                                          | Mit Navigation |
  | -------------- | --------------------------------------------------- | -------------- |
  | `/`            | Bestand mit geführtem Leerzustand (TASK-04-06)      | ja             |
  | `/becken`      | Beckenliste (TASK-04-04)                            | ja             |
  | `/becken/neu`  | Becken anlegen (TASK-04-05)                         | nein           |
  | `/becken/:id`  | Beckendetail; Diary-Tabs erst in MS-8 (TASK-04-07)  | ja             |

  Für **Becken bearbeiten** nennt die Liste keinen Pfad. Vorschlag: `/becken/:id/bearbeiten` (ohne Navigation).
  → Pfad festlegen.
  → **Entschieden 18.09.2026:** `/becken/:id/bearbeiten`, ohne Navigation.

- [x] **Diary und Profil in der Navigation.** `design.md` legt vier Einträge fest, die Screens dahinter kommen erst in
      MS-8 (Diary) und MS-9 (Profil, FR-6.8). `/profil` steht in der Routenliste, ein eigener Diary-Pfad nicht –
      das Diary liegt laut Liste in `/becken/:id`. Möglichkeiten:
  - **(a)** schlichte Platzhalterseiten `/diary` und `/profil` mit Überschrift und einem Satz
  - **(b)** „Diary" führt bis MS-8 auf die Beckenliste, „Profil" auf eine Platzhalterseite
  → Entscheiden, dabei den Pfad für Diary festlegen, damit er in MS-8 nicht umbenannt werden muss.
  → **Entschieden 18.09.2026:** (a) – Platzhalterseiten `/diary` und `/profil`. `/diary` entspricht dem eigenen
    Diary-Screen im Mockup (über alle Becken), die Diary-Tabs in `/becken/:id` bleiben davon unberührt.

- [x] **„Abmelden".** Sitzt heute auf dem Platzhalter-Bestand (`src/pages/HomeScreen.tsx`), der in TASK-04-06 zum
      echten Bestand wird. Im Mockup liegt „Abmelden" im Profil.
      → Festlegen, ob „Abmelden" (mit Anzeige der E-Mail) auf die Profil-Platzhalterseite umzieht.
      → **Entschieden 18.09.2026:** Ja – „Abmelden" mit Anzeige der E-Mail zieht auf `/profil` um
      (wie Mockup und Routenliste „Profil bearbeiten und Abmelden").

## Schritte

1. [x] **Layout-Komponente** anlegen (z. B. `src/components/AppLayout.tsx`): rendert `<Outlet />` und darunter
       einen Platz für die Bottom-Navigation aus TASK-04-02. Unterer Innenabstand des Inhalts **104 px**
       (64 Navigation + 40 Luft, `design.md` Abschnitt 3), damit nichts hinter der Navigation verschwindet.
2. [x] **Router in `src/App.tsx` erweitern:** innerhalb von `RequireAuth` zwei Gruppen
   - mit `AppLayout`: `/`, `/becken`, `/becken/:id` und die Pfade aus der Diary/Profil-Entscheidung
   - ohne `AppLayout`: `/becken/neu` und der Bearbeiten-Pfad
3. [x] Für jede neue Route vorerst eine **Platzhalterseite** in `src/pages/` mit Überschrift anlegen – die echten
       Inhalte folgen in TASK-04-04 bis 04-08. So ist jede Route sofort erreichbar und prüfbar.
4. [x] „Abmelden" gemäß Entscheidung verschieben.
5. [x] Der Kommentar über dem Router (`// Pfade nach Requirements v2.2, Abschnitt 7`) gilt weiter; für den
       Bearbeiten-Pfad (nicht in Abschnitt 7) die Entscheidung dazuschreiben. Kein zweiter Routenkatalog im Code.

## Fertig, wenn

- [x] Jede neue Route ist mit Session per direkter Adresse erreichbar und zeigt ihre Überschrift
- [x] Ohne Session leitet jede neue Route zur Anmeldung (FR-6.3)
- [x] Formularrouten rendern ohne `AppLayout`
- [x] Unbekannte Pfade landen weiterhin auf `/`
- [x] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- `/becken/neu` und `/becken/:id` kollidieren nicht: React Router bewertet statische Segmente höher als Parameter.
- Links innerhalb der App immer mit `Link`/`NavLink` bzw. `navigate()`, nie mit `<a href="/…">` – sonst fehlt der
  `basename` `/Coralkeeper/` und die Seite lädt komplett neu.
- Direktaufrufe auf GitHub Pages funktionieren über den `404.html`-Fallback aus TASK-03-10, neue Routen brauchen dafür nichts Zusätzliches.

## Quellen

- [`../MS-04_UI-Shell-Becken.md`](../MS-04_UI-Shell-Becken.md) – Umfang „Routing, Bottom-Navigation"
- `15_Modul/Dokumentation_alt/depricated/Claude-Coralkeeper-Requirements-v2.2.md` – Abschnitt 7 (Routenliste)
- `design.md` – Abschnitt 3 (unterer Screen-Abstand), Abschnitt 4 (Bottom-Navigation)
- `Dokumentation/Design/Coralkeeper Design System/Coralkeeper.dc.html` – Screens Diary und Profil
