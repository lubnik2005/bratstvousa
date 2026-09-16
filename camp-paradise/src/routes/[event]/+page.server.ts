import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { env } from '$env/dynamic/public';
import {
	getPublishedEvent,
	eventCapacity,
	roomsForEvent,
	bedsForRoom,
	isBedFree,
	requiredForms
} from '$lib/server/paradise/queries';
import { generateConfirmationCode } from '$lib/server/email/paradise';
import { makeStripe } from '$lib/server/paradise/payments';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';
import {
	paradiseReservations,
	paradiseEventRooms,
	paradiseFormAnswers
} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const clean = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const load: PageServerLoad = async ({ params, url, locals }) => {
	const db = locals.db;
	const id = Number(params.event);
	if (!Number.isInteger(id)) throw error(404, 'Event not found');

	const event = await getPublishedEvent(db, id);
	if (!event) throw error(404, 'Event not found');

	const capacity = await eventCapacity(db, id);

	const sexParam = url.searchParams.get('sex');
	const sex = sexParam === 'm' || sexParam === 'f' ? sexParam : null;
	const rooms = sex ? await roomsForEvent(db, id, sex) : [];

	const roomParam = url.searchParams.get('room');
	const roomId = roomParam && /^\d+$/.test(roomParam) ? Number(roomParam) : null;
	const beds = roomId ? await bedsForRoom(db, id, roomId) : [];

	const forms = await requiredForms(db);

	return {
		event,
		capacity,
		sex,
		rooms,
		roomId,
		beds,
		forms,
		publicStripeKey: env.PUBLIC_STRIPE_KEY ?? ''
	};
};

export const actions: Actions = {
	hold: async ({ request, locals, platform }) => {
		const db = locals.db;
		const fd = await request.formData();

		const ts = await verifyTurnstile(
			fd.get('cf-turnstile-response') as string | null,
			platform?.env?.TURNSTILE_SECRET_KEY,
			request.headers.get('cf-connecting-ip'),
			'paradise_register',
			platform?.env?.TURNSTILE_HOSTNAMES
		);
		if (!ts.ok) return fail(403, { message: TURNSTILE_ERROR_MESSAGE });

		// Honeypot: silently accept without writing.
		if (clean(fd.get('middle_name'))) return { held: true, code: 'PARADISE-XXXXX' };

		const eventId = Number(fd.get('eventId'));
		const roomId = Number(fd.get('roomId'));
		const cotId = Number(fd.get('cotId'));
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
		if (!Number.isInteger(roomId) || !Number.isInteger(cotId)) errors.bed = 'Please select a bed.';

		const forms = await requiredForms(db);
		for (const form of forms) {
			if (!fd.get(`form_${form.id}`)) errors[`form_${form.id}`] = `Please agree to ${form.name}.`;
		}

		if (Object.keys(errors).length) return fail(400, { errors, fields });

		if (!(await isBedFree(db, eventId, cotId)))
			return fail(400, { message: 'That bed was just taken. Please pick another.', fields });

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
		if (!stripe) return fail(500, { message: 'Payments are not configured yet.', fields });

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
