import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import type { IStorageService } from "@application/ports/storage.port";
import { Product } from "@domain/entities/product.entity";
import { generateId } from "@utils/id-generator";
import type { CurrencyCode } from "@domain/value-objects/money.vo";

export interface CreateProductRequestDto {
  name: string;
  description: string;
  priceAmount: number;
  priceCurrency: CurrencyCode;
  fileStream: ReadableStream;
  fileContentType: string;
  fileName: string;
}

export interface CreateProductResponseDto {
  id: string;
  name: string;
}

export class AdminCreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(req: CreateProductRequestDto): Promise<CreateProductResponseDto> {
    const maxSortOrder = await this.productRepository.findMaxSortOrder();
    const id = generateId("product");
    const fileKey = `products/${id}/${req.fileName}`;

    await this.storageService.uploadObject(fileKey, req.fileStream, req.fileContentType);

    const product = Product.create(
      id,
      req.name,
      req.description,
      req.priceAmount,
      req.priceCurrency,
      fileKey,
      maxSortOrder + 1,
    );

    await this.productRepository.save(product);
    return { id: product.id, name: product.name };
  }
}
