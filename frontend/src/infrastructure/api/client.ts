import type { ZodType } from "zod";
import {
  BaseError,
  InfrastructureError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} from "@domain/errors/base.error";

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => string | undefined;
}

type RequestInitWithSchema<T> = RequestInit & { schema?: ZodType<T> };

/** HTTP status → typed domain error. Downstream branches on `error.kind`, never status. */
async function toTypedError(res: Response): Promise<BaseError> {
  const message = await res.text().catch(() => res.statusText);
  switch (res.status) {
    case 400:
      return new ValidationError(message);
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    default:
      return new InfrastructureError(message);
  }
}

/**
 * The single place that knows the base URL, auth header injection, error translation,
 * and response validation. Everything else goes through this.
 */
export function createApiClient(opts: ApiClientOptions) {
  async function request<T>(path: string, init?: RequestInitWithSchema<T>): Promise<T> {
    const token = opts.getToken?.();
    const headers = new Headers(init?.headers);
    headers.set("content-type", "application/json");
    if (token) headers.set("authorization", `Bearer ${token}`);

    const res = await fetch(`${opts.baseUrl}${path}`, { ...init, headers });
    if (!res.ok) throw await toTypedError(res);

    const json = (await res.json()) as unknown;
    return init?.schema ? init.schema.parse(json) : (json as T);
  }

  return {
    get: <T>(path: string, init?: RequestInitWithSchema<T>) =>
      request<T>(path, { ...init, method: "GET" }),
    post: <T>(path: string, body?: unknown, init?: RequestInitWithSchema<T>) =>
      request<T>(path, { ...init, method: "POST", body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: unknown, init?: RequestInitWithSchema<T>) =>
      request<T>(path, { ...init, method: "PATCH", body: JSON.stringify(body) }),
    del: <T>(path: string, init?: RequestInitWithSchema<T>) =>
      request<T>(path, { ...init, method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
