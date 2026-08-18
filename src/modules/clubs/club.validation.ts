import { z } from "zod";

export const listClubsQuerySchema = z.object({
  userName: z.string().optional(),
});

export type ListClubsQuery = z.infer<typeof listClubsQuerySchema>;
