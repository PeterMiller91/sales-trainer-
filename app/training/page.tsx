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
      <p className="mt-1 text-muted">Hier setzt du das Gelernte in die Praxis um.</p>
      <Link href="/training/closer" className="mt-6 block rounded-3xl bg-gradient-to-br from-signal to-[#FF4D2E] p-5 text-white active:scale-[0.98] transition">
        <div className="text-3xl">🎯</div>
        <div className="mt-2 font-display text-xl font-bold">CLOSER-Praxis</div>
        <p className="mt-1 text-white/90">Führe ganze Verkaufsgespräche und formuliere jede Antwort selbst.</p>
        <div className="mt-3 font-semibold">Jetzt üben →</div>
      </Link>
      <h2 className="mt-8 mb-3 font-display text-lg font-bold">Demnächst</h2>
      <div className="space-y-3">
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
