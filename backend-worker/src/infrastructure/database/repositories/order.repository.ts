import { eq, and, count } from "drizzle-orm";
import type { DbClient } from "@infrastructure/database/drizzle/client";
import { orders } from "@infrastructure/database/drizzle/schema";
import type { IOrderRepository, OrderFilters } from "@domain/repositories/order.repository.interface";
import { Order } from "@domain/entities/order.entity";
import type { PaginatedResult, PaginationParams } from "@app-types/common";

export class OrderRepository implements IOrderRepository {
  constructor(private readonly db: DbClient) {}

  async save(order: Order): Promise<void> {
    const row = order.toObject();
    await this.db
      .insert(orders)
      .values(row as typeof orders.$inferInsert)
      .onConflictDoUpdate({
        target: orders.id,
        set: {
          razorpayPaymentId: row.razorpayPaymentId as string | null,
          status: row.status as string,
          updatedAt: row.updatedAt as string,
        },
      });
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.db.query.orders.findFirst({ where: eq(orders.id, id) });
    return row ? Order.fromObject(row) : null;
  }

  async findByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    const row = await this.db.query.orders.findFirst({
      where: eq(orders.razorpayOrderId, razorpayOrderId),
    });
    return row ? Order.fromObject(row) : null;
  }

  async findPaidAndUnfulfilled(): Promise<Order[]> {
    const rows = await this.db.query.orders.findMany({
      where: eq(orders.status, "paid"),
    });
    return rows.map(Order.fromObject);
  }

  async list(
    filters: OrderFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Order>> {
    const offset = (pagination.page - 1) * pagination.pageSize;

    const conditions = [];
    if (filters.status) conditions.push(eq(orders.status, filters.status));
    if (filters.buyerEmail) conditions.push(eq(orders.buyerEmail, filters.buyerEmail));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      this.db.query.orders.findMany({ where, limit: pagination.pageSize, offset }),
      this.db.select({ total: count() }).from(orders).where(where),
    ]);

    return {
      data: rows.map(Order.fromObject),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }
}
