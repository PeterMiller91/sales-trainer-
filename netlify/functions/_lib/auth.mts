import { getStore } from "@netlify/blobs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const users = () => getStore({ name: "users", consistency: "strong" });
export const sessions = () => getStore({ name: "sessions", consistency: "strong" });
export const userData = () => getStore({ name: "progress", consistency: "strong" });
export const usage = () => getStore({ name: "usage", consistency: "strong" });

export type User = { name: string; salt: string; hash: string; created: number };

export const userKey = (name: string) => name.trim().toLowerCase().replace(/[^a-z0-9äöüß._-]/g, "-");

export function hashPin(pin: string, salt = randomBytes(16).toString("hex")) {
  return { salt, hash: scryptSync(pin, salt, 32).toString("hex") };
}

export function checkPin(pin: string, u: User) {
  const a = Buffer.from(hashPin(pin, u.salt).hash, "hex");
  const b = Buffer.from(u.hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function newSession(key: string) {
  const token = randomBytes(32).toString("hex");
  await sessions().setJSON(token, { user: key, created: Date.now() });
  return token;
}

const SESSION_DAYS = 90;

/** Liefert den Benutzer-Schlüssel zum Bearer-Token oder null. */
export async function authUser(req: Request): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const s = (await sessions().get(token, { type: "json" })) as { user: string; created: number } | null;
  if (!s || Date.now() - s.created > SESSION_DAYS * 864e5) return null;
  return s.user;
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

/** Tageslimit für KI-Aufrufe pro Benutzer (Kostenschutz). */
export async function takeAiQuota(user: string): Promise<boolean> {
  const limit = Number(process.env.AI_DAILY_LIMIT || 80);
  const key = `${user}:${new Date().toISOString().slice(0, 10)}`;
  const store = usage();
  const n = Number((await store.get(key)) || 0);
  if (n >= limit) return false;
  await store.set(key, String(n + 1));
  return true;
}
