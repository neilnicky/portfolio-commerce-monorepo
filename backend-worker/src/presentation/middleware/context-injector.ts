import type { Context, Next } from "hono";
import type { Env } from "@config/env";
import { createDbClient } from "@infrastructure/database/drizzle/client";
import { ProductRepository } from "@infrastructure/database/repositories/product.repository";
import { OrderRepository } from "@infrastructure/database/repositories/order.repository";
import { DownloadTokenRepository } from "@infrastructure/database/repositories/download-token.repository";
import { VerificationCodeRepository } from "@infrastructure/database/repositories/verification-code.repository";
import { createEmailService } from "@infrastructure/email/resend.email.service";
import { createPaymentService } from "@infrastructure/payment/razorpay.payment.service";
import { createStorageService } from "@infrastructure/storage/r2.storage.service";
import { createPaymentQueueService } from "@infrastructure/queue/payment-event.queue.service";
import { ListProductsUseCase } from "@application/use-cases/product/list-products.use-case";
import { GetProductUseCase } from "@application/use-cases/product/get-product.use-case";
import { CreateOrderUseCase } from "@application/use-cases/order/create-order.use-case";
import { GetOrderStatusUseCase } from "@application/use-cases/order/get-order-status.use-case";
import { EnqueuePaymentEventUseCase } from "@application/use-cases/order/enqueue-payment-event.use-case";
import { DownloadAssetUseCase } from "@application/use-cases/download/download-asset.use-case";
import { RequestFreshLinkUseCase } from "@application/use-cases/download/request-fresh-link.use-case";
import { VerifyFreshLinkUseCase } from "@application/use-cases/download/verify-fresh-link.use-case";
import { AdminCreateProductUseCase } from "@application/use-cases/admin/create-product.use-case";
import { AdminGrantAccessUseCase } from "@application/use-cases/admin/grant-access.use-case";

export interface Dependencies {
  useCases: {
    listProducts: ListProductsUseCase;
    getProduct: GetProductUseCase;
    createOrder: CreateOrderUseCase;
    getOrderStatus: GetOrderStatusUseCase;
    enqueuePaymentEvent: EnqueuePaymentEventUseCase;
    downloadAsset: DownloadAssetUseCase;
    requestFreshLink: RequestFreshLinkUseCase;
    verifyFreshLink: VerifyFreshLinkUseCase;
  };
  adminUseCases: {
    createProduct: AdminCreateProductUseCase;
    grantAccess: AdminGrantAccessUseCase;
  };
}

export interface AppContext {
  Bindings: Env;
  Variables: {
    dependencies: Dependencies;
  };
}

export async function contextInjector(
  c: Context<AppContext>,
  next: Next,
): Promise<Response | void> {
  const env = c.env;
  const db = createDbClient(env);

  const productRepository = new ProductRepository(db);
  const orderRepository = new OrderRepository(db);
  const downloadTokenRepository = new DownloadTokenRepository(db);
  const verificationCodeRepository = new VerificationCodeRepository(db);

  const emailService = createEmailService(env);
  const paymentService = createPaymentService(env);
  const storageService = createStorageService(env);
  const paymentQueueService = createPaymentQueueService(env);

  const dependencies: Dependencies = {
    useCases: {
      listProducts: new ListProductsUseCase(productRepository),
      getProduct: new GetProductUseCase(productRepository),
      createOrder: new CreateOrderUseCase(
        orderRepository,
        productRepository,
        paymentService,
        env.RAZORPAY_KEY_ID,
      ),
      getOrderStatus: new GetOrderStatusUseCase(orderRepository, downloadTokenRepository),
      enqueuePaymentEvent: new EnqueuePaymentEventUseCase(
        paymentService,
        paymentQueueService,
        orderRepository,
      ),
      downloadAsset: new DownloadAssetUseCase(
        downloadTokenRepository,
        orderRepository,
        productRepository,
        storageService,
      ),
      requestFreshLink: new RequestFreshLinkUseCase(
        orderRepository,
        verificationCodeRepository,
        emailService,
      ),
      verifyFreshLink: new VerifyFreshLinkUseCase(
        orderRepository,
        verificationCodeRepository,
        downloadTokenRepository,
        productRepository,
        emailService,
        env.SITE_URL,
      ),
    },
    adminUseCases: {
      createProduct: new AdminCreateProductUseCase(productRepository, storageService),
      grantAccess: new AdminGrantAccessUseCase(
        orderRepository,
        downloadTokenRepository,
        productRepository,
        emailService,
        env.SITE_URL,
      ),
    },
  };

  c.set("dependencies", dependencies);
  await next();
}
