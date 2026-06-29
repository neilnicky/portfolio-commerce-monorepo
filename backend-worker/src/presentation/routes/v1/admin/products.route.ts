import { Hono } from "hono";
import type { AppContext } from "@presentation/middleware/context-injector";
import { adminAuth } from "@presentation/middleware/admin-auth";
import type { CurrencyCode } from "@domain/value-objects/money.vo";

const adminProductsRoute = new Hono<AppContext>();

adminProductsRoute.use("*", adminAuth);

adminProductsRoute.post("/", async (c) => {
  const { adminUseCases } = c.get("dependencies");
  const formData = await c.req.formData();
  const file = formData.get("file") as unknown as File;
  const result = await adminUseCases.createProduct.execute({
    name: formData.get("name") as string,
    description: (formData.get("description") as string) ?? "",
    priceAmount: Number(formData.get("priceAmount")),
    priceCurrency: (formData.get("priceCurrency") as CurrencyCode) ?? "INR",
    fileStream: file.stream(),
    fileContentType: file.type,
    fileName: file.name,
  });
  return c.json({ data: result }, 201);
});

export default adminProductsRoute;
