import { eq } from "drizzle-orm";
import type { DbClient } from "@infrastructure/database/drizzle/client";
import { downloadTokens } from "@infrastructure/database/drizzle/schema";
import type { IDownloadTokenRepository } from "@domain/repositories/download-token.repository.interface";
import { DownloadToken } from "@domain/entities/download-token.entity";

export class DownloadTokenRepository implements IDownloadTokenRepository {
  constructor(private readonly db: DbClient) {}

  async save(token: DownloadToken): Promise<void> {
    const row = token.toObject();
    await this.db
      .insert(downloadTokens)
      .values(row as typeof downloadTokens.$inferInsert)
      .onConflictDoUpdate({
        target: downloadTokens.id,
        set: {
          downloadCount: row.downloadCount as number,
          isActive: row.isActive as boolean,
        },
      });
  }

  async findByToken(token: string): Promise<DownloadToken | null> {
    const row = await this.db.query.downloadTokens.findFirst({
      where: eq(downloadTokens.token, token),
    });
    return row ? DownloadToken.fromObject(row) : null;
  }

  async findByOrderId(orderId: string): Promise<DownloadToken[]> {
    const rows = await this.db.query.downloadTokens.findMany({
      where: eq(downloadTokens.orderId, orderId),
    });
    return rows.map(DownloadToken.fromObject);
  }

  async revokeAllForOrder(orderId: string): Promise<void> {
    await this.db
      .update(downloadTokens)
      .set({ isActive: false })
      .where(eq(downloadTokens.orderId, orderId));
  }
}
