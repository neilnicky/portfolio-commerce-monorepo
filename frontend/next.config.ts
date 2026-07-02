import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Lets local `next dev` see Cloudflare bindings (.dev.vars / wrangler config).
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // Node.js runtime only — NEVER `export const runtime = "edge"` (unsupported by OpenNext).
  reactStrictMode: true,
};

export default nextConfig;
