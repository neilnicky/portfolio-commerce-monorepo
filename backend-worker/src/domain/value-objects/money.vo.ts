import { ValidationError } from "@domain/errors/domain.error";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

const CURRENCY_MINOR_UNITS: Record<CurrencyCode, number> = {
  INR: 100,
  USD: 100,
  EUR: 100,
  GBP: 100,
};

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: CurrencyCode,
  ) {}

  static fromMinorUnit(amount: number, currency: CurrencyCode): Money {
    if (!Number.isInteger(amount) || amount < 0) {
      throw new ValidationError("Amount must be a non-negative integer in minor units", { amount });
    }
    return new Money(amount, currency);
  }

  static fromMajorUnit(amount: number, currency: CurrencyCode): Money {
    const multiplier = CURRENCY_MINOR_UNITS[currency];
    const minorAmount = Math.round(amount * multiplier);
    return Money.fromMinorUnit(minorAmount, currency);
  }

  toMinorUnit(): number {
    return this.amount;
  }

  toMajorUnit(): number {
    return this.amount / CURRENCY_MINOR_UNITS[this.currency];
  }

  getCurrency(): CurrencyCode {
    return this.currency;
  }

  format(): string {
    const major = this.toMajorUnit();
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: this.currency,
    }).format(major);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }
}
