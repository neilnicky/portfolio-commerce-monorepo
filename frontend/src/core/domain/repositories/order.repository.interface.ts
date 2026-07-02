import type { Order } from "@domain/entities/order.entity";

export interface CreateOrderInput {
  productId: string;
  buyerEmail: string;
}

/** Persistence PORT for orders. Price is decided server-side, never trusted from client. */
export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  create(input: CreateOrderInput): Promise<Order>;
  /** Manual admin grant — runs the same issue-and-email path as a normal sale. */
  grantAccess(orderId: string): Promise<void>;
}
