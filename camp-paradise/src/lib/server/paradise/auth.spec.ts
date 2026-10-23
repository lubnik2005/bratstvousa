import { beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { issueLoginCode, verifyLoginCode, hashPassword, verifyPassword } from './auth';
import { sendLoginCode } from '$lib/server/email/paradise';
import type { AppDatabase } from '$lib/server/db';

vi.mock('$lib/server/email/paradise', () => ({ sendLoginCode: vi.fn(async () => undefined) }));

function database() {
	const sqlite = new Database(':memory:');
	sqlite.exec(`CREATE TABLE paradise_login_codes (
    id integer primary key autoincrement, email text not null, code_hash text not null,
    expires_at text not null, consumed_at text, attempts integer not null default 0,
    created_at text not null default (datetime('now'))
  )`);
	return { sqlite, db: drizzle(sqlite) as unknown as AppDatabase };
}

beforeEach(() => vi.clearAllMocks());

describe('one-time login codes', () => {
	it('atomically claims codes and counts concurrent wrong attempts', async () => {
		const { db, sqlite } = database();
		try {
			const issued = await Promise.all(
				Array.from({ length: 5 }, () => issueLoginCode(db, 'parallel@example.com'))
			);
			expect(issued.filter((result) => result.ok)).toHaveLength(1);
			expect(sendLoginCode).toHaveBeenCalledTimes(1);
			const code = vi.mocked(sendLoginCode).mock.calls[0][2];
			const results = await Promise.all([
				verifyLoginCode(db, 'parallel@example.com', code),
				verifyLoginCode(db, 'parallel@example.com', code)
			]);
			expect(results.filter((result) => result.ok)).toHaveLength(1);
			await issueLoginCode(db, 'attempts@example.com');
			await Promise.all(
				Array.from({ length: 10 }, () => verifyLoginCode(db, 'attempts@example.com', '000000'))
			);
			const row = sqlite
				.prepare("select attempts from paradise_login_codes where email='attempts@example.com'")
				.get() as { attempts: number };
			expect(row.attempts).toBe(5);
		} finally {
			sqlite.close();
		}
	});
	it('stores a hash, normalizes email, rate limits, and permits a single redemption', async () => {
		const { db, sqlite } = database();
		try {
			expect(await issueLoginCode(db, ' Camper@Example.com ')).toEqual({ ok: true });
			const code = vi.mocked(sendLoginCode).mock.calls[0][2];
			expect(code).toMatch(/^[2-9]{6}$/);
			const row = sqlite.prepare('select * from paradise_login_codes').get() as {
				email: string;
				code_hash: string;
			};
			expect(row.email).toBe('camper@example.com');
			expect(row.code_hash).not.toBe(code);
			expect(await issueLoginCode(db, 'camper@example.com')).toEqual({
				ok: false,
				reason: 'rate_limited'
			});
			expect(sendLoginCode).toHaveBeenCalledTimes(1);
			expect(await verifyLoginCode(db, row.email, code)).toEqual({ ok: true });
			expect(await verifyLoginCode(db, row.email, code)).toEqual({ ok: false, reason: 'invalid' });
		} finally {
			sqlite.close();
		}
	});

	it('rejects expired codes and locks the code after five wrong attempts', async () => {
		const { db, sqlite } = database();
		try {
			await issueLoginCode(db, 'expired@example.com');
			const expired = vi.mocked(sendLoginCode).mock.calls[0][2];
			sqlite.exec("update paradise_login_codes set expires_at='2000-01-01 00:00:00'");
			expect(await verifyLoginCode(db, 'expired@example.com', expired)).toEqual({
				ok: false,
				reason: 'expired'
			});
			await issueLoginCode(db, 'locked@example.com');
			const correct = vi.mocked(sendLoginCode).mock.calls[1][2];
			for (let i = 0; i < 5; i++)
				expect(await verifyLoginCode(db, 'locked@example.com', '000000')).toEqual({
					ok: false,
					reason: 'invalid'
				});
			expect(await verifyLoginCode(db, 'locked@example.com', correct)).toEqual({
				ok: false,
				reason: 'too_many_attempts'
			});
		} finally {
			sqlite.close();
		}
	});
});

it('verifies passwords without accepting an incorrect password or missing hash', async () => {
	const hash = await hashPassword('test-only-example-password');
	expect(await verifyPassword('test-only-example-password', hash)).toBe(true);
	expect(await verifyPassword('incorrect', hash)).toBe(false);
	expect(await verifyPassword('anything', null)).toBe(false);
});
