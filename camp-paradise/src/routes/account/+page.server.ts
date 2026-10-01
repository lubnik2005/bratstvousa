import { fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { paradiseAttendees, paradiseRefundRequests } from '$lib/server/db/schema';
import { hashPassword, MIN_PASSWORD_LENGTH } from '$lib/server/paradise/auth';
import { sendRefundRequestNotice } from '$lib/server/email/paradise';
import {
	reservationsForEmail,
	formAnswersForEmail,
	balanceForEmail,
	ledgerForEmail,
	findAttendeeByEmail
} from '$lib/server/paradise/queries';
import { readSession, clearSession } from '$lib/server/paradise/session';
import type { Actions, PageServerLoad } from './$types';

const sessionSecret = (platform: App.Platform | undefined) =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

const DEFAULT_REFUND_NOTIFY = 'Contact@camp-paradise.org';

export const load: PageServerLoad = async ({ locals, cookies, platform, setHeaders }) => {
	const identity = await readSession(cookies, sessionSecret(platform));
	if (!identity) {
		throw redirect(303, '/?next=/account');
	}

	setHeaders({ 'cache-control': 'private, no-cache' });

	const [reservations, forms, balanceCents, ledger, attendee, refundRequests] = await Promise.all([
		reservationsForEmail(locals.db, identity.email),
		formAnswersForEmail(locals.db, identity.email),
		balanceForEmail(locals.db, identity.email),
		ledgerForEmail(locals.db, identity.email),
		findAttendeeByEmail(locals.db, identity.email),
		locals.db
			.select({
				id: paradiseRefundRequests.id,
				amountCents: paradiseRefundRequests.amountCents,
				status: paradiseRefundRequests.status,
				createdAt: paradiseRefundRequests.createdAt
			})
			.from(paradiseRefundRequests)
			.where(eq(paradiseRefundRequests.email, identity.email.toLowerCase()))
			.orderBy(sql`${paradiseRefundRequests.id} desc`)
			.limit(5)
	]);

	return {
		camper: identity,
		reservations,
		forms,
		balanceCents,
		ledger,
		hasPassword: Boolean(attendee?.passwordHash),
		refundRequests
	};
};

export const actions: Actions = {
	signout: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(303, '/');
	},

	requestRefund: async ({ request, locals, cookies, platform }) => {
		const identity = await readSession(cookies, sessionSecret(platform));
		if (!identity) throw redirect(303, '/?next=/account');

		const data = await request.formData();
		const amountRaw = String(data.get('amount') ?? '').trim();
		const note =
			String(data.get('note') ?? '')
				.trim()
				.slice(0, 1000) || null;
		const balanceCents = await balanceForEmail(locals.db, identity.email);

		if (balanceCents <= 0) {
			return fail(400, { refundError: 'You have no balance to refund.' });
		}

		let amountCents: number | null = null;
		if (amountRaw) {
			const dollars = Number(amountRaw.replace(/[$,]/g, ''));
			if (!Number.isFinite(dollars) || dollars <= 0) {
				return fail(400, {
					refundError: 'Enter a valid amount, or leave it blank for the full balance.'
				});
			}
			amountCents = Math.round(dollars * 100);
			if (amountCents > balanceCents) {
				return fail(400, { refundError: 'That is more than your current balance.' });
			}
		}

		const email = identity.email.toLowerCase();
		let requestId: number;
		try {
			const inserted = await locals.db
				.insert(paradiseRefundRequests)
				.values({ attendeeId: identity.attendeeId, email, amountCents, balanceCents, note })
				.returning({ id: paradiseRefundRequests.id });
			requestId = inserted[0].id;
		} catch (err) {
			console.error('refund request insert failed:', err);
			return fail(500, { refundError: 'Could not submit your request. Please try again.' });
		}

		const recipients = (platform?.env?.REFUND_NOTIFY_EMAILS ?? DEFAULT_REFUND_NOTIFY)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const info = {
			requestId,
			firstName: identity.firstName,
			lastName: identity.lastName,
			email,
			amountCents,
			balanceCents,
			note
		};
		await Promise.all(
			recipients.map((to) =>
				sendRefundRequestNotice(locals.db, to, info).catch((err) =>
					console.error('refund notice email failed:', to, err)
				)
			)
		);

		return { refundRequested: true };
	},

	setPassword: async ({ request, locals, cookies, platform }) => {
		const identity = await readSession(cookies, sessionSecret(platform));
		if (!identity) throw redirect(303, '/?next=/account');

		const data = await request.formData();
		const password = String(data.get('password') ?? '');
		const confirm = String(data.get('confirm') ?? '');

		if (password.length < MIN_PASSWORD_LENGTH) {
			return fail(400, {
				passwordError: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
			});
		}
		if (password.length > 200) {
			return fail(400, { passwordError: 'Password is too long.' });
		}
		if (password !== confirm) {
			return fail(400, { passwordError: 'Passwords do not match.' });
		}

		await locals.db
			.update(paradiseAttendees)
			.set({
				passwordHash: await hashPassword(password),
				updatedAt: sql`datetime('now')` as unknown as string
			})
			.where(eq(paradiseAttendees.id, identity.attendeeId));

		return { passwordSaved: true };
	}
};
