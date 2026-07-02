"use client";

import { useProducts } from "@presentation/features/product/hooks/use-products";
import { ProductList } from "@presentation/features/product/components/ProductList";
import type { ProductFilters } from "@domain/repositories/product.repository.interface";

/** Container — the only place a hook is allowed. Wires data → presentational child. */
export function ProductListContainer({ filters }: { filters: ProductFilters }) {
  const { data, isLoading, error } = useProducts(filters);
  if (isLoading) return <p className="text-sm text-white/50">Loading…</p>;
  if (error) return <p className="text-sm text-red-400">Could not load products.</p>;
  return <ProductList items={data?.items ?? []} />;
}
