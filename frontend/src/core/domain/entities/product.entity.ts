import { Money } from "@domain/value-objects/money.vo";

/** A purchasable digital asset (LUT, preset, project file, stock footage). */
export class Product {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price: Money,
    public readonly sortOrder: number,
    public readonly published: boolean,
    public readonly createdAt: Date,
  ) {}

  get isBuyable(): boolean {
    return this.published;
  }
}
