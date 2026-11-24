"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cards } from "@/lib/library";
import { useCardBoxes } from "@/lib/progress";

// Leitner-System: Box 0 (neu) bis 4 (sitzt). Falsch => zurück auf 1.
export default function Karteikarten() {
  const { boxes, loaded, setBox } = useCardBoxes();
  const [flipped, setFlipped] = useState(false);
  const [round, setRound] = useState(0);
  const [seen, setSeen] = useState(0);

  // Die Reihenfolge wird pro Runde festgelegt (schwächste Karten zuerst), nicht bei jeder Antwort neu.
  const queue = useMemo(() => {
    if (!loaded) return [];
    const list = [...cards].sort((a, b) => (boxes[a.id] ?? 0) - (boxes[b.id] ?? 0) || a.id.localeCompare(b.id));
    return list.slice(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, loaded]);

  const card = queue[seen];
  const mastered = cards.filter((c) => (boxes[c.id] ?? 0) >= 4).length;

  function answer(ok: boolean) {
    const cur = boxes[card.id] ?? 0;
    setBox(card.id, ok ? Math.min(4, cur + 1) : 1);
    setFlipped(false);
    setSeen((s) => s + 1);
  }

  return (
    <div>
      <Link href="/bibliothek" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Bibliothek</Link>
      <h1 className="mt-1 font-display text-3xl font-bold">Karteikarten</h1>
      <p className="mt-1 text-muted">Lies den Kundensatz, antworte laut, dann umdrehen. {mastered} / {cards.length} Karten sitzen.</p>
      {!loaded ? null : card ? (
        <>
          <div className="mt-4 flex items-center justify-between text-sm text-muted"><span>Karte {seen + 1} / {queue.length}</span><span className="rounded-full bg-night-3 px-2 py-0.5 text-xs text-gold">{card.tag}</span></div>
          <button onClick={() => setFlipped((f) => !f)} className="mt-2 flex min-h-64 w-full flex-col justify-center rounded-3xl bg-night-2 p-6 text-left transition active:scale-[0.99]">
            {!flipped ? (
              <>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Kunde sagt</span>
                <span className="mt-2 font-display text-2xl font-bold leading-snug">{card.front}</span>
                <span className="mt-6 text-sm text-signal">Antippen zum Umdrehen</span>
              </>
            ) : (
              <>
                <span className="text-xs font-bold uppercase tracking-wider text-gold">Starke Antwort</span>
                <span className="mt-2 text-lg leading-relaxed">{card.back}</span>
              </>
            )}
          </button>
          {flipped && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => answer(false)} className="min-h-14 rounded-2xl bg-night-3 font-semibold active:scale-[0.97]">🔁 Nochmal</button>
              <button onClick={() => answer(true)} className="min-h-14 rounded-2xl bg-mint font-semibold text-night active:scale-[0.97]">✓ Wusste ich</button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-3xl bg-night-2 p-6 text-center">
          <div className="text-5xl">🃏</div>
          <div className="mt-3 font-display text-2xl font-bold">Runde geschafft!</div>
          <p className="mt-1 text-muted">{mastered} von {cards.length} Karten sitzen schon.</p>
          <button onClick={() => { setSeen(0); setRound((r) => r + 1); }} className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white">Nächste Runde</button>
        </div>
      )}
    </div>
  );
}
