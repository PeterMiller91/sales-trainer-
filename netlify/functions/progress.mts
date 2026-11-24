import type { Config } from "@netlify/functions";
import { authUser, json, userData } from "./_lib/auth.mts";

const MAX_BYTES = 900_000;

export default async (req: Request) => {
  const user = await authUser(req);
  if (!user) return json({ error: "Bitte melde dich an." }, 401);
  const store = userData();
  if (req.method === "GET") {
    return json((await store.get(user, { type: "json" })) ?? {});
  }
  if (req.method === "PUT") {
    const text = await req.text();
    if (text.length > MAX_BYTES) return json({ error: "Daten zu groß" }, 413);
    let data: unknown;
    try { data = JSON.parse(text); } catch { return json({ error: "Ungültige Daten" }, 400); }
    if (!data || typeof data !== "object" || Array.isArray(data)) return json({ error: "Ungültige Daten" }, 400);
    await store.setJSON(user, data);
    return json({ ok: true, at: Date.now() });
  }
  return json({ error: "Methode nicht erlaubt" }, 405);
};

export const config: Config = { path: "/api/progress" };
