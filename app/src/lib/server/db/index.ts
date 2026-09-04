import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';

export type AppDatabase = DrizzleD1Database;

/**
 * Create a Drizzle database instance from a Cloudflare D1 binding.
 * Called in hooks.server.ts with the platform binding.
 */
export function createDb(d1: D1Database): AppDatabase {
	return drizzle(d1);
}
