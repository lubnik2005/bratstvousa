# AGENTS.md - Development Guidelines for bratstvousa

This file contains guidelines for AI coding agents working in this SvelteKit + TypeScript project.

## Project Overview

This is a SvelteKit 2.x application using:

- **Frontend**: Svelte 5, TypeScript, TailwindCSS, Bootstrap 5 (via Sveltestrap)
- **Backend**: SvelteKit server routes, Drizzle ORM with PostgreSQL
- **Auth**: Custom session-based auth (Oslo crypto)
- **I18n**: Paraglide SvelteKit
- **Testing**: Vitest (unit), Playwright (e2e)
- **Deployment**: Node adapter, SST (AWS)
- **Mock Database**: Built-in mock system for development without PostgreSQL

## Development Setup

### Option 1: With Mock Database (Recommended for Quick Start)

```bash
# Set in .env
USE_MOCK_DB="true"

npm install
npm run dev
```

No PostgreSQL required! See MOCK_DATABASE.md for details.

### Option 2: With Real PostgreSQL

```bash
# Set in .env
USE_MOCK_DB="false"
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"

npm run db:start   # Start PostgreSQL in Docker
npm install
npm run dev
```

## Build, Lint, Test Commands

### Development

```bash
npm run dev                 # Start dev server
npm run check               # Type-check
npm run check:watch         # Type-check in watch mode
```

### Testing

```bash
npm run test                # Run all tests (unit + e2e)
npm run test:unit           # Run Vitest unit tests
npm run test:unit -- --run  # Run unit tests once (no watch)
npm run test:e2e            # Run Playwright e2e tests

# Run a single test file
npx vitest src/demo.spec.ts
npx playwright test e2e/demo.test.ts
```

### Build & Quality

```bash
npm run build               # Build for production
npm run preview             # Preview production build
npm run lint                # Run Prettier + ESLint
npm run format              # Format code with Prettier
```

### Database

```bash
npm run db:start            # Start PostgreSQL in Docker
npm run db:push             # Push schema changes to DB
npm run db:migrate          # Run migrations
npm run db:studio           # Open Drizzle Studio
```

### Storybook

```bash
npm run storybook           # Start Storybook dev server
npm run build-storybook     # Build Storybook
```

## Code Style Guidelines

### General Formatting

- **Tabs for indentation** (not spaces) - configured in `.prettierrc`
- **Single quotes** for strings
- **No trailing commas**
- **100 character line length**
- Run `npm run format` before committing

### TypeScript

- **Strict mode enabled** - all TS strict checks are on
- **Explicit types** for function parameters and return values
- **No `any`** - use `unknown` or proper types
- **Type imports**: Use `import type` for type-only imports
  ```typescript
  import type { PageServerLoad, Actions } from './$types';
  import type { RequestEvent } from '@sveltejs/kit';
  ```

### Imports Organization

Order imports as follows:

1. SvelteKit and Svelte imports
2. Third-party libraries
3. Local imports (`$lib/*`)
4. Relative imports
5. Type imports (using `import type`)

Example:

```typescript
import { redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
```

### Naming Conventions

- **Files**: kebab-case for routes/components (`+page.svelte`, `main-nav.svelte`)
- **Components**: PascalCase for Svelte components (`Header.svelte`, `MainNav.svelte`)
- **Variables/Functions**: camelCase (`sessionToken`, `validateSessionToken`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants (`DAY_IN_MS`)
- **Types/Interfaces**: PascalCase (`Session`, `User`, `FormSubmission`)
- **Database tables**: snake_case (`user`, `form_submissions`, `youth_events`)

### Svelte Components

- Use `<script lang="ts">` for TypeScript
- Export props explicitly: `export let title = 'Default';`
- Use `$props()` runes for Svelte 5 when appropriate
- Template syntax: Use `{#if}`, `{#each}`, `{#await}` blocks
- Keep logic in `+page.server.ts` when dealing with data loading/mutations

Example component structure:

```svelte
<script lang="ts">
	export let title = 'Default Title';
	export let subtitle: string | undefined = undefined;
</script>

<div class="container">
	<h1>{title}</h1>
	{#if subtitle}
		<p>{subtitle}</p>
	{/if}
</div>
```

### SvelteKit Conventions

- **Server routes**: `+page.server.ts`, `+layout.server.ts`
- **Load functions**: Export as `export const load: PageServerLoad`
- **Actions**: Export as `export const actions: Actions`
- **Redirects**: Use `redirect(302, '/path')` from `@sveltejs/kit`
- **Error handling**: Use `fail(statusCode, data)` for form actions

### Database (Drizzle ORM)

- Schema in `src/lib/server/db/schema.ts`
- Use `pgTable` for table definitions
- Export types: `export type User = typeof user.$inferSelect;`
- Queries go in `src/lib/server/db/queries.ts`
- Use prepared statements for security

Example schema:

```typescript
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export type User = typeof user.$inferSelect;
```

### Error Handling

- Use try-catch for async operations
- Return `fail()` from form actions with appropriate status codes
- Log errors server-side before returning to client
- Never expose sensitive error details to client

```typescript
export const actions: Actions = {
	submit: async (event) => {
		try {
			// ... operation
		} catch (error) {
			console.error('Failed to submit form:', error);
			return fail(500, { message: 'Internal server error' });
		}
	}
};
```

### Security

- **Never hardcode secrets** - use environment variables
- **Validate all user input** server-side
- **Use parameterized queries** (Drizzle handles this)
- **Session tokens** use SHA-256 hashing
- **Password hashing** uses Argon2 (`@node-rs/argon2`)

### Comments

- Use comments sparingly - prefer self-documenting code
- Document "why" not "what"
- Use JSDoc for exported functions when needed
- Note: `src/lib/helpers.ts` has a comment: "Please, never have a helpers file" - avoid catch-all utility files

### Testing

- **Unit tests**: `*.spec.ts` files next to source (Vitest)
- **E2E tests**: `e2e/*.test.ts` (Playwright)
- Test files use describe/it/expect pattern
- Keep tests focused and isolated

```typescript
import { describe, it, expect } from 'vitest';

describe('feature name', () => {
	it('should do something specific', () => {
		expect(result).toBe(expected);
	});
});
```

## Project-Specific Notes

- **Authentication**: Custom session-based auth in `$lib/server/auth.ts`
- **I18n**: Paraglide handles translations, configured in `vite.config.ts`
- **Media**: AWS S3 for file storage (`@aws-sdk/client-s3`)
- **Regions**: Multi-region support (all, central, east, california, north-west)
- **Event schemas**: Multiple event tables per ministry in DB schema
