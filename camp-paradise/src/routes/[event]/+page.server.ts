import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { env } from '$env/dynamic/public';
import {
	getPublishedEvent,
	eventCapacity,
	roomsForEvent,
	bedsForRoom,
	isBedFree,
	requiredForms,
	registrationState
} from '$lib/server/paradise/queries';
import { generateConfirmationCode } from '$lib/server/email/paradise';
import { makeStripe } from '$lib/server/paradise/payments';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';
import { readSession, setSession, clearSession } from '$lib/server/paradise/session';
import {
	paradiseReservations,
	paradiseEventRooms,
	paradiseFormAnswers
} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const clean = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const sessionSecret = (platform: App.Platform | undefined): string =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

export const load: PageServerLoad = async ({
	params,
	url,
	locals,
	cookies,
	platform,
	setHeaders
}) => {
	const db = locals.db;
	const id = Number(params.event);
	if (!Number.isInteger(id)) throw error(404, 'Event not found');

	// This page varies by the registration cookie (who is registering), so it
	// must never be shared from the edge cache — otherwise one person's step
	// could leak to another. The public home page is still cached.
	setHeaders({ 'cache-control': 'private, no-cache' });

	const event = await getPublishedEvent(db, id);
	if (!event) throw error(404, 'Event not found');

	// Registration is only allowed while the window is open. Closed/upcoming
	// camps still render (friendlier for bookmarked links) but hide the wizard.
	const regState = registrationState(event);
	if (regState !== 'open') {
		return {
			event,
			registrationState: regState,
			capacity: { total: 0, taken: 0, available: 0 },
			identity: null,
			rooms: [],
			roomId: null,
			beds: [],
			forms: [],
			publicStripeKey: ''
		};
	}

	// Identity comes ONLY from the signed cookie set at the "start" step — not
	// from a URL param — so room/bed availability can't be scraped by flipping
	// ?sex. Without a valid session, no rooms or beds are fetched at all.
	const identity = await readSession(cookies, sessionSecret(platform), id);
	const sex = identity?.sex ?? null;

	const roomParam = url.searchParams.get('room');
	const roomId = sex && roomParam && /^\d+$/.test(roomParam) ? Number(roomParam) : null;

	// Run the independent lookups in parallel to cut serial D1 round-trips.
	const [capacity, rooms, beds, forms] = await Promise.all([
		eventCapacity(db, id),
		sex ? roomsForEvent(db, id, sex) : Promise.resolve([]),
		roomId ? bedsForRoom(db, id, roomId, { freeOnly: true }) : Promise.resolve([]),
		requiredForms(db)
	]);

	return {
		event,
		registrationState: 'open' as const,
		capacity,
		identity,
		rooms,
		roomId,
		beds,
		forms,
		publicStripeKey: env.PUBLIC_STRIPE_KEY ?? ''
	};
};

