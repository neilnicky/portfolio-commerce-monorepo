/** Wire shape from the backend API. */
export interface OrderDto {
  id: string;
  product_id: string;
  buyer_email: string;
  amount_minor: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface CreateOrderDto {
  product_id: string;
  buyer_email: string;
}
