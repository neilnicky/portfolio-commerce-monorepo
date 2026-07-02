import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// WORKERS FREE PLAN: no Durable Objects, no Queues.
// Therefore NO `queue`, NO sharded tag cache, NO R2 incremental cache override here.
// Falls back to the Workers-Static-Assets incremental cache (read-only, no on-demand
// revalidation). Pages are SSR or build-time static.
// If the account upgrades to Workers Paid, re-introduce r2IncrementalCache + doQueue +
// tag cache here and the matching bindings in wrangler.jsonc to unlock ISR revalidation.
export default defineCloudflareConfig({});
