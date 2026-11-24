import type { Config } from "@netlify/functions";
import { z } from "zod";
import { authUser, json, takeAiQuota } from "./_lib/auth.mts";
import { ask, aiErrorResponse, apiKey, clip } from "./_lib/ai.mts";

const COACH = `Du bist ein erfahrener, direkter Verkaufstrainer, der nach den Prinzipien von Alex Hormozi coacht: CLOSER-Framework (Clarify, Label, Overview, Sell the Vacation, Explain away concerns, Reinforce), Value Equation, Einwand vs. Vorwand, anerkennen statt widersprechen, nachfragen, isolieren, lösen, zum Abschluss führen. Du gibst ehrliches, konkretes Feedback auf Deutsch, duzt den Lernenden, lobst nur, was wirklich gut war, und zeigst immer eine bessere Formulierung. Bewerte streng, aber fair: 10 heißt Profi-Niveau.`;

const exerciseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["score", "summary", "strengths", "improvements", "better"],
  properties: {
    score: { type: "integer", description: "0 bis 10" },
    summary: { type: "string", description: "Ein Satz Gesamturteil" },
    strengths: { type: "array", items: { type: "string" }, description: "0 bis 3 konkrete Stärken" },
    improvements: { type: "array", items: { type: "string" }, description: "1 bis 3 konkrete Verbesserungen" },
    better: { type: "string", description: "Eine verbesserte Version der Antwort, so wie man sie sagen würde" },
  },
};

const roleplaySchema = {
  type: "object",
  additionalProperties: false,
  required: ["score", "summary", "strengths", "improvements", "closer", "objections", "nextFocus"],
  properties: {
    score: { type: "integer", description: "0 bis 10" },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    closer: {
      type: "array",
      description: "Genau 6 Einträge in der Reihenfolge C, L, O, S, E, R",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["step", "rating", "note"],
        properties: {
          step: { type: "string", enum: ["C", "L", "O", "S", "E", "R"] },
          rating: { type: "string", enum: ["stark", "okay", "fehlt"] },
          note: { type: "string" },
        },
      },
    },
    objections: {
      type: "array",
      description: "Jeder Einwand oder Vorwand des Kunden",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["quote", "type", "handled", "better"],
        properties: {
          quote: { type: "string" },
          type: { type: "string", enum: ["Einwand", "Vorwand"] },
          handled: { type: "string", enum: ["gut", "teilweise", "schlecht"] },
          better: { type: "string", description: "Wie man besser hätte antworten können" },
        },
      },
    },
    nextFocus: { type: "string", description: "Woran der Lernende als Nächstes arbeiten soll" },
  },
};

const Exercise = z.object({ score: z.number(), summary: z.string(), strengths: z.array(z.string()), improvements: z.array(z.string()), better: z.string() });
const Roleplay = z.object({
  score: z.number(), summary: z.string(), strengths: z.array(z.string()), improvements: z.array(z.string()),
  closer: z.array(z.object({ step: z.string(), rating: z.string(), note: z.string() })),
  objections: z.array(z.object({ quote: z.string(), type: z.string(), handled: z.string(), better: z.string() })),
  nextFocus: z.string(),
});

export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Methode nicht erlaubt" }, 405);
  const user = await authUser(req);
  if (!user) return json({ error: "Bitte melde dich an, um KI-Feedback zu bekommen." }, 401);
  if (!apiKey()) return json({ error: "Die KI ist noch nicht eingerichtet (ANTHROPIC_API_KEY fehlt)." }, 503);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Ungültige Anfrage" }, 400); }

  let prompt: string;
  let schema: Record<string, unknown>;
  let parser: z.ZodTypeAny;
  if (body.kind === "exercise") {
    const answer = clip(body.answer, 2000);
    if (answer.trim().length < 10) return json({ error: "Die Antwort ist zu kurz." }, 400);
    prompt = `Übungsaufgabe für den Lernenden.
Kontext/Kundensatz: ${clip(body.situation, 600)}
Aufgabe: ${clip(body.task, 400)}
Musterantwort als Orientierung (nicht die einzige richtige Lösung): ${clip(body.model, 800)}

Antwort des Lernenden:
<antwort>
${answer}
</antwort>

Bewerte die Antwort.`;
    schema = exerciseSchema; parser = Exercise;
  } else if (body.kind === "roleplay") {
    const transcript = Array.isArray(body.messages) ? (body.messages as { role: string; content: string }[]).slice(0, 80) : [];
    if (transcript.length < 2) return json({ error: "Das Gespräch ist zu kurz für eine Bewertung." }, 400);
    const lines = transcript.map((m) => `${m.role === "assistant" ? "KUNDE" : "VERKÄUFER"}: ${clip(m.content, 2000)}`).join("\n");
    prompt = `Werte dieses Übungs-Verkaufsgespräch aus. Bewertet wird nur der VERKÄUFER.
Situation: ${clip(body.situation, 600)}
Ausgang: ${body.outcome === "ja" ? "Kunde hat gekauft" : body.outcome === "nein" ? "Kunde hat abgelehnt" : "Gespräch wurde vorher beendet"}

<gespraech>
${lines}
</gespraech>`;
    schema = roleplaySchema; parser = Roleplay;
  } else {
    return json({ error: "Unbekannte Art" }, 400);
  }

  if (!(await takeAiQuota(user))) return json({ error: "Tageslimit für KI-Übungen erreicht. Morgen geht's weiter!" }, 429);
  try {
    const { text } = await ask({ system: COACH, messages: [{ role: "user", content: prompt }], effort: "medium", maxTokens: 8000, schema });
    const parsed = parser.safeParse(JSON.parse(text));
    if (!parsed.success) return json({ error: "Die Auswertung war unvollständig. Bitte nochmal versuchen." }, 502);
    return json(parsed.data);
  } catch (e) {
    if (e instanceof SyntaxError) return json({ error: "Die Auswertung war unvollständig. Bitte nochmal versuchen." }, 502);
    return aiErrorResponse(e);
  }
};

export const config: Config = { path: "/api/feedback" };
