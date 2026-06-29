import { ValidationError } from "@domain/errors/domain.error";

export class DownloadToken {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public downloadCount: number,
    public readonly maxDownloads: number,
    public isActive: boolean,
    public readonly createdAt: Date,
  ) {}

  isValid(): boolean {
    return this.isActive && new Date() < this.expiresAt && this.downloadCount < this.maxDownloads;
  }

  recordDownload(): void {
    if (!this.isValid()) throw new ValidationError("Download token is no longer valid");
    this.downloadCount += 1;
  }

  revoke(): void {
    this.isActive = false;
  }

  static create(
    id: string,
    orderId: string,
    token: string,
    ttlSeconds: number,
    maxDownloads: number,
  ): DownloadToken {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
    return new DownloadToken(id, orderId, token, expiresAt, 0, maxDownloads, true, now);
  }

  toObject(): Record<string, unknown> {
    return {
      id: this.id,
      orderId: this.orderId,
      token: this.token,
      expiresAt: this.expiresAt.toISOString(),
      downloadCount: this.downloadCount,
      maxDownloads: this.maxDownloads,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromObject(d: Record<string, unknown>): DownloadToken {
    return new DownloadToken(
      d.id as string,
      d.orderId as string,
      d.token as string,
      new Date(d.expiresAt as string),
      d.downloadCount as number,
      d.maxDownloads as number,
      d.isActive as boolean,
      new Date(d.createdAt as string),
    );
  }
}
