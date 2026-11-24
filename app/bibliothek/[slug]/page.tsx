import Link from "next/link";
import { notFound } from "next/navigation";
import { objections, getObjection } from "@/lib/library";
import { ObjectionExercise } from "@/components/ObjectionExercise";

export function generateStaticParams() {
  return objections.map((o) => ({ slug: o.slug }));
}

export default async function ObjectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const o = getObjection(slug);
  if (!o) notFound();
  return (
    <article>
      <Link href="/bibliothek" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Bibliothek</Link>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-night-3 px-2 py-0.5 text-gold">Schuld: {o.category}</span>
        <span className="rounded-full bg-night-3 px-2 py-0.5 text-mint">Hebel: {o.lever}</span>
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight">{o.title}</h1>
      <div className="mt-4 rounded-3xl rounded-bl-md bg-night-3 px-4 py-3">
        <div className="text-[11px] font-semibold text-muted">Kunde</div>
        <div className="text-lg">„{o.quote}“</div>
      </div>
      <h2 className="mt-6 font-display text-lg font-bold">Was wirklich dahintersteckt</h2>
      <p className="mt-1 leading-relaxed text-[#D9DEEA]">{o.behind}</p>
      <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm">
        <span className="font-bold text-red-300">Typischer Fehler: </span>{o.mistake}
      </div>
      <h2 className="mt-6 font-display text-lg font-bold">So antwortest du</h2>
      <div className="mt-2 space-y-2">
        {o.scripts.map((s) => (
          <div key={s.name} className="rounded-3xl rounded-br-md bg-signal/15 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-signal">{s.name}</div>
            <p className="mt-1 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8"><ObjectionExercise slug={o.slug} /></div>
    </article>
  );
}
