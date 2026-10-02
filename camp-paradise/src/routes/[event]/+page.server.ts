import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import {
	getPublishedEvent,
	getAnyEvent,
	eventCapacity,
	roomsForEvent,
	bedsForRoom,
	isBedFree,
	requiredForms,
	registrationState,
	balanceForEmail,
	activeReservationForEvent
} from '$lib/server/paradise/queries';
import { generateConfirmationCode, sendReservationConfirmed } from '$lib/server/email/paradise';
import { applyPayment, listPayments, normalizeEmail } from '$lib/server/paradise/zeffy';
import { isHealthForm, parseHealthForm } from '$lib/server/paradise/health-form';
import { readSession } from '$lib/server/paradise/session';
import { validPreviewToken } from '$lib/server/paradise/preview';
import {
	paradiseReservations,
	paradiseEventRooms,
	paradiseFormAnswers,
	paradiseRooms,
	paradiseCots,
	paradiseLedger
} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const clean = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');

const sessionSecret = (platform: App.Platform | undefined): string =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

const topupUrlFor = (
	event: { zeffyTicketingUrl: string | null },
	platform: App.Platform | undefined
): string | null => event.zeffyTicketingUrl || platform?.env?.PUBLIC_ZEFFY_TOPUP_URL || null;

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

	// Admin preview: a valid ?preview= token unlocks draft events.
	const previewToken = validPreviewToken(platform, url.searchParams.get('preview'));
	const event = previewToken ? await getAnyEvent(db, id) : await getPublishedEvent(db, id);
	if (!event) throw error(404, 'Event not found');
	const isDraft = event.status !== 'published';

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
			balanceCents: 0,
			existing: null,
			previewToken,
			isDraft,
			topupUrl: topupUrlFor(event, platform)
		};
	}

	// Identity comes ONLY from the signed cookie set at the "start" step — not
	// from a URL param — so room/bed availability can't be scraped by flipping
	// ?sex. Without a valid session, no rooms or beds are fetched at all.
	const identity = await readSession(cookies, sessionSecret(platform));
	if (!identity) {
		const next = previewToken ? `/${id}?preview=${previewToken}` : `/${id}`;
		throw redirect(303, `/?next=${encodeURIComponent(next)}`);
	}
	const sex = identity.sex;

	const roomParam = url.searchParams.get('room');
	const roomId = roomParam && /^\d+$/.test(roomParam) ? Number(roomParam) : null;

	// Run the independent lookups in parallel to cut serial D1 round-trips.
	const [capacity, rooms, roomBeds, forms, balanceCents, existing] = await Promise.all([
		eventCapacity(db, id),
		roomsForEvent(db, id, sex),
		roomId ? bedsForRoom(db, id, roomId) : Promise.resolve([]),
		requiredForms(db),
		balanceForEmail(db, identity.email),
		activeReservationForEvent(db, identity.email, id)
	]);
	// Only expose beds (and occupant names) for rooms this camper may book.
	const beds = rooms.some((r) => r.id === roomId) ? roomBeds : [];

	return {
		event,
		registrationState: 'open' as const,
		capacity,
		identity,
		rooms,
		roomId,
		beds,
		forms,
		balanceCents,
		existing,
		previewToken,
		isDraft,
		topupUrl: topupUrlFor(event, platform)
	};
};

