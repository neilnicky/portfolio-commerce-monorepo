import type { VerificationCode } from "@domain/entities/verification-code.entity";

export interface IVerificationCodeRepository {
  save(code: VerificationCode): Promise<void>;
  findLatestByOrderId(orderId: string): Promise<VerificationCode | null>;
  countRecentByOrderId(orderId: string, since: Date): Promise<number>;
}
