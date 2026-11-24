"use client";
import { useCallback } from "react";
import { useSection } from "./store";

export type Rating = "gut" | "mittel" | "nochmal";
export type Answer = { text: string; rating?: Rating; at?: number; ai?: { score: number; summary: string } };

export function useAnswers() {
  const { data, loaded, update } = useSection<Record<string, Answer>>("answers");
  const save = useCallback((id: string, a: Answer) => update(id, a), [update]);
  return { answers: data, loaded, save };
}
