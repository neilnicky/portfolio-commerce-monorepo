import type { PaymentQueueMessage } from "@app-types/common";

export interface IPaymentQueueService {
  enqueue(message: PaymentQueueMessage): Promise<void>;
}
