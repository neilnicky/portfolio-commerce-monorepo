import { getContext } from "hono/context-storage";
import type { AppContext } from "@presentation/middleware/context-injector";

export interface Env extends CloudflareBindings {
  DATABASE_URL: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  CF_ACCESS_AUD: string;
  SITE_URL: string;
  // ENVIRONMENT, ASSETS_BUCKET, PAYMENT_QUEUE come from CloudflareBindings (wrangler-generated)
}

export function getEnv(): Env {
  const ctx = getContext<AppContext>();
  if (!ctx) throw new Error("Context unavailable — is contextStorage() applied?");
  return ctx.env as Env;
}
