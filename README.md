# Nuxt Auth Template

This repository is an integration demo for the reusable [`@raworiginal/nuxt-auth-layer`](./packages/nuxt-auth-layer) package. The root Nuxt app consumes the layer through the pnpm workspace, so auth changes can be verified here before publishing a version.

## Requirements

- Node.js and pnpm
- PostgreSQL (or Docker Compose)
- `DATABASE_URL` and a `BETTER_AUTH_SECRET` of at least 32 characters

Copy `.env.example` to `.env`, set a secret, then start PostgreSQL and the app:

```sh
docker compose up -d
pnpm install
pnpm dev
```

The app is available at `http://localhost:3000`. Apply database migrations with `pnpm db:migrate` before first use and after layer updates that include migrations. Generate a schema migration with `pnpm db:generate` when changing the auth schema.

## Checks

```sh
pnpm typecheck
pnpm build
```

## Using the layer in another app

Install a released version of `@raworiginal/nuxt-auth-layer` and add it to the Nuxt `extends` array. See the [layer documentation](./packages/nuxt-auth-layer/README.md) for setup, configuration, and migration notes.
