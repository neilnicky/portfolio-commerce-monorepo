import { Hono } from "hono";
import { z } from "zod";
import type { AppContext } from "@presentation/middleware/context-injector";
import { validateJson } from "@presentation/middleware/validator";

const createOrderSchema = z.object({
  productId: z.string().min(1),
  buyerEmail: z.string().email(),
});

const ordersRoute = new Hono<AppContext>();

ordersRoute.post("/", validateJson(createOrderSchema), async (c) => {
  const { useCases } = c.get("dependencies");
  const body = c.req.valid("json");
  const result = await useCases.createOrder.execute(body);
  return c.json({ data: result }, 201);
});

ordersRoute.get("/:id/status", async (c) => {
  const { useCases } = c.get("dependencies");
  const status = await useCases.getOrderStatus.execute(c.req.param("id"));
  return c.json({ data: status });
});

export default ordersRoute;
