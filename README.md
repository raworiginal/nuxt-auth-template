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

## Architecture and Styling Guidelines

### Component organization

Components follow a **Composables, Container, Presentational** model:

- **Composables** contain reusable state, API calls, validation, and business logic.
- **Container components** orchestrate data loading, actions, and event handling.
- **Presentational components** focus on markup, props, emits, and visual states.

Suggested locations and naming:

- `composables/` for reusable behavior, such as `useAuth` and `useUserManagement`.
- `components/ui/` for generic presentational components, such as `BaseButton` and `BaseInput`.
- `components/features/` for domain-specific components, such as `AuthLoginForm` and `AdminUserTable`.
- Pages should primarily act as container components.

### Data flow

- Pass data down through typed props and communicate events up through emits.
- Presentational components should not make API calls or access auth state directly.
- Composables should expose typed state and actions.

### Styling

- Use DaisyUI component classes in templates.
- Put additional component-specific styling in a `<style scoped>` section.
- Use Tailwind's `@apply` directive for additional or repeated utility styling.
- Small state-dependent utilities may remain in templates when they improve readability.
- Avoid arbitrary CSS unless `@apply` cannot express the requirement.

### States and accessibility

Components should account for relevant loading, empty, error, disabled, and success states.
Every form input should have an associated label and an error state where applicable.
Destructive actions must require confirmation.

Visual state describes how a component appears or behaves—for example, loading, disabled,
focused, active, selected, expanded, error, success, or empty. Form state is separate and
describes the form's data and validation lifecycle, such as values, touched/untouched,
dirty/pristine, validation errors, and submission status. These concepts may overlap; for
example, a form validation error can produce an input's visual error state.

## User Stories

### Authentication

- As a guest, I want to be able to register as a user
- As a guest, I want to be able to sign in
- As a user, I want to be able to sign out
- As a user, I want to be able to request and complete a password reset
- As a user, I want to be able to verify my email address

### Account Management

- As a user, I want to be able to update my email, username, displayUsername, name, password
- As a user, I want to be able to delete my account
- As a user, I want to be able to view and revoke my active sessions

### Admin Management

- As an admin, I want to be able to see all users
- As an admin, I want to be able to search, filter, and paginate users
- As an admin, I want to be able to see a specific user and their sessions
- As an admin, I want to be able to ban and unban a user
- As an admin, I want to be able to revoke a user's session
- As an admin, I want to be able to revoke all of a user's sessions
- As an admin, I want to be able to reset a user's password
- As an admin, I want to be able to set a user's role
- As an admin, I want to be able to update a user's information
- As an admin, I want to be able to remove a user
- As an admin, I want destructive actions to require confirmation

### MVP Security Requirements

- Banned users cannot sign in or use existing sessions
- Only authorized admins can access admin functionality
- Passwords and session tokens are never exposed
- The last admin cannot be removed or demoted
- Password and email changes invalidate relevant sessions or require reauthentication
- Authentication endpoints have rate limiting and server-side validation
- Registration, login, password reset, authorization, banning, and deletion are covered by automated tests

### Deferred Features

The following features are intentionally deferred until after the MVP:

- OAuth and social login
- Multi-factor authentication
- Admin audit logs
- Bulk user actions
- Scheduled or expiring bans
- Data export
- Account restoration
- Custom roles and permissions
- Login notifications
- Detailed device and location tracking

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
