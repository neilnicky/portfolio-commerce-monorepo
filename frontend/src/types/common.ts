/** Cross-cutting shared types (framework-agnostic). */

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedDto<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export type ID = string;
