import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import { user } from "~~/server/db/schema/auth-schema";

export const userSelectSchema = createSelectSchema(user);
export const usesrInsertSchema = createInsertSchema(user);
export const userUpdateSchema = createUpdateSchema(user);
