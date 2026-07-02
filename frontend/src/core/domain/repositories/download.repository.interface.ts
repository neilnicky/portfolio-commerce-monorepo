import type { DownloadToken } from "@domain/entities/download-token.entity";

export interface RequestFreshLinkInput {
  /** Email already on record for the purchase — a one-time code is sent here. */
  email: string;
  token: string;
}

export interface VerifyFreshLinkInput {
  email: string;
  token: string;
  code: string;
}

/** Persistence PORT for the download / fresh-link lifecycle. */
export interface IDownloadRepository {
  resolve(token: string): Promise<DownloadToken | null>;
  /** Sends a one-time verification code to the email of record. Rate-limited server-side. */
  requestFreshLink(input: RequestFreshLinkInput): Promise<void>;
  /** Exchanges a valid code for a fresh download token. */
  verifyFreshLink(input: VerifyFreshLinkInput): Promise<DownloadToken>;
}
