/** A time-limited, single-purpose link tied to a paid order. */
export class DownloadToken {
  constructor(
    public readonly token: string,
    public readonly orderId: string,
    public readonly expiresAt: Date,
  ) {}

  isExpired(now: Date = new Date()): boolean {
    return now.getTime() >= this.expiresAt.getTime();
  }
}
