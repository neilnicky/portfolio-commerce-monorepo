import type { ApiClient } from "@infrastructure/api/client";
import type {
  IProductRepository,
  ProductFilters,
  CreateProductInput,
  UpdateProductInput,
} from "@domain/repositories/product.repository.interface";
import type { Product } from "@domain/entities/product.entity";
import type { ProductDto } from "@application/dtos/product.dto";
import type { PaginatedResult, PaginatedDto } from "@app-types/common";
import { productMapper } from "@infrastructure/mappers/product.mapper";
import { API_VERSION } from "@config/constants";

function toQuery(f: ProductFilters): string {
  const p = new URLSearchParams();
  if (f.page) p.set("page", String(f.page));
  if (f.pageSize) p.set("page_size", String(f.pageSize));
  if (f.publishedOnly) p.set("published", "true");
  return p.toString();
}

/** Adapter: implements the port over the API client. Maps DTO ↔ entity via the mapper. */
export class HttpProductRepository implements IProductRepository {
  constructor(private readonly api: ApiClient) {}

  async findById(id: string): Promise<Product | null> {
    const dto = await this.api.get<ProductDto | null>(`/${API_VERSION}/products/${id}`);
    return dto ? productMapper.toEntity(dto) : null;
  }

  async list(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    const dto = await this.api.get<PaginatedDto<ProductDto>>(
      `/${API_VERSION}/products?${toQuery(filters)}`,
    );
    return {
      items: dto.items.map(productMapper.toEntity),
      total: dto.total,
      page: dto.page,
      pageSize: dto.page_size,
    };
  }

  async create(input: CreateProductInput): Promise<Product> {
    const dto = await this.api.post<ProductDto>(
      `/${API_VERSION}/admin/products`,
      productMapper.toCreateDto(input),
    );
    return productMapper.toEntity(dto);
  }

  async update(id: string, patch: UpdateProductInput): Promise<Product> {
    const dto = await this.api.patch<ProductDto>(`/${API_VERSION}/admin/products/${id}`, patch);
    return productMapper.toEntity(dto);
  }

  async remove(id: string): Promise<void> {
    await this.api.del(`/${API_VERSION}/admin/products/${id}`);
  }

  async reorder(orderedIds: string[]): Promise<void> {
    await this.api.post(`/${API_VERSION}/admin/products/reorder`, { ordered_ids: orderedIds });
  }
}
