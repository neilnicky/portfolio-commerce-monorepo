import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { IDownloadTokenRepository } from "@domain/repositories/download-token.repository.interface";
import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import type { IEmailService } from "@application/ports/email.port";
import { DownloadToken } from "@domain/entities/download-token.entity";
import { generateId, generateSecureToken } from "@utils/id-generator";
import { DOWNLOAD_TOKEN_TTL_SECONDS, DOWNLOAD_TOKEN_MAX_DOWNLOADS } from "@config/constants";

export class SweepUnfulfilledOrdersUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly downloadTokenRepository: IDownloadTokenRepository,
    private readonly productRepository: IProductRepository,
    private readonly emailService: IEmailService,
    private readonly baseUrl: string,
  ) {}

  async execute(): Promise<void> {
    const orders = await this.orderRepository.findPaidAndUnfulfilled();

    for (const order of orders) {
      try {
        const tokens = await this.downloadTokenRepository.findByOrderId(order.id);
        if (tokens.some((t) => t.isValid())) continue;

        const product = await this.productRepository.findById(order.productId);
        if (!product) continue;

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
        console.log("[sweep] fulfilled order", order.id);
      } catch (err) {
        console.error("[sweep] failed for order", order.id, err);
      }
    }
  }
}
