"use client";
import Link from "next/link";
import { useState } from "react";
import { getScenario } from "@/lib/exercises";
import { useAnswers, type Rating } from "@/lib/answers";
import { FreeTextExercise } from "./FreeTextExercise";

export function ScenarioRunner({ slug }: { slug: string }) {
  const s = getScenario(slug)!;
  const { answers: stored } = useAnswers();
  const [local, setLocal] = useState<Record<string, Rating>>({});
  const answers: Record<string, { rating?: Rating }> = { ...stored };
  for (const [k, v] of Object.entries(local)) answers[k] = { ...answers[k], rating: v };
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const step = s.steps[idx];
  const rated = !!answers[step.id]?.rating;

  if (done) {
    const r = s.steps.map((st) => answers[st.id]?.rating);
    const strong = r.filter((x) => x === "gut").length;
    return (
      <div>
        <div className="rounded-3xl bg-night-2 p-6 text-center">
          <div className="text-5xl">🎯</div>
          <h1 className="mt-3 font-display text-2xl font-bold">Gespräch abgeschlossen</h1>
          <p className="mt-1 text-muted">{strong} von {s.steps.length} Schritten hast du als „stark“ bewertet.</p>
        </div>
        <ul className="mt-4 space-y-2">
          {s.steps.map((st, i) => (
            <li key={st.id}>
              <button onClick={() => { setIdx(i); setDone(false); }} className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-night-2 px-4 text-left active:scale-[0.98] transition">
                <span className="font-display text-xl font-bold text-signal">{st.step}</span>
                <span className="flex-1 font-medium">{st.stepName}</span>
                <span>{r[i] === "gut" ? "💪" : r[i] === "mittel" ? "👌" : r[i] === "nochmal" ? "🔁" : "–"}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Tipp: Tippe auf einen Schritt, um ihn nochmal zu üben.</p>
        <Link href="/training/closer" className="mt-4 flex min-h-12 items-center justify-center rounded-2xl bg-signal font-semibold text-white">Anderes Szenario</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/training/closer" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Szenarien</Link>
      <div className="mt-1 flex items-center gap-2"><span className="text-2xl">{s.emoji}</span><h1 className="font-display text-2xl font-bold">{s.title}</h1></div>
      <details className="mt-2 rounded-2xl bg-night-2 px-4 py-3 text-sm text-muted">
        <summary className="cursor-pointer font-semibold text-paper">Wer ist der Kunde?</summary>
        <p className="mt-2">{s.persona}</p>
      </details>
      <div className="mt-4 flex gap-1.5">
        {s.steps.map((st, i) => (
          <button key={st.id} onClick={() => setIdx(i)} className={`flex h-11 flex-1 items-center justify-center rounded-xl font-display font-bold transition ${i === idx ? "bg-signal text-white" : answers[st.id]?.rating ? "bg-mint/20 text-mint" : "bg-night-2 text-muted"}`}>{st.step}</button>
        ))}
      </div>
      <div className="mt-4 rounded-3xl bg-night-2 p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-signal">Schritt {idx + 1} / {s.steps.length} · {step.stepName}</div>
        <FreeTextExercise ex={step} compact onDone={(r) => setLocal((l) => ({ ...l, [step.id]: r }))} />
      </div>
      <button
        onClick={() => (idx + 1 < s.steps.length ? setIdx(idx + 1) : setDone(true))}
        disabled={!rated}
        className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white transition active:scale-[0.98] disabled:opacity-30"
      >
        {!rated ? "Erst Antwort prüfen und bewerten" : idx + 1 < s.steps.length ? `Weiter zu ${s.steps[idx + 1].stepName} →` : "Gespräch abschließen"}
      </button>
    </div>
  );
}
