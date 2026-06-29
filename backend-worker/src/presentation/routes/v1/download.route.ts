import { Hono } from "hono";
import { z } from "zod";
import type { AppContext } from "@presentation/middleware/context-injector";
import { validateJson, validateParam } from "@presentation/middleware/validator";

const tokenParamSchema = z.object({ token: z.string().min(1) });
const requestFreshLinkSchema = z.object({
  orderId: z.string().min(1),
  buyerEmail: z.string().email(),
});
const verifyFreshLinkSchema = z.object({
  orderId: z.string().min(1),
  code: z.string().length(6),
});

const downloadRoute = new Hono<AppContext>();

downloadRoute.get("/:token", validateParam(tokenParamSchema), async (c) => {
  const { useCases } = c.get("dependencies");
  const { token } = c.req.valid("param");
  const { object, fileName } = await useCases.downloadAsset.execute(token);

  return new Response(object.body, {
    headers: {
      "Content-Type": object.contentType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      ...(object.contentLength !== undefined
        ? { "Content-Length": String(object.contentLength) }
        : {}),
    },
  });
});

downloadRoute.post("/request-link", validateJson(requestFreshLinkSchema), async (c) => {
  const { useCases } = c.get("dependencies");
  const body = c.req.valid("json");
  await useCases.requestFreshLink.execute(body.orderId, body.buyerEmail);
  return c.json({ message: "Verification code sent" });
});

downloadRoute.post("/verify-link", validateJson(verifyFreshLinkSchema), async (c) => {
  const { useCases } = c.get("dependencies");
  const body = c.req.valid("json");
  await useCases.verifyFreshLink.execute(body.orderId, body.code);
  return c.json({ message: "New download link sent" });
});

export default downloadRoute;
