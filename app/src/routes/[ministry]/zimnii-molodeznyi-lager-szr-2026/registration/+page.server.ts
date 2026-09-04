import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { campRegistrations, youthLeaders } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const EVENT_SLUG = 'zimnii-molodeznyi-lager-szr-2026';
const CAMP_AMOUNT = 350;

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

	return { leaders: leaders.length ? leaders : DEMO_LEADERS, amount: CAMP_AMOUNT };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const db = locals.db;
		const fd = await request.formData();

		// honeypot
		if (clean(fd.get('middle_name'))) {
			return { form: { message: 'Спасибо! Если это отправлено по ошибке, ничего делать не нужно.' } };
		}

		const fields = {
			firstName: clean(fd.get('firstName')),
			lastName: clean(fd.get('lastName')),
			church: clean(fd.get('church')),
			email: clean(fd.get('email')),
			phone: clean(fd.get('phone')),
			leaderId: clean(fd.get('leaderId'))
		};

		const errors: Record<string, string> = {};
		if (!fields.firstName) errors.firstName = 'Укажите имя.';
		if (!fields.lastName) errors.lastName = 'Укажите фамилию.';
		if (!fields.church) errors.church = 'Укажите церковь.';
		if (!fields.email) errors.email = 'Укажите email.';
		else if (!isEmail(fields.email)) errors.email = 'Укажите корректный email.';
		if (!fields.leaderId) errors.leaderId = 'Выберите ответственного за молодежь.';

		if (Object.keys(errors).length) {
			return fail(400, { form: { errors, fields } });
		}

		const now = new Date().toISOString();
		try {
			await db.insert(campRegistrations).values({
				eventSlug: EVENT_SLUG,
				firstName: fields.firstName,
				lastName: fields.lastName,
				church: fields.church,
				email: fields.email,
				phone: fields.phone,
				leaderId: Number(fields.leaderId),
				status: 'pending_payment',
				paymentStatus: 'unpaid',
				amount: CAMP_AMOUNT,
				createdAt: now,
				updatedAt: now
			});
		} catch (err) {
			// Demo mode: youth_leaders may not be seeded yet (FK), don't block the flow.
			console.warn('camp registration insert skipped (demo):', err);
		}

		// Proceed to the (demo) payment step.
		return {
			paid: false,
			registered: true,
			amount: CAMP_AMOUNT,
			name: `${fields.firstName} ${fields.lastName}`,
			fields: {}
		};
	}
};
