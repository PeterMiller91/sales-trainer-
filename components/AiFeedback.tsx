"use client";
export type ExerciseFeedback = { score: number; summary: string; strengths: string[]; improvements: string[]; better: string };

export function ScoreBadge({ score }: { score: number }) {
  const c = score >= 8 ? "bg-mint text-night" : score >= 5 ? "bg-gold text-night" : "bg-red-400 text-night";
  return <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold ${c}`}>{score}</span>;
}

export function ExerciseFeedbackView({ fb }: { fb: ExerciseFeedback }) {
  return (
    <div className="rounded-2xl border border-signal/40 bg-signal/10 p-4">
      <div className="flex items-center gap-3">
        <ScoreBadge score={fb.score} />
        <div><div className="text-xs font-bold uppercase tracking-wider text-signal">KI-Coach</div><p className="font-semibold leading-snug">{fb.summary}</p></div>
      </div>
      {fb.strengths.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">{fb.strengths.map((s) => <li key={s} className="flex gap-2"><span className="text-mint">✓</span>{s}</li>)}</ul>
      )}
      {fb.improvements.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">{fb.improvements.map((s) => <li key={s} className="flex gap-2"><span className="text-gold">→</span>{s}</li>)}</ul>
      )}
      <div className="mt-3 rounded-xl bg-night p-3 text-sm"><span className="font-bold text-gold">Besser so: </span>{fb.better}</div>
    </div>
  );
}
