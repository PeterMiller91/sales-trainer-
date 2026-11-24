"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api, useSession, useStatus } from "@/lib/api";
import { updateEntry } from "@/lib/store";
import { objections } from "@/lib/library";
import { ScoreBadge } from "./AiFeedback";

type Msg = { role: "user" | "assistant"; content: string };
type Setup = { industry: string; product: string; price: string; persona: string; difficulty: 1 | 2 | 3; focus: string };
type Report = {
  score: number; summary: string; strengths: string[]; improvements: string[];
  closer: { step: string; rating: string; note: string }[];
  objections: { quote: string; type: string; handled: string; better: string }[];
  nextFocus: string;
};

const presets: { label: string; emoji: string; setup: Omit<Setup, "difficulty" | "focus"> }[] = [
  { label: "Fitness-Coaching", emoji: "🏋️", setup: { industry: "Online-Fitness-Coaching für Berufstätige", product: "12-Wochen-Coaching mit Trainings- und Ernährungsplan", price: "1.500 €", persona: "Vielbeschäftigte Führungskraft, Mitte 30, hat schon zwei Diäten abgebrochen" } },
  { label: "B2B-Software", emoji: "💼", setup: { industry: "Handwerksbetrieb mit 25 Mitarbeitern", product: "Software für Angebote, Aufträge und Rechnungen", price: "249 € pro Monat", persona: "Geschäftsführerin, pragmatisch, wenig Zeit, schlechte Erfahrung mit komplizierter Software" } },
  { label: "Immobilien", emoji: "🏠", setup: { industry: "Immobilienverkauf", product: "Makler-Auftrag zum Verkauf eines Einfamilienhauses", price: "3 % Provision", persona: "Eigentümer, Anfang 60, will das Haus der Eltern verkaufen und überlegt, es privat zu machen" } },
  { label: "Solaranlage", emoji: "☀️", setup: { industry: "Photovoltaik für Eigenheime", product: "Solaranlage mit Speicher inklusive Montage", price: "18.900 €", persona: "Familienvater, rechnet alles genau nach, hat schon drei Angebote eingeholt" } },
];

const personas = ["Skeptisch und kritisch", "Freundlich, aber unentschlossen", "Sparsam, achtet auf jeden Euro", "Hat wenig Zeit und ist ungeduldig", "Muss mit Partner/Chef abstimmen"];

