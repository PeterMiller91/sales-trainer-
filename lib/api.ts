"use client";
import { useEffect, useState } from "react";
import { exportAll, mergeAll, onStoreChange } from "./store";

const TOKEN = "einwandfrei.session";
const NAME = "einwandfrei.name";
const AUTH_EVENT = "einwandfrei:auth";

export type Session = { token: string; name: string } | null;

export function getSession(): Session {
  try {
    const token = localStorage.getItem(TOKEN);
    const name = localStorage.getItem(NAME);
    return token && name ? { token, name } : null;
  } catch { return null; }
}

function setSession(s: Session) {
  try {
    if (s) { localStorage.setItem(TOKEN, s.token); localStorage.setItem(NAME, s.name); }
    else { localStorage.removeItem(TOKEN); localStorage.removeItem(NAME); }
  } catch {}
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useSession() {
  const [s, setS] = useState<Session>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setS(getSession()); setLoaded(true);
    const h = () => setS(getSession());
    window.addEventListener(AUTH_EVENT, h);
    return () => window.removeEventListener(AUTH_EVENT, h);
  }, []);
  return { session: s, loaded };
}

export class ApiError extends Error { constructor(msg: string, public status: number) { super(msg); } }

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const s = getSession();
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { "content-type": "application/json", ...(s ? { authorization: `Bearer ${s.token}` } : {}), ...(init.headers ?? {}) },
    });
  } catch {
    throw new ApiError("Keine Verbindung. Bist du online?", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && s) setSession(null);
  if (!res.ok) throw new ApiError((data as { error?: string }).error ?? `Fehler ${res.status}`, res.status);
  return data as T;
}

export type Status = { ai: boolean; registration: boolean };
export function useStatus() {
  const [st, setSt] = useState<Status | null>(null);
  useEffect(() => { api<Status>("/api/status").then(setSt).catch(() => setSt({ ai: false, registration: false })); }, []);
  return st;
}

export async function login(action: "login" | "register", name: string, pin: string, invite?: string) {
  const r = await api<{ token: string; name: string }>("/api/auth", { method: "POST", body: JSON.stringify({ action, name, pin, invite }) });
  setSession(r);
  await pullAndMerge();
  await push();
}

export async function logout() {
  try { await api("/api/auth", { method: "DELETE" }); } catch {}
  setSession(null);
}

export async function pullAndMerge() {
  const remote = await api<Record<string, Record<string, { at?: number }>>>("/api/progress");
  mergeAll(remote);
}

let timer: ReturnType<typeof setTimeout> | null = null;
export async function push() {
  if (!getSession()) return;
  await api("/api/progress", { method: "PUT", body: JSON.stringify(exportAll()) });
}

/** Startet die automatische Synchronisierung (einmal im Layout). */
export function useAutoSync() {
  useEffect(() => {
    if (getSession()) pullAndMerge().catch(() => {});
    return onStoreChange((_s, silent) => {
      if (silent || !getSession()) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { push().catch(() => {}); }, 1500);
    });
  }, []);
}
