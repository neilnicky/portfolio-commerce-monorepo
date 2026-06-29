import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { IDownloadTokenRepository } from "@domain/repositories/download-token.repository.interface";
import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import type { IEmailService } from "@application/ports/email.port";
import { NotFoundError } from "@domain/errors/domain.error";
import { DownloadToken } from "@domain/entities/download-token.entity";
import { generateId, generateSecureToken } from "@utils/id-generator";
import { DOWNLOAD_TOKEN_TTL_SECONDS, DOWNLOAD_TOKEN_MAX_DOWNLOADS } from "@config/constants";

export class AdminGrantAccessUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly downloadTokenRepository: IDownloadTokenRepository,
    private readonly productRepository: IProductRepository,
    private readonly emailService: IEmailService,
    private readonly baseUrl: string,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundError("Order", orderId);

    const product = await this.productRepository.findById(order.productId);
    if (!product) throw new NotFoundError("Product");

    await this.downloadTokenRepository.revokeAllForOrder(orderId);
    const token = generateSecureToken();
    const downloadToken = DownloadToken.create(
      generateId("token"),
      orderId,
      token,
      DOWNLOAD_TOKEN_TTL_SECONDS,
      DOWNLOAD_TOKEN_MAX_DOWNLOADS,
    );
    await this.downloadTokenRepository.save(downloadToken);

    const downloadUrl = `${this.baseUrl}/v1/download/${token}`;
    await this.emailService.sendDownloadLink(order.buyerEmail, product.name, downloadUrl);
  }
}
