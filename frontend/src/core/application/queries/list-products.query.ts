import type { IProductRepository, ProductFilters } from "@domain/repositories/product.repository.interface";
import type { Product } from "@domain/entities/product.entity";
import type { ProductVm } from "@application/view-models/product.vm";
import type { PaginatedResult } from "@app-types/common";
import { formatMoney } from "@application/services/format";

/** entity → ViewModel. The single place this mapping happens for products. */
export function toProductVm(p: Product, canEdit = false): ProductVm {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    priceText: formatMoney(p.price),
    isBuyable: p.isBuyable,
    canEdit,
  };
}

/** READ use-case. Constructor takes the PORT, never a concrete repository. */
export class ListProductsQuery {
  constructor(private readonly products: IProductRepository) {}

  async execute(filters: ProductFilters): Promise<PaginatedResult<ProductVm>> {
    const page = await this.products.list(filters);
    return { ...page, items: page.items.map((p) => toProductVm(p)) };
  }
}
