# Mock Database System

## Overview

The mock database system allows you to run the application **without PostgreSQL** installed. This is useful for:

- Quick development without Docker/PostgreSQL setup
- Testing UI changes without database dependencies
- Onboarding new developers faster
- Running the app in environments where DB isn't available

## How to Use

### Enable Mock Database

**Option 1: Set environment variable (Recommended)**

```bash
# In your .env file
USE_MOCK_DB="true"
```

**Option 2: Remove DATABASE_URL**
If `DATABASE_URL` is not set, mock mode is automatically enabled.

### Disable Mock Database (Use Real PostgreSQL)

```bash
# In your .env file
USE_MOCK_DB="false"
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
```

## What Gets Mocked

The mock system provides sample data for all database tables:

### User & Auth Data

- Mock users with sessions
- Test user: `testuser`

### Settings

- `donation_url`
- `donation_tokenuid`

### Content Data

- **Churches** (2 sample churches: Sacramento, Seattle)
- **Events** for all ministries:
  - Youth events (2 items)
  - Children's events (1 item)
  - Bible education events (1 item)
  - Gospel events (1 item)
  - Music events (1 item)
  - Family events (1 item)
  - General events (1 item)
- **News Articles** (3 items)
- **Files** (1 item)

### Empty Tables

- Form submissions (starts empty, can be added)
- Media files (starts empty)

## Customizing Mock Data

To add or modify mock data:

1. Edit `src/lib/server/db/mock-data.ts`
2. Add/modify data in the exported arrays
3. Restart dev server

Example:

```typescript
export const mockYouthEvents = [
	{
		id: 3,
		title: 'Your New Event',
		slug: 'your-new-event',
		// ... other fields
		startAt: '2025-08-01',
		endAt: '2025-08-05'
	}
	// ... existing events
];
```

## How It Works

### Architecture

1. **Detection** (`src/lib/server/db/index.ts`):
   - Checks `USE_MOCK_DB` env variable
   - Falls back to mock if `DATABASE_URL` is missing
   - Exports `isMockDb` flag for conditional logic

2. **Mock Implementation** (`src/lib/server/db/mock-db.ts`):
   - `MockDrizzle` class mimics Drizzle ORM API
   - `MockQueryBuilder` handles `.select().from().where()` patterns
   - `MockInsertBuilder`, `MockUpdateBuilder`, `MockDeleteBuilder` handle mutations

3. **Query Adaptations** (`src/lib/server/db/queries.ts`):
   - Complex queries (unionAll, etc.) have simplified mock versions
   - `eventsSchema()` and `newsArticlesSchema()` detect mock mode
   - Simplified filtering and sorting for mock data

### Supported Operations

✅ **Fully Supported:**

- `db.select().from(table)`
- `db.select().from(table).where(condition)`
- `db.select().from(table).orderBy(field)`
- `db.select().from(table).limit(n)`
- `db.insert(table).values(data)`
- `db.update(table).set(data).where(condition)`
- `db.delete(table).where(condition)`

⚠️ **Partially Supported:**

- Complex joins (returns original table data)
- Raw SQL queries (simplified in queries.ts)
- Transactions (no-op, executes immediately)

❌ **Not Supported:**

- Database migrations
- Complex SQL expressions
- Triggers and stored procedures

## Limitations

1. **Data Persistence**: Mock data resets on server restart
2. **Complex Queries**: unionAll queries have simplified implementations
3. **Relationships**: Foreign key constraints not enforced
4. **Performance**: Not representative of real database performance

## Console Output

When mock database is active, you'll see:

```
🔶 Using mock database (set USE_MOCK_DB=false and DATABASE_URL to use real DB)
```

When real database is active:

```
✅ Connected to PostgreSQL database
```

## Troubleshooting

### "DATABASE_URL is not set" Error

- Make sure `USE_MOCK_DB="true"` is in your `.env` file
- OR remove/comment out `DATABASE_URL` to auto-enable mock mode

### Page Shows No Data

- Check mock data has future dates for events
- Verify mock data is properly exported in `mock-data.ts`
- Check browser console for JavaScript errors

### TypeScript Errors

- Pre-existing TypeScript errors in `queries.ts` are documented in ISSUES.md
- They don't prevent the app from running in development mode

## Switching Between Mock and Real DB

You can toggle between mock and real database by changing one line:

```bash
# .env file

# Use mock (no PostgreSQL needed)
USE_MOCK_DB="true"

# Use real database
USE_MOCK_DB="false"
DATABASE_URL="postgres://user:pass@localhost:5432/db"
```

Restart the dev server after changing.

## Future Improvements

Potential enhancements to the mock system:

- [ ] Persistent mock data (save to JSON file)
- [ ] Mock data seeder/generator
- [ ] Better join support
- [ ] Transaction simulation
- [ ] Mock data faker integration
- [ ] Visual mock data editor

## Related Files

- `src/lib/server/db/index.ts` - Database initialization & mock detection
- `src/lib/server/db/mock-db.ts` - Mock database implementation
- `src/lib/server/db/mock-data.ts` - Sample data
- `src/lib/server/db/queries.ts` - Query functions with mock support
- `.env` - Configuration (USE_MOCK_DB flag)
- `.env.example` - Example configuration with all variables

## Questions?

See ISSUES.md for known issues and AGENTS.md for development guidelines.
