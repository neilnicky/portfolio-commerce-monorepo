import { Hono } from "hono";
import type { AppContext } from "@presentation/middleware/context-injector";

const productsRoute = new Hono<AppContext>();

productsRoute.get("/", async (c) => {
  const { useCases } = c.get("dependencies");
  const products = await useCases.listProducts.execute();
  return c.json({ data: products });
});

productsRoute.get("/:id", async (c) => {
  const { useCases } = c.get("dependencies");
  const product = await useCases.getProduct.execute(c.req.param("id"));
  return c.json({ data: product });
});

export default productsRoute;
