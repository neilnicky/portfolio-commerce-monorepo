import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { Order } from "@domain/entities/order.entity";
import type { OrderVm } from "@application/view-models/order.vm";
import { NotFoundError } from "@domain/errors/base.error";
import { formatMoney } from "@application/services/format";

export function toOrderVm(o: Order): OrderVm {
  return {
    id: o.id,
    statusLabel: o.status.toString(),
    isComplete: o.isFulfilled,
    amountText: formatMoney(o.amount),
    downloadUrl: null, // populated by the backend response once fulfilled
  };
}

/** Polled by the checkout confirmation screen until the order is fulfilled. */
export class GetOrderStatusQuery {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(id: string): Promise<OrderVm> {
    const order = await this.orders.findById(id);
    if (!order) throw new NotFoundError(`Order ${id} not found`);
    return toOrderVm(order);
  }
}
