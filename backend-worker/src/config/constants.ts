export const DOWNLOAD_TOKEN_TTL_SECONDS = 24 * 60 * 60;
export const DOWNLOAD_TOKEN_MAX_DOWNLOADS = 5;
export const VERIFICATION_CODE_TTL_SECONDS = 15 * 60;
export const FRESH_LINK_RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
export const FRESH_LINK_RATE_LIMIT_MAX = 3;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const SIGNED_URL_EXPIRY_SECONDS = 300;

export const ERROR_MESSAGES = {
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  INVALID_TOKEN: "Invalid or expired download link",
  INVALID_CODE: "Invalid or expired verification code",
  RATE_LIMITED: "Too many requests, please try again later",
} as const;
