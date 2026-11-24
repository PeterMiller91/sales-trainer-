# Einwandfrei – Verkaufstrainer

Mobile-first Web-App zum Trainieren von Einwand- und Vorwandbehandlung nach den Prinzipien von Alex Hormozi.

## Was drin ist
- **Akademie**: 6 Lektionen (Einwand vs. Vorwand, Warum Menschen nicht kaufen, Value Equation, CLOSER, Grundhaltung, Vorwände aufdecken) mit Video, Praxis-Aufgabe und Quiz
- **Bibliothek**: 10 Einwände mit Hintergrund, typischem Fehler, Antwort-Skripten und Übung
- **Vorwand-Detektor**: 8 Vorwände mit Aufdeck-Fragen plus Spiel „Einwand oder Vorwand?“
- **Karteikarten**: Leitner-Drill mit 32 Karten
- **CLOSER-Praxis**: ganze Gespräche Schritt für Schritt selbst formulieren
- **KI-Rollenspiel**: KI-Kunde mit echten Einwänden, Auswertung nach CLOSER (Claude Opus 5.5)
- **KI-Feedback** auf jede Freitext-Antwort
- **Konto** mit Name + PIN, Fortschritt wird über Geräte synchronisiert, Profil-Statistik

## Einrichtung auf Netlify
Unter *Project configuration → Environment variables* drei Werte anlegen:

| Variable | Wofür |
|---|---|
| `ANTHROPIC_API_KEY` | Schlüssel von console.anthropic.com, für Rollenspiel und KI-Feedback |
| `INVITE_CODE` | Einladungscode, den man zum Registrieren braucht (schützt vor fremden Konten und KI-Kosten) |
| `AI_DAILY_LIMIT` | optional, KI-Aufrufe pro Person und Tag (Standard 80) |

Danach einmal neu deployen. Konten und Fortschritt liegen in Netlify Blobs, es ist keine weitere Datenbank nötig.

## Entwicklung
```bash
npm install
npm run dev              # Oberfläche auf http://localhost:3000 (ohne Server-Funktionen)
npm run build            # statischer Export nach ./out
npm run test:functions   # Tests der Server-Funktionen (lokaler Blob-Server, simulierte KI)
```

Inhalte: `lib/lessons.ts`, `lib/library.ts`, `lib/exercises.ts`, `lib/videos.ts`. Server-Funktionen: `netlify/functions/`.
