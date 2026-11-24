"use client";
import Link from "next/link";
import { useState } from "react";
import { lessons } from "@/lib/lessons";
import { cards, objections } from "@/lib/library";
import { useSection } from "@/lib/store";
import { login, logout, useSession, useStatus } from "@/lib/api";

export default function Profil() {
  const { session, loaded } = useSession();
  const { data: progress } = useSection<Record<string, { score: number; total: number; done: boolean }>>("progress");
  const { data: answers } = useSection<Record<string, { text?: string; rating?: string; ai?: { score: number } }>>("answers");
  const { data: cardBoxes } = useSection<Record<string, { box: number }>>("cards");
  const { data: stats } = useSection<Record<string, { kind: string; score?: number; total?: number; at?: number }>>("stats");
  const { data: roleplays } = useSection<Record<string, { score: number; industry: string; outcome: string | null; at?: number; nextFocus?: string }>>("roleplays");

  const lessonEntries = lessons.map((l) => progress[l.slug]).filter(Boolean);
  const quizCorrect = lessonEntries.reduce((s, p) => s + p.score, 0);
  const quizTotal = lessonEntries.reduce((s, p) => s + p.total, 0);
  const ans = Object.values(answers);
  const strong = ans.filter((a) => a.rating === "gut").length;
  const aiScores = ans.map((a) => a.ai?.score).filter((x): x is number => typeof x === "number");
  const mastered = cards.filter((c) => (cardBoxes[c.id]?.box ?? 0) >= 4).length;
  const rps = Object.values(roleplays).sort((a, b) => (b.at ?? 0) - (a.at ?? 0));
  const rpAvg = rps.length ? (rps.reduce((s, r) => s + r.score, 0) / rps.length).toFixed(1) : "–";
  const detector = Object.values(stats).filter((s) => s.kind === "detector").sort((a, b) => (b.at ?? 0) - (a.at ?? 0))[0];
  const libDone = objections.filter((o) => answers[o.exercise.id]).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Profil</h1>
      {loaded && (session ? (
        <div className="mt-4 flex items-center justify-between rounded-3xl bg-night-2 p-4">
          <div><div className="font-display text-lg font-bold">Hallo {session.name} 👋</div><div className="text-sm text-mint">Fortschritt wird auf allen Geräten gespeichert</div></div>
          <button onClick={() => logout()} className="min-h-10 rounded-xl bg-night-3 px-3 text-sm">Abmelden</button>
        </div>
      ) : <AuthForm />)}

      <h2 className="mt-8 font-display text-lg font-bold">Deine Statistik</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat value={`${lessonEntries.filter((p) => p.done).length}/${lessons.length}`} label="Lektionen bestanden" color="text-mint" />
        <Stat value={`${quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0}%`} label="Quiz-Trefferquote" color="text-gold" />
        <Stat value={String(ans.length)} label={`Freitext-Antworten (${strong} stark)`} color="text-signal" />
        <Stat value={aiScores.length ? (aiScores.reduce((a, b) => a + b, 0) / aiScores.length).toFixed(1) : "–"} label="Ø KI-Note Freitext" color="text-signal" />
        <Stat value={`${mastered}/${cards.length}`} label="Karteikarten sitzen" color="text-mint" />
        <Stat value={`${libDone}/${objections.length}`} label="Einwände geübt" color="text-gold" />
        <Stat value={String(rps.length)} label="KI-Rollenspiele" color="text-signal" />
        <Stat value={rpAvg} label="Ø Rollenspiel-Note" color="text-mint" />
      </div>
      {detector && <p className="mt-3 rounded-2xl bg-night-2 p-3 text-sm text-muted">🔍 Letztes Vorwand-Spiel: <span className="font-semibold text-paper">{detector.score} / {detector.total}</span> erkannt</p>}

      {rps.length > 0 && <>
        <h2 className="mt-8 font-display text-lg font-bold">Letzte Rollenspiele</h2>
        <div className="mt-3 space-y-2">
          {rps.slice(0, 5).map((r, i) => (
            <div key={i} className="rounded-2xl bg-night-2 p-3 text-sm">
              <div className="flex items-center justify-between"><span className="font-semibold">{r.industry}</span><span className="font-display text-lg font-bold text-signal">{r.score}/10</span></div>
              <div className="text-muted">{r.outcome === "ja" ? "Abschluss ✓" : r.outcome === "nein" ? "Kein Abschluss" : "Abgebrochen"}{r.at ? ` · ${new Date(r.at).toLocaleDateString("de-DE")}` : ""}</div>
              {i === 0 && r.nextFocus && <div className="mt-1 text-gold">Fokus: {r.nextFocus}</div>}
            </div>
          ))}
        </div>
      </>}

      <Link href="/marke" className="mt-8 flex min-h-12 items-center justify-between rounded-2xl bg-night-2 px-4 font-semibold active:scale-[0.98] transition"><span>Über die Marke Einwandfrei</span><span aria-hidden>→</span></Link>
    </div>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return <div className="rounded-3xl bg-night-2 p-4"><div className={`font-display text-3xl font-bold ${color}`}>{value}</div><div className="text-sm text-muted">{label}</div></div>;
}

function AuthForm() {
  const status = useStatus();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [invite, setInvite] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try { await login(mode, name, pin, invite); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }

  const input = "mt-1 min-h-12 w-full rounded-xl border-2 border-night-3 bg-night px-3 text-base focus:border-signal focus:outline-none";
  return (
    <form onSubmit={submit} className="mt-4 rounded-3xl bg-night-2 p-5">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-night p-1">
        {(["login", "register"] as const).map((m) => (
          <button type="button" key={m} onClick={() => setMode(m)} className={`min-h-10 rounded-xl text-sm font-semibold ${mode === m ? "bg-signal text-white" : "text-muted"}`}>{m === "login" ? "Anmelden" : "Konto erstellen"}</button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">Mit Konto wird dein Fortschritt auf allen Geräten gespeichert, und du bekommst KI-Feedback und das KI-Rollenspiel.</p>
      <label className="mt-3 block text-sm"><span className="text-muted">Name</span><input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" required /></label>
      <label className="mt-3 block text-sm"><span className="text-muted">PIN (4 bis 8 Ziffern)</span><input className={input} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
      {mode === "register" && (
        <label className="mt-3 block text-sm"><span className="text-muted">Einladungscode</span><input className={input} value={invite} onChange={(e) => setInvite(e.target.value)} required /></label>
      )}
      {mode === "register" && status && !status.registration && <p className="mt-3 text-sm text-gold">Hinweis: Auf dem Server ist noch kein Einladungscode hinterlegt.</p>}
      {err && <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{err}</p>}
      <button disabled={busy} className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white disabled:opacity-50">{busy ? "Einen Moment …" : mode === "login" ? "Anmelden" : "Konto erstellen"}</button>
    </form>
  );
}
