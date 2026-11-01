import { z } from "zod";
export const listUsersOptionsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
  searchValue: z.string().optional(),
  searchField: z.enum(["email", "name"]).optional(),
  searchOperator: z
    .enum(["contains", "starts_with", "ends_with"])
    .optional(),
});
