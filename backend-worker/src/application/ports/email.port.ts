export interface IEmailService {
  sendDownloadLink(to: string, productName: string, downloadUrl: string): Promise<void>;
  sendVerificationCode(to: string, code: string): Promise<void>;
}
