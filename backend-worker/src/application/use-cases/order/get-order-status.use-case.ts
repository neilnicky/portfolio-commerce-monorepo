import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { IDownloadTokenRepository } from "@domain/repositories/download-token.repository.interface";
import { NotFoundError } from "@domain/errors/domain.error";

export interface OrderStatusResponseDto {
  orderId: string;
  status: string;
  hasDownloadToken: boolean;
}

export class GetOrderStatusUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly downloadTokenRepository: IDownloadTokenRepository,
  ) {}

  async execute(orderId: string): Promise<OrderStatusResponseDto> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundError("Order", orderId);

    const tokens = await this.downloadTokenRepository.findByOrderId(orderId);
    const hasDownloadToken = tokens.some((t) => t.isValid());

    return {
      orderId: order.id,
      status: order.status.toString(),
      hasDownloadToken,
    };
  }
}
