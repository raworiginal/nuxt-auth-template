# Nuxt Auth Starter

A Nuxt 4 starter project with Better Auth, NuxtHub, and PostgreSQL. It includes a local Nuxt layer for the default auth and admin experience. This repository is intended to be copied as a project template; it is not published as an npm package.

## Start a project

1. Create a project from this repository using GitHub's **Use this template** flow, or clone it.
2. Install dependencies and configure the local environment:

   ```sh
   pnpm install
   cp .env.example .env
   ```

3. Set a strong `NUXT_APP_SECRET` (at least 32 characters) and `ADMIN_PASSWORD` (at least 12 characters) in `.env`. `NUXT_BETTER_AUTH_SECRET` can be used when you want a dedicated Better Auth secret.
4. Start PostgreSQL and set up the database and initial admin:

   ```sh
   docker compose up -d
   pnpm auth:setup
   ```

   The setup command prepares Nuxt, applies pending migrations, and creates the initial admin if it does not already exist. An existing admin is left unchanged; setup stops if the configured email belongs to a non-admin account.
5. Start the app:

   ```sh
   pnpm dev
   ```

   Visit `http://localhost:3000`, sign in at `/login`, and visit `/admin`.

## How the project is organized

- `layers/auth/` contains the default admin/profile pages, components, composables, route rules, and styling. It is a local Nuxt layer, not a package dependency.
- `app/` contains project-owned pages and UI, including login, registration, navigation, and Better Auth client configuration.
- `server/` contains this project's Better Auth server configuration, API handlers, and NuxtHub-managed PostgreSQL migrations. Better Auth tables are generated from the enabled plugins.
- `shared/auth/` contains schemas and types used by both the app and server.

The root `nuxt.config.ts` extends `./layers/auth`. To replace a layer page or component, add a project file at the same path under `app/`; project files take priority over extended-layer files. You can also edit or remove the local layer directly in your copied project.

## Customize Better Auth

Server and client configuration live in the project so each app can add the plugins it needs. For example, to add Better Auth's username plugin, add `username()` to `server/auth.config.ts` and `usernameClient()` to `app/auth.config.ts`:

```ts
// server/auth.config.ts
import { username } from "better-auth/plugins";

// Keep the existing config and add username() to its plugins array:
plugins: [admin(), username()],
```

```ts
// app/auth.config.ts
import { usernameClient } from "better-auth/client/plugins";

// Keep the existing client config and add usernameClient():
plugins: [adminClient(), usernameClient()],
```

Better Auth plugin tables are generated from the server configuration. Restart Nuxt after changing plugins, generate and review a migration with `pnpm db:generate`, then apply it with `pnpm db:migrate`. Put application-owned tables in `server/db/schema/`; do not redefine Better Auth tables there.

## Configuration

The app uses PostgreSQL through NuxtHub. Set `DATABASE_URL` and `NUXT_APP_SECRET` in the environment. Set `NUXT_PUBLIC_SITE_URL` to the canonical production URL. Social sign-in is optional; set both variables for a provider to enable it:

```dotenv
NUXT_GOOGLE_CLIENT_ID=...
NUXT_GOOGLE_CLIENT_SECRET=...
NUXT_GITHUB_CLIENT_ID=...
NUXT_GITHUB_CLIENT_SECRET=...
```

Register the matching callback URLs with each OAuth provider:

- `https://your-domain/api/auth/callback/google`
- `https://your-domain/api/auth/callback/github`

### Netlify or Vercel with Neon

Deploy with the standard Node/serverless runtime (Node 22.19+), not an Edge runtime. Set `DATABASE_URL` to Neon’s pooled connection string for application traffic. For migrations, set `MIGRATIONS_DATABASE_URL` to Neon’s direct (non-pooled) connection string; `pnpm db:migrate` and `pnpm auth:setup` prefer it when present. Both URLs must target the same database. Keep production and preview database credentials isolated.

Run migrations as a release/deploy step, not in the application build. Set `NUXT_PUBLIC_SITE_URL` to the production domain and configure the OAuth callback URLs above. Add secrets in the hosting provider’s environment settings rather than committing them.

### Self-hosted PostgreSQL

Use the included Docker Compose service for local development. For production, provide a PostgreSQL connection string through `DATABASE_URL` and run `pnpm db:migrate` before deploying the app.

## Database commands

```sh
pnpm db:generate  # Generate a migration from the NuxtHub/Better Auth schema
pnpm db:migrate   # Apply pending migrations
pnpm auth:setup   # Prepare Nuxt, apply migrations, and create the initial admin
```

Keep `.env` and production credentials out of source control. Use a secret manager and a managed PostgreSQL database such as Neon for hosted deployments.

## Checks

```sh
pnpm typecheck
pnpm build
```
