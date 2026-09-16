import { drizzle } from "drizzle-orm/pglite";
import { authRelations } from "../db/schema/auth-schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  relations: authRelations,
});
