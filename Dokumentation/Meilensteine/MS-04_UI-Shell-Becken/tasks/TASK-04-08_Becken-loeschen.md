# TASK-04-08 · Becken löschen mit Bestätigung und Löschsperre

**Status:** offen
**Bezug:** FR-1.1 (Löschsperre bei zugeordneten Korallen), FR-6.5 (Bestätigungsdialog), NFR-4.7, ER-Modell Festlegung 1
**Voraussetzung:** TASK-04-07

---

## Worum geht es

Ein Becken lässt sich vom Beckendetail aus löschen – aber nur nach Bestätigung (FR-6.5) und nur, wenn ihm keine
Korallen mehr zugeordnet sind (FR-1.1). Die Sperre sitzt in der Datenbank (`RESTRICT`); die Oberfläche macht sie
verständlich, je nach Entscheidung aus TASK-04-03 vorher oder nachher.

## Vor dem Start klären

- [ ] **Dialogtext.** Laut ER-Modell hängen `messwert` und `becken_ereignis` per `ON DELETE CASCADE` am Becken –
      mit dem Becken verschwinden also alle Diary-Einträge. Vorschlag:
      Titel „Becken löschen?", Text „„{Name}" und alle Diary-Einträge dieses Beckens werden endgültig gelöscht."
      → Wortlaut festlegen.

## Schritte

1. [ ] Alert-Dialog per shadcn hinzufügen (`npx shadcn@latest add alert-dialog`) und an `design.md` anpassen:
       Fläche `surface`, Rahmen, Radius 14, keine Schatten, Buttons 48 hoch.
2. [ ] Im Beckendetail Button „Löschen" (Sekundärbutton mit Schrift in `error`, wie „Abmelden").
3. [ ] Dialog mit „Abbrechen" und „Löschen"; „Abbrechen" ist die sichere Standardaktion.
4. [ ] Bestätigen ruft `deleteTank`; während des Löschens beide Buttons deaktiviert, Beschriftung „Wird gelöscht …".
5. [ ] Erfolg → zur Beckenliste. Fehler → Meldung sichtbar lassen (im Dialog oder auf der Seite), Becken bleibt bestehen.
6. [ ] Bei Entscheidung (b) aus TASK-04-03: Enthält das Becken Korallen, statt „Löschen" einen Hinweis anzeigen,
       dass zuerst die Korallen umgesetzt oder gelöscht werden müssen.

## Fertig, wenn

- [ ] Ohne Bestätigung wird nichts gelöscht; „Abbrechen" und `Esc` schließen den Dialog folgenlos (FR-6.5)
- [ ] Ein leeres Becken wird gelöscht und fehlt danach in der Beckenliste
- [ ] **Löschsperre:** Als Testnutzer A lässt sich Becken `aaaaaaaa-0000-0000-0000-000000000001` (enthält die
      Testkorallen …02 und …03) **nicht** löschen, es erscheint die verständliche Meldung (FR-1.1)
- [ ] Der Dialog ist mit der Tastatur bedienbar, der Fokus bleibt im Dialog und kehrt danach zum Auslöser zurück
- [ ] Buttons im Dialog mindestens 44 px hoch; bei 360 px Breite passt der Dialog ohne waagerechtes Scrollen
- [ ] `npm run build`, `npm run lint`, `npm run format` ohne Fehler

## Hinweise

- Die Testdaten von A (Becken …01, Korallen …02/…03) bleiben unangetastet – sie werden für die RLS-Wiederholung in MS-7 gebraucht.
  Für den Erfolgsfall ein eigenes, leeres Becken anlegen und löschen.
- Der Dialog ist die Vorlage für alle späteren Löschaktionen (Koralle, Diary-Einträge) – deshalb hier sauber an `design.md` angleichen.

## Quellen

- `Dokumentation/Datenmodell/Coralkeeper-ER-Modell-v1.0.md` – Festlegung 1, Tabelle der Löschregeln
- `Dokumentation/Requirements/Coralkeeper-Requirements-v2.2.md` – FR-1.1, FR-6.5, NFR-4.7
- `design.md` – Abschnitt 1 (Fehlerfarbe), Abschnitt 3 (Radien, keine Schatten)
