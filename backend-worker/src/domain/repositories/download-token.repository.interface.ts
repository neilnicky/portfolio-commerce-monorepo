import type { DownloadToken } from "@domain/entities/download-token.entity";

export interface IDownloadTokenRepository {
  save(token: DownloadToken): Promise<void>;
  findByToken(token: string): Promise<DownloadToken | null>;
  findByOrderId(orderId: string): Promise<DownloadToken[]>;
  revokeAllForOrder(orderId: string): Promise<void>;
}
