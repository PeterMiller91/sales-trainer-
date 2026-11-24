"use client";
import Link from "next/link";
import { useState } from "react";
import { objections, type Category } from "@/lib/library";

const cats: (Category | "Alle")[] = ["Alle", "Umstände", "Andere", "Sich selbst"];

export default function Bibliothek() {
  const [cat, setCat] = useState<Category | "Alle">("Alle");
  const list = objections.filter((o) => cat === "Alle" || o.category === cat);
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Bibliothek</h1>
      <p className="mt-1 text-muted">Die häufigsten Einwände: was dahintersteckt und wie du antwortest.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href="/vorwand" className="rounded-2xl bg-night-2 p-3 active:scale-[0.98] transition"><div className="text-2xl">🔍</div><div className="mt-1 font-display font-bold">Vorwand-Detektor</div></Link>
        <Link href="/karteikarten" className="rounded-2xl bg-night-2 p-3 active:scale-[0.98] transition"><div className="text-2xl">🃏</div><div className="mt-1 font-display font-bold">Karteikarten</div></Link>
      </div>
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${cat === c ? "bg-signal text-white" : "bg-night-2 text-muted"}`}>{c}</button>
        ))}
      </div>
      <ul className="mt-4 space-y-3">
        {list.map((o) => (
          <li key={o.slug}>
            <Link href={`/bibliothek/${o.slug}`} className="block rounded-3xl bg-night-2 p-4 active:scale-[0.98] transition">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-lg font-bold">{o.title}</span>
                <span className="shrink-0 rounded-full bg-night-3 px-2 py-0.5 text-xs text-gold">{o.category}</span>
              </div>
              <p className="mt-1 text-sm text-muted">„{o.quote.replace(/[„“]/g, "")}“</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
