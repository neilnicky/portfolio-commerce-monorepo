"use client";

import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { buildContainer, createApiClient, type Container } from "@infrastructure/container";
import { publicEnv } from "@config/env";

const ContainerContext = createContext<Container | null>(null);

/** Client-side DI: build once from the public API URL, provide via Context. */
export function ContainerProvider({ children }: PropsWithChildren) {
  const container = useMemo(
    () => buildContainer({ api: createApiClient({ baseUrl: publicEnv.apiUrl }) }),
    [],
  );
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}

export function useContainer(): Container {
  const ctx = useContext(ContainerContext);
  if (!ctx) throw new Error("useContainer must be used within <ContainerProvider>");
  return ctx;
}

// Hooks read resolved use-cases from here.
export const useListProductsQuery = () => useContainer().queries.listProducts;
export const useGetProductQuery = () => useContainer().queries.getProduct;
export const useGetOrderStatusQuery = () => useContainer().queries.getOrderStatus;
export const useCreateOrderCommand = () => useContainer().commands.createOrder;
