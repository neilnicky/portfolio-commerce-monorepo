/** Order lifecycle status — mirrors the backend's order-status vocabulary. */
export type OrderStatusValue = "pending" | "paid" | "fulfilled" | "failed";

export class OrderStatus {
  private constructor(public readonly value: OrderStatusValue) {}

  static fromString(value: string): OrderStatus {
    if (!["pending", "paid", "fulfilled", "failed"].includes(value)) {
      throw new Error(`Unknown order status: ${value}`);
    }
    return new OrderStatus(value as OrderStatusValue);
  }

  get isComplete(): boolean {
    return this.value === "fulfilled";
  }

  toString(): string {
    return this.value;
  }
}
