import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

export type AppDatabase = DrizzleD1Database;

export function createDb(d1: D1Database): AppDatabase {
	return drizzle(d1);
}
