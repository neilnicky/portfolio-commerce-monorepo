/** Immutable money value object. Amount stored in minor units (e.g. paise). */
export class Money {
  private constructor(
    public readonly amountMinor: number,
    public readonly currency: string,
  ) {}

  static of(amountMinor: number, currency = "INR"): Money {
    if (!Number.isInteger(amountMinor) || amountMinor < 0) {
      throw new Error("Money.amountMinor must be a non-negative integer");
    }
    return new Money(amountMinor, currency);
  }

  get major(): number {
    return this.amountMinor / 100;
  }

  toString(): string {
    return `${this.currency} ${this.major.toFixed(2)}`;
  }
}