export const actions: Actions = {
	// Step 1: capture the camper identity (name/email/sex) behind a Turnstile
	// check and store it in a signed cookie. No DB write happens here — this
	// just unlocks the room/bed views for this browser session.
	start: async ({ request, locals, params, cookies, platform }) => {
		const db = locals.db;
		const id = Number(params.event);
		const fd = await request.formData();

		const ts = await verifyTurnstile(
			fd.get('cf-turnstile-response') as string | null,
			platform?.env?.TURNSTILE_SECRET_KEY,
			request.headers.get('cf-connecting-ip'),
			'paradise_register',
			platform?.env?.TURNSTILE_HOSTNAMES
		);
		if (!ts.ok) return fail(403, { message: TURNSTILE_ERROR_MESSAGE });

		// Honeypot: pretend success without setting a session.
		if (clean(fd.get('middle_name'))) return { started: true };

		const event = Number.isInteger(id) ? await getPublishedEvent(db, id) : null;
		if (!event || registrationState(event) !== 'open')
			return fail(400, { message: 'Registration is closed for this camp.' });

		const firstName = clean(fd.get('firstName'));
		const lastName = clean(fd.get('lastName'));
		const email = clean(fd.get('email'));
		const sex = clean(fd.get('sex'));

		const fields = { firstName, lastName, email };
		const errors: Record<string, string> = {};
		if (!firstName) errors.firstName = 'First name is required.';
		if (!lastName) errors.lastName = 'Last name is required.';
		if (!isEmail(email)) errors.email = 'A valid email is required.';
		if (sex !== 'm' && sex !== 'f') errors.sex = 'Please choose who this is for.';
		if (Object.keys(errors).length) return fail(400, { errors, fields });

		await setSession(
			cookies,
			{ eventId: id, firstName, lastName, email, sex: sex as 'm' | 'f' },
			sessionSecret(platform)
		);
		return { started: true };
	},

	// "Start over": drop the identity cookie and return to step 1.
	reset: async ({ cookies }) => {
		clearSession(cookies);
		return { reset: true };
	},

	hold: async ({ request, locals, params, cookies, platform }) => {
		const db = locals.db;
		const id = Number(params.event);
		const fd = await request.formData();

		// Identity must come from the signed session established at step 1 —
		// it is never taken from posted form fields.
		const identity = await readSession(cookies, sessionSecret(platform), id);
		if (!identity)
			return fail(400, {
				message: 'Your registration session expired. Please start again.',
				expired: true
			});

		// Honeypot: silently accept without writing.
		if (clean(fd.get('middle_name'))) return { held: true, code: 'PARADISE-XXXXX' };

		const eventId = id;
		const roomId = Number(fd.get('roomId'));
		const cotId = Number(fd.get('cotId'));

		// Reject holds on camps whose registration window is not open.
		const heldEvent = Number.isInteger(eventId) ? await getPublishedEvent(db, eventId) : null;
		if (!heldEvent || registrationState(heldEvent) !== 'open')
			return fail(400, { message: 'Registration is closed for this camp.' });

		const { firstName, lastName, email, sex } = identity;

		const errors: Record<string, string> = {};
		if (!Number.isInteger(roomId) || !Number.isInteger(cotId)) errors.bed = 'Please select a bed.';

		const forms = await requiredForms(db);
		for (const form of forms) {
			if (!fd.get(`form_${form.id}`)) errors[`form_${form.id}`] = `Please agree to ${form.name}.`;
		}

		if (Object.keys(errors).length) return fail(400, { errors });

		if (!(await isBedFree(db, eventId, cotId)))
			return fail(400, { message: 'That bed was just taken. Please pick another.' });

		// Per-event room price (cents).
		const priceRows = await db
			.select({ price: paradiseEventRooms.price })
			.from(paradiseEventRooms)
			.where(and(eq(paradiseEventRooms.eventId, eventId), eq(paradiseEventRooms.roomId, roomId)))
			.limit(1);
		const price = priceRows[0]?.price ?? 0;

		const code = generateConfirmationCode();
		const heldUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();

		const inserted = await db
			.insert(paradiseReservations)
			.values({
				eventId,
				roomId,
				cotId,
				firstName,
				lastName,
				email,
				sex,
				status: 'held',
				heldUntil,
				price,
				confirmationCode: code
			})
			.returning({ id: paradiseReservations.id });
		const reservationId = inserted[0].id;

		// Persist each signed agreement / form as a paradise_form_answers row.
		const signedOn = new Date().toISOString();
		for (const form of forms) {
			const answers: Record<string, unknown> = { agreed: true };
			const questions = Array.isArray(form.questions) ? form.questions : [];
			for (const q of questions) {
				const key = (q as { key?: string })?.key;
				if (typeof key === 'string' && key) {
					answers[key] = clean(fd.get(`form_${form.id}_${key}`));
				}
			}
			await db.insert(paradiseFormAnswers).values({
				formId: form.id,
				eventId,
				reservationId,
				email,
				answers,
				signedOn
			});
		}

		const stripe = makeStripe(
			platform?.env?.STRIPE_SECRET_KEY,
			platform?.env?.STRIPE_WEBHOOK_SECRET
		);
		if (!stripe) return fail(500, { message: 'Payments are not configured yet.' });

		const intent = await stripe.createPaymentIntent(price, {
			reservationId,
			eventId,
			cotId,
			email
		});

		await db
			.update(paradiseReservations)
			.set({ stripePaymentIntent: intent.paymentIntentId })
			.where(eq(paradiseReservations.id, reservationId));

		return { held: true, code, clientSecret: intent.clientSecret };
	}
};
