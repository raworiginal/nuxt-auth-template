import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const layerRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  out: join(layerRoot, "server/db/migrations"),
  schema: join(layerRoot, "server/db/schema"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
