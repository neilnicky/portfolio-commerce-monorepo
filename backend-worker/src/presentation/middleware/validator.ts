import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";
import { ValidationError } from "@domain/errors/domain.error";

const makeHook =
  (target: "json" | "query" | "param") =>
  (result: { success: boolean; error?: { issues: unknown[] } }) => {
    if (!result.success) {
      throw new ValidationError(`Invalid ${target} payload`, { issues: result.error?.issues });
    }
  };

export const validateJson = (schema: ZodSchema) => zValidator("json", schema, makeHook("json"));
export const validateQuery = (schema: ZodSchema) => zValidator("query", schema, makeHook("query"));
export const validateParam = (schema: ZodSchema) => zValidator("param", schema, makeHook("param"));
