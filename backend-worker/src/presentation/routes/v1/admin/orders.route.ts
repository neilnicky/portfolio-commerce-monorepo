import { Hono } from "hono";
import type { AppContext } from "@presentation/middleware/context-injector";
import { adminAuth } from "@presentation/middleware/admin-auth";

const adminOrdersRoute = new Hono<AppContext>();

adminOrdersRoute.use("*", adminAuth);

adminOrdersRoute.post("/:id/grant-access", async (c) => {
  const { adminUseCases } = c.get("dependencies");
  await adminUseCases.grantAccess.execute(c.req.param("id"));
  return c.json({ message: "Access granted and download link sent" });
});

export default adminOrdersRoute;