export const actions: Actions = {
	hold: async ({ request, locals, params, cookies, platform }) => {
		const db = locals.db;
		const id = Number(params.event);
		const fd = await request.formData();

		// Identity must come from the signed session established at step 1 —
		// it is never taken from posted form fields.
		const identity = await readSession(cookies, sessionSecret(platform));
		if (!identity)
			return fail(400, {
				message: 'Your registration session expired. Please start again.',
				expired: true
			});

		// Honeypot: silently accept without writing.
		if (clean(fd.get('middle_name'))) return { confirmed: true, code: 'PARADISE-XXXXX' };

		const eventId = id;
		const roomId = Number(fd.get('roomId'));
		// One bed per camper per camp.
		const already = await activeReservationForEvent(db, identity.email, eventId);
		if (already) return fail(400, { alreadyBooked: true, code: already.confirmationCode });

		const cotRaw = clean(fd.get('cotId'));
		let cotId = cotRaw === 'any' ? NaN : Number(cotRaw);

		// Reject holds on camps whose registration window is not open.
		// Drafts are bookable only with a valid admin preview token.
		const preview = validPreviewToken(platform, fd.get('preview'));
		const heldEvent = !Number.isInteger(eventId)
			? null
			: preview
				? await getAnyEvent(db, eventId)
				: await getPublishedEvent(db, eventId);
		if (!heldEvent || registrationState(heldEvent) !== 'open')
			return fail(400, { message: 'Registration is closed for this camp.' });

		const { attendeeId, firstName, lastName, email, sex } = identity;

		const errors: Record<string, string> = {};
		if (!Number.isInteger(roomId)) errors.bed = 'Please select a bed.';
		else if (cotRaw === 'any') {
			// "Any available bed": pick the first free bed in this room server-side.
			const free = await bedsForRoom(db, eventId, roomId, { freeOnly: true });
			if (free.length === 0) errors.bed = 'No beds left in this room. Please pick another room.';
			else cotId = free[0].id;
		} else if (!Number.isInteger(cotId)) errors.bed = 'Please select a bed.';

		const forms = await requiredForms(db);
		const parsedAnswers = new Map<number, Record<string, unknown>>();
		for (const form of forms) {
			if (!fd.get(`form_${form.id}`)) errors[`form_${form.id}`] = `Please agree to ${form.name}.`;
			if (isHealthForm(form)) {
				const parsed = parseHealthForm(fd, form.id);
				Object.assign(errors, parsed.errors);
				parsedAnswers.set(form.id, parsed.answers);
			}
		}

		if (Object.keys(errors).length) return fail(400, { errors });

		if (!(await isBedFree(db, eventId, cotId)))
			return fail(400, { message: 'That bed was just taken. Please pick another.' });

		// Per-event room price (cents) — debited from the camper's wallet.
		const priceRows = await db
			.select({ price: paradiseEventRooms.price })
			.from(paradiseEventRooms)
			.where(and(eq(paradiseEventRooms.eventId, eventId), eq(paradiseEventRooms.roomId, roomId)))
			.limit(1);
		const price = priceRows[0]?.price ?? 0;

		// Wallet model: the bed is paid from the balance topped up via Zeffy.
		const balance = await balanceForEmail(db, email);
		if (balance < price)
			return fail(400, { insufficient: true, needed: price - balance, price, balance });

		const code = generateConfirmationCode();
		const nowIso = new Date().toISOString();

		const inserted = await db
			.insert(paradiseReservations)
			.values({
				eventId,
				roomId,
				cotId,
				attendeeId,
				firstName,
				lastName,
				email,
				sex,
				status: 'confirmed',
				paidAt: nowIso,
				price,
				confirmationCode: code
			})
			.returning({ id: paradiseReservations.id });
		const reservationId = inserted[0].id;

		// Debit the wallet.
		if (price > 0) {
			await db.insert(paradiseLedger).values({
				email: normalizeEmail(email),
				attendeeId,
				eventId,
				kind: 'debit',
				amountCents: -price,
				reservationId,
				note: `Bed reserved · ${heldEvent.name}`
			});
		}

		// Persist each signed agreement / form as a paradise_form_answers row.
		const signedOn = nowIso;
		for (const form of forms) {
			let answers: Record<string, unknown> | undefined = parsedAnswers.get(form.id);
			if (!answers) {
				answers = { agreed: true };
				const questions = Array.isArray(form.questions) ? form.questions : [];
				for (const q of questions) {
					const key = (q as { key?: string })?.key;
					if (typeof key === 'string' && key) {
						answers[key] = clean(fd.get(`form_${form.id}_${key}`));
					}
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

		try {
			const roomRows = await db
				.select({ name: paradiseRooms.name })
				.from(paradiseRooms)
				.where(eq(paradiseRooms.id, roomId))
				.limit(1);
			const cotRows = await db
				.select({ description: paradiseCots.description })
				.from(paradiseCots)
				.where(eq(paradiseCots.id, cotId))
				.limit(1);
			await sendReservationConfirmed(db, {
				firstName,
				email,
				eventName: heldEvent.name,
				roomName: roomRows[0]?.name ?? `Room ${roomId}`,
				cotName: cotRows[0]?.description ?? '',
				code,
				amount: price / 100
			});
		} catch (err) {
			console.error('sendReservationConfirmed failed', err);
		}

		return { confirmed: true, code };
	},

	// "I already paid — check again": pull recent succeeded payments from the
	// Zeffy API for this camper's email and apply them (credits the wallet).
	checkBalance: async ({ locals, params, cookies, platform }) => {
		const db = locals.db;
		void params;
		const identity = await readSession(cookies, sessionSecret(platform));
		if (!identity)
			return fail(400, {
				message: 'Your registration session expired. Please start again.',
				expired: true
			});

		const apiKey = platform?.env?.ZEFFY_API_KEY;
		if (!apiKey) return fail(500, { message: 'Balance lookup is not configured yet.' });

		const email = normalizeEmail(identity.email);
		try {
			const payments = await listPayments(apiKey, { status: 'succeeded', maxPages: 5 });
			for (const p of payments) {
				if (normalizeEmail(p.buyer?.email) === email) await applyPayment(db, p, { apiKey });
			}
		} catch (err) {
			console.error('checkBalance failed', err);
			return fail(502, { message: "We couldn't reach Zeffy right now. Try again shortly." });
		}

		const balanceCents = await balanceForEmail(db, identity.email);
		return { checked: true, balanceCents };
	}
};
