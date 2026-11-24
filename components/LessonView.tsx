"use client";
import Link from "next/link";
import { useState } from "react";
import type { Block, Lesson } from "@/lib/lessons";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";
import { lessonVideos, hormoziSearch } from "@/lib/videos";
import { lessonExercises } from "@/lib/exercises";
import { VideoEmbed } from "./VideoEmbed";
import { FreeTextExercise } from "./FreeTextExercise";

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p, i) => (p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>))}</>;
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "h": return <h3 className="mt-7 mb-2 font-display text-xl font-bold text-white">{b.text}</h3>;
    case "p": return <p><Rich text={b.text} /></p>;
    case "list": return (
      <ul className="mb-4 space-y-2">
        {b.items.map((it, i) => (
          <li key={i} className="flex gap-3 rounded-2xl bg-night-2 p-3 leading-relaxed text-[#D9DEEA]">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal" /><span><Rich text={it} /></span>
          </li>
        ))}
      </ul>
    );
    case "merksatz": return (
      <div className="my-6 rounded-3xl border border-gold/30 bg-gold/10 p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-gold">Merksatz</div>
        <p className="mt-1 !mb-0 font-display text-lg font-bold !text-white"><Rich text={b.text} /></p>
      </div>
    );
    case "dialog": return (
      <div className="my-6 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-muted">Beispiel-Gespräch</div>
        {b.lines.map((l, i) => (
          <div key={i} className={`flex ${l.who === "Du" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-3xl px-4 py-3 ${l.who === "Du" ? "rounded-br-md bg-signal text-white" : "rounded-bl-md bg-night-3 text-paper"}`}>
              <div className="text-[11px] font-semibold opacity-75">{l.who}</div>
              <div className="leading-snug">{l.text}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

function Quiz({ lesson }: { lesson: Lesson }) {
  const { save } = useProgress();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = lesson.quiz[idx];
  const nextLesson = lessons.find((l) => l.number === lesson.number + 1);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (idx + 1 < lesson.quiz.length) { setIdx(idx + 1); setPicked(null); }
    else { save(lesson.slug, score, lesson.quiz.length); setFinished(true); }
  }
  function restart() { setIdx(0); setPicked(null); setScore(0); setFinished(false); }

  if (finished) {
    const passed = score / lesson.quiz.length >= 0.6;
    return (
      <div className="rounded-3xl bg-night-2 p-6 text-center">
        <div className="text-5xl">{passed ? "🏆" : "💪"}</div>
        <div className="mt-3 font-display text-2xl font-bold">{score} von {lesson.quiz.length} richtig</div>
        <p className="mt-1 text-muted">{passed ? "Lektion bestanden. Stark!" : "Fast. Lies die Lektion nochmal und versuch es erneut."}</p>
        <div className="mt-5 space-y-2">
          {passed && nextLesson && <Link href={`/akademie/${nextLesson.slug}`} className="flex min-h-12 items-center justify-center rounded-2xl bg-signal font-semibold text-white">Nächste Lektion: {nextLesson.title}</Link>}
          {passed && !nextLesson && <Link href="/" className="flex min-h-12 items-center justify-center rounded-2xl bg-signal font-semibold text-white">Akademie abgeschlossen 🎉</Link>}
          <button onClick={restart} className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-night-3 font-semibold">Quiz wiederholen</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-night-2 p-5">
      <div className="flex items-center justify-between text-xs font-semibold text-muted">
        <span className="uppercase tracking-wider text-signal">Quiz</span><span>Frage {idx + 1} / {lesson.quiz.length}</span>
      </div>
      <div className="mt-2 flex gap-1">{lesson.quiz.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-signal" : "bg-night-3"}`} />)}</div>
      <p className="mt-4 font-display text-lg font-bold leading-snug">{q.question}</p>
      <div className="mt-4 space-y-2">
        {q.options.map((o, i) => {
          let cls = "bg-night-3 border-transparent";
          if (picked !== null) {
            if (i === q.correct) cls = "bg-mint/15 border-mint text-white";
            else if (i === picked) cls = "bg-red-500/15 border-red-400";
            else cls = "bg-night-3 border-transparent opacity-50";
          }
          return (
            <button key={i} onClick={() => pick(i)} className={`flex min-h-14 w-full items-center rounded-2xl border-2 px-4 py-3 text-left font-medium transition active:scale-[0.98] ${cls}`}>{o}</button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4">
          <p className={`rounded-2xl p-4 text-sm leading-relaxed ${picked === q.correct ? "bg-mint/10 text-mint" : "bg-red-500/10 text-red-300"}`}>
            <strong>{picked === q.correct ? "Richtig! " : "Nicht ganz. "}</strong>{q.explanation}
          </p>
          <button onClick={next} className="mt-3 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white active:scale-[0.98] transition">
            {idx + 1 < lesson.quiz.length ? "Weiter" : "Ergebnis anzeigen"}
          </button>
        </div>
      )}
    </div>
  );
}

const searchTerms: Record<string, string> = {
  "einwand-vs-vorwand": "objections",
  "warum-menschen-nicht-kaufen": "why people don't buy",
  "value-equation": "value equation",
  "closer-framework": "closer sales",
  "grundhaltung-einwandbehandlung": "how to close",
  "vorwaende-aufdecken": "think about it",
};

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article>
      <Link href="/akademie" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Akademie</Link>
      <div className="mt-2 text-sm font-semibold text-signal">Lektion {lesson.number} · {lesson.minutes} Min.</div>
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight">{lesson.title}</h1>
      <p className="mt-2 text-lg text-muted">{lesson.summary}</p>
      <div className="prose-lesson mt-6">{lesson.blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>
      {lessonVideos[lesson.slug] && <VideoEmbed video={lessonVideos[lesson.slug]} moreQuery={lesson.title} moreHref={hormoziSearch(searchTerms[lesson.slug] ?? lesson.title)} />}
      {lessonExercises[lesson.slug] && <div className="mt-8"><FreeTextExercise ex={lessonExercises[lesson.slug]} /></div>}
      {lesson.slug === "closer-framework" && (
        <Link href="/training/closer" className="mt-4 flex min-h-14 items-center justify-between rounded-2xl bg-night-2 px-5 font-semibold active:scale-[0.98] transition">
          <span>🎯 Ganze Gespräche üben: CLOSER-Praxis</span><span aria-hidden>→</span>
        </Link>
      )}
      <div className="mt-8"><Quiz lesson={lesson} /></div>
    </article>
  );
}
