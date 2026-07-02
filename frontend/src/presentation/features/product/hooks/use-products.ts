"use client";

import { useQuery } from "@tanstack/react-query";
import { productKeys } from "@config/query-keys";
import { useListProductsQuery } from "@presentation/providers/container-provider";
import type { ProductFilters } from "@domain/repositories/product.repository.interface";

/** The only place a component touches the list-products use-case. */
export function useProducts(filters: ProductFilters) {
  const query = useListProductsQuery();
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => query.execute(filters),
  });
}
