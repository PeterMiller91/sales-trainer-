import type { Config } from "@netlify/functions";
import { json } from "./_lib/auth.mts";
import { apiKey } from "./_lib/ai.mts";

export default async () => json({ ai: !!apiKey(), registration: !!process.env.INVITE_CODE });

export const config: Config = { path: "/api/status" };
