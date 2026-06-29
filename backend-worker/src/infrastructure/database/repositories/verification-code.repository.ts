import { eq, gte, count, desc } from "drizzle-orm";
import type { DbClient } from "@infrastructure/database/drizzle/client";
import { verificationCodes } from "@infrastructure/database/drizzle/schema";
import type { IVerificationCodeRepository } from "@domain/repositories/verification-code.repository.interface";
import { VerificationCode } from "@domain/entities/verification-code.entity";

export class VerificationCodeRepository implements IVerificationCodeRepository {
  constructor(private readonly db: DbClient) {}

  async save(code: VerificationCode): Promise<void> {
    const row = code.toObject();
    await this.db
      .insert(verificationCodes)
      .values(row as typeof verificationCodes.$inferInsert)
      .onConflictDoUpdate({
        target: verificationCodes.id,
        set: { used: row.used as boolean },
      });
  }

  async findLatestByOrderId(orderId: string): Promise<VerificationCode | null> {
    const row = await this.db.query.verificationCodes.findFirst({
      where: eq(verificationCodes.orderId, orderId),
      orderBy: [desc(verificationCodes.createdAt)],
    });
    return row ? VerificationCode.fromObject(row) : null;
  }

  async countRecentByOrderId(orderId: string, since: Date): Promise<number> {
    const [{ total }] = await this.db
      .select({ total: count() })
      .from(verificationCodes)
      .where(
        eq(verificationCodes.orderId, orderId) &&
          gte(verificationCodes.createdAt, since.toISOString()),
      );
    return total;
  }
}
