import type { PaymentQueueMessage } from "@app-types/common";
import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { IDownloadTokenRepository } from "@domain/repositories/download-token.repository.interface";
import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import type { IEmailService } from "@application/ports/email.port";
import { NotFoundError } from "@domain/errors/domain.error";
import { DownloadToken } from "@domain/entities/download-token.entity";
import { generateId, generateSecureToken } from "@utils/id-generator";
import { DOWNLOAD_TOKEN_TTL_SECONDS, DOWNLOAD_TOKEN_MAX_DOWNLOADS } from "@config/constants";

export class ConfirmPaymentUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly downloadTokenRepository: IDownloadTokenRepository,
    private readonly productRepository: IProductRepository,
    private readonly emailService: IEmailService,
    private readonly baseUrl: string,
  ) {}

  async execute(message: PaymentQueueMessage): Promise<void> {
    const order = await this.orderRepository.findByRazorpayOrderId(message.razorpayOrderId);
    if (!order) throw new NotFoundError("Order", message.razorpayOrderId);

    if (order.status.isPaid()) return; // idempotent

    order.markPaid(message.razorpayPaymentId);
    await this.orderRepository.save(order);

    const product = await this.productRepository.findById(order.productId);
    if (!product) throw new NotFoundError("Product", order.productId);

    await this.downloadTokenRepository.revokeAllForOrder(order.id);
    const token = generateSecureToken();
    const downloadToken = DownloadToken.create(
      generateId("token"),
      order.id,
      token,
      DOWNLOAD_TOKEN_TTL_SECONDS,
      DOWNLOAD_TOKEN_MAX_DOWNLOADS,
    );
    await this.downloadTokenRepository.save(downloadToken);

    const downloadUrl = `${this.baseUrl}/v1/download/${token}`;
    await this.emailService.sendDownloadLink(order.buyerEmail, product.name, downloadUrl);
  }
}
