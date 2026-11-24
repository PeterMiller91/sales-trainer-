"use client";
import { getObjection } from "@/lib/library";
import { FreeTextExercise } from "./FreeTextExercise";

export function ObjectionExercise({ slug }: { slug: string }) {
  const o = getObjection(slug);
  return o ? <FreeTextExercise ex={o.exercise} label="Jetzt du" /> : null;
}
