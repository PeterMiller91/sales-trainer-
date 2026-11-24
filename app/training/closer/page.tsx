import Link from "next/link";
import { scenarios } from "@/lib/exercises";

const steps = [
  ["C", "Clarify", "Warum ist der Kunde hier?"],
  ["L", "Label", "Problem benennen und bestätigen lassen"],
  ["O", "Overview", "Bisherige Versuche durchgehen"],
  ["S", "Sell the Vacation", "Das Ergebnis verkaufen"],
  ["E", "Explain", "Bedenken auflösen"],
  ["R", "Reinforce", "Entscheidung bestärken"],
];

export default function CloserPraxis() {
  return (
    <div>
      <Link href="/training" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Training</Link>
      <h1 className="mt-1 font-display text-3xl font-bold">CLOSER-Praxis</h1>
      <p className="mt-1 text-muted">Führe ein ganzes Verkaufsgespräch. Bei jedem Schritt formulierst du deine Antwort selbst und vergleichst sie mit der Musterantwort.</p>
      <div className="mt-5 grid grid-cols-6 gap-1.5">
        {steps.map(([l, n]) => (
          <div key={l} className="flex flex-col items-center rounded-2xl bg-night-2 py-2">
            <span className="font-display text-xl font-bold text-signal">{l}</span>
            <span className="text-[9px] text-muted">{n.split(" ")[0]}</span>
          </div>
        ))}
      </div>
      <h2 className="mt-8 mb-3 font-display text-lg font-bold">Wähle ein Szenario</h2>
      <div className="space-y-3">
        {scenarios.map((s) => (
          <Link key={s.slug} href={`/training/closer/${s.slug}`} className="block rounded-3xl bg-night-2 p-4 active:scale-[0.98] transition">
            <div className="flex items-center gap-3"><span className="text-3xl">{s.emoji}</span><span className="font-display text-lg font-bold">{s.title}</span></div>
            <p className="mt-2 text-sm text-muted">{s.persona}</p>
            <p className="mt-2 text-xs font-semibold text-signal">6 Schritte · ca. 10 Min. →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
