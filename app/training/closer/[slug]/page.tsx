import { notFound } from "next/navigation";
import { scenarios, getScenario } from "@/lib/exercises";
import { ScenarioRunner } from "@/components/ScenarioRunner";

export function generateStaticParams() {
  return scenarios.map((s) => ({ slug: s.slug }));
}

export default async function ScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getScenario(slug);
  if (!s) notFound();
  return <ScenarioRunner slug={s.slug} />;
}
