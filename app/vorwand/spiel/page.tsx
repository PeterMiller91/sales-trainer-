"use client";
import Link from "next/link";
import { useState } from "react";
import { detectorItems } from "@/lib/library";
import { recordStat } from "@/lib/progress";

export default function Spiel() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= detectorItems.length;
  const item = detectorItems[i];

  function choose(t: "Einwand" | "Vorwand") {
    if (pick) return;
    setPick(t);
    if (t === item.type) setScore((s) => s + 1);
  }
  function next() {
    const n = i + 1;
    setI(n); setPick(null);
    if (n >= detectorItems.length) recordStat("detector", { score: score, total: detectorItems.length });
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-night-2 p-6 text-center">
        <div className="text-5xl">{score >= 10 ? "🕵️" : "🔍"}</div>
        <div className="mt-3 font-display text-2xl font-bold">{score} von {detectorItems.length} erkannt</div>
        <p className="mt-1 text-muted">{score >= 10 ? "Du hast ein feines Gespür für Ausreden." : "Übung macht den Detektiv. Nochmal?"}</p>
        <button onClick={() => { setI(0); setScore(0); }} className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white">Nochmal spielen</button>
        <Link href="/vorwand" className="mt-2 flex min-h-12 items-center justify-center rounded-2xl bg-night-3 font-semibold">Zum Vorwand-Detektor</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/vorwand" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Vorwand-Detektor</Link>
      <div className="mt-2 flex items-center justify-between text-sm text-muted"><span>Satz {i + 1} / {detectorItems.length}</span><span>✓ {score}</span></div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-night-3"><div className="h-full bg-signal transition-all" style={{ width: `${(i / detectorItems.length) * 100}%` }} /></div>
      <div className="mt-8 rounded-3xl rounded-bl-md bg-night-3 px-5 py-6 text-xl leading-snug">{item.text}</div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {(["Einwand", "Vorwand"] as const).map((t) => {
          let cls = "bg-night-2";
          if (pick) cls = t === item.type ? "bg-mint/20 border-mint" : t === pick ? "bg-red-500/15 border-red-400" : "bg-night-2 opacity-50";
          return <button key={t} onClick={() => choose(t)} className={`min-h-16 rounded-2xl border-2 border-transparent font-display text-lg font-bold transition active:scale-[0.97] ${cls}`}>{t}</button>;
        })}
      </div>
      {pick && (
        <div className="mt-4">
          <p className={`rounded-2xl p-4 text-sm ${pick === item.type ? "bg-mint/10 text-mint" : "bg-red-500/10 text-red-300"}`}><strong>{pick === item.type ? "Richtig! " : `Eher ein ${item.type}. `}</strong>{item.why}</p>
          <button onClick={next} className="mt-3 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white">Weiter</button>
        </div>
      )}
    </div>
  );
}
