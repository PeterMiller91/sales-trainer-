"use client";
import { useCallback } from "react";
import { useSection, updateEntry, readSection } from "./store";

type P = { score: number; total: number; done: boolean; at?: number };

export function useProgress() {
  const { data, update } = useSection<Record<string, P>>("progress");
  const save = useCallback((slug: string, score: number, total: number) => {
    update(slug, { score, total, done: score / total >= 0.6 });
  }, [update]);
  return { progress: data, save };
}

export function useCardBoxes() {
  const { data, loaded, update } = useSection<Record<string, { box: number; at?: number }>>("cards");
  const boxes = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.box]));
  const setBox = useCallback((id: string, box: number) => update(id, { box }), [update]);
  return { boxes, loaded, setBox };
}

/** Einfache Statistik-Einträge, z. B. Spielergebnisse. */
export function recordStat(kind: string, value: Record<string, unknown>) {
  const id = `${kind}-${Date.now()}`;
  updateEntry("stats", id, { kind, ...value });
}

export function readStats() {
  return Object.values(readSection("stats")) as { kind: string; at?: number; [k: string]: unknown }[];
}
