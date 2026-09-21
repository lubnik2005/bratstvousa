import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendEmail } from '$lib/email';
import { sendRegistrantApproved } from './camp';
import type { AppDatabase } from '$lib/server/db';

vi.mock('$lib/email', () => ({
	sendEmail: vi.fn(async () => ({ ok: true }))
}));

const db = {} as unknown as AppDatabase;

const registrant = {
	firstName: 'John',
	lastName: 'Smith',
	email: 'john@example.com',
	confirmationCode: 'CAMP-ABC12'
};

function lastHtml(): string {
	const calls = vi.mocked(sendEmail).mock.calls;
	const last = calls[calls.length - 1];
	return String(last[3]);
}

describe('sendRegistrantApproved payment wording', () => {
	beforeEach(() => {
		vi.mocked(sendEmail).mockClear();
	});

	it('cash-at-door registrant: $0 on Zeffy, full price in cash', async () => {
		await sendRegistrantApproved(db, {
			registrant,
			zeffyUrl: 'https://www.zeffy.com/en-US/ticketing/pnw-youth-camp--2026',
			cashEligible: true,
			eventPriceCents: 35000
		});

		const html = lastHtml();
		expect(html).toContain('Оплата на месте');
		expect(html).toContain('$0');
		expect(html).toContain('$350.00');
		expect(html).toContain('наличными');
		expect(html).not.toContain('К оплате:');
		expect(html).toContain('registrationCode=CAMP-ABC12');
	});

	it('partial-price registrant: shows the amount owed online, never $0', async () => {
		await sendRegistrantApproved(db, {
			registrant,
			zeffyUrl: 'https://www.zeffy.com/en-US/ticketing/pnw-youth-camp--2026',
			cashEligible: false,
			eventPriceCents: 17500
		});

		const html = lastHtml();
		expect(html).toContain('К оплате:');
		expect(html).toContain('$175.00');
		expect(html).not.toContain('$0');
		expect(html).not.toContain('Оплата на месте');
		expect(html).not.toContain('наличными');
	});

	it('full-price registrant: shows the full amount, never $0', async () => {
		await sendRegistrantApproved(db, {
			registrant,
			zeffyUrl: 'https://www.zeffy.com/en-US/ticketing/pnw-youth-camp--2026',
			cashEligible: false,
			eventPriceCents: 35000
		});

		const html = lastHtml();
		expect(html).toContain('К оплате:');
		expect(html).toContain('$350.00');
		expect(html).not.toContain('$0');
		expect(html).not.toContain('Оплата на месте');
	});

	it('no price known: omits the payment line entirely', async () => {
		await sendRegistrantApproved(db, {
			registrant,
			zeffyUrl: '#',
			cashEligible: false
		});

		const html = lastHtml();
		expect(html).not.toContain('К оплате:');
		expect(html).not.toContain('Оплата на месте');
	});
});
