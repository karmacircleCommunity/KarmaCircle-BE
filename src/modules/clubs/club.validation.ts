import { z } from "zod";

export const listClubsQuerySchema = z.object({
  userName: z.string().optional(),
});
