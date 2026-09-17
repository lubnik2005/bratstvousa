import { fail } from '@sveltejs/kit';
import { eq, desc, and, sql } from 'drizzle-orm';
import {
	campRegistrations,
	youthLeaders,
	churches,
	cashEligibilityRules
} from '$lib/server/db/schema';
import {
	generateConfirmationCode,
	generateApprovalToken,
	sendRegistrantThankYou,
	sendLeaderApprovalRequest
} from '$lib/server/email/camp';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';
import type { Actions, PageServerLoad } from './$types';

const EVENT_SLUG = 'osennii-molodeznyi-lager-szr-2026';
const CAMP_AMOUNT = 350;
const CAMP_AMOUNT_CENTS = CAMP_AMOUNT * 100;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (s: FormDataEntryValue | null | undefined) =>
	(typeof s === 'string' ? s.trim() : '') || '';

// Demo fallback until the real youth-leader list is provided and seeded.
const DEMO_LEADERS = [
	{ id: 1, name: 'Бальжик Вениамин' },
	{ id: 2, name: 'Озеров Андрей' },
	{ id: 3, name: 'Кузнецов Сергей' },
	{ id: 4, name: 'Бадулин Павел' }
];

// Demo fallback churches until the real DB is reachable in this environment.
const DEMO_CHURCHES = [
	{ id: 1, label: 'МСЦ ЕХБ Спокан (Spokane, WA)' },
	{ id: 2, label: 'МСЦ ЕХБ Сакраменто (Sacramento, CA)' },
	{ id: 3, label: 'МСЦ ЕХБ Портленд (Portland, OR)' }
];

const churchLabel = (c: {
	name_line_1: string | null;
	name_line_2: string | null;
	address_line_1: string | null;
	address_line_2: string | null;
}) => {
	const name = [c.name_line_1, c.name_line_2].filter(Boolean).join(' ').trim();
	const addr = [c.address_line_1, c.address_line_2].filter(Boolean).join(' ').trim();
	return addr ? `${name} (${addr})` : name;
};

export const load: PageServerLoad = async ({ locals }) => {
	let leaders: { id: number; name: string }[] = [];
	try {
		leaders = await locals.db
			.select({ id: youthLeaders.id, name: youthLeaders.name })
			.from(youthLeaders)
			.where(eq(youthLeaders.active, true))
			.orderBy(youthLeaders.name);
	} catch (err) {
		// Demo mode: youth_leaders table may not exist yet in this environment.
		console.warn('youth_leaders query failed, using demo leaders:', err);
	}

	let churchList: { id: number; label: string }[] = [];
	try {
		const rows = await locals.db.select().from(churches).orderBy(desc(churches.state));
		churchList = rows
			.map((c) => ({ id: c.id, label: churchLabel(c) }))
			.filter((c) => c.label)
			.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
	} catch (err) {
		console.warn('churches query failed, using demo churches:', err);
	}

	return {
		leaders: leaders.length ? leaders : DEMO_LEADERS,
		churches: churchList.length ? churchList : DEMO_CHURCHES,
		amount: CAMP_AMOUNT
	};
};

