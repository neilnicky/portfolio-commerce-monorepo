import { Resend } from "resend";
import type { IEmailService } from "@application/ports/email.port";
import type { Env } from "@config/env";

export class ResendEmailService implements IEmailService {
  private readonly resend: Resend;

  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
  ) {
    this.resend = new Resend(apiKey);
  }

  async sendDownloadLink(to: string, productName: string, downloadUrl: string): Promise<void> {
    await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: `Your download: ${productName}`,
      html: `
        <p>Thank you for your purchase!</p>
        <p>Your download link for <strong>${productName}</strong> is ready:</p>
        <p><a href="${downloadUrl}">Download ${productName}</a></p>
        <p>This link expires in 24 hours and can be used up to 5 times.</p>
        <p>If your link expires, you can request a new one from the order confirmation page.</p>
      `,
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: "Your verification code",
      html: `
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code expires in 15 minutes.</p>
      `,
    });
  }
}

export function createEmailService(env: Env): IEmailService {
  return new ResendEmailService(env.RESEND_API_KEY, env.RESEND_FROM_EMAIL);
}
