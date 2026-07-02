import type { IProductRepository, UpdateProductInput } from "@domain/repositories/product.repository.interface";
import type { ProductVm } from "@application/view-models/product.vm";
import { toProductVm } from "@application/queries/list-products.query";

export class UpdateProductCommand {
  constructor(private readonly products: IProductRepository) {}

  async execute(id: string, patch: UpdateProductInput): Promise<ProductVm> {
    const updated = await this.products.update(id, patch);
    return toProductVm(updated, true);
  }
}
