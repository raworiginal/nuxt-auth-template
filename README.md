# Nuxt Auth Starter

A Nuxt 4 starter project with Better Auth, PostgreSQL/Drizzle, and a local Nuxt layer for the default auth and admin experience. This repository is intended to be copied as a project template; it is not published as an npm package.

## Start a project

1. Create a project from this repository using GitHub's **Use this template** flow, or clone it.
2. Install dependencies and configure the local environment:

   ```sh
   pnpm install
   cp .env.example .env
   ```

3. Set a strong `NUXT_BETTER_AUTH_SECRET` (at least 32 characters) and `ADMIN_PASSWORD` (at least 12 characters) in `.env`. `NUXT_APP_SECRET` is also supported by the module; the setup script uses it when the dedicated auth secret is absent. Existing projects can keep using the legacy `BETTER_AUTH_SECRET` name.
4. Start PostgreSQL and set up the database and initial admin:

   ```sh
   docker compose up -d
   pnpm auth:setup
   ```

   The setup script applies pending migrations and creates the initial admin if it does not already exist. An existing admin is left unchanged; setup stops if the configured email belongs to a non-admin account.
5. Start the app:

   ```sh
   pnpm dev
   ```

   Visit `http://localhost:3000`, sign in at `/login`, and visit `/admin`.

## How the project is organized

- `layers/auth/` contains the default admin/profile pages, components, composables, route rules, and styling. It is a local Nuxt layer, not a package dependency.
- `app/` contains project-owned pages and UI, including login, registration, navigation, and Better Auth client configuration.
- `server/` contains this project's Better Auth server configuration, API handlers, database schema, and migrations.
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

Some plugins add database fields or tables. Update `server/db/schema/`, generate and review a migration, then apply it with `pnpm db:migrate`. The setup script applies migrations from this project, so plugin-specific migrations belong here too.

## Configuration

The app uses PostgreSQL. Configure `DATABASE_URL` and `NUXT_BETTER_AUTH_SECRET` in the environment. Set `NUXT_PUBLIC_SITE_URL` for production deployments where the public URL cannot be inferred. Social sign-in is optional; set both variables for a provider to enable it:

```dotenv
NUXT_GOOGLE_CLIENT_ID=...
NUXT_GOOGLE_CLIENT_SECRET=...
NUXT_GITHUB_CLIENT_ID=...
NUXT_GITHUB_CLIENT_SECRET=...
```

Register the matching callback URLs with each OAuth provider:

- `https://your-domain/api/auth/callback/google`
- `https://your-domain/api/auth/callback/github`

## Database commands

```sh
pnpm db:generate  # Generate a migration from server/db/schema
pnpm db:migrate   # Apply pending migrations
pnpm auth:setup   # Apply migrations and create the initial admin
```

Keep `.env` and production credentials out of source control. For production, use a secret manager and a managed PostgreSQL database.

## Checks

```sh
pnpm typecheck
pnpm build
```
