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

Set `DATABASE_URL` to a PostgreSQL connection string and `BETTER_AUTH_SECRET` to a secret of at least 32 characters. Configure `NUXT_PUBLIC_SITE_URL` for deployments where the public URL cannot be inferred. The demo app in this repository includes a `.env.example` and Docker Compose database service.

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

The layer currently expects PostgreSQL and the Better Auth Drizzle schema in `server/db/schema`. Its schema and migrations are part of the package. Review and apply migrations as part of each consuming app's deployment; updating the package does not migrate a database automatically. Install `drizzle-kit` in the consuming app and run migrations with the packaged config:

```sh
pnpm exec drizzle-kit migrate --config node_modules/@raworiginal/nuxt-auth-layer/drizzle.config.ts
```

In this repository, `pnpm db:migrate` runs the same config from the workspace source. Maintainers generate new migrations with `pnpm db:generate` and commit them in the layer package. See [`CHANGELOG.md`](./CHANGELOG.md) for release-specific migration notes.

## Included functionality

- Registration, email/password and optional social login, and logout logic via composables; profile and password-management UI
- Account and session management
- Admin user search, editing, bans, session revocation, and removal
- Auth-protected `/app/**` and `/admin/**` routes
- Better Auth client/server configuration and PostgreSQL schema

## Development and releases

The repository root is an integration demo that consumes this package through the pnpm workspace. Make layer changes in `packages/nuxt-auth-layer`, verify them from the root app, update this package's semver version, and publish a release. Consumers update by changing their dependency version and applying any documented database migrations.
