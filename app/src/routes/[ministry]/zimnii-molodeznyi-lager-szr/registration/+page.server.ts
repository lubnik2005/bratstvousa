import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { campRegistrations, youthLeaders } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const EVENT_SLUG = 'zimnii-molodeznyi-lager-szr';
const CAMP_AMOUNT = 350;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (s: FormDataEntryValue | null | undefined) =>
	(typeof s === 'string' ? s.trim() : '') || '';

export const load: PageServerLoad = async ({ locals }) => {
	const leaders = await locals.db
		.select({ id: youthLeaders.id, name: youthLeaders.name })
		.from(youthLeaders)
		.where(eq(youthLeaders.active, true))
		.orderBy(youthLeaders.name);
	return { leaders };
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

		return {
			message: 'Спасибо! Мы получили вашу заявку.',
			fields: {}
		};
	}
};
