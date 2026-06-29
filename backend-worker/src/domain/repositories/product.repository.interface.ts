import type { Product } from "@domain/entities/product.entity";
import type { PaginatedResult, PaginationParams } from "@app-types/common";

export interface IProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Product>>;
  findPublished(): Promise<Product[]>;
  delete(id: string): Promise<void>;
  findMaxSortOrder(): Promise<number>;
}
