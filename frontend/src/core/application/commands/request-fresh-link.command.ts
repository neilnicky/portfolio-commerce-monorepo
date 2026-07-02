import type { IDownloadRepository, RequestFreshLinkInput } from "@domain/repositories/download.repository.interface";

/** Sends a one-time code to the email on record. Rate-limited server-side. */
export class RequestFreshLinkCommand {
  constructor(private readonly downloads: IDownloadRepository) {}

  async execute(input: RequestFreshLinkInput): Promise<void> {
    await this.downloads.requestFreshLink(input);
  }
}
