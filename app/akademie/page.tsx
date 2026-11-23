"use client";
import Link from "next/link";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";

export default function Akademie() {
  const { progress } = useProgress();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Akademie</h1>
      <p className="mt-1 text-muted">Die Hormozi-Grundlagen. Jede Lektion endet mit einem kurzen Quiz.</p>
      <ol className="mt-6 space-y-3">
        {lessons.map((l) => {
          const p = progress[l.slug];
          return (
            <li key={l.slug}>
              <Link href={`/akademie/${l.slug}`} className="flex items-center gap-4 rounded-3xl bg-night-2 p-4 active:scale-[0.98] transition">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold ${p?.done ? "bg-mint text-night" : "bg-night-3 text-signal"}`}>
                  {p?.done ? "✓" : l.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold">{l.title}</span>
                  <span className="block text-sm text-muted">{l.summary}</span>
                  <span className="mt-1 block text-xs text-muted/80">{l.minutes} Min. · {l.quiz.length} Fragen{p ? ` · ${p.score}/${p.total} richtig` : ""}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
