# AGENTS.md - Development Guidelines for bratstvousa

This file contains guidelines for AI coding agents working in this monorepo project.

## Project Overview

**Monorepo structure:**

- `app/` - SvelteKit 2.x frontend/backend application (main development)
- `admin/` - Laravel Nova admin panel (legacy, minimal changes)
- `nginx/` - Nginx configuration for deployment
- Root-level Docker Compose setup for local development

**Tech Stack (app/):**

- **Frontend**: Svelte 5, TypeScript, TailwindCSS, Bootstrap 5 (Sveltestrap)
- **Backend**: SvelteKit server routes, Drizzle ORM with PostgreSQL
- **Auth**: Custom session-based auth using Oslo crypto (SHA-256, Argon2)
- **I18n**: Paraglide SvelteKit for translations
- **Media**: AWS S3 for file storage (`@aws-sdk/client-s3`)
- **Testing**: Vitest (unit tests), Playwright (e2e tests)
- **Deployment**: Node adapter, SST (AWS), Docker

## Working Directory

**Always work in `app/` directory for SvelteKit development.** Use `workdir` parameter when running commands:

```bash
# Good: Use workdir parameter
workdir="app" with command: npm run dev

# Bad: Using cd
cd app && npm run dev
```

## Build, Lint, Test Commands

All commands should be run from the `app/` directory:

### Development

```bash
npm run dev                 # Start dev server (port 5173)
npm run check               # Type-check TypeScript
npm run check:watch         # Type-check in watch mode
```

### Testing

```bash
npm run test                # Run all tests (unit + e2e)
npm run test:unit           # Run Vitest unit tests (watch mode)
npm run test:unit -- --run  # Run unit tests once (CI mode)
npm run test:e2e            # Run Playwright e2e tests

# Run a single test file
npx vitest src/demo.spec.ts              # Single unit test
npx vitest src/lib/auth.spec.ts --run    # Single unit test, no watch
npx playwright test e2e/demo.test.ts     # Single e2e test
npx playwright test e2e/ --grep "login"  # Filter by test name
```

### Build & Quality

```bash
npm run build               # Build for production
npm run preview             # Preview production build
npm run lint                # Run Prettier + ESLint
npm run format              # Format code with Prettier
```

### Database (Docker Compose)

```bash
npm run db:start            # Start PostgreSQL in Docker (docker compose up)
npm run db:push             # Push schema changes to DB (development)
npm run db:migrate          # Run migrations (production)
npm run db:studio           # Open Drizzle Studio (GUI)
```

### Storybook

```bash
npm run storybook           # Start Storybook dev server (port 6006)
npm run build-storybook     # Build static Storybook
```

## Code Style Guidelines

### General Formatting

- **Tabs for indentation** (not spaces) - configured in `.prettierrc`
- **Single quotes** for strings (`'example'` not `"example"`)
- **No trailing commas** in objects/arrays
- **100 character line length** maximum
- **Always run `npm run format` before committing**

### TypeScript Rules

- **Strict mode enabled** - all TypeScript strict checks are on
- **Explicit types** required for function parameters and return values
- **No `any` type** - use `unknown` or proper types instead
- **Type imports**: Use `import type` for type-only imports to help with tree-shaking

```typescript
// Good
import type { PageServerLoad, Actions } from "./$types";
import type { RequestEvent } from "@sveltejs/kit";
import { redirect, fail } from "@sveltejs/kit";

// Bad
import { PageServerLoad, Actions } from "./$types";
```

### Import Organization

**Order imports in this sequence:**

1. Svelte and SvelteKit core imports
2. Third-party library imports (alphabetically)
3. Local `$lib/*` imports (alphabetically)
4. Relative imports (`./`, `../`)
5. Type-only imports at the end (grouped with `import type`)

**Example:**

```typescript
import { redirect, fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import * as auth from "$lib/server/auth";
import type { Actions, PageServerLoad } from "./$types";
import type { RequestEvent } from "@sveltejs/kit";
```

### Naming Conventions

- **Files**: kebab-case (`event-list.svelte`, `+page.server.ts`)
- **Components**: PascalCase for component files (`Header.svelte`, `MainNav.svelte`)
- **Variables/Functions**: camelCase (`sessionToken`, `validateSessionToken`)
- **Constants**: SCREAMING_SNAKE_CASE (`DAY_IN_MS`, `SESSION_COOKIE_NAME`)
- **Types/Interfaces**: PascalCase (`Session`, `User`, `EventData`)
- **Database tables**: snake_case (`user`, `session`, `youth_events`)

### Svelte Component Structure

**Use this template for Svelte components:**

```svelte
<script lang="ts">
	// Imports first
	import { page } from '$app/stores';
	import type { ComponentProps } from 'svelte';

	// Props with explicit types
	export let title = 'Default Title';
	export let subtitle: string | undefined = undefined;
	export let items: Array<{ id: number; name: string }> = [];

	// Local state and reactive declarations
	let count = 0;
	$: doubled = count * 2;

	// Functions
	function handleClick() {
		count += 1;
	}
</script>

<div class="container">
	<h1>{title}</h1>
	{#if subtitle}
		<p>{subtitle}</p>
	{/if}
	{#each items as item (item.id)}
		<div>{item.name}</div>
	{/each}
</div>

<style>
	/* Scoped styles if needed */
</style>
```

