import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import type { Env } from "@config/env";

export type DbClient = ReturnType<typeof createDbClient>;

export function createDbClient(env: Env) {
  const sql = neon(env.DATABASE_URL);
  return drizzle(sql, { schema });
}
