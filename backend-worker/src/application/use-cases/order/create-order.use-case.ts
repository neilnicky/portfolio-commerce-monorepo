import type { IOrderRepository } from "@domain/repositories/order.repository.interface";
import type { IProductRepository } from "@domain/repositories/product.repository.interface";
import type { IPaymentService } from "@application/ports/payment.port";
import { NotFoundError, ValidationError } from "@domain/errors/domain.error";
import { Order } from "@domain/entities/order.entity";
import { generateId } from "@utils/id-generator";

export interface CreateOrderRequestDto {
  productId: string;
  buyerEmail: string;
}

export interface CreateOrderResponseDto {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly paymentService: IPaymentService,
    private readonly razorpayKeyId: string,
  ) {}

  async execute(req: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    const product = await this.productRepository.findById(req.productId);
    if (!product) throw new NotFoundError("Product", req.productId);
    if (!product.isPublished) throw new ValidationError("Product is not available for purchase");

    const paymentOrder = await this.paymentService.createOrder(
      product.price.toMinorUnit(),
      product.price.getCurrency(),
      generateId("order"),
    );

    const order = Order.create(
      generateId("order"),
      product.id,
      req.buyerEmail,
      paymentOrder.amount,
      paymentOrder.currency,
      paymentOrder.razorpayOrderId,
    );

    await this.orderRepository.save(order);

    return {
      orderId: order.id,
      razorpayOrderId: paymentOrder.razorpayOrderId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      keyId: this.razorpayKeyId,
    };
  }
}
