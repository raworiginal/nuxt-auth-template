import "dotenv/config";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "../server/db/schema/auth-schema.ts";
import { relations } from "../server/db/schema/relations.ts";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set.`);
  }
  return value;
}

function loadSetupConfig() {
  const email = requiredEnv("ADMIN_EMAIL").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Required environment variable ADMIN_PASSWORD is not set.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }

  return {
    databaseUrl: requiredEnv("DATABASE_URL"),
    secret: requiredEnv("BETTER_AUTH_SECRET"),
    name: requiredEnv("ADMIN_NAME"),
    email,
    password,
    baseURL: process.env.NUXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  };
}

function runMigrations() {
  const drizzleKitEntry = require.resolve("drizzle-kit");
  const drizzleKitBin = join(dirname(drizzleKitEntry), "bin.cjs");
  const drizzleConfig = join(packageRoot, "drizzle.config.ts");
  const result = spawnSync(
    process.execPath,
    [drizzleKitBin, "migrate", "--config", drizzleConfig],
    { cwd: process.cwd(), env: process.env, stdio: "inherit" },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Database migration failed (exit code ${result.status ?? "unknown"}).`);
  }
}

async function main() {
  const config = loadSetupConfig();
  if (config.secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters long.");
  }

  console.info("Applying Nuxt Auth Layer database migrations...");
  runMigrations();

  const client = postgres(config.databaseUrl, { max: 1 });
  try {
    const db = drizzle({ client, relations });
    const [existingUser] = await db
      .select({ role: authSchema.user.role })
      .from(authSchema.user)
      .where(eq(authSchema.user.email, config.email))
      .limit(1);

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.info(`Admin ${config.email} already exists; leaving it unchanged.`);
        return;
      }
      throw new Error(
        `A non-admin user already exists for ${config.email}; no account changes were made. Promote it manually if appropriate.`,
      );
    }

    const auth = betterAuth({
      secret: config.secret,
      baseURL: config.baseURL,
      emailAndPassword: { enabled: true },
      database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
      plugins: [admin()],
    });

    const result = await auth.api.createUser({
      body: {
        email: config.email,
        password: config.password,
        name: config.name,
        role: "admin",
        data: { emailVerified: true },
      },
    });

    console.info(`Created initial admin user ${result.user.email}.`);
  } finally {
    await client.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Nuxt Auth Layer setup failed: ${message}`);
  process.exitCode = 1;
});
