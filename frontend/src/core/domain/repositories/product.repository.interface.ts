import type { Product } from "@domain/entities/product.entity";
import type { PaginatedResult } from "@app-types/common";

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  publishedOnly?: boolean;
}

export interface CreateProductInput {
  title: string;
  description: string;
  priceMinor: number;
  currency: string;
}

export type UpdateProductInput = Partial<CreateProductInput> & {
  published?: boolean;
  sortOrder?: number;
};

/** Persistence PORT — the application codes against this, never a concrete class. */
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  list(filters: ProductFilters): Promise<PaginatedResult<Product>>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, patch: UpdateProductInput): Promise<Product>;
  remove(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<void>;
}