**Svelte 5 runes (when appropriate):**

- Use `$props()` for complex prop handling
- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects

### SvelteKit Route Conventions

- **Server routes**: `+page.server.ts`, `+layout.server.ts`, `+server.ts`
- **Load functions**: Always type with `PageServerLoad` or `LayoutServerLoad`
- **Actions**: Always type with `Actions` from `./$types`
- **Redirects**: Use `redirect(302, '/path')` from `@sveltejs/kit`
- **Form failures**: Use `fail(statusCode, data)` for validation errors
- **Environment variables**: Import from `$env/dynamic/private` (server) or `$env/static/public` (client)

**Example route structure:**

```typescript
import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/login");
  }
  return { user: event.locals.user };
};

export const actions: Actions = {
  submit: async (event) => {
    const formData = await event.request.formData();
    const title = formData.get("title");

    if (!title || typeof title !== "string") {
      return fail(400, { message: "Title is required" });
    }

    // Process form...
    return { success: true };
  },
};
```

### Database (Drizzle ORM)

- **Schema location**: `src/lib/server/db/schema.ts`
- **Queries location**: `src/lib/server/db/queries.ts`
- **Connection**: Import `db` from `$lib/server/db`
- **Type inference**: Use `typeof tableName.$inferSelect` for row types
- **Use `pgTable`** for table definitions with explicit column types

**Example schema:**

```typescript
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  age: integer("age"),
});

export type User = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
```

**Querying patterns:**

```typescript
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

// Select
const users = await db.select().from(user).where(eq(user.id, userId));

// Insert
await db
  .insert(user)
  .values({ id: "123", username: "test", passwordHash: "hash" });

// Update
await db.update(user).set({ username: "new" }).where(eq(user.id, userId));

// Delete
await db.delete(user).where(eq(user.id, userId));
```

### Error Handling

- **Always use try-catch** for async operations
- **Return `fail()`** from form actions with appropriate HTTP status codes
- **Log errors server-side** before returning to client
- **Never expose sensitive details** to the client (stack traces, DB errors)

```typescript
export const actions: Actions = {
  submit: async (event) => {
    try {
      const result = await riskyOperation();
      return { success: true, result };
    } catch (error) {
      console.error("Operation failed:", error);
      return fail(500, { message: "Internal server error" });
    }
  },
};
```

### Security Best Practices

- **Never hardcode secrets** - use environment variables from `$env/dynamic/private`
- **Validate all user input** server-side in `+page.server.ts`
- **Use parameterized queries** - Drizzle handles this automatically
- **Session tokens**: Use SHA-256 hashing (see `$lib/server/auth.ts`)
- **Password hashing**: Use Argon2 via `@node-rs/argon2`
- **CSRF protection**: SvelteKit provides this by default for form actions

### Testing Guidelines

**Unit tests (`*.spec.ts`):**

- Place next to the source file being tested
- Use Vitest's `describe`, `it`, `expect` pattern
- Keep tests focused and isolated
- Mock external dependencies

```typescript
import { describe, it, expect } from "vitest";
import { validateUsername } from "./auth";

describe("validateUsername", () => {
  it("should accept valid usernames", () => {
    expect(validateUsername("user123")).toBe(true);
  });

  it("should reject usernames with spaces", () => {
    expect(validateUsername("user 123")).toBe(false);
  });
});
```

**E2E tests (`e2e/*.test.ts`):**

- Use Playwright's `test` and `expect`
- Test complete user flows
- Use `page.goto()`, `page.locator()`, `page.click()`, etc.

```typescript
import { expect, test } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="username"]', "testuser");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await expect(page.locator("h1")).toContainText("Dashboard");
});
```

### Comments and Documentation

- **Prefer self-documenting code** over excessive comments
- **Document "why"** not "what" - the code shows what it does
- **Use JSDoc** for public API functions when helpful
- **Avoid catch-all utility files** - the codebase has a note: "Please, never have a helpers file"

```typescript
// Bad
// This function adds two numbers
function add(a: number, b: number) {
  return a + b;
}

// Good (no comment needed - self-documenting)
function calculateTotalPrice(basePrice: number, tax: number): number {
  return basePrice + tax;
}

// Good (explains business logic "why")
// Session tokens are valid for 30 days per security policy
const SESSION_EXPIRY_MS = DAY_IN_MS * 30;
```

## Project-Specific Notes

- **Authentication**: Custom session-based auth in `$lib/server/auth.ts` using Oslo crypto
- **I18n**: Paraglide configured in `vite.config.ts` for multi-language support
- **Regions**: Multi-region support (all, central, east, california, north-west)
- **Media storage**: AWS S3 integration for file uploads
- **Database**: PostgreSQL with JSON/JSONB support for flexible content
- **Event tables**: Separate event tables per ministry (youth, children, bible-school, etc.)
- **Admin panel**: Laravel Nova in `admin/` directory (minimal changes expected)

## Git Workflow

**Before committing:**

1. Run `npm run format` to format code
2. Run `npm run lint` to check for issues
3. Run `npm run check` to type-check TypeScript
4. Run `npm run test:unit -- --run` to ensure tests pass

**Commit message style:**

- Use clear, concise messages
- Start with verb: "add", "fix", "update", "refactor", "remove"
- Reference issue numbers when applicable
