import type { IProductRepository } from "@domain/repositories/product.repository.interface";

export interface ProductResponseDto {
  id: string;
  name: string;
  description: string;
  priceAmount: number;
  priceCurrency: string;
  priceFormatted: string;
  sortOrder: number;
}

function toDto(product: import("@domain/entities/product.entity").Product): ProductResponseDto {
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

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findPublished();
    return products.map(toDto);
  }
}
