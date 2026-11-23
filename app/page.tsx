"use client";
import Link from "next/link";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";

const modules = [
  { title: "Akademie", text: "Hormozi-Grundlagen in 6 Lektionen", href: "/akademie", ready: true, emoji: "🎓" },
  { title: "Einwand-Bibliothek", text: "Geld, Zeit, Partner & Co.", href: "/training", ready: false, emoji: "🛡️" },
  { title: "Vorwand-Detektor", text: "Ausreden erkennen und auflösen", href: "/training", ready: false, emoji: "🔍" },
  { title: "KI-Rollenspiel", text: "Übe mit einem echten Kunden-Bot", href: "/training", ready: false, emoji: "🤖" },
];

export default function Home() {
  const { progress } = useProgress();
  const done = lessons.filter((l) => progress[l.slug]?.done).length;
  const next = lessons.find((l) => !progress[l.slug]?.done);
  const pct = Math.round((done / lessons.length) * 100);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-signal to-[#FF4D2E] p-6 text-white shadow-lg shadow-signal/20">
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
        <p className="text-sm font-medium text-white/80">Verkaufen ohne Wenn und Aber.</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight">Jeder Einwand ist eine Frage.</h1>
        <p className="mt-2 text-white/90">Lerne, sie zu beantworten.</p>
        {next ? (
          <Link href={`/akademie/${next.slug}`} className="mt-5 flex min-h-12 items-center justify-between rounded-2xl bg-night px-5 py-3 font-semibold active:scale-[0.98] transition">
            <span>{done === 0 ? "Jetzt starten" : "Weiter lernen"}: {next.title}</span><span aria-hidden>→</span>
          </Link>
        ) : (
          <div className="mt-5 rounded-2xl bg-night px-5 py-3 font-semibold">🏆 Akademie abgeschlossen!</div>
        )}
      </section>

      <section className="rounded-3xl bg-night-2 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Dein Fortschritt</h2>
          <span className="text-sm text-muted">{done} / {lessons.length} Lektionen</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-night-3">
          <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Trainingsbereiche</h2>
        <div className="grid grid-cols-2 gap-3">
          {modules.map((m) => (
            <Link key={m.title} href={m.href} className="relative flex min-h-36 flex-col rounded-3xl bg-night-2 p-4 active:scale-[0.98] transition">
              <span className="text-3xl">{m.emoji}</span>
              <span className="mt-3 font-display font-bold leading-tight">{m.title}</span>
              <span className="mt-1 text-sm text-muted">{m.text}</span>
              {!m.ready && <span className="absolute right-3 top-3 rounded-full bg-night-3 px-2 py-0.5 text-[11px] text-gold">bald</span>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
