"use client";
import { useEffect, useState, useCallback } from "react";

const KEY = "einwandfrei.progress.v1";
type Progress = Record<string, { score: number; total: number; done: boolean }>;

function read(): Progress {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});
  useEffect(() => { setProgress(read()); }, []);
  const save = useCallback((slug: string, score: number, total: number) => {
    const next = { ...read(), [slug]: { score, total, done: score / total >= 0.6 } };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setProgress(next);
  }, []);
  return { progress, save };
}
