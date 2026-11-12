# @raworiginal/nuxt-auth-layer

A reusable Nuxt 4 layer providing authentication logic, user-administration UI, server endpoints, Better Auth setup, and the PostgreSQL/Drizzle schema used by this template. It does not provide login or registration pages or site navigation.

## Install

Install the layer and its Nuxt peer dependency in a Nuxt 4.5.2+ application:

```sh
pnpm add @raworiginal/nuxt-auth-layer
```

Extend it from `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ["@raworiginal/nuxt-auth-layer"],
});
```

Your project takes precedence over the layer, so you can replace its pages, components, and configuration by adding files at the same paths in your app. The repository root contains the integration demo's example home, login, and registration pages, forms, and navigation; these examples are not included in the published layer. The layer keeps the auth composables and expects consuming apps to provide their own `/login` page for the configured redirects.

## Configuration

Each consuming app must provide its own PostgreSQL connection and Better Auth secret. Set `DATABASE_URL` to a PostgreSQL connection string and `BETTER_AUTH_SECRET` to a random secret of at least 32 characters. Set `NUXT_PUBLIC_SITE_URL` when the public URL cannot be inferred (for example, when deploying behind a proxy). Keep these values in the consuming app's environment, not in source control.

### Optional Google and GitHub sign-in

Social sign-in is opt-in per app. Set both runtime variables for a provider to enable its login button:

```dotenv
NUXT_GOOGLE_CLIENT_ID=...
NUXT_GOOGLE_CLIENT_SECRET=...
# Optional GitHub provider
NUXT_GITHUB_CLIENT_ID=...
NUXT_GITHUB_CLIENT_SECRET=...
```

Register the callback URL `https://your-domain/api/auth/callback/google` or `https://your-domain/api/auth/callback/github` in the provider's OAuth app settings (use `http://localhost:3000` for local development). Keep client secrets server-side and out of source control. A provider is omitted when both credentials are unset; setting only one credential causes the server to report a configuration error.

The layer currently expects PostgreSQL. Its Better Auth schema and migrations are included in the package, but installing or updating the package does not automatically change your database or create an admin. For a new or existing database, add the setup values to the consuming app's `.env`:

```dotenv
DATABASE_URL=postgres://user:password@host:5432/database
BETTER_AUTH_SECRET=replace-with-a-random-secret-of-at-least-32-characters
NUXT_PUBLIC_SITE_URL=https://your-domain.example
ADMIN_NAME=Site Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password-of-at-least-12-characters
```

Use a secret manager for production values. Then, from the consuming app's root (where its `.env` is located), run:

```sh
pnpm exec nuxt-auth-layer-setup
```

The command applies pending packaged migrations first, then creates an email-verified admin account with the supplied name, email, and password. `ADMIN_PASSWORD` must be at least 12 characters. It is safe to rerun: an existing admin with that email is left unchanged, including its password. If a non-admin user already has that email, setup stops without changing the account. Use the admin's email and password to sign in through the consuming app's login page; the layer provides `/admin` but expects the app to provide its own `/login` page.

On later layer upgrades, rerun the setup command to apply any new migrations. It does not downgrade or reset the database. In this repository, `pnpm db:migrate` runs the same migration config from the workspace source. Maintainers generate new migrations with `pnpm db:generate` and commit them in the layer package. See [`CHANGELOG.md`](./CHANGELOG.md) for release-specific migration notes.

## Included functionality

- Registration, email/password and optional social login, and logout logic via composables; profile and password-management UI
- Account and session management
- Admin user search, editing, bans, session revocation, and removal
- Auth-protected `/app/**` and `/admin/**` routes
- Better Auth client/server configuration and PostgreSQL schema

## Development and releases

The repository root is an integration demo that consumes this package through the pnpm workspace. Make layer changes in `packages/nuxt-auth-layer`, verify them from the root app, update this package's semver version, and publish a release. Consumers update by changing their dependency version and applying any documented database migrations.
