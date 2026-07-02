import type { ProductFilters } from "@domain/repositories/product.repository.interface";

/** Centralized TanStack Query key factories — precise invalidation, refactor-safe. */

export const productKeys = {
  all: ["products"] as const,
  list: (f: ProductFilters) => [...productKeys.all, "list", f] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  status: (id: string) => [...orderKeys.all, "status", id] as const,
};
