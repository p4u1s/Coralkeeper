# MS-6 · Detailseite: Steckbrief & Historie

## Meilensteinübersicht

| MS | Name | Deckt ab | Aufwand |
| --- | --- | --- | --- |
| MS-1 | Design & Mockup | Vorbereitung Bildschirme und Routing, NFR-1.1 bis NFR-1.8 | ~10 % |
| MS-2 | Datenmodell & Schema-Entwurf *(parallel zu MS-1)* | Abschnitt 3 und 4 der Anforderungsanalyse, NFR-4.7, NFR-4.4 | ~4 % |
| MS-3 | Fundament & Auth | MVP 1 · FR-6.1, FR-6.3, FR-6.10, FR-6.2 | ~8 % |
| MS-4 | UI-Shell & Becken | MVP 2 · FR-1.1, FR-1.15, NFR-1.2 | ~8 % |
| MS-5 | Koralle & Bestand (Grundgerüst) | MVP 3 · FR-1.2, FR-1.14 | ~11 % |
| **➤ MS-6** | **Detailseite: Steckbrief & Historie** | **MVP 4 + 5 · FR-2.1, FR-2.2, FR-3.3, FR-3.4, FR-3.5** | **~11 %** |
| MS-7 | Ableger & Inserat | MVP 6 · FR-1.7, FR-3.6, FR-4.1, FR-4.2 | ~9 % |
| MS-8 | Diary | MVP 7 · FR-5.1, FR-5.3, FR-5.4, FR-5.10 | ~10 % |
| 🚦 | GATE: MVP-Abnahme | Abnahmekriterien, Abschnitt 7 | — |
| MS-9 | Bestand nutzbar & Profil | FR-1.3 bis FR-1.6, FR-1.9, FR-1.10, FR-2.3, FR-2.4, FR-6.8 | ~9 % |
| MS-10 | Herkunft, Historie & Diary-Ausbau | FR-3.1, FR-3.2, FR-3.7, FR-5.2 | ~7 % |
| MS-11 | Vermittlung *(optional, Abbruchkriterium)* | FR-4.3 bis FR-4.7 | ~8 % |
| MS-12 | Feinschliff & Abgabe | NFR-4.5, NFR-2.1 bis NFR-2.4 | ~5 % |

Der Aufwand ist als relativer Anteil am Gesamtprojekt angegeben, nicht in Wochen – so lässt er sich auf jeden Zeitrahmen abbilden. Bis zum MVP-Gate sind rund **71 %** verplant.

---

## Immer mitgeltend

Diese Anforderungen sind Teil der Definition of Done von MS-6 und werden nicht auf einen späteren Meilenstein verschoben:

| ID | Gilt auch in MS-6 |
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

## MS-6 im Detail

**Ziel:** Die Detailseite trägt die beiden fachlichen Kernfunktionen.

**Umfang:** Detailseite mit Tab-Navigation; Steckbrief anlegen und ändern, alle Felder optional (FR-2.1, FR-2.2); manueller Journaleintrag mit Datum und Freitext (FR-3.5); Systemeinträge bei Anlage und Statuswechsel (FR-3.4).

**Definition of Done:** Die Einträge der Bestandsliste führen auf die Detailseite der Koralle; ein gespeicherter Historieneintrag ist nachweislich weder bearbeitbar noch löschbar (FR-3.3); die Anlage der Koralle steht als Systemeintrag in derselben Historie.

> MS-6 fasst die MVP-Schritte 4 und 5 zusammen, weil beide dieselbe Detailseite bauen. Falls kleinere Schritte gewünscht sind, ist das die naheliegende Teilungsstelle.
