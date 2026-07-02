import { z } from "zod";

export const RequestFreshLinkSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
});

export const VerifyFreshLinkSchema = RequestFreshLinkSchema.extend({
  code: z.string().min(4).max(8),
});

export type RequestFreshLinkValues = z.infer<typeof RequestFreshLinkSchema>;
export type VerifyFreshLinkValues = z.infer<typeof VerifyFreshLinkSchema>;
