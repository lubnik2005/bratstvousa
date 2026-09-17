import { describe, it, expect, beforeEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import {
	extractCampCode,
	extractZeffyIdentifiers,
	verifySignature,
	applyPayment,
	type ZeffyPaymentPayload
} from './zeffy';
import { buildZeffyUrl } from './email/camp';
import {
	campRegistrations,
	zeffyPayments,
	registrationEvents,
	cashEligibilityRules
} from './db/schema';
import type { AppDatabase } from './db';
import { createHmac } from 'node:crypto';

// The camp email module hits the real sendEmail (which writes to email_log and
// calls Resend). Stub it so applyPayment's unmatched-path email is a no-op.
vi.mock('$lib/email', () => ({
	sendEmail: vi.fn(async () => ({ ok: true }))
}));

/**
 * Builds a real in-memory SQLite database with just the tables applyPayment
 * touches, using the same column shapes as the Drizzle schema / D1 migrations.
 * drizzle's better-sqlite3 driver is API-compatible with the D1 driver for the
 * query builder we use, so we cast to AppDatabase for the tests.
 */
function makeDb(): AppDatabase {
	const sqlite = new Database(':memory:');
	sqlite.exec(`
		CREATE TABLE camp_registrations (
			id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
			event_slug text NOT NULL,
			first_name text NOT NULL,
			last_name text NOT NULL,
			church text,
			church_id integer,
			email text,
			phone text,
			leader_id integer,
			status text DEFAULT 'pending_payment' NOT NULL,
			payment_status text DEFAULT 'unpaid' NOT NULL,
			cash_eligible integer DEFAULT false NOT NULL,
			fee_waived integer DEFAULT false NOT NULL,
			payment_method text,
			amount integer,
			event_price_cents integer,
			amount_due_cents integer,
			amount_paid_cents integer DEFAULT 0 NOT NULL,
			stripe_session_id text,
			confirmation_code text,
			approval_token text,
			approved_by text,
			approved_at text,
			zeffy_payment_id text,
			zeffy_ticket_id text,
			zeffy_contact_id text,
			zeffy_campaign_id text,
			zeffy_discount_code text,
			paid_at text,
			paid_by text,
			checkin_status text DEFAULT 'NOT_CHECKED_IN' NOT NULL,
			checked_in_at text,
			checked_in_by text,
			created_at text DEFAULT (datetime('now')) NOT NULL,
			updated_at text DEFAULT (datetime('now')) NOT NULL
		);
		CREATE TABLE zeffy_payments (
			id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
			zeffy_payment_id text NOT NULL,
			status text, amount integer, currency text,
			buyer_email text, buyer_first_name text, buyer_last_name text,
			confirmation_code text, matched_registration_id integer,
			match_status text DEFAULT 'unmatched' NOT NULL, raw_json text,
			created_at text DEFAULT (datetime('now')) NOT NULL,
			updated_at text DEFAULT (datetime('now')) NOT NULL
		);
		CREATE UNIQUE INDEX zeffy_payments_zeffy_payment_id_unique ON zeffy_payments (zeffy_payment_id);
		CREATE TABLE registration_events (
			id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
			registration_id integer NOT NULL,
			event text NOT NULL,
			amount_cents integer,
			staff_user text,
			payload text,
			created_at text DEFAULT (datetime('now')) NOT NULL
		);
		CREATE TABLE cash_eligibility_rules (
			id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
			scope_type text DEFAULT 'church' NOT NULL,
			church_id integer,
			event_slug text,
			amount_cents integer NOT NULL,
			discount_code text,
			zeffy_campaign_id text,
			active integer DEFAULT true NOT NULL,
			created_at text DEFAULT (datetime('now')) NOT NULL,
			updated_at text DEFAULT (datetime('now')) NOT NULL
		);
	`);
	return drizzle(sqlite) as unknown as AppDatabase;
}

/** Inserts a cash eligibility rule and returns its id. */
async function seedRule(
	db: AppDatabase,
	over: Partial<typeof cashEligibilityRules.$inferInsert> = {}
): Promise<number> {
	const rows = await db
		.insert(cashEligibilityRules)
		.values({
			scopeType: 'church',
			churchId: 12,
			eventSlug: 'osennii-molodeznyi-lager-szr-2026',
			amountCents: 17500,
			discountCode: 'PNW-CASH-2026',
			active: true,
			...over
		})
		.returning({ id: cashEligibilityRules.id });
	return rows[0].id;
}

/** Inserts a registration and returns its id. */
async function seedReg(
	db: AppDatabase,
	over: Partial<typeof campRegistrations.$inferInsert> = {}
): Promise<number> {
	const rows = await db
		.insert(campRegistrations)
		.values({
			eventSlug: 'osennii-molodeznyi-lager-szr-2026',
			firstName: 'John',
			lastName: 'Smith',
			email: 'john@example.com',
			confirmationCode: 'CAMP-ABC12',
			paymentStatus: 'PENDING',
			eventPriceCents: 17500,
			amountDueCents: 17500,
			amountPaidCents: 0,
			cashEligible: false,
			...over
		})
		.returning({ id: campRegistrations.id });
	return rows[0].id;
}

describe('extractCampCode', () => {
	it('finds a code in buyer_questions (case-insensitive, uppercased)', () => {
		const p: ZeffyPaymentPayload = {
			id: 'p1',
			buyer_questions: [{ question: 'Registration Code', answer: 'camp-abc12' }]
		};
		expect(extractCampCode(p)).toBe('CAMP-ABC12');
	});

	it('finds a code inside item questions when buyer_questions has none', () => {
		const p: ZeffyPaymentPayload = {
			id: 'p1',
			buyer_questions: [{ question: 'Name', answer: 'John' }],
			items: [{ questions: [{ answer: 'my code is CAMP-XYZ99 thanks' }] }]
		};
		expect(extractCampCode(p)).toBe('CAMP-XYZ99');
	});

	it('scans array answers', () => {
		const p: ZeffyPaymentPayload = {
			id: 'p1',
			buyer_questions: [{ answer: ['no', 'CAMP-9ABCD'] }]
		};
		expect(extractCampCode(p)).toBe('CAMP-9ABCD');
	});

	it('returns null when no code present', () => {
		expect(extractCampCode({ id: 'p1', buyer_questions: [{ answer: 'nope' }] })).toBeNull();
	});
});

describe('extractZeffyIdentifiers', () => {
	it('prefers ticket_id, then item id; reads contact/campaign/discount', () => {
		const ids = extractZeffyIdentifiers({
			id: 'p1',
			contact_id: 'c1',
			campaign_id: 'camp1',
			discount_code: 'PNW-CASH-2026',
			items: [{ ticket_id: 't1', id: 'i1' }]
		});
		expect(ids).toEqual({
			ticketId: 't1',
			contactId: 'c1',
			campaignId: 'camp1',
			discountCode: 'PNW-CASH-2026',
			faceValueCents: null
		});
	});

	it('falls back to item.id and buyer.id, alternate discount spellings', () => {
		const ids = extractZeffyIdentifiers({
			id: 'p1',
			buyer: { id: 'b1' },
			promo_code: 'PROMO',
			items: [{ id: 'i1' }]
		});
		expect(ids.ticketId).toBe('i1');
		expect(ids.contactId).toBe('b1');
		expect(ids.discountCode).toBe('PROMO');
		expect(ids.campaignId).toBeNull();
	});

	it('reads the real Zeffy payload shape (discount.code, top-level contact, item face value)', () => {
		// Shape observed on a real $0 test checkout (ticket face value $350).
		const ids = extractZeffyIdentifiers({
			id: '6504f03d-78e5-4f26-9568-ee514cd5d790',
			object: 'payment',
			amount: 0,
			currency: 'usd',
			status: 'succeeded',
			contact: 'd241175e-0000-0000-0000-000000000001',
			campaign_id: '7351fd37-0000-0000-0000-000000000002',
			campaign_type: 'ticketing',
			description: 'PNW Youth Camp 2026',
			discount: { code: 'TESTINGNIK', amount: 35000 },
			payment_method: { type: 'free', brand: null, last4: null },
			buyer: { email: 'lubnik2005@gmail.com', first_name: 'Nikita', last_name: 'Lubyanoy' },
			buyer_questions: [
				{ question: 'Регистрационный Код (CAMP-XXXXX)', type: 'text', answer: 'CAMP-R9UEG' }
			],
			items: [
				{
					id: '61319e30-0000-0000-0000-000000000003',
					type: 'ticket',
					amount: 35000,
					currency: 'usd',
					rate_id: '3f89159b-0000-0000-0000-000000000004',
					rate_title: 'General Admission',
					contact_id: 'd241175e-0000-0000-0000-000000000001',
					questions: []
				}
			]
		});
		expect(ids).toEqual({
			ticketId: '61319e30-0000-0000-0000-000000000003',
			contactId: 'd241175e-0000-0000-0000-000000000001',
			campaignId: '7351fd37-0000-0000-0000-000000000002',
			discountCode: 'TESTINGNIK',
			faceValueCents: 35000
		});
	});
});

describe('verifySignature', () => {
	const secret = 'whsec_test';
	function sign(body: string, t: number): string {
		const v1 = createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');
		return `t=${t},v1=${v1}`;
	}

	it('accepts a valid, fresh signature', () => {
		const body = '{"id":"p1"}';
		const t = Math.floor(Date.now() / 1000);
		expect(verifySignature(body, sign(body, t), secret)).toBe(true);
	});

	it('rejects a stale timestamp (replay guard)', () => {
		const body = '{"id":"p1"}';
		const t = Math.floor(Date.now() / 1000) - 10 * 60;
		expect(verifySignature(body, sign(body, t), secret)).toBe(false);
	});

	it('rejects a tampered body', () => {
		const t = Math.floor(Date.now() / 1000);
		const header = sign('{"id":"p1"}', t);
		expect(verifySignature('{"id":"HACKED"}', header, secret)).toBe(false);
	});

	it('rejects missing header / secret', () => {
		expect(verifySignature('x', null, secret)).toBe(false);
		expect(verifySignature('x', 't=1,v1=aa', '')).toBe(false);
	});
});

describe('buildZeffyUrl', () => {
	it('appends the registration code as query params', () => {
		const out = buildZeffyUrl('https://www.zeffy.com/ticketing/abc', 'CAMP-ABC12');
		const u = new URL(out);
		expect(u.searchParams.get('registrationCode')).toBe('CAMP-ABC12');
		expect(u.searchParams.get('code')).toBe('CAMP-ABC12');
	});

	it('passes through placeholder / invalid base URLs untouched', () => {
		expect(buildZeffyUrl('#', 'CAMP-ABC12')).toBe('#');
		expect(buildZeffyUrl('', 'CAMP-ABC12')).toBe('#');
		expect(buildZeffyUrl('not a url', 'CAMP-ABC12')).toBe('not a url');
	});
});

describe('applyPayment decision logic (spec §11)', () => {
	let db: AppDatabase;
	beforeEach(() => {
		db = makeDb();
	});

	async function getReg(id: number) {
		return (
			await db.select().from(campRegistrations).where(eq(campRegistrations.id, id)).limit(1)
		)[0];
	}
	async function getEvents(id: number) {
		return db.select().from(registrationEvents).where(eq(registrationEvents.registrationId, id));
	}

	it('online paid checkout -> ONLINE / PAID, due=0', async () => {
		const id = await seedReg(db);
		await applyPayment(db, {
			id: 'zp-online',
			status: 'succeeded',
			amount: 17500,
			currency: 'USD',
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		});
		const reg = await getReg(id);
		expect(reg.paymentMethod).toBe('ONLINE');
		expect(reg.paymentStatus).toBe('PAID');
		expect(reg.amountPaidCents).toBe(17500);
		expect(reg.amountDueCents).toBe(0);
		expect(reg.zeffyPaymentId).toBe('zp-online');
		const evs = await getEvents(id);
		expect(evs.map((e) => e.event)).toContain('online_payment');
	});

	it('authorized $0 cash checkout -> CASH / DUE, due=event price', async () => {
		const id = await seedReg(db, { cashEligible: true });
		await applyPayment(db, {
			id: 'zp-cash',
			status: 'succeeded',
			amount: 0,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		});
		const reg = await getReg(id);
		expect(reg.paymentMethod).toBe('CASH');
		expect(reg.paymentStatus).toBe('DUE');
		expect(reg.amountPaidCents).toBe(0);
		expect(reg.amountDueCents).toBe(17500);
		const evs = await getEvents(id);
		expect(evs.map((e) => e.event)).toContain('cash_due');
	});

	it('unauthorized $0 checkout -> REVIEW_REQUIRED, not paid', async () => {
		const id = await seedReg(db, { cashEligible: false });
		await applyPayment(db, {
			id: 'zp-review',
			status: 'succeeded',
			amount: 0,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		});
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('REVIEW_REQUIRED');
		expect(reg.paymentMethod).toBeNull();
		expect(reg.amountDueCents).toBe(17500);
		const evs = await getEvents(id);
		expect(evs.map((e) => e.event)).toContain('unauthorized_zero_dollar');
	});

	it('is idempotent: replaying the same webhook makes one state change + one audit', async () => {
		const id = await seedReg(db, { cashEligible: true });
		const payload: ZeffyPaymentPayload = {
			id: 'zp-idem',
			status: 'succeeded',
			amount: 0,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		};
		await applyPayment(db, payload);
		await applyPayment(db, payload);
		await applyPayment(db, payload);
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('DUE');
		const evs = await getEvents(id);
		expect(evs.filter((e) => e.event === 'cash_due')).toHaveLength(1);
		const zps = await db
			.select()
			.from(zeffyPayments)
			.where(eq(zeffyPayments.zeffyPaymentId, 'zp-idem'));
		expect(zps).toHaveLength(1);
	});

	it('registration-code abuse: a different payment for a linked code is flagged, not applied', async () => {
		const id = await seedReg(db, { cashEligible: true });
		await applyPayment(db, {
			id: 'zp-first',
			status: 'succeeded',
			amount: 17500,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		});
		// Second, different payment claims the same code.
		await applyPayment(db, {
			id: 'zp-second',
			status: 'succeeded',
			amount: 0,
			buyer: { email: 'thief@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		});
		const reg = await getReg(id);
		// Still linked to the first payment; state unchanged.
		expect(reg.zeffyPaymentId).toBe('zp-first');
		expect(reg.paymentStatus).toBe('PAID');
		const dup = await db
			.select()
			.from(zeffyPayments)
			.where(eq(zeffyPayments.zeffyPaymentId, 'zp-second'));
		expect(dup[0].matchStatus).toBe('duplicate');
		const evs = await getEvents(id);
		expect(evs.map((e) => e.event)).toContain('duplicate_registration_code');
	});

	it('unmatched payment is recorded as unmatched (no registration touched)', async () => {
		await applyPayment(db, {
			id: 'zp-unmatched',
			status: 'succeeded',
			amount: 17500,
			buyer: { email: 'nobody@example.com' },
			buyer_questions: [{ answer: 'CAMP-NOPE0' }]
		});
		const zp = await db
			.select()
			.from(zeffyPayments)
			.where(eq(zeffyPayments.zeffyPaymentId, 'zp-unmatched'));
		expect(zp[0].matchStatus).toBe('unmatched');
	});

	it('refund reverts a matched registration to REFUNDED', async () => {
		const id = await seedReg(db);
		await applyPayment(db, {
			id: 'zp-refund',
			status: 'succeeded',
			amount: 17500,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		});
		await applyPayment(db, {
			id: 'zp-refund',
			status: 'refunded',
			refund_status: 'full',
			amount: 17500,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }]
		});
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('REFUNDED');
		expect(reg.amountPaidCents).toBe(0);
		const zp = await db
			.select()
			.from(zeffyPayments)
			.where(eq(zeffyPayments.zeffyPaymentId, 'zp-refund'));
		expect(zp[0].matchStatus).toBe('refunded');
	});

	it('matches by email when no code is present', async () => {
		const id = await seedReg(db, { confirmationCode: 'CAMP-EMAIL', cashEligible: true });
		await applyPayment(db, {
			id: 'zp-byemail',
			status: 'succeeded',
			amount: 0,
			buyer: { email: 'JOHN@example.com' }
		});
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('DUE');
		expect(reg.zeffyPaymentId).toBe('zp-byemail');
	});
});

describe('applyPayment discount-code validation (cash_eligibility_rules)', () => {
	let db: AppDatabase;
	beforeEach(() => {
		db = makeDb();
	});

	async function getReg(id: number) {
		return (
			await db.select().from(campRegistrations).where(eq(campRegistrations.id, id)).limit(1)
		)[0];
	}
	async function getEvents(id: number) {
		return db.select().from(registrationEvents).where(eq(registrationEvents.registrationId, id));
	}
	type Payload = Record<string, unknown> | null;

	function zeroCheckout(id: string, discountCode: string | null): ZeffyPaymentPayload {
		return {
			id,
			status: 'succeeded',
			amount: 0,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }],
			discount: discountCode ? { code: discountCode, amount: 17500 } : undefined,
			items: [{ id: 'item-1', amount: 17500 }]
		};
	}

	it('eligible + matching code -> DUE, codeMatch true, no mismatch event', async () => {
		const ruleId = await seedRule(db, { churchId: 12, discountCode: 'PNW-CASH-2026' });
		const id = await seedReg(db, { cashEligible: true, churchId: 12 });
		await applyPayment(db, zeroCheckout('zp-match', 'pnw-cash-2026'));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('DUE');
		expect(reg.paymentMethod).toBe('CASH');
		expect(reg.zeffyDiscountCode).toBe('pnw-cash-2026');
		const evs = await getEvents(id);
		expect(evs.map((e) => e.event)).not.toContain('discount_code_mismatch');
		const cashDue = evs.find((e) => e.event === 'cash_due');
		const payload = cashDue?.payload as Payload;
		expect(payload?.codeMatch).toBe(true);
		expect(payload?.ruleId).toBe(ruleId);
		expect(payload?.faceValueCents).toBe(17500);
	});

	it('eligible + wrong/missing code -> still DUE, plus discount_code_mismatch audit', async () => {
		await seedRule(db, { churchId: 12, discountCode: 'PNW-CASH-2026' });
		const id = await seedReg(db, { cashEligible: true, churchId: 12 });
		await applyPayment(db, zeroCheckout('zp-mismatch', 'SOMETHING-ELSE'));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('DUE');
		expect(reg.paymentMethod).toBe('CASH');
		expect(reg.amountDueCents).toBe(17500);
		const evs = await getEvents(id);
		const names = evs.map((e) => e.event);
		expect(names).toContain('cash_due');
		expect(names).toContain('discount_code_mismatch');
		const mismatch = evs.find((e) => e.event === 'discount_code_mismatch');
		const payload = mismatch?.payload as Payload;
		expect(payload?.codeMatch).toBe(false);
		expect(payload?.expectedCode).toBe('PNW-CASH-2026');
	});

	it('not eligible + leaked code from another church -> REVIEW_REQUIRED with leak provenance', async () => {
		const ruleId = await seedRule(db, { churchId: 12, discountCode: 'PNW-CASH-2026' });
		// Church 99 has no rule; registrant is not cash-eligible.
		const id = await seedReg(db, { cashEligible: false, churchId: 99 });
		await applyPayment(db, zeroCheckout('zp-leak', 'PNW-CASH-2026'));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('REVIEW_REQUIRED');
		expect(reg.paymentMethod).toBeNull();
		expect(reg.amountDueCents).toBe(17500);
		const evs = await getEvents(id);
		const ev = evs.find((e) => e.event === 'unauthorized_zero_dollar');
		expect(ev).toBeDefined();
		const payload = ev?.payload as Payload;
		expect(payload?.leakedFromRuleId).toBe(ruleId);
		expect(payload?.leakedFromChurchId).toBe(12);
		expect(payload?.discountCode).toBe('PNW-CASH-2026');
	});

	it('not eligible + no discount -> REVIEW_REQUIRED with null code/provenance', async () => {
		await seedRule(db, { churchId: 12, discountCode: 'PNW-CASH-2026' });
		const id = await seedReg(db, { cashEligible: false, churchId: 99 });
		await applyPayment(db, zeroCheckout('zp-nocode', null));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('REVIEW_REQUIRED');
		const evs = await getEvents(id);
		const ev = evs.find((e) => e.event === 'unauthorized_zero_dollar');
		const payload = ev?.payload as Payload;
		expect(payload?.discountCode).toBeNull();
		expect(payload?.leakedFromRuleId ?? null).toBeNull();
	});
});

