# MS-11 · Vermittlung

## Meilensteinübersicht

| MS | Name | Deckt ab | Aufwand |
| --- | --- | --- | --- |
| MS-1 | Design & Mockup | Vorbereitung Bildschirme und Routing, NFR-1.1 bis NFR-1.8 | ~10 % |
| MS-2 | Datenmodell & Schema-Entwurf *(parallel zu MS-1)* | Abschnitt 3 und 4 der Anforderungsanalyse, NFR-4.7, NFR-4.4 | ~4 % |
| MS-3 | Fundament & Auth | MVP 1 · FR-6.1, FR-6.3, FR-6.10, FR-6.2 | ~8 % |
| MS-4 | UI-Shell & Becken | MVP 2 · FR-1.1, FR-1.15, NFR-1.2 | ~8 % |
| MS-5 | Koralle & Bestand (Grundgerüst) | MVP 3 · FR-1.2, FR-1.14 | ~11 % |
| MS-6 | Detailseite: Steckbrief & Historie | MVP 4 + 5 · FR-2.1, FR-2.2, FR-3.3, FR-3.4, FR-3.5 | ~11 % |
| MS-7 | Ableger & Inserat | MVP 6 · FR-1.7, FR-3.6, FR-4.1, FR-4.2 | ~9 % |
| MS-8 | Diary | MVP 7 · FR-5.1, FR-5.3, FR-5.4, FR-5.10 | ~10 % |
| 🚦 | GATE: MVP-Abnahme | Abnahmekriterien, Abschnitt 7 | — |
| MS-9 | Bestand nutzbar & Profil | FR-1.3 bis FR-1.6, FR-1.9, FR-1.10, FR-2.3, FR-2.4, FR-6.8 | ~9 % |
| MS-10 | Herkunft, Historie & Diary-Ausbau | FR-3.1, FR-3.2, FR-3.7, FR-5.2 | ~7 % |
| **➤ MS-11** | **Vermittlung** *(optional, Abbruchkriterium)* | **FR-4.3 bis FR-4.7** | **~8 %** |
| MS-12 | Feinschliff & Abgabe | NFR-4.5, NFR-2.1 bis NFR-2.4 | ~5 % |

Der Aufwand ist als relativer Anteil am Gesamtprojekt angegeben, nicht in Wochen – so lässt er sich auf jeden Zeitrahmen abbilden. Bis zum MVP-Gate sind rund **71 %** verplant.

---

## Immer mitgeltend

Diese Anforderungen sind Teil der Definition of Done von MS-11 und werden nicht auf einen späteren Meilenstein verschoben:

| ID | Gilt auch in MS-11 |
| --- | --- |
| FR-6.2 | RLS auf jeder neu angelegten Tabelle, kein Zugriff auf fremde Daten |
| FR-6.4 | Lade-, Leer- und Fehlerzustände in jeder neuen Liste und jedem neuen Formular |
| FR-6.5 | Bestätigungsdialog vor jeder löschenden Aktion |
| FR-6.6 | Formularvalidierung mit Feldfehlern |
| NFR-1.3 | Trefferflächen ≥ 44 px, keine Hover-abhängige Funktion |
| NFR-1.4 | Kein Icon ohne Textalternative, sichtbare Labels, Kontrast WCAG 2.1 AA |
| NFR-1.6 | Nutzbar ab 360 px Breite |
| NFR-4.1 | TypeScript Strict, kein `any` |
| NFR-4.3 | Datenzugriff ausschließlich über `src/services/*` |

---

## MS-11 im Detail

*(optional)*

**Umfang:** Öffentliche Inseratsliste mit Filter (FR-4.3); Interessensanfrage (FR-4.3); Auswahl einer Anfrage, Inserat wird unsichtbar (FR-4.4); gegenseitiger Kontaktaustausch (FR-4.5, NFR-3.3); Rückabwicklung (FR-4.6); Abschluss mit Statuswechsel, Abgabedatensatz, Historieneintrag und Löschen des Inserats (FR-4.7).

> **Abbruchkriterium (bereits in der Anforderungsanalyse festgelegt):** Ist MS-11 zeitlich nicht sicher erreichbar, bleibt es beim Inserieren nach FR-4.1 und FR-4.2. Die Kontaktaufnahme läuft dann offline; Status und Historie bleiben trotzdem vollständig. Alle Anforderungen dieses Meilensteins haben Priorität **S**.

> **Offen (vermerkt am 28.09.2026, TASK-07-01):** Beim Abschluss (FR-4.7) entsteht beim Interessenten keine Koralle.
> Gewünscht: Der neue Besitzer hat die Koralle mit dem Übergabetag als Erwerbsdatum im Bestand. Bis dahin legt er sie
> selbst nach FR-1.2 an. Eine Übernahme durch die App ist eine neue Anforderung: Der Züchter darf per RLS keine Koralle
> für Fremde anlegen, und der Interessent kann nach dem Abschluss weder `koralle` noch `abgabe` des Züchters lesen
> (das Inserat ist gelöscht). In MS-11 erneut vorschlagen; umgesetzt wird es erst in MS-12 (Feinschliff).

> **Notiz (vermerkt am 29.09.2026, TASK-07-06):** Für die öffentliche Inseratsliste (FR-4.3) wäre ein fünfter Eintrag
> „Inserate" oder „Börse" in der Bottom-Navigation gut, mit einem kleinen Hammer-Symbol – rein symbolisch für „Börse",
> keine Versteigerung. Nach dem Gate muss es einen Ort geben, an dem **alle** Inserate sichtbar sind, aufgeteilt in
> **eigene** Inserate und **Angebote anderer Nutzer**. FR-4.3 deckt nur die öffentliche Liste ab; die Aufteilung ist eine
> Erweiterung. Offen: MS-11 ist optional (Abbruchkriterium) – fällt MS-11 weg, gäbe es diesen Ort nicht.
> `design.md` (Abschnitt 4, Bottom-Navigation) legt bisher **vier** Einträge
> fest (Bestand · Becken · Diary · Profil) und hat Vorrang – vor der Umsetzung also erst `design.md` anpassen und bei
> 360 px Breite prüfen, ob fünf Einträge mit Textlabel noch passen (NFR-1.3, NFR-1.4, NFR-1.6).

> **Aus MS-9 verschoben (TASK-09-01, 02.10.2026):** Bild am Inserat (FR-4.1 „Bild"). `angebot` hat keine Bildspalte,
> gemeint ist vermutlich das Primärbild der Koralle (TASK-02-02). Erst mit der öffentlichen Inseratsliste (FR-4.3) sehen
> Fremde Inserate. Der Bucket ist privat (ER-Modell, Festlegung 20) – Fremde brauchen eine eigene Lesefreigabe für das
> Bild der inserierten Koralle (ER-Modell, offener Punkt 7; RLS-Matrix `bild_dokument`).
