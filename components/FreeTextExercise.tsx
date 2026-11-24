"use client";
import { useEffect, useState } from "react";
import { evaluate, type Exercise } from "@/lib/exercises";
import { useAnswers, type Rating } from "@/lib/answers";

export function FreeTextExercise({ ex, label = "Praxis-Aufgabe", onDone, compact = false }: { ex: Exercise; label?: string; onDone?: (r: Rating) => void; compact?: boolean }) {
  const { answers, save } = useAnswers();
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [rating, setRating] = useState<Rating | undefined>();

  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, [answers]);
  useEffect(() => {
    if (!ready || loadedId === ex.id) return;
    const prev = answers[ex.id];
    setText(prev?.text ?? "");
    setRating(prev?.rating);
    setChecked(false);
    setLoadedId(ex.id);
  }, [ready, answers, ex.id, loadedId]);

  const result = evaluate(text, ex.checks);
  const hits = result.filter((r) => r.ok).length;
  const tooShort = text.trim().length < 25;

  function check() { setChecked(true); save(ex.id, { text, rating, at: Date.now() }); }
  function rate(r: Rating) { setRating(r); save(ex.id, { text, rating: r, at: Date.now() }); onDone?.(r); }

  return (
    <div className={compact ? "" : "rounded-3xl bg-night-2 p-5"}>
      {!compact && <div className="text-xs font-bold uppercase tracking-wider text-gold">✍️ {label}</div>}
      <div className="mt-3 rounded-3xl rounded-bl-md bg-night-3 px-4 py-3">
        <div className="text-[11px] font-semibold text-muted">Kunde</div>
        <div className="leading-snug">{ex.situation}</div>
      </div>
      <p className="mt-4 font-display text-lg font-bold leading-snug">{ex.task}</p>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setChecked(false); }}
        rows={5}
        placeholder="Schreib hier deine Antwort, so wie du sie im Gespräch sagen würdest …"
        className="mt-3 w-full resize-y rounded-2xl border-2 border-night-3 bg-night px-4 py-3 text-base leading-relaxed text-paper placeholder:text-muted/70 focus:border-signal focus:outline-none"
      />
      {!checked ? (
        <button onClick={check} disabled={tooShort} className="mt-3 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white transition active:scale-[0.98] disabled:opacity-40">
          {tooShort ? "Schreib mindestens einen ganzen Satz" : "Antwort prüfen"}
        </button>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl bg-night p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Schnell-Check</span>
              <span className={`text-sm font-bold ${hits === result.length ? "text-mint" : "text-gold"}`}>{hits} / {result.length}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {result.map((r) => (
                <li key={r.label} className="flex items-start gap-2 text-sm">
                  <span className={r.ok ? "text-mint" : "text-muted"}>{r.ok ? "✓" : "○"}</span>
                  <span className={r.ok ? "" : "text-muted"}>{r.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">Automatischer Stichwort-Check. Echtes KI-Feedback kommt mit dem Rollenspiel in Phase 3.</p>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gold">Musterantwort</div>
            <p className="mt-1 leading-relaxed">{ex.model}</p>
            {ex.tip && <p className="mt-2 text-sm text-muted">💡 {ex.tip}</p>}
          </div>
          <div>
            <p className="text-sm font-semibold">Wie gut war deine Antwort im Vergleich?</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([["gut", "💪 Stark"], ["mittel", "👌 Okay"], ["nochmal", "🔁 Nochmal"]] as [Rating, string][]).map(([r, l]) => (
                <button key={r} onClick={() => rate(r)} className={`min-h-12 rounded-2xl border-2 text-sm font-semibold transition active:scale-[0.97] ${rating === r ? "border-signal bg-signal/15" : "border-transparent bg-night-3"}`}>{l}</button>
              ))}
            </div>
            {rating === "nochmal" && <p className="mt-2 text-sm text-muted">Ändere deinen Text oben und prüfe erneut.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