describe('applyPayment campaign validation (cash_eligibility_rules.zeffy_campaign_id)', () => {
	const CAMP = '7351fd37-0000-0000-0000-000000000002';
	let db: AppDatabase;
	beforeEach(() => {
		db = makeDb();
	});

	async function getReg(id: number) {
		return (
			await db.select().from(campRegistrations).where(eq(campRegistrations.id, id)).limit(1)
		)[0];
	}
	async function getEvents(id: number) {
		return db.select().from(registrationEvents).where(eq(registrationEvents.registrationId, id));
	}
	type Payload = Record<string, unknown> | null;

	function checkout(id: string, amount: number, campaignId: string | null): ZeffyPaymentPayload {
		return {
			id,
			status: 'succeeded',
			amount,
			campaign_id: campaignId,
			buyer: { email: 'john@example.com' },
			buyer_questions: [{ answer: 'CAMP-ABC12' }],
			discount: amount === 0 ? { code: 'PNW-CASH-2026', amount: 17500 } : undefined,
			items: [{ id: 'item-1', amount: 17500 }]
		};
	}

	it('no campaign configured on any rule -> no restriction (paid online normally)', async () => {
		await seedRule(db, { churchId: 12, zeffyCampaignId: null });
		const id = await seedReg(db, { churchId: 12 });
		await applyPayment(db, checkout('zp-open', 17500, 'some-other-campaign'));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('PAID');
		expect(reg.paymentMethod).toBe('ONLINE');
		const ev = (await getEvents(id)).find((e) => e.event === 'online_payment');
		expect((ev?.payload as Payload)?.campaignMatch).toBeNull();
	});

	it('campaign matches -> normal cash DUE decision', async () => {
		await seedRule(db, { churchId: 12, zeffyCampaignId: CAMP });
		const id = await seedReg(db, { cashEligible: true, churchId: 12 });
		await applyPayment(db, checkout('zp-ok', 0, CAMP));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('DUE');
		expect(reg.paymentMethod).toBe('CASH');
		expect(reg.zeffyCampaignId).toBe(CAMP);
		const ev = (await getEvents(id)).find((e) => e.event === 'cash_due');
		expect((ev?.payload as Payload)?.campaignMatch).toBe(true);
	});

	it('$0 from a different campaign -> REVIEW_REQUIRED even when cash eligible', async () => {
		await seedRule(db, { churchId: 12, zeffyCampaignId: CAMP });
		const id = await seedReg(db, { cashEligible: true, churchId: 12 });
		await applyPayment(db, checkout('zp-wrong', 0, 'other-campaign'));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('REVIEW_REQUIRED');
		expect(reg.paymentMethod).toBeNull();
		expect(reg.amountDueCents).toBe(17500);
		const evs = await getEvents(id);
		expect(evs.map((e) => e.event)).toContain('campaign_mismatch');
		expect(evs.map((e) => e.event)).not.toContain('cash_due');
		const payload = evs.find((e) => e.event === 'campaign_mismatch')?.payload as Payload;
		expect(payload?.campaignId).toBe('other-campaign');
		expect(payload?.allowedCampaignIds).toEqual([CAMP]);
		expect(payload?.campaignMatch).toBe(false);
	});

	it('paid amount from a different campaign -> REVIEW_REQUIRED, not PAID', async () => {
		await seedRule(db, { churchId: 12, zeffyCampaignId: CAMP });
		const id = await seedReg(db, { churchId: 12 });
		await applyPayment(db, checkout('zp-wrong-paid', 5000, 'other-campaign'));
		const reg = await getReg(id);
		expect(reg.paymentStatus).toBe('REVIEW_REQUIRED');
		expect(reg.amountPaidCents).toBe(0);
		const payload = (await getEvents(id)).find((e) => e.event === 'campaign_mismatch')
			?.payload as Payload;
		expect(payload?.zeffyAmountCents).toBe(5000);
	});

	it('missing campaign_id on payload when one is required -> REVIEW_REQUIRED', async () => {
		await seedRule(db, { churchId: 12, zeffyCampaignId: CAMP });
		const id = await seedReg(db, { cashEligible: true, churchId: 12 });
		await applyPayment(db, checkout('zp-nocamp', 0, null));
		expect((await getReg(id)).paymentStatus).toBe('REVIEW_REQUIRED');
	});

	it('restriction applies event-wide: rule for another church pins the campaign', async () => {
		await seedRule(db, { churchId: 12, zeffyCampaignId: CAMP });
		const id = await seedReg(db, { churchId: 99 });
		await applyPayment(db, checkout('zp-event-wide', 17500, 'other-campaign'));
		expect((await getReg(id)).paymentStatus).toBe('REVIEW_REQUIRED');
	});

	it('inactive rule does not pin the campaign', async () => {
		await seedRule(db, { churchId: 12, zeffyCampaignId: CAMP, active: false });
		const id = await seedReg(db, { churchId: 12 });
		await applyPayment(db, checkout('zp-inactive', 17500, 'other-campaign'));
		expect((await getReg(id)).paymentStatus).toBe('PAID');
	});
});
