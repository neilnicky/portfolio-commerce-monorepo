/**
 * Typed error hierarchy — mirrors the backend so an error keeps its meaning from the
 * API all the way to the toast. Downstream code branches on `kind`, never raw HTTP status.
 */
export type ErrorKind =
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "infrastructure";

export abstract class BaseError extends Error {
  abstract readonly kind: ErrorKind;
  constructor(message: string, public readonly details?: unknown) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends BaseError {
  readonly kind = "validation";
}
export class UnauthorizedError extends BaseError {
  readonly kind = "unauthorized";
}
export class ForbiddenError extends BaseError {
  readonly kind = "forbidden";
}
export class NotFoundError extends BaseError {
  readonly kind = "not_found";
}
export class ConflictError extends BaseError {
  readonly kind = "conflict";
}
export class InfrastructureError extends BaseError {
  readonly kind = "infrastructure";
}
