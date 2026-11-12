# Nuxt Auth Template

This repository is an integration demo for the reusable [`@raworiginal/nuxt-auth-layer`](./packages/nuxt-auth-layer) package. The root Nuxt app consumes the layer through the pnpm workspace, so auth changes can be verified here before publishing a version.

## Local setup

Requirements: Node.js, pnpm, and Docker Compose (or a PostgreSQL database you manage).

1. Install dependencies and create a local environment file:

```sh
pnpm install
cp .env.example .env
```

2. Edit `.env`. The Docker values below work for local development; replace the secret and admin password with your own values. Generate a Better Auth secret with `openssl rand -base64 32`.

```dotenv
POSTGRES_DB=ProjectDB
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me_locally
DATABASE_URL=postgres://postgres:change_me_locally@localhost:5432/ProjectDB
BETTER_AUTH_SECRET=replace-with-output-from-openssl-rand-base64-32
NUXT_PUBLIC_SITE_URL=http://localhost:3000

ADMIN_NAME=Site Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password-of-at-least-12-characters
```

`BETTER_AUTH_SECRET` must be at least 32 characters; `ADMIN_PASSWORD` must be at least 12. Keep `.env` out of source control and use production-grade credentials and a managed secret store outside local development.

3. Start PostgreSQL and initialize the database:

```sh
docker compose up -d
pnpm exec nuxt-auth-layer-setup
```

The setup command applies the layer's migrations, then creates the initial admin using the `ADMIN_*` values. It is safe to rerun: an existing admin is left unchanged. If the configured email belongs to a non-admin account, setup stops without changing it. Don't run `pnpm db:migrate` as well during initial setup; the setup command already migrates.

4. Start the app:

```sh
pnpm dev
```

Open `http://localhost:3000`, sign in at `/login` with the configured admin email and password, and visit `/admin` to verify the admin tools. After upgrading the layer, rerun `pnpm exec nuxt-auth-layer-setup` to apply any pending migrations; it won't reset an existing admin's password.

## Checks

```sh
pnpm typecheck
pnpm build
```

## Using the layer in another app

Install a released version of `@raworiginal/nuxt-auth-layer` and add it to the Nuxt `extends` array. See the [layer documentation](./packages/nuxt-auth-layer/README.md) for consumer setup, configuration, and migration instructions.

## Maintaining the layer

Generate schema migrations with `pnpm db:generate`, commit them in `packages/nuxt-auth-layer`, and verify changes with `pnpm typecheck` and `pnpm build`. Update the layer package's changelog and version before publishing.
