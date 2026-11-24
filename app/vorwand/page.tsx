import Link from "next/link";
import { pretexts } from "@/lib/library";

export default function Vorwand() {
  return (
    <div>
      <Link href="/bibliothek" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Bibliothek</Link>
      <h1 className="mt-1 font-display text-3xl font-bold">Vorwand-Detektor</h1>
      <p className="mt-1 text-muted">Typische Ausreden, was oft dahintersteckt und welche Fragen den echten Grund ans Licht holen.</p>
      <Link href="/vorwand/spiel" className="mt-5 block rounded-3xl bg-gradient-to-br from-signal to-[#FF4D2E] p-5 text-white active:scale-[0.98] transition">
        <div className="font-display text-xl font-bold">Spiel: Einwand oder Vorwand?</div>
        <p className="mt-1 text-white/90">{`12 Kundensätze. Erkennst du den Unterschied?`}</p>
      </Link>
      <div className="mt-6 space-y-3">
        {pretexts.map((p) => (
          <details key={p.slug} className="group rounded-3xl bg-night-2 p-4">
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 font-display text-lg font-bold">
              <span>„{p.quote}“</span><span className="text-muted transition group-open:rotate-90">›</span>
            </summary>
            <div className="mt-3 text-sm font-bold uppercase tracking-wider text-muted">Oft steckt dahinter</div>
            <ul className="mt-1 space-y-1">{p.realReasons.map((r) => <li key={r} className="flex gap-2"><span className="text-gold">•</span>{r}</li>)}</ul>
            <div className="mt-3 text-sm font-bold uppercase tracking-wider text-muted">Aufdeck-Fragen</div>
            <div className="mt-1 space-y-2">{p.questions.map((q) => <p key={q} className="rounded-2xl rounded-br-md bg-signal/15 p-3">{q}</p>)}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
