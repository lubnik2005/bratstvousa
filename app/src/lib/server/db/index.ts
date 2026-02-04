import { env } from '$env/dynamic/private';
import { createMockDb } from './mock-db';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { MockDb } from './mock-db';

// Check if we should use mock database
const useMockDb = env.USE_MOCK_DB === 'true' || !env.DATABASE_URL;

export const isMockDb = useMockDb;

let db: PostgresJsDatabase | MockDb;

if (useMockDb) {
	// Use mock database for development without PostgreSQL
	console.log('🔶 Using mock database (set USE_MOCK_DB=false and DATABASE_URL to use real DB)');
	db = createMockDb();
} else {
	// Use real PostgreSQL database
	const { drizzle } = await import('drizzle-orm/postgres-js');
	const postgres = (await import('postgres')).default;
	const { secret } = await import('@aws-amplify/backend');

	const database_url =
		env.DATABASE_URL ?? (secret('DATABASE_URL') as unknown as string | undefined);

	if (!database_url) {
		throw new Error('DATABASE_URL is not set and USE_MOCK_DB is not enabled');
	}

	const client = postgres(database_url);
	db = drizzle(client);
	console.log('✅ Connected to PostgreSQL database');
}

export { db };
