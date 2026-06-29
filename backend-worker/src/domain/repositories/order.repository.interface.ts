import type { Order } from "@domain/entities/order.entity";
import type { PaginatedResult, PaginationParams } from "@app-types/common";

export interface OrderFilters {
  status?: string;
  buyerEmail?: string;
}

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null>;
  findPaidAndUnfulfilled(): Promise<Order[]>;
  list(filters: OrderFilters, pagination: PaginationParams): Promise<PaginatedResult<Order>>;
}
