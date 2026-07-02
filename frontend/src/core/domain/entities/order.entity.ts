import { Money } from "@domain/value-objects/money.vo";
import { OrderStatus } from "@domain/value-objects/order-status.vo";

/** A purchase. Identified by buyer email + payment — no buyer accounts. */
export class Order {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly buyerEmail: string,
    public readonly amount: Money,
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
  ) {}

  get isFulfilled(): boolean {
    return this.status.isComplete;
  }
}
