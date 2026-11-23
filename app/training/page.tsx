import Link from "next/link";

const soon = [
  { t: "Einwand-Bibliothek", d: "Die großen Einwände mit Hintergrund und Antwort-Skripten.", phase: "Phase 2" },
  { t: "Vorwand-Detektor", d: "Ausreden erkennen und mit Fragen zum echten Grund kommen.", phase: "Phase 2" },
  { t: "Karteikarten-Drill", d: "„Kunde sagt X“: 5 Minuten am Tag, perfekt fürs Handy.", phase: "Phase 2" },
  { t: "KI-Rollenspiel", d: "Ein KI-Kunde bringt Einwände, du bekommst eine Bewertung.", phase: "Phase 3" },
];

export default function Training() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Training</h1>
      <p className="mt-1 text-muted">Hier wird bald trainiert. Bis dahin: Starte mit der Akademie.</p>
      <div className="mt-6 space-y-3">
        {soon.map((s) => (
          <div key={s.t} className="rounded-3xl bg-night-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-display font-bold">{s.t}</span>
              <span className="rounded-full bg-night-3 px-2 py-0.5 text-xs text-gold">{s.phase}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{s.d}</p>
          </div>
        ))}
      </div>
      <Link href="/akademie" className="mt-6 flex min-h-12 items-center justify-center rounded-2xl bg-signal font-semibold text-white active:scale-[0.98] transition">Zur Akademie</Link>
    </div>
  );
}
