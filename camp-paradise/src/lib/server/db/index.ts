import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';

export type AppDatabase = DrizzleD1Database;

export function createDb(d1: D1Database): AppDatabase {
	return drizzle(d1);
}
