import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import { NotFoundError } from "@domain/errors/domain.error";
import type { ProductResponseDto } from "./list-products.use-case";

export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product || !product.isPublished) throw new NotFoundError("Product", id);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      priceAmount: product.price.toMinorUnit(),
      priceCurrency: product.price.getCurrency(),
      priceFormatted: product.price.format(),
      sortOrder: product.sortOrder,
    };
  }
}
