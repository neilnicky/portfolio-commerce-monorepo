import { z } from "zod";

/** Buyer email captured before payment — the canonical contact for delivery. */
export const CheckoutSchema = z.object({
  productId: z.string().min(1),
  email: z.string().email(),
});

export type CheckoutValues = z.infer<typeof CheckoutSchema>;
