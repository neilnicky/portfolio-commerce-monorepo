import type { PaymentQueueMessage } from "@app-types/common";
import { createDbClient } from "@infrastructure/database/drizzle/client";
import { OrderRepository } from "@infrastructure/database/repositories/order.repository";
import { DownloadTokenRepository } from "@infrastructure/database/repositories/download-token.repository";
import { createEmailService } from "@infrastructure/email/resend.email.service";
import { ProductRepository } from "@infrastructure/database/repositories/product.repository";
import { ConfirmPaymentUseCase } from "@application/use-cases/order/confirm-payment.use-case";
import type { Env } from "@config/env";

export async function processPaymentBatch(
  batch: MessageBatch<PaymentQueueMessage>,
  env: Env,
): Promise<void> {
  const db = createDbClient(env);
  const orderRepository = new OrderRepository(db);
  const downloadTokenRepository = new DownloadTokenRepository(db);
  const productRepository = new ProductRepository(db);
  const emailService = createEmailService(env);

  const confirmPaymentUseCase = new ConfirmPaymentUseCase(
    orderRepository,
    downloadTokenRepository,
    productRepository,
    emailService,
    env.SITE_URL,
  );

  for (const msg of batch.messages) {
    try {
      await confirmPaymentUseCase.execute(msg.body);
      msg.ack();
    } catch (err) {
      console.error("[payment-worker] failed to process", msg.body.orderId, err);
    }
  }
}
