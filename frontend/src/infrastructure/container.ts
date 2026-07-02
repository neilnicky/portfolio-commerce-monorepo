import { createApiClient, type ApiClient } from "@infrastructure/api/client";
import { HttpProductRepository } from "@infrastructure/repositories/http-product.repository";
import { HttpOrderRepository } from "@infrastructure/repositories/http-order.repository";
import { HttpDownloadRepository } from "@infrastructure/repositories/http-download.repository";
import { ListProductsQuery } from "@application/queries/list-products.query";
import { GetProductQuery } from "@application/queries/get-product.query";
import { GetOrderStatusQuery } from "@application/queries/get-order-status.query";
import { CreateOrderCommand } from "@application/commands/create-order.command";
import { RequestFreshLinkCommand } from "@application/commands/request-fresh-link.command";
import { VerifyFreshLinkCommand } from "@application/commands/verify-fresh-link.command";
import { CreateProductCommand } from "@application/commands/admin/create-product.command";
import { UpdateProductCommand } from "@application/commands/admin/update-product.command";
import { ReorderProductsCommand } from "@application/commands/admin/reorder-products.command";
import { GrantAccessCommand } from "@application/commands/admin/grant-access.command";

/**
 * Composition root — runtime-neutral factory. Wires ports → repositories → use-cases.
 * No global service locator; both runtimes (RSC + client) build from this same factory.
 */
export function buildContainer(deps: { api: ApiClient }) {
  const products = new HttpProductRepository(deps.api);
  const orders = new HttpOrderRepository(deps.api);
  const downloads = new HttpDownloadRepository(deps.api);

  return {
    queries: {
      listProducts: new ListProductsQuery(products),
      getProduct: new GetProductQuery(products),
      getOrderStatus: new GetOrderStatusQuery(orders),
    },
    commands: {
      createOrder: new CreateOrderCommand(orders),
      requestFreshLink: new RequestFreshLinkCommand(downloads),
      verifyFreshLink: new VerifyFreshLinkCommand(downloads),
      admin: {
        createProduct: new CreateProductCommand(products),
        updateProduct: new UpdateProductCommand(products),
        reorderProducts: new ReorderProductsCommand(products),
        grantAccess: new GrantAccessCommand(orders),
      },
    },
  };
}

export type Container = ReturnType<typeof buildContainer>;

export { createApiClient };
