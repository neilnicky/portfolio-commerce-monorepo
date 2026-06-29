import { eq, asc, count } from "drizzle-orm";
import type { DbClient } from "@infrastructure/database/drizzle/client";
import { products } from "@infrastructure/database/drizzle/schema";
import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import { Product } from "@domain/entities/product.entity";
import type { PaginatedResult, PaginationParams } from "@app-types/common";

export class ProductRepository implements IProductRepository {
  constructor(private readonly db: DbClient) {}

  async save(product: Product): Promise<void> {
    const row = product.toObject();
    await this.db
      .insert(products)
      .values(row as typeof products.$inferInsert)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: row.name as string,
          description: row.description as string,
          priceAmount: row.priceAmount as number,
          priceCurrency: row.priceCurrency as string,
          fileKey: row.fileKey as string,
          isPublished: row.isPublished as boolean,
          sortOrder: row.sortOrder as number,
          updatedAt: row.updatedAt as string,
        },
      });
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.db.query.products.findFirst({ where: eq(products.id, id) });
    return row ? Product.fromObject(row) : null;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Product>> {
    const offset = (pagination.page - 1) * pagination.pageSize;
    const [rows, [{ total }]] = await Promise.all([
      this.db.query.products.findMany({
        orderBy: [asc(products.sortOrder)],
        limit: pagination.pageSize,
        offset,
      }),
      this.db.select({ total: count() }).from(products),
    ]);
    return {
      data: rows.map(Product.fromObject),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async findPublished(): Promise<Product[]> {
    const rows = await this.db.query.products.findMany({
      where: eq(products.isPublished, true),
      orderBy: [asc(products.sortOrder)],
    });
    return rows.map(Product.fromObject);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id));
  }

  async findMaxSortOrder(): Promise<number> {
    const rows = await this.db.query.products.findMany({
      orderBy: [asc(products.sortOrder)],
    });
    return rows.length > 0 ? Math.max(...rows.map((r) => r.sortOrder)) : 0;
  }
}
