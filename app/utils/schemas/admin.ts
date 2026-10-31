import { z } from "zod";
export const listUsersOptionsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  searchValue: z.string().optional(),
});

export type ListUsersOptions = z.infer<typeof listUsersOptionsSchema>;
