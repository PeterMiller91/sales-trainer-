"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "einwandfrei.answers.v1";
export type Rating = "gut" | "mittel" | "nochmal";
export type Answer = { text: string; rating?: Rating; at: number };
type Store = Record<string, Answer>;

function read(): Store {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function useAnswers() {
  const [answers, setAnswers] = useState<Store>({});
  useEffect(() => { setAnswers(read()); }, []);
  const save = useCallback((id: string, a: Answer) => {
    const next = { ...read(), [id]: a };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setAnswers(next);
  }, []);
  return { answers, save };
}
