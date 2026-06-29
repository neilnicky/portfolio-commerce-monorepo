import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import type { AppContext } from "@presentation/middleware/context-injector";
import { contextInjector } from "@presentation/middleware/context-injector";
import { onErrorHandler, notFoundHandler } from "@presentation/middleware/error-handler";
import routes from "@presentation/routes/index";
import { processPaymentBatch } from "@infrastructure/queue/payment-event.worker";
import { createDbClient } from "@infrastructure/database/drizzle/client";
import { ProductRepository } from "@infrastructure/database/repositories/product.repository";
import { OrderRepository } from "@infrastructure/database/repositories/order.repository";
import { DownloadTokenRepository } from "@infrastructure/database/repositories/download-token.repository";
import { createEmailService } from "@infrastructure/email/resend.email.service";
import { SweepUnfulfilledOrdersUseCase } from "@application/use-cases/background/sweep-unfulfilled-orders.use-case";
import type { PaymentQueueMessage } from "@app-types/common";
import type { Env } from "@config/env";

const app = new Hono<AppContext>();

app.use(contextStorage());
app.use("*", cors({ origin: "*", allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }));
app.use("*", contextInjector);

app.get("/", (c) =>
  c.json({ service: "midhun-raj-films-backend", version: "1.0.0", status: "ok" }),
);
app.route("/", routes);

app.onError(onErrorHandler);
app.notFound(notFoundHandler);

const handler: ExportedHandler<Env> = {
  fetch: (req, env, ctx) => app.fetch(req, env, ctx),

  queue: async (batch: MessageBatch, env: Env) => {
    await processPaymentBatch(batch as MessageBatch<PaymentQueueMessage>, env);
  },

  scheduled: async (_controller: ScheduledController, env: Env, _ctx: ExecutionContext) => {
    const db = createDbClient(env);
    const sweep = new SweepUnfulfilledOrdersUseCase(
      new OrderRepository(db),
      new DownloadTokenRepository(db),
      new ProductRepository(db),
      createEmailService(env),
      env.SITE_URL,
    );
    await sweep.execute();
  },
};

export default handler;
