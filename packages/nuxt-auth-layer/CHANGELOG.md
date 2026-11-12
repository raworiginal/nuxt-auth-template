# Changelog

Releases follow semantic versioning. Every release that changes the database schema must include its migration and describe the required consumer action here.

## 0.1.1

- Add a setup command that applies the packaged database migrations and creates the initial admin user from environment variables.

## 0.1.0

- Initial versioned layer extracted from the Nuxt Auth Template.
- Optional Google and GitHub social sign-in, configured per consuming app.
- Includes the existing Better Auth PostgreSQL schema and initial Drizzle migration.
- New installations should apply the included migration. Existing databases should use Drizzle's migration history and apply only migrations that have not already run.
