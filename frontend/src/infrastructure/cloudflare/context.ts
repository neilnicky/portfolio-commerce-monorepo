import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { buildContainer, type Container } from "@infrastructure/container";
import { createApiClient } from "@infrastructure/api/client";
import type { AppEnv } from "@config/env";

/**
 * SERVER-ONLY. Builds a per-request container from Cloudflare bindings.
 * Secrets + the backend URL come from `env`, never from NEXT_PUBLIC_*.
 */
export function getServerContainer(): Container {
  // API_BASE_URL / INTERNAL_SERVICE_SECRET are .dev.vars / secrets, not declared bindings,
  // so they aren't on the generated CloudflareEnv — bridge through `unknown` to AppEnv.
  const { env } = getCloudflareContext();
  const appEnv = env as unknown as AppEnv;
  return buildContainer({
    api: createApiClient({
      baseUrl: appEnv.API_BASE_URL,
      getToken: () => appEnv.INTERNAL_SERVICE_SECRET,
    }),
  });
}
