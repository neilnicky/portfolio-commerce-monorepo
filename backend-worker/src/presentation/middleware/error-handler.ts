import type { Context, ErrorHandler } from "hono";
import { BaseError } from "@domain/errors/base.error";
import type { AppContext } from "./context-injector";

export const onErrorHandler: ErrorHandler<AppContext> = (err, c) => {
  console.error("[error]", err);

  if (err instanceof BaseError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return c.json(err.toJSON(), err.statusCode as any);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return c.json(
    {
      error: "InternalServerError",
      message: "An unexpected error occurred",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
    500 as any,
  );
};

export const notFoundHandler = (c: Context) =>
  c.json(
    {
      error: "NotFound",
      message: `Route ${c.req.method} ${c.req.path} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    },
    404 as any,
  );
