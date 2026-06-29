import { ValidationError, ConflictError } from "@domain/errors/domain.error";
import { OrderStatus } from "@domain/value-objects/order-status.vo";
import { Money, type CurrencyCode } from "@domain/value-objects/money.vo";

export class Order {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly buyerEmail: string,
    public readonly amount: Money,
    public readonly razorpayOrderId: string,
    public razorpayPaymentId: string | null,
    public status: OrderStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  markPaid(razorpayPaymentId: string): void {
    if (this.status.isPaid()) throw new ConflictError("Order already paid");
    if (!this.status.isFulfillable()) {
      throw new ValidationError(`Cannot mark order as paid from status: ${this.status.toString()}`);
    }
    this.razorpayPaymentId = razorpayPaymentId;
    this.status = OrderStatus.paid();
    this.updatedAt = new Date();
  }

  markFailed(): void {
    this.status = OrderStatus.failed();
    this.updatedAt = new Date();
  }

  static create(
    id: string,
    productId: string,
    buyerEmail: string,
    priceMinorUnit: number,
    currency: CurrencyCode,
    razorpayOrderId: string,
  ): Order {
    if (!buyerEmail.trim()) throw new ValidationError("Buyer email cannot be empty");
    const now = new Date();
    return new Order(
      id,
      productId,
      buyerEmail.toLowerCase().trim(),
      Money.fromMinorUnit(priceMinorUnit, currency),
      razorpayOrderId,
      null,
      OrderStatus.pending(),
      now,
      now,
    );
  }

  toObject(): Record<string, unknown> {
    return {
      id: this.id,
      productId: this.productId,
      buyerEmail: this.buyerEmail,
      priceAmount: this.amount.toMinorUnit(),
      priceCurrency: this.amount.getCurrency(),
      razorpayOrderId: this.razorpayOrderId,
      razorpayPaymentId: this.razorpayPaymentId,
      status: this.status.toString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  static fromObject(d: Record<string, unknown>): Order {
    return new Order(
      d.id as string,
      d.productId as string,
      d.buyerEmail as string,
      Money.fromMinorUnit(d.priceAmount as number, d.priceCurrency as CurrencyCode),
      d.razorpayOrderId as string,
      (d.razorpayPaymentId as string | null) ?? null,
      OrderStatus.fromString(d.status as string),
      new Date(d.createdAt as string),
      new Date(d.updatedAt as string),
    );
  }
}