export function RoleplayApp() {
  const { session, loaded } = useSession();
  const status = useStatus();
  const [setup, setSetup] = useState<Setup>({ ...presets[0].setup, difficulty: 2, focus: objections[0].quote });
  const [style, setStyle] = useState(personas[0]);
  const [phase, setPhase] = useState<"setup" | "chat" | "report">("setup");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ended, setEnded] = useState<"ja" | "nein" | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, busy, ended]);

  const fullSetup = { ...setup, persona: `${setup.persona}. Grundhaltung: ${style}` };

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next); setInput(""); setBusy(true); setErr(null);
    try {
      const r = await api<{ reply: string; ended: "ja" | "nein" | null }>("/api/roleplay", { method: "POST", body: JSON.stringify({ setup: fullSetup, messages: next }) });
      setMsgs([...next, { role: "assistant", content: r.reply }]);
      if (r.ended) setEnded(r.ended);
    } catch (e) {
      setErr((e as Error).message);
      setMsgs(msgs); setInput(text);
    } finally { setBusy(false); }
  }

  async function evaluate() {
    setBusy(true); setErr(null);
    try {
      const r = await api<Report>("/api/feedback", { method: "POST", body: JSON.stringify({ kind: "roleplay", situation: `${setup.industry}; Angebot: ${setup.product} für ${setup.price}; Kunde: ${fullSetup.persona}`, outcome: ended, messages: msgs }) });
      setReport(r); setPhase("report");
      updateEntry("roleplays", `rp-${Date.now()}`, { industry: setup.industry, focus: setup.focus, difficulty: setup.difficulty, outcome: ended, score: r.score, summary: r.summary, nextFocus: r.nextFocus, turns: msgs.length, closer: r.closer.map((c) => `${c.step}:${c.rating}`).join(",") });
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  function restart() { setMsgs([]); setEnded(null); setReport(null); setErr(null); setPhase("setup"); }

  if (!loaded) return null;

  if (!session) {
    return (
      <div>
        <Back />
        <h1 className="mt-1 font-display text-3xl font-bold">KI-Rollenspiel</h1>
        <p className="mt-2 text-muted">Ein KI-Kunde bringt echte Einwände und Vorwände. Du führst das Gespräch, am Ende bekommst du eine ausführliche Auswertung nach CLOSER.</p>
        <Link href="/profil" className="mt-6 flex min-h-12 items-center justify-center rounded-2xl bg-signal font-semibold text-white">Anmelden, um zu starten</Link>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div>
        <Back />
        <h1 className="mt-1 font-display text-3xl font-bold">KI-Rollenspiel</h1>
        <p className="mt-1 text-muted">Wähle eine Situation. Der KI-Kunde erfindet sich einen eigenen Hintergrund und einen echten Grund für sein Zögern.</p>
        {status && !status.ai && <p className="mt-4 rounded-2xl bg-red-500/10 p-3 text-sm text-red-300">Die KI ist auf dem Server noch nicht eingerichtet. Ohne ANTHROPIC_API_KEY funktioniert das Rollenspiel nicht.</p>}

        <Label>Situation</Label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button key={p.label} onClick={() => setSetup({ ...setup, ...p.setup })} className={`min-h-14 rounded-2xl border-2 p-3 text-left font-semibold transition active:scale-[0.98] ${setup.industry === p.setup.industry ? "border-signal bg-signal/10" : "border-transparent bg-night-2"}`}>
              <span className="mr-1">{p.emoji}</span>{p.label}
            </button>
          ))}
        </div>
        <details className="mt-3 rounded-2xl bg-night-2 p-4">
          <summary className="cursor-pointer text-sm font-semibold">✏️ Eigene Situation eingeben (dein Produkt)</summary>
          <Field label="Branche / Kunde" value={setup.industry} onChange={(v) => setSetup({ ...setup, industry: v })} />
          <Field label="Angebot" value={setup.product} onChange={(v) => setSetup({ ...setup, product: v })} />
          <Field label="Preis" value={setup.price} onChange={(v) => setSetup({ ...setup, price: v })} />
          <Field label="Wer ist der Kunde?" value={setup.persona} onChange={(v) => setSetup({ ...setup, persona: v })} />
        </details>

        <Label>Kundentyp</Label>
        <div className="flex flex-wrap gap-2">
          {personas.map((p) => <Chip key={p} on={style === p} onClick={() => setStyle(p)}>{p}</Chip>)}
        </div>

        <Label>Schwerpunkt-Einwand</Label>
        <select value={setup.focus} onChange={(e) => setSetup({ ...setup, focus: e.target.value })} className="min-h-12 w-full rounded-2xl border-2 border-night-3 bg-night-2 px-3 text-base">
          {objections.map((o) => <option key={o.slug} value={o.quote}>{o.title}: „{o.quote}“</option>)}
          <option value="Zufällig, such dir selbst einen typischen Einwand aus">🎲 Überrasch mich</option>
        </select>

        <Label>Schwierigkeit</Label>
        <div className="grid grid-cols-3 gap-2">
          {([1, 2, 3] as const).map((d) => <Chip key={d} on={setup.difficulty === d} onClick={() => setSetup({ ...setup, difficulty: d })}>{["Leicht", "Mittel", "Profi"][d - 1]}</Chip>)}
        </div>

        <button onClick={() => setPhase("chat")} className="mt-8 flex min-h-14 w-full items-center justify-center rounded-2xl bg-signal text-lg font-semibold text-white active:scale-[0.98] transition">Gespräch starten</button>
      </div>
    );
  }

  if (phase === "report" && report) {
    const rc = (r: string) => (r === "stark" || r === "gut" ? "text-mint" : r === "okay" || r === "teilweise" ? "text-gold" : "text-red-300");
    return (
      <div>
        <Back />
        <div className="mt-2 flex items-center gap-4 rounded-3xl bg-night-2 p-5">
          <ScoreBadge score={report.score} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-signal">Auswertung {ended === "ja" ? "· Abschluss ✓" : ended === "nein" ? "· Kein Abschluss" : ""}</div>
            <p className="font-semibold leading-snug">{report.summary}</p>
          </div>
        </div>
        <h2 className="mt-6 font-display text-lg font-bold">CLOSER-Check</h2>
        <div className="mt-2 space-y-2">
          {report.closer.map((c) => (
            <div key={c.step} className="flex gap-3 rounded-2xl bg-night-2 p-3">
              <span className="font-display text-xl font-bold text-signal">{c.step}</span>
              <div className="text-sm"><span className={`font-bold ${rc(c.rating)}`}>{c.rating}</span> · {c.note}</div>
            </div>
          ))}
        </div>
        {report.objections.length > 0 && <>
          <h2 className="mt-6 font-display text-lg font-bold">Einwände im Gespräch</h2>
          <div className="mt-2 space-y-2">
            {report.objections.map((o, i) => (
              <div key={i} className="rounded-2xl bg-night-2 p-4 text-sm">
                <div className="flex items-center justify-between gap-2"><span className="font-semibold">„{o.quote}“</span><span className="shrink-0 rounded-full bg-night-3 px-2 py-0.5 text-xs text-gold">{o.type}</span></div>
                <div className={`mt-1 font-semibold ${rc(o.handled)}`}>Behandelt: {o.handled}</div>
                <div className="mt-2 rounded-xl bg-night p-3"><span className="font-bold text-gold">Besser: </span>{o.better}</div>
              </div>
            ))}
          </div>
        </>}
        <h2 className="mt-6 font-display text-lg font-bold">Stärken & Hebel</h2>
        <ul className="mt-2 space-y-1 text-sm">{report.strengths.map((s) => <li key={s} className="flex gap-2"><span className="text-mint">✓</span>{s}</li>)}</ul>
        <ul className="mt-2 space-y-1 text-sm">{report.improvements.map((s) => <li key={s} className="flex gap-2"><span className="text-gold">→</span>{s}</li>)}</ul>
        <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 p-4"><div className="text-xs font-bold uppercase tracking-wider text-gold">Dein nächster Fokus</div><p className="mt-1">{report.nextFocus}</p></div>
        <button onClick={restart} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-signal font-semibold text-white">Neues Gespräch</button>
      </div>
    );
  }

  // Chat
  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col">
      <div className="flex items-center justify-between">
        <button onClick={restart} className="min-h-10 text-sm font-medium text-muted">← Abbrechen</button>
        <span className="rounded-full bg-night-2 px-3 py-1 text-xs text-muted">{["Leicht", "Mittel", "Profi"][setup.difficulty - 1]} · {setup.price}</span>
      </div>
      <div className="mt-2 rounded-2xl bg-night-2 p-3 text-sm text-muted">📞 Der Kunde ({setup.industry}) ist am Telefon. Du eröffnest das Gespräch. Denk an CLOSER: erst klären, warum er da ist.</div>
      <div className="mt-4 flex-1 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 leading-snug ${m.role === "user" ? "rounded-br-md bg-signal text-white" : "rounded-bl-md bg-night-3"}`}>{m.content}</div>
          </div>
        ))}
        {busy && <div className="flex"><div className="rounded-3xl rounded-bl-md bg-night-3 px-4 py-3 text-muted">tippt …</div></div>}
        {ended && <div className={`rounded-2xl p-4 text-center font-semibold ${ended === "ja" ? "bg-mint/15 text-mint" : "bg-red-500/10 text-red-300"}`}>{ended === "ja" ? "🎉 Der Kunde hat zugesagt!" : "Der Kunde hat das Gespräch beendet."}</div>}
        {err && <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-300">{err}</p>}
        <div ref={endRef} className="h-4 scroll-mb-40" />
      </div>
      <div className="sticky bottom-20 mt-4 space-y-2 bg-night pt-2">
        {!ended && (
          <div className="flex gap-2">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2} placeholder="Deine Antwort …" className="min-h-12 flex-1 resize-none rounded-2xl border-2 border-night-3 bg-night-2 px-4 py-3 text-base focus:border-signal focus:outline-none" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) { e.preventDefault(); send(); } }} />
            <button onClick={send} disabled={busy || !input.trim()} aria-label="Senden" className="flex w-14 items-center justify-center rounded-2xl bg-signal text-white disabled:opacity-40">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2z" /></svg>
            </button>
          </div>
        )}
        {msgs.length >= 4 && (
          <button onClick={evaluate} disabled={busy} className="flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-signal font-semibold text-signal disabled:opacity-50">
            {busy ? "Bitte warten …" : ended ? "Gespräch auswerten" : "Gespräch beenden & auswerten"}
          </button>
        )}
      </div>
    </div>
  );
}

const Back = () => <Link href="/training" className="inline-flex min-h-10 items-center text-sm font-medium text-muted">← Training</Link>;
const Label = ({ children }: { children: React.ReactNode }) => <div className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-muted">{children}</div>;
const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`min-h-11 rounded-full px-4 text-sm font-semibold transition ${on ? "bg-signal text-white" : "bg-night-2 text-muted"}`}>{children}</button>
);
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      <span className="text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 min-h-12 w-full rounded-xl border-2 border-night-3 bg-night px-3 text-base focus:border-signal focus:outline-none" />
    </label>
  );
}
