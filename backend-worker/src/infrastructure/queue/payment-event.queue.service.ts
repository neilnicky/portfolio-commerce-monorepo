import type { IPaymentQueueService } from "@application/ports/payment-queue.port";
import type { PaymentQueueMessage } from "@app-types/common";
import type { Env } from "@config/env";

export class PaymentEventQueueService implements IPaymentQueueService {
  constructor(private readonly queue: Queue<PaymentQueueMessage>) {}

  async enqueue(message: PaymentQueueMessage): Promise<void> {
    await this.queue.send(message);
  }
}

export function createPaymentQueueService(env: Env): IPaymentQueueService {
  if (!env.PAYMENT_QUEUE) throw new Error("PAYMENT_QUEUE binding not configured");
  return new PaymentEventQueueService(env.PAYMENT_QUEUE as Queue<PaymentQueueMessage>);
}
