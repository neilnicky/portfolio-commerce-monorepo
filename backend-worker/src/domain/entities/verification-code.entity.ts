import { ValidationError } from "@domain/errors/domain.error";

export class VerificationCode {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly code: string,
    public readonly expiresAt: Date,
    public used: boolean,
    public readonly createdAt: Date,
  ) {}

  isValid(): boolean {
    return !this.used && new Date() < this.expiresAt;
  }

  consume(): void {
    if (!this.isValid()) throw new ValidationError("Verification code is expired or already used");
    this.used = true;
  }

  static create(id: string, orderId: string, code: string, ttlSeconds: number): VerificationCode {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
    return new VerificationCode(id, orderId, code, expiresAt, false, now);
  }

  toObject(): Record<string, unknown> {
    return {
      id: this.id,
      orderId: this.orderId,
      code: this.code,
      expiresAt: this.expiresAt.toISOString(),
      used: this.used,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromObject(d: Record<string, unknown>): VerificationCode {
    return new VerificationCode(
      d.id as string,
      d.orderId as string,
      d.code as string,
      new Date(d.expiresAt as string),
      d.used as boolean,
      new Date(d.createdAt as string),
    );
  }
}
