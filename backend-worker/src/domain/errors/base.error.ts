import { HttpStatusCode } from "@app-types/common";

export abstract class BaseError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly timestamp: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.details = details;
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      details: this.details,
    };
  }
}

export abstract class DomainError extends BaseError {}
export abstract class ApplicationError extends BaseError {}
export abstract class InfrastructureError extends BaseError {}