export const actions: Actions = {
	default: async ({ request, locals, url, platform }) => {
		const db = locals.db;
		const fd = await request.formData();

		// Turnstile: verify before any processing.
		const ts = await verifyTurnstile(
			fd.get('cf-turnstile-response') as string | null,
			platform?.env?.TURNSTILE_SECRET_KEY,
			request.headers.get('cf-connecting-ip'),
			'camp_2026',
			platform?.env?.TURNSTILE_HOSTNAMES
		);
		if (!ts.ok) {
			return fail(403, { form: { message: TURNSTILE_ERROR_MESSAGE } });
		}

		// honeypot
		if (clean(fd.get('middle_name'))) {
			return {
				form: { message: 'Спасибо! Если это отправлено по ошибке, ничего делать не нужно.' }
			};
		}

		const churchSelected = clean(fd.get('church'));
		const churchOther = clean(fd.get('churchOther'));
		// If "Другое" was chosen, use the free-text value; otherwise the selected label.
		const churchValue = churchSelected === 'other' ? churchOther : churchSelected;

		// Real church FK from the hidden churchId input. Only trusted when it maps
		// to a known church row; free-typed / "other" churches have no id (=> null)
		// and are therefore never cash-eligible (spec §6/§22).
		const churchIdRaw = clean(fd.get('churchId'));
		const churchId =
			churchIdRaw && /^\d+$/.test(churchIdRaw) && churchSelected !== 'other'
				? Number(churchIdRaw)
				: null;

		const fields = {
			firstName: clean(fd.get('firstName')),
			lastName: clean(fd.get('lastName')),
			church: churchValue,
			email: clean(fd.get('email')),
			phone: clean(fd.get('phone')),
			leaderId: clean(fd.get('leaderId'))
		};

		const errors: Record<string, string> = {};
		if (!fields.firstName) errors.firstName = 'Укажите имя.';
		if (!fields.lastName) errors.lastName = 'Укажите фамилию.';
		if (!fields.church)
			errors.church = churchSelected === 'other' ? 'Введите название церкви.' : 'Выберите церковь.';
		if (!fields.email) errors.email = 'Укажите email.';
		else if (!isEmail(fields.email)) errors.email = 'Укажите корректный email.';
		if (!fields.leaderId) errors.leaderId = 'Выберите ответственного за молодежь.';

		if (Object.keys(errors).length) {
			return fail(400, { form: { errors, fields } });
		}

		// One registration per event per email. Compare case-insensitively
		// (lowercase + trim). A previously rejected registration is allowed to
		// re-register, so only pending_payment/awaiting_approval/approved block.
		const normalizedEmail = fields.email.trim().toLowerCase();
		try {
			const existing = await db
				.select({ status: campRegistrations.status })
				.from(campRegistrations)
				.where(
					and(
						eq(campRegistrations.eventSlug, EVENT_SLUG),
						sql`lower(${campRegistrations.email}) = ${normalizedEmail}`
					)
				);
			const hasActive = existing.some((r) => r.status !== 'rejected');
			if (hasActive) {
				errors.email = 'На этот адрес уже зарегистрирован участник на это мероприятие.';
				return fail(400, { form: { errors, fields } });
			}
		} catch (err) {
			console.error('camp dedup check failed:', err);
		}

		// Resolve cash eligibility from the authoritative rules table, keyed on
		// (churchId, eventSlug). A matching active rule => this registrant may pay
		// $0 on Zeffy and cash at check-in; its amountCents is the price snapshot.
		// No rule (or no real churchId) => not eligible, default event price.
		let cashEligible = false;
		let eventPriceCents = CAMP_AMOUNT_CENTS;
		if (churchId != null) {
			try {
				const rule = (
					await db
						.select({ amountCents: cashEligibilityRules.amountCents })
						.from(cashEligibilityRules)
						.where(
							and(
								eq(cashEligibilityRules.churchId, churchId),
								eq(cashEligibilityRules.eventSlug, EVENT_SLUG),
								eq(cashEligibilityRules.active, true)
							)
						)
						.limit(1)
				)[0];
				if (rule) {
					cashEligible = true;
					if (rule.amountCents != null) eventPriceCents = rule.amountCents;
				}
			} catch (err) {
				// Non-fatal: table may not exist yet in some environments. Falling
				// back to not-eligible is the safe default.
				console.warn('cash eligibility lookup failed, defaulting to not-eligible:', err);
			}
		}

		// Generate the confirmation code + approval token at submission time.
		// The code is emailed to the registrant now and re-used at payment (Zeffy)
		// after approval; on rejection it is simply never used.
		const confirmationCode = generateConfirmationCode();
		const approvalToken = generateApprovalToken();
		const now = new Date().toISOString();

		try {
			await db.insert(campRegistrations).values({
				eventSlug: EVENT_SLUG,
				firstName: fields.firstName,
				lastName: fields.lastName,
				church: fields.church,
				churchId,
				email: fields.email,
				phone: fields.phone,
				leaderId: Number(fields.leaderId),
				status: 'awaiting_approval',
				// New payment model: PENDING until a Zeffy checkout arrives. Legacy
				// dollar `amount` is kept for back-compat; *_cents drive new logic.
				paymentStatus: 'PENDING',
				paymentMethod: null,
				cashEligible,
				amount: Math.round(eventPriceCents / 100),
				eventPriceCents,
				amountDueCents: eventPriceCents,
				amountPaidCents: 0,
				checkinStatus: 'NOT_CHECKED_IN',
				confirmationCode,
				approvalToken,
				createdAt: now,
				updatedAt: now
			});
		} catch (err) {
			console.error('camp registration insert failed:', err);
			return fail(500, {
				form: {
					message: 'Не удалось сохранить регистрацию. Попробуйте ещё раз.',
					fields
				}
			});
		}

		// Look up the assigned leader's contact details server-side only.
		// Phone/email are never exposed to the browser.
		let leader: { name: string; email: string | null } | undefined;
		try {
			const rows = await db
				.select({ name: youthLeaders.name, email: youthLeaders.email })
				.from(youthLeaders)
				.where(eq(youthLeaders.id, Number(fields.leaderId)))
				.limit(1);
			leader = rows[0];
		} catch (err) {
			console.error('leader lookup failed:', err);
		}

		const registrant = {
			firstName: fields.firstName,
			lastName: fields.lastName,
			email: fields.email,
			phone: fields.phone,
			church: fields.church,
			confirmationCode
		};

		// Emails are best-effort: a delivery failure must not lose the saved
		// registration, so failures are logged rather than surfaced.
		try {
			await sendRegistrantThankYou(db, registrant);
		} catch (err) {
			console.error('registrant thank-you email failed:', err);
		}

		if (leader?.email) {
			const approvalUrl = `${url.origin}/camp-approval?token=${approvalToken}`;
			try {
				await sendLeaderApprovalRequest(db, {
					leaderEmail: leader.email,
					leaderName: leader.name,
					registrant,
					approvalUrl
				});
			} catch (err) {
				console.error('leader approval-request email failed:', err);
			}
		} else {
			console.error('no leader email for leaderId', fields.leaderId);
		}

		return {
			registered: true,
			confirmationCode,
			name: `${fields.firstName} ${fields.lastName}`,
			fields: {}
		};
	}
};
