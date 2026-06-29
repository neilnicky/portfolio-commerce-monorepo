import { Hono } from "hono";
import type { AppContext } from "@presentation/middleware/context-injector";
import { UnauthorizedError } from "@domain/errors/domain.error";

const RAZORPAY_SIGNATURE_HEADER = "x-razorpay-signature";

const webhooksRoute = new Hono<AppContext>();

webhooksRoute.post("/razorpay", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header(RAZORPAY_SIGNATURE_HEADER);

  if (!signature) throw new UnauthorizedError("Missing signature header");

  const { useCases } = c.get("dependencies");
  await useCases.enqueuePaymentEvent.execute(rawBody, signature);

  return c.json({ received: true });
});

export default webhooksRoute;
