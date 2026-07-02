import { z } from "zod";

/** One schema, both ends: admin product form (client) + route handler (server). */
export const ProductFormSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  priceMinor: z.number().int().nonnegative(),
  currency: z.string().length(3).default("INR"),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
