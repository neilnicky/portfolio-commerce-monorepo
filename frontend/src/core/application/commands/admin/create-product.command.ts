import type { IProductRepository, CreateProductInput } from "@domain/repositories/product.repository.interface";
import type { ProductVm } from "@application/view-models/product.vm";
import { toProductVm } from "@application/queries/list-products.query";

export class CreateProductCommand {
  constructor(private readonly products: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<ProductVm> {
    const created = await this.products.create(input);
    return toProductVm(created, true);
  }
}
