import { ValidationError } from "@domain/errors/domain.error";
import { Money, type CurrencyCode } from "@domain/value-objects/money.vo";

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: Money,
    public fileKey: string,
    public isPublished: boolean,
    public sortOrder: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  publish(): void {
    this.isPublished = true;
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.isPublished = false;
    this.updatedAt = new Date();
  }

  updateDetails(name: string, description: string): void {
    if (!name.trim()) throw new ValidationError("Product name cannot be empty");
    this.name = name.trim();
    this.description = description;
    this.updatedAt = new Date();
  }

  updatePrice(price: Money): void {
    this.price = price;
    this.updatedAt = new Date();
  }

  static create(
    id: string,
    name: string,
    description: string,
    priceMinorUnit: number,
    currency: CurrencyCode,
    fileKey: string,
    sortOrder: number,
  ): Product {
    if (!name.trim()) throw new ValidationError("Product name cannot be empty");
    const now = new Date();
    return new Product(
      id,
      name.trim(),
      description,
      Money.fromMinorUnit(priceMinorUnit, currency),
      fileKey,
      false,
      sortOrder,
      now,
      now,
    );
  }

  toObject(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      priceAmount: this.price.toMinorUnit(),
      priceCurrency: this.price.getCurrency(),
      fileKey: this.fileKey,
      isPublished: this.isPublished,
      sortOrder: this.sortOrder,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  static fromObject(d: Record<string, unknown>): Product {
    return new Product(
      d.id as string,
      d.name as string,
      d.description as string,
      Money.fromMinorUnit(d.priceAmount as number, d.priceCurrency as CurrencyCode),
      d.fileKey as string,
      d.isPublished as boolean,
      d.sortOrder as number,
      new Date(d.createdAt as string),
      new Date(d.updatedAt as string),
    );
  }
}
