import { Product } from "@domain/entities/product.entity";
import { Money } from "@domain/value-objects/money.vo";
import type { ProductDto, CreateProductDto } from "@application/dtos/product.dto";
import type { CreateProductInput } from "@domain/repositories/product.repository.interface";

/** DTO ↔ Entity only. Never leaks DTO shapes upward past the repository. */
export const productMapper = {
  toEntity(d: ProductDto): Product {
    return new Product(
      d.id,
      d.title,
      d.description,
      Money.of(d.price_minor, d.currency),
      d.sort_order,
      d.published,
      new Date(d.created_at),
    );
  },
  toCreateDto(input: CreateProductInput): CreateProductDto {
    return {
      title: input.title,
      description: input.description,
      price_minor: input.priceMinor,
      currency: input.currency,
    };
  },
};
