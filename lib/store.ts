"use client";
// Lokaler Speicher für alles, was der Nutzer tut. Jeder Bereich ist ein Objekt
// { id: { ...daten, at } }. Ist ein Konto angemeldet, wird automatisch synchronisiert.
import { useCallback, useEffect, useState } from "react";

export const SECTIONS = ["progress", "answers", "cards", "stats", "roleplays"] as const;
export type Section = (typeof SECTIONS)[number];
type Entry = { at?: number; [k: string]: unknown };
export type SectionData = Record<string, Entry>;

const PREFIX = "einwandfrei.";
const LEGACY: Partial<Record<Section, string>> = { progress: "einwandfrei.progress.v1", answers: "einwandfrei.answers.v1" };
const EVENT = "einwandfrei:store";

export function readSection<T extends SectionData = SectionData>(s: Section): T {
  try {
    const raw = localStorage.getItem(PREFIX + s) ?? (LEGACY[s] ? localStorage.getItem(LEGACY[s]!) : null);
    return JSON.parse(raw || "{}");
  } catch { return {} as T; }
}

export function writeSection(s: Section, data: SectionData, opts: { silent?: boolean } = {}) {
  try { localStorage.setItem(PREFIX + s, JSON.stringify(data)); } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT, { detail: { section: s, silent: opts.silent } }));
}

export function updateEntry(s: Section, id: string, value: Entry) {
  const cur = readSection(s);
  writeSection(s, { ...cur, [id]: { ...value, at: Date.now() } });
}

export function exportAll(): Record<Section, SectionData> {
  return Object.fromEntries(SECTIONS.map((s) => [s, readSection(s)])) as Record<Section, SectionData>;
}

/** Zusammenführen: pro Eintrag gewinnt der neuere (at). */
export function mergeAll(remote: Partial<Record<Section, SectionData>>) {
  for (const s of SECTIONS) {
    const local = readSection(s);
    const r = remote[s] ?? {};
    const merged: SectionData = { ...r };
    for (const [k, v] of Object.entries(local)) {
      if (!merged[k] || (v.at ?? 0) >= (merged[k].at ?? 0)) merged[k] = v;
    }
    writeSection(s, merged, { silent: true });
  }
}

export function onStoreChange(cb: (section: Section, silent?: boolean) => void) {
  const h = (e: Event) => { const d = (e as CustomEvent).detail; cb(d.section, d.silent); };
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}

/** React-Hook: liest einen Bereich und aktualisiert sich bei Änderungen. */
export function useSection<T extends SectionData = SectionData>(s: Section) {
  const [data, setData] = useState<T>({} as T);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setData(readSection<T>(s)); setLoaded(true);
    return onStoreChange((sec) => { if (sec === s) setData(readSection<T>(s)); });
  }, [s]);
  const update = useCallback((id: string, value: Entry) => updateEntry(s, id, value), [s]);
  return { data, loaded, update };
}
