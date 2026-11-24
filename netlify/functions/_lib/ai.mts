import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";
let client: Anthropic | null = null;
export const ai = () => (client ??= new Anthropic({ maxRetries: 2, timeout: 60_000 }));

/** Gemeinsamer Aufruf mit serverseitigem Fallback, falls das Modell eine Anfrage ablehnt. */
export async function ask(params: {
  system: string;
  messages: Anthropic.Beta.BetaMessageParam[];
  effort: "low" | "medium" | "high";
  maxTokens: number;
  schema?: Record<string, unknown>;
}) {
  const res = await ai().beta.messages.create({
    model: MODEL,
    max_tokens: params.maxTokens,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: params.system,
    messages: params.messages,
    output_config: {
      effort: params.effort,
      ...(params.schema ? { format: { type: "json_schema" as const, schema: params.schema } } : {}),
    },
  });
  if (res.stop_reason === "refusal") throw new AiRefusal();
  const text = res.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("").trim();
  return { text, stopReason: res.stop_reason };
}

export class AiRefusal extends Error {}

export function aiErrorResponse(e: unknown) {
  const body = (msg: string, status: number) =>
    new Response(JSON.stringify({ error: msg }), { status, headers: { "content-type": "application/json; charset=utf-8" } });
  if (e instanceof AiRefusal) return body("Die KI hat diese Anfrage abgelehnt. Formuliere es bitte anders.", 422);
  if (e instanceof Anthropic.AuthenticationError) return body("Der KI-Schlüssel (ANTHROPIC_API_KEY) ist ungültig.", 500);
  if (e instanceof Anthropic.RateLimitError) return body("Die KI ist gerade ausgelastet. Bitte versuch es in einer Minute nochmal.", 429);
  if (e instanceof Anthropic.APIConnectionError) return body("Keine Verbindung zur KI. Bitte versuch es gleich nochmal.", 503);
  if (e instanceof Anthropic.APIError) return body(`KI-Fehler (${e.status ?? "?"}). Bitte versuch es nochmal.`, 502);
  console.error(e);
  return body("Unerwarteter Fehler. Bitte versuch es nochmal.", 500);
}

const clip = (s: unknown, n: number) => String(s ?? "").slice(0, n);
export { clip };
