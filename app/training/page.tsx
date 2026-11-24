import Link from "next/link";

const items = [
  { href: "/training/rollenspiel", emoji: "🤖", t: "KI-Rollenspiel", d: "Ein KI-Kunde bringt echte Einwände. Am Ende gibt's eine Auswertung nach CLOSER.", hero: true },
  { href: "/training/closer", emoji: "🎯", t: "CLOSER-Praxis", d: "Ganze Gespräche Schritt für Schritt selbst formulieren." },
  { href: "/karteikarten", emoji: "🃏", t: "Karteikarten-Drill", d: "„Kunde sagt X“: 5 Minuten am Tag." },
  { href: "/vorwand/spiel", emoji: "🔍", t: "Einwand oder Vorwand?", d: "Erkennst du die Ausrede?" },
  { href: "/bibliothek", emoji: "🛡️", t: "Einwand-Bibliothek", d: "10 Einwände mit Skripten und Übungen." },
];

export default function Training() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Training</h1>
      <p className="mt-1 text-muted">Hier setzt du das Gelernte in die Praxis um.</p>
      <div className="mt-6 space-y-3">
        {items.map((s) => (
          <Link key={s.href} href={s.href} className={`flex items-center gap-4 rounded-3xl p-4 active:scale-[0.98] transition ${s.hero ? "bg-gradient-to-br from-signal to-[#FF4D2E] text-white" : "bg-night-2"}`}>
            <span className="text-3xl">{s.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-bold">{s.t}</span>
              <span className={`block text-sm ${s.hero ? "text-white/90" : "text-muted"}`}>{s.d}</span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
