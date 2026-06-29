import type { CurrencyCode } from "@domain/value-objects/money.vo";

export interface PaymentOrderResult {
  razorpayOrderId: string;
  amount: number;
  currency: CurrencyCode;
}

export interface PaymentDetails {
  id: string;
  orderId: string;
  status: string;
  amount: number;
  currency: CurrencyCode;
}

export interface IPaymentService {
  createOrder(amount: number, currency: CurrencyCode, receiptId: string): Promise<PaymentOrderResult>;
  verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean>;
  fetchPayment(paymentId: string): Promise<PaymentDetails | null>;
}
