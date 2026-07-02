/** Wire shape from the backend API (server field names, snake_case). */
export interface ProductDto {
  id: string;
  title: string;
  description: string;
  price_minor: number;
  currency: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface CreateProductDto {
  title: string;
  description: string;
  price_minor: number;
  currency: string;
}
