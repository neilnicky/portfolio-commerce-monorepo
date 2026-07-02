/** Shapes shared across the API boundary (envelope, error body, etc.). */

export interface ApiErrorBody {
  kind: string;
  message: string;
  details?: unknown;
}
