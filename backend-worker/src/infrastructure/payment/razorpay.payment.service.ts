import type { IPaymentService, PaymentOrderResult, PaymentDetails } from "@application/ports/payment.port";
import type { CurrencyCode } from "@domain/value-objects/money.vo";
import type { Env } from "@config/env";
import { hmacSha256, timingSafeEqual } from "@utils/crypto";
import { ExternalServiceError } from "@domain/errors/domain.error";

const RAZORPAY_API = "https://api.razorpay.com/v1";

export class RazorpayPaymentService implements IPaymentService {
  private readonly authHeader: string;

  constructor(
    private readonly keyId: string,
    private readonly keySecret: string,
    private readonly webhookSecret: string,
  ) {
    this.authHeader = `Basic ${btoa(`${keyId}:${keySecret}`)}`;
  }

  async createOrder(
    amount: number,
    currency: CurrencyCode,
    receiptId: string,
  ): Promise<PaymentOrderResult> {
    const res = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency, receipt: receiptId }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new ExternalServiceError("Razorpay", { status: res.status, body: err });
    }

    const data = (await res.json()) as { id: string; amount: number; currency: string };
    return {
      razorpayOrderId: data.id,
      amount: data.amount,
      currency: data.currency as CurrencyCode,
    };
  }

  async verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
    const expected = await hmacSha256(this.webhookSecret, rawBody);
    return timingSafeEqual(expected, signature);
  }

  async fetchPayment(paymentId: string): Promise<PaymentDetails | null> {
    try {
      const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}`, {
        headers: { Authorization: this.authHeader },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        id: string;
        order_id: string;
        status: string;
        amount: number;
        currency: string;
      };
      return {
        id: data.id,
        orderId: data.order_id,
        status: data.status,
        amount: data.amount,
        currency: data.currency as CurrencyCode,
      };
    } catch {
      return null;
    }
  }
}

export function createPaymentService(env: Env): IPaymentService {
  return new RazorpayPaymentService(
    env.RAZORPAY_KEY_ID,
    env.RAZORPAY_KEY_SECRET,
    env.RAZORPAY_WEBHOOK_SECRET,
  );
}
