import type { IPaymentService } from "@application/ports/payment.port";
import type { IPaymentQueueService } from "@application/ports/payment-queue.port";
import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import { UnauthorizedError, NotFoundError } from "@domain/errors/domain.error";
import type { PaymentQueueMessage } from "@app-types/common";

export interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
      };
    };
  };
}

export class EnqueuePaymentEventUseCase {
  constructor(
    private readonly paymentService: IPaymentService,
    private readonly paymentQueueService: IPaymentQueueService,
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(rawBody: string, signature: string): Promise<void> {
    const isValid = await this.paymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) throw new UnauthorizedError("Invalid webhook signature");

    const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;

    if (payload.event !== "payment.captured") return;

    const { id: razorpayPaymentId, order_id: razorpayOrderId } =
      payload.payload.payment.entity;

    const order = await this.orderRepository.findByRazorpayOrderId(razorpayOrderId);
    if (!order) throw new NotFoundError("Order", razorpayOrderId);

    const message: PaymentQueueMessage = {
      eventType: payload.event,
      orderId: order.id,
      razorpayPaymentId,
      razorpayOrderId,
      rawPayload: rawBody,
    };

    await this.paymentQueueService.enqueue(message);
  }
}
