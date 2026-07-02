import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import type { ProductVm } from "@application/view-models/product.vm";
import { NotFoundError } from "@domain/errors/base.error";
import { toProductVm } from "@application/queries/list-products.query";

export class GetProductQuery {
  constructor(private readonly products: IProductRepository) {}

  async execute(id: string): Promise<ProductVm> {
    const product = await this.products.findById(id);
    if (!product) throw new NotFoundError(`Product ${id} not found`);
    return toProductVm(product);
  }
}
