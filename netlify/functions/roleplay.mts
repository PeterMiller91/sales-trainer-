import type { Config } from "@netlify/functions";
import type Anthropic from "@anthropic-ai/sdk";
import { authUser, json, takeAiQuota } from "./_lib/auth.mts";
import { ask, aiErrorResponse, clip } from "./_lib/ai.mts";

const MAX_TURNS = 40;

type Setup = { industry: string; product: string; price: string; persona: string; difficulty: 1 | 2 | 3; focus: string };

function systemPrompt(s: Setup) {
  const level = {
    1: "Du bist grundsätzlich offen. Bring ein oder zwei Einwände, und lass dich überzeugen, wenn der Verkäufer sie ordentlich behandelt.",
    2: "Du bist skeptisch. Bring drei bis vier Einwände, darunter mindestens einen Vorwand, hinter dem ein echter Grund steckt. Du sagst erst Ja, wenn der Verkäufer deinen echten Grund aufgedeckt und gelöst hat.",
    3: "Du bist sehr schwer zu überzeugen. Du weichst mit Vorwänden aus, testest den Verkäufer, wechselst den Grund, wenn er nur oberflächlich reagiert, und sagst nur Ja, wenn er wirklich nach CLOSER vorgeht, nicht drängt und deinen echten Zweifel löst.",
  }[s.difficulty];
  return `Du spielst in einem Verkaufstraining einen potenziellen Kunden. Die Person, mit der du schreibst, übt, ein Verkaufsgespräch zu führen und Einwände zu behandeln (nach den Prinzipien von Alex Hormozi).

Deine Rolle:
- Branche/Situation: ${s.industry}
- Angebot, um das es geht: ${s.product}
- Preis: ${s.price}
- Dein Kundentyp: ${s.persona}
- Schwerpunkt-Einwand, den du auf jeden Fall bringst: ${s.focus}

Schwierigkeit: ${level}

So verhältst du dich:
- Bleib immer in deiner Rolle als Kunde. Erkläre nie das Training, gib keine Tipps und bewerte den Verkäufer nicht.
- Erfinde dir zu Beginn still einen konkreten Hintergrund: Name, Lebens- oder Firmensituation, ein echtes Problem, frühere Versuche, und einen echten Grund für dein Zögern, den du nicht sofort verrätst.
- Antworte wie in einem echten Gespräch: kurz, gesprochen, meist 1 bis 3 Sätze, auf Deutsch, ohne Aufzählungen.
- Gute Fragen beantwortest du ehrlich und mit Details. Auf Druck, Floskeln oder Monologe reagierst du kühler.
- Wenn der Verkäufer deinen Einwand nur übergeht, bringst du ihn erneut oder wirst ausweichender.
- Wenn du dich entscheidest, schreibst du deine letzte Antwort und hängst in einer neuen Zeile genau [ENDE:JA] (du kaufst) oder [ENDE:NEIN] (du beendest das Gespräch) an. Sonst nie.`;
}

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Methode nicht erlaubt" }, 405);
  const user = await authUser(req);
  if (!user) return json({ error: "Bitte melde dich an, um das KI-Rollenspiel zu nutzen." }, 401);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: "Die KI ist noch nicht eingerichtet (ANTHROPIC_API_KEY fehlt)." }, 503);

  let body: { setup?: Partial<Setup>; messages?: { role: string; content: string }[] };
  try { body = await req.json(); } catch { return json({ error: "Ungültige Anfrage" }, 400); }
  const s = body.setup ?? {};
  const setup: Setup = {
    industry: clip(s.industry, 200) || "Coaching",
    product: clip(s.product, 300) || "ein Coaching-Programm",
    price: clip(s.price, 80) || "1.500 €",
    persona: clip(s.persona, 300) || "skeptischer Interessent",
    difficulty: ([1, 2, 3].includes(Number(s.difficulty)) ? Number(s.difficulty) : 2) as 1 | 2 | 3,
    focus: clip(s.focus, 200) || "Das ist mir zu teuer.",
  };
  const msgs = Array.isArray(body.messages) ? body.messages : [];
  if (msgs.length === 0 || msgs.length > MAX_TURNS * 2) return json({ error: "Das Gespräch ist zu lang. Bitte starte ein neues." }, 400);
  const messages: Anthropic.Beta.BetaMessageParam[] = msgs.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: clip(m.content, 2000) || "…",
  }));
  if (messages[0].role !== "user" || messages[messages.length - 1].role !== "user") return json({ error: "Ungültiger Gesprächsverlauf" }, 400);

  if (!(await takeAiQuota(user))) return json({ error: "Tageslimit für KI-Übungen erreicht. Morgen geht's weiter!" }, 429);

  try {
    const { text } = await ask({ system: systemPrompt(setup), messages, effort: "low", maxTokens: 4000 });
    const end = text.match(/\[ENDE:(JA|NEIN)\]/);
    return json({ reply: text.replace(/\[ENDE:(JA|NEIN)\]/g, "").trim(), ended: end ? (end[1] === "JA" ? "ja" : "nein") : null });
  } catch (e) {
    return aiErrorResponse(e);
  }
};

export const config: Config = { path: "/api/roleplay" };
