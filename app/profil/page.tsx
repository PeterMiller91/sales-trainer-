"use client";
import Link from "next/link";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";

export default function Profil() {
  const { progress } = useProgress();
  const entries = lessons.map((l) => ({ l, p: progress[l.slug] })).filter((e) => e.p);
  const correct = entries.reduce((s, e) => s + e.p!.score, 0);
  const total = entries.reduce((s, e) => s + e.p!.total, 0);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Profil</h1>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-night-2 p-4"><div className="font-display text-3xl font-bold text-mint">{entries.filter((e) => e.p!.done).length}</div><div className="text-sm text-muted">Lektionen bestanden</div></div>
        <div className="rounded-3xl bg-night-2 p-4"><div className="font-display text-3xl font-bold text-gold">{total ? Math.round((correct / total) * 100) : 0}%</div><div className="text-sm text-muted">Quiz-Trefferquote</div></div>
      </div>
      <p className="mt-6 rounded-3xl bg-night-2 p-4 text-sm text-muted">Login und Fortschritt über mehrere Geräte kommen in Phase 4. Aktuell wird dein Fortschritt auf diesem Gerät gespeichert.</p>
      <Link href="/marke" className="mt-3 flex min-h-12 items-center justify-between rounded-2xl bg-night-2 px-4 font-semibold active:scale-[0.98] transition"><span>Über die Marke Einwandfrei</span><span aria-hidden>→</span></Link>
    </div>
  );
}
