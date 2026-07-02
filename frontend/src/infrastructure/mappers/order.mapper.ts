import { Order } from "@domain/entities/order.entity";
import { Money } from "@domain/value-objects/money.vo";
import { OrderStatus } from "@domain/value-objects/order-status.vo";
import type { OrderDto, CreateOrderDto } from "@application/dtos/order.dto";
import type { CreateOrderInput } from "@domain/repositories/order.repository.interface";

export const orderMapper = {
  toEntity(d: OrderDto): Order {
    return new Order(
      d.id,
      d.product_id,
      d.buyer_email,
      Money.of(d.amount_minor, d.currency),
      OrderStatus.fromString(d.status),
      new Date(d.created_at),
    );
  },
  toCreateDto(input: CreateOrderInput): CreateOrderDto {
    return { product_id: input.productId, buyer_email: input.buyerEmail };
  },
};
