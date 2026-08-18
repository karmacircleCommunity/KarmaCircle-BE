import { z } from "zod";

export const updateProfileSchema = z.object({
  tagLine: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});

export const listUsersQuerySchema = z.object({
  userName: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
