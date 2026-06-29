import type { IDownloadTokenRepository } from "@domain/repositories/download-token.repository.interface";
import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import type { IStorageService, StorageObject } from "@application/ports/storage.port";
import { NotFoundError, ValidationError } from "@domain/errors/domain.error";

export interface DownloadAssetResponseDto {
  object: StorageObject;
  productName: string;
  fileName: string;
}

export class DownloadAssetUseCase {
  constructor(
    private readonly downloadTokenRepository: IDownloadTokenRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(token: string): Promise<DownloadAssetResponseDto> {
    const downloadToken = await this.downloadTokenRepository.findByToken(token);
    if (!downloadToken || !downloadToken.isValid()) {
      throw new ValidationError("Invalid or expired download link");
    }

    const order = await this.orderRepository.findById(downloadToken.orderId);
    if (!order || !order.status.isPaid()) throw new NotFoundError("Order");

    const product = await this.productRepository.findById(order.productId);
    if (!product) throw new NotFoundError("Product");

    downloadToken.recordDownload();
    await this.downloadTokenRepository.save(downloadToken);

    const object = await this.storageService.getObject(product.fileKey);
    if (!object) throw new NotFoundError("File");

    const fileName = product.fileKey.split("/").pop() ?? "download";
    return { object, productName: product.name, fileName };
  }
}
