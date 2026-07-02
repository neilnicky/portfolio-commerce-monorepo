import type { ApiClient } from "@infrastructure/api/client";
import type { IOrderRepository, CreateOrderInput } from "@domain/repositories/order.repository.interface";
import type { Order } from "@domain/entities/order.entity";
import type { OrderDto } from "@application/dtos/order.dto";
import { orderMapper } from "@infrastructure/mappers/order.mapper";
import { API_VERSION } from "@config/constants";

export class HttpOrderRepository implements IOrderRepository {
  constructor(private readonly api: ApiClient) {}

  async findById(id: string): Promise<Order | null> {
    const dto = await this.api.get<OrderDto | null>(`/${API_VERSION}/orders/${id}`);
    return dto ? orderMapper.toEntity(dto) : null;
  }

  async create(input: CreateOrderInput): Promise<Order> {
    const dto = await this.api.post<OrderDto>(
      `/${API_VERSION}/orders`,
      orderMapper.toCreateDto(input),
    );
    return orderMapper.toEntity(dto);
  }

  async grantAccess(orderId: string): Promise<void> {
    await this.api.post(`/${API_VERSION}/admin/orders/${orderId}/grant-access`);
  }
}
