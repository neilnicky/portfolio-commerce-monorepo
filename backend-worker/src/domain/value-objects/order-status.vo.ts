import { ValidationError } from "@domain/errors/domain.error";

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export class OrderStatus {
  private constructor(private readonly value: OrderStatusType) {}

  static pending() {
    return new OrderStatus(ORDER_STATUS.PENDING);
  }
  static paid() {
    return new OrderStatus(ORDER_STATUS.PAID);
  }
  static failed() {
    return new OrderStatus(ORDER_STATUS.FAILED);
  }
  static refunded() {
    return new OrderStatus(ORDER_STATUS.REFUNDED);
  }

  static fromString(v: string): OrderStatus {
    const values = Object.values(ORDER_STATUS) as string[];
    if (!values.includes(v)) {
      throw new ValidationError(`Invalid order status: ${v}`, { v });
    }
    return new OrderStatus(v as OrderStatusType);
  }

  isPending(): boolean {
    return this.value === ORDER_STATUS.PENDING;
  }
  isPaid(): boolean {
    return this.value === ORDER_STATUS.PAID;
  }
  isFailed(): boolean {
    return this.value === ORDER_STATUS.FAILED;
  }
  isRefunded(): boolean {
    return this.value === ORDER_STATUS.REFUNDED;
  }
  isFulfillable(): boolean {
    return this.isPending();
  }

  toString(): string {
    return this.value;
  }

  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }
}
