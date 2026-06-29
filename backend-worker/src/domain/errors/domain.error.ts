import { HttpStatusCode } from "@app-types/common";
import { DomainError, ApplicationError, InfrastructureError } from "./base.error";

export class ValidationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, HttpStatusCode.BAD_REQUEST, details);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      HttpStatusCode.NOT_FOUND,
    );
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden") {
    super(message, HttpStatusCode.FORBIDDEN);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, HttpStatusCode.CONFLICT);
  }
}

export class QuotaExceededError extends ApplicationError {
  constructor(message: string) {
    super(message, HttpStatusCode.TOO_MANY_REQUESTS);
  }
}

export class DatabaseError extends InfrastructureError {
  constructor(message: string, details?: unknown) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, details);
  }
}

export class ExternalServiceError extends InfrastructureError {
  constructor(service: string, details?: unknown) {
    super(`External service error: ${service}`, HttpStatusCode.BAD_GATEWAY, details);
  }
}

export class QueueError extends InfrastructureError {
  constructor(message: string, details?: unknown) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, details);
  }
}
