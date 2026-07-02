/** Wire shape from the backend API. */
export interface DownloadTokenDto {
  token: string;
  order_id: string;
  expires_at: string;
}
