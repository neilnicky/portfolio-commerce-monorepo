import type { IOrderRepository, CreateOrderInput } from "@domain/repositories/order.repository.interface";
import type { OrderVm } from "@application/view-models/order.vm";
import { toOrderVm } from "@application/queries/get-order-status.query";

/** WRITE use-case. Price is looked up server-side by the backend, never trusted here. */
export class CreateOrderCommand {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(input: CreateOrderInput): Promise<OrderVm> {
    const order = await this.orders.create(input);
    return toOrderVm(order);
  }
}
