import type { IOrderRepository } from "@domain/repositories/order.repository.interface";

/** Manual grant — runs the SAME issue-and-email path as a normal sale (no untested route). */
export class GrantAccessCommand {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(orderId: string): Promise<void> {
    await this.orders.grantAccess(orderId);
  }
}
