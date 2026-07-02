import type { IProductRepository } from "@domain/repositories/product.repository.interface";

export class ReorderProductsCommand {
  constructor(private readonly products: IProductRepository) {}

  async execute(orderedIds: string[]): Promise<void> {
    await this.products.reorder(orderedIds);
  }
}
