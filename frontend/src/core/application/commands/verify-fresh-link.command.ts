import type { IDownloadRepository, VerifyFreshLinkInput } from "@domain/repositories/download.repository.interface";

/** Exchanges a valid one-time code for a fresh, time-limited download token. */
export class VerifyFreshLinkCommand {
  constructor(private readonly downloads: IDownloadRepository) {}

  async execute(input: VerifyFreshLinkInput): Promise<{ token: string; expiresAt: string }> {
    const dt = await this.downloads.verifyFreshLink(input);
    return { token: dt.token, expiresAt: dt.expiresAt.toISOString() };
  }
}
