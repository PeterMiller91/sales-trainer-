import type { Config } from "@netlify/functions";
import { json } from "./_lib/auth.mts";

export default async () => json({ ai: !!process.env.ANTHROPIC_API_KEY, registration: !!process.env.INVITE_CODE });

export const config: Config = { path: "/api/status" };
