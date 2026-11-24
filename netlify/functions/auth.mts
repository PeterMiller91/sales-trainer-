import type { Config } from "@netlify/functions";
import { checkPin, hashPin, json, newSession, sessions, userKey, users, type User } from "./_lib/auth.mts";

export default async (req: Request) => {
  if (req.method === "DELETE") {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
    if (token) await sessions().delete(token);
    return json({ ok: true });
  }
  if (req.method !== "POST") return json({ error: "Methode nicht erlaubt" }, 405);

  let body: { action?: string; name?: string; pin?: string; invite?: string };
  try { body = await req.json(); } catch { return json({ error: "Ungültige Anfrage" }, 400); }
  const name = String(body.name ?? "").trim().slice(0, 40);
  const pin = String(body.pin ?? "");
  if (name.length < 2) return json({ error: "Bitte gib einen Namen mit mindestens 2 Zeichen ein." }, 400);
  if (!/^\d{4,8}$/.test(pin)) return json({ error: "Die PIN muss 4 bis 8 Ziffern haben." }, 400);
  const key = userKey(name);
  const store = users();
  const existing = (await store.get(key, { type: "json" })) as User | null;

  if (body.action === "register") {
    const invite = process.env.INVITE_CODE;
    if (!invite) return json({ error: "Registrierung ist noch nicht freigeschaltet (INVITE_CODE fehlt)." }, 403);
    if (String(body.invite ?? "").trim() !== invite) return json({ error: "Der Einladungscode stimmt nicht." }, 403);
    if (existing) return json({ error: "Diesen Namen gibt es schon. Bitte melde dich an oder wähle einen anderen." }, 409);
    const user: User = { name, ...hashPin(pin), created: Date.now() };
    await store.setJSON(key, user);
    return json({ token: await newSession(key), name });
  }

  if (body.action === "login") {
    // Gleiche Antwort für unbekannten Namen und falsche PIN.
    if (!existing || !checkPin(pin, existing)) return json({ error: "Name oder PIN stimmt nicht." }, 401);
    return json({ token: await newSession(key), name: existing.name });
  }

  return json({ error: "Unbekannte Aktion" }, 400);
};

export const config: Config = { path: "/api/auth" };
