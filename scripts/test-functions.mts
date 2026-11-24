// Lokaler Test der Netlify-Functions mit lokalem Blob-Server und einer simulierten KI.
// Start: npx tsx scripts/test-functions.mts
import { BlobsServer } from "@netlify/blobs/server";
import { setEnvironmentContext } from "@netlify/blobs";
import { createServer } from "node:http";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const blobs = new BlobsServer({ directory: mkdtempSync(join(tmpdir(), "blobs-")), token: "t" });
const { port } = await blobs.start();
setEnvironmentContext({ edgeURL: `http://localhost:${port}`, uncachedEdgeURL: `http://localhost:${port}`, token: "t", siteID: "site" });

// Simulierte Claude-API: antwortet je nach Anfrage mit Rollenspiel-Text oder JSON-Auswertung.
let lastBody: any = null;
const fake = createServer((req, res) => {
  let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => {
    lastBody = JSON.parse(b);
    const isJson = !!lastBody.output_config?.format;
    const text = isJson
      ? JSON.stringify(lastBody.output_config.format.schema.required.includes("closer")
        ? { score: 6, summary: "Solide", strengths: ["a"], improvements: ["b"], closer: [{ step: "C", rating: "stark", note: "x" }], objections: [{ quote: "zu teuer", type: "Einwand", handled: "gut", better: "y" }], nextFocus: "isolieren" }
        : { score: 7, summary: "Gut", strengths: ["anerkannt"], improvements: ["isolieren"], better: "Besser so" })
      : "Hm, klingt interessant, aber was kostet das?\n[ENDE:JA]";
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ id: "msg_1", type: "message", role: "assistant", model: "claude-opus-5-5", content: [{ type: "text", text }], stop_reason: "end_turn", stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 } }));
  });
}).listen(0);
await new Promise((r) => fake.once("listening", r));
process.env.ANTHROPIC_BASE_URL = `http://localhost:${(fake.address() as any).port}`;

const auth = (await import("../netlify/functions/auth.mts")).default;
const progress = (await import("../netlify/functions/progress.mts")).default;
const roleplay = (await import("../netlify/functions/roleplay.mts")).default;
const feedback = (await import("../netlify/functions/feedback.mts")).default;

const req = (method: string, body?: unknown, token?: string) =>
  new Request("http://x/api", { method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });

let r = await auth(req("POST", { action: "register", name: "Daniel", pin: "1234", invite: "x" }));
assert.equal(r.status, 403, "ohne INVITE_CODE gesperrt");
process.env.INVITE_CODE = "geheim";
r = await auth(req("POST", { action: "register", name: "Daniel", pin: "1234", invite: "falsch" }));
assert.equal(r.status, 403, "falscher Code");
r = await auth(req("POST", { action: "register", name: "Daniel", pin: "12", invite: "geheim" }));
assert.equal(r.status, 400, "PIN zu kurz");
r = await auth(req("POST", { action: "register", name: "Daniel", pin: "1234", invite: "geheim" }));
assert.equal(r.status, 200); const { token } = await r.json();
r = await auth(req("POST", { action: "register", name: "daniel", pin: "9999", invite: "geheim" }));
assert.equal(r.status, 409, "Name doppelt");
r = await auth(req("POST", { action: "login", name: "Daniel", pin: "0000" }));
assert.equal(r.status, 401, "falsche PIN");
r = await auth(req("POST", { action: "login", name: " DANIEL ", pin: "1234" }));
assert.equal(r.status, 200, "Login unabhängig von Groß/Klein");
const token2 = (await r.json()).token;

assert.equal((await progress(req("GET"))).status, 401, "progress ohne Login");
r = await progress(req("PUT", { progress: { a: { score: 1, total: 2, at: 5 } } }, token));
assert.equal(r.status, 200);
r = await progress(req("GET", undefined, token2));
assert.deepEqual(await r.json(), { progress: { a: { score: 1, total: 2, at: 5 } } }, "Sync über zweite Sitzung");

const rpBody = { setup: { industry: "Fitness", difficulty: 2 }, messages: [{ role: "user", content: "Hallo!" }] };
assert.equal((await roleplay(req("POST", rpBody))).status, 401, "Rollenspiel ohne Login");
assert.equal((await roleplay(req("POST", rpBody, token))).status, 503, "ohne API-Key");
process.env.ANTHROPIC_API_KEY = "sk-test";
r = await roleplay(req("POST", rpBody, token));
assert.equal(r.status, 200); const rp = await r.json();
assert.equal(rp.reply, "Hm, klingt interessant, aber was kostet das?"); assert.equal(rp.ended, "ja");
assert.equal(lastBody.model, "claude-opus-5-5"); assert.equal(lastBody.fallbacks, "default"); assert.equal(lastBody.output_config.effort, "low");
assert.match(lastBody.system, /Fitness/);
assert.equal((await roleplay(req("POST", { ...rpBody, messages: [{ role: "assistant", content: "x" }] }, token))).status, 400, "erste Nachricht muss vom Verkäufer sein");

r = await feedback(req("POST", { kind: "exercise", situation: "zu teuer", task: "t", model: "m", answer: "Verstehe ich, was genau ist Ihnen zu teuer?" }, token));
assert.equal(r.status, 200); assert.equal((await r.json()).score, 7);
assert.equal(lastBody.output_config.format.type, "json_schema");
r = await feedback(req("POST", { kind: "roleplay", situation: "s", outcome: "ja", messages: [{ role: "user", content: "Hallo" }, { role: "assistant", content: "Hi" }] }, token));
assert.equal(r.status, 200); assert.equal((await r.json()).closer[0].step, "C");

process.env.AI_DAILY_LIMIT = "3"; // 3 KI-Aufrufe sind schon gelaufen
r = await feedback(req("POST", { kind: "exercise", situation: "s", task: "t", model: "m", answer: "Noch eine Antwort hier" }, token));
assert.equal(r.status, 429, "Tageslimit greift");

assert.equal((await auth(req("DELETE", undefined, token))).status, 200);
assert.equal((await progress(req("GET", undefined, token))).status, 401, "nach Abmelden ungültig");

console.log("Alle Function-Tests bestanden ✓");
await blobs.stop(); fake.close();
