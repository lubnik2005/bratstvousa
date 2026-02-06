# AGENTS.md - Development Guidelines for bratstvousa

Guidelines for AI coding agents working in this SvelteKit + TypeScript monorepo.

## Project Structure

- `app/` - SvelteKit 2.x application (main development)
- `admin/` - Laravel Nova admin panel (legacy, minimal changes)
- `nginx/` - Nginx configuration

**Tech Stack:** Svelte 5, TypeScript, TailwindCSS, Bootstrap 5 (Sveltestrap), Drizzle ORM, PostgreSQL, Vitest, Playwright

## Commands (run from `app/` directory)

### Development

```bash
npm run dev           # Start dev server (port 5173)
npm run check         # Type-check TypeScript
```

### Testing

```bash
npm run test:unit           # Vitest watch mode
npm run test:unit -- --run  # Vitest single run (CI)
npm run test:e2e            # Playwright e2e tests

# Single test file
npx vitest src/lib/auth.spec.ts --run    # Unit test (no watch)
npx playwright test e2e/demo.test.ts     # E2E test
npx playwright test --grep "login"       # Filter by name
```

### Build & Quality

```bash
npm run build         # Production build
npm run lint          # Prettier + ESLint check
npm run format        # Format with Prettier
```

### Database

```bash
npm run db:start      # Start PostgreSQL (Docker)
npm run db:push       # Push schema changes
npm run db:studio     # Open Drizzle Studio
```

## Code Style

### Formatting (.prettierrc)

- **Tabs** for indentation (not spaces)
- **Single quotes** (`'example'`)
- **No trailing commas**
- **100 char** line width
- Run `npm run format` before commits

### TypeScript

- **Strict mode** enabled
- **No `any`** - use `unknown` or proper types
- **Type imports**: Use `import type` for type-only imports

```typescript
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
```

### Import Order

1. SvelteKit core (`@sveltejs/kit`)
2. Third-party libraries
3. Local `$lib/*` imports
4. Relative imports (`./`, `../`)
5. Type-only imports (at end)

```typescript
import { redirect, fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";
```

### Naming Conventions

| Category            | Convention      | Example             |
| ------------------- | --------------- | ------------------- |
| Files               | kebab-case      | `event-list.svelte` |
| Components          | PascalCase      | `MainNav.svelte`    |
| Variables/Functions | camelCase       | `validateSession`   |
| Constants           | SCREAMING_SNAKE | `DAY_IN_MS`         |
| Types               | PascalCase      | `Session`, `User`   |
| DB tables/columns   | snake_case      | `youth_events`      |

## SvelteKit Patterns

### Route Structure

```typescript
import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return redirect(302, "/login");
  return { user: event.locals.user };
};

export const actions: Actions = {
  submit: async (event) => {
    const formData = await event.request.formData();
    const title = formData.get("title");
    if (!title || typeof title !== "string") {
      return fail(400, { message: "Title is required" });
    }
    return { success: true };
  },
};
```

### Error Handling

- Use `try-catch` for async operations
- Return `fail(statusCode, data)` for form errors
- Log errors server-side, never expose stack traces to client

```typescript
try {
  await riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
  return fail(500, { message: "Internal server error" });
}
```

### Svelte Components

```svelte
<script lang="ts">
  export let title = 'Default';
  export let items: Array<{ id: number; name: string }> = [];
</script>

{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

**Svelte 5 runes** (for new components): `$props()`, `$state()`, `$derived()`, `$effect()`

## Database (Drizzle ORM)

Schema in `src/lib/server/db/schema.ts`:

```typescript
import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export type User = typeof user.$inferSelect;
```

Queries:

```typescript
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";

const users = await db.select().from(user).where(eq(user.id, id));
await db.insert(user).values({ id, username, passwordHash });
```

## Testing

**Unit tests** (`*.spec.ts` next to source):

```typescript
import { describe, it, expect } from "vitest";

describe("feature", () => {
  it("should work", () => {
    expect(result).toBe(expected);
  });
});
```

**E2E tests** (`e2e/*.test.ts`):

```typescript
import { expect, test } from "@playwright/test";

test("user flow", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="username"]', "user");
  await expect(page.locator("h1")).toBeVisible();
});
```

## Security

- Never hardcode secrets - use `$env/dynamic/private`
- Validate all input server-side
- Session tokens use SHA-256 (`$lib/server/auth.ts`)
- Passwords use Argon2 (`@node-rs/argon2`)

## Project Notes

- **Auth**: Custom session-based in `$lib/server/auth.ts`
- **I18n**: Paraglide SvelteKit
- **Media**: AWS S3 (`@aws-sdk/client-s3`)
- **Regions**: all, central, east, california, north-west
- **Avoid**: catch-all utility files (see `src/lib/helpers.ts` warning)

## Git Workflow

Before committing:

```bash
npm run format && npm run lint && npm run check && npm run test:unit -- --run
```
