import { createSelectSchema } from "drizzle-orm/zod";
import { user } from "~~/server/db/schema"

export const userSelectSchema = createSelectSchema(user)


