# Nuxt Auth Template

This is a template for starting full-stack nuxt applications with auth. It has an auth panel layer for managing users and sessions in your application.

## Tech Stack

- Nuxt 4
- Vue 3
- Drizzle
- Better-Auth
- Tailwind
- DaisyUI
- Zod

## User Stories

- As a guest, I want to be able to register as a user
- As a user, I want to be able to update my email, username, displayUsername, name, password
- As a user, I want to be able to delete my account
- As an admin, I want to be able to see all users
- As an admin, I want to be able to see a specific user and their sessions
- As an admin, I want to be able to ban and unban a user
- As an admin, I want to be able to revoke a user's session
- As an admin, I want to be able to revoke all of a user's sessions
- As an admin, I want to be able to reset a user's password
- As an admin, I want to be able to set a user's role
- As an admin, I want to be able to update a user's information
- As an admin, I want to be able to remove a user

## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm build
```

Locally preview production build:

```bash
# pnpm
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
