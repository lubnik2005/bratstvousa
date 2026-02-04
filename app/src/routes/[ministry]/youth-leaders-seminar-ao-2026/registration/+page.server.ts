// src/routes/[ministry]/youth-leaders-seminar-ao-2026/registration/+page.server.ts
import { db } from '$lib/server/db';
import { formSubmissions, churches } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const churchesList = await db.select().from(churches).orderBy(desc(churches.state));

	// Sort by state, then city
	const sortedChurches = churchesList.sort((a: any, b: any) => {
		const stateA = a.city.split(', ')[1];
		const stateB = b.city.split(', ')[1];

		if (stateA < stateB) return -1;
		if (stateA > stateB) return 1;

		// If states are the same, compare cities
		const cityA = a.city.split(', ')[0];
		const cityB = b.city.split(', ')[0];
		return cityA.localeCompare(cityB);
	});

	return {
		churches: sortedChurches
	};
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (s: FormDataEntryValue | null | undefined) =>
	(typeof s === 'string' ? s.trim() : '') || '';

export const actions: Actions = {
	default: async ({ request }) => {
		console.log('Seminar 2026 registration submission started');
		const fd = await request.formData();

		// Honeypot check
		if (clean(fd.get('middle_name'))) {
			console.log('Honeypot triggered');
			return {
				message: 'Спасибо! Если это было отправлено по ошибке, никаких действий не требуется.'
			};
		}

		const fields = {
			firstName: clean(fd.get('firstName')),
			lastName: clean(fd.get('lastName')),
			phone: clean(fd.get('phone')),
			email: clean(fd.get('email')),
			church: clean(fd.get('church')),
			churchOther: clean(fd.get('churchOther')),
			role: clean(fd.get('role')),
			roleOther: clean(fd.get('roleOther')),
			notes: clean(fd.get('notes')),
			paid: fd.get('paid') === 'on' ? 'on' : ''
		};

		const errors: Record<string, string> = {};

		// Validation
		if (!fields.firstName) errors.firstName = 'Пожалуйста, введите ваше имя.';
		if (!fields.lastName) errors.lastName = 'Пожалуйста, введите вашу фамилию.';
		if (!fields.phone) errors.phone = 'Пожалуйста, введите ваш телефон.';
		if (!fields.email) errors.email = 'Пожалуйста, введите вашу эл. почту.';
		else if (!isEmail(fields.email)) errors.email = 'Пожалуйста, введите корректный email.';
		if (!fields.church) errors.church = 'Пожалуйста, выберите вашу церковь.';
		else if (fields.church === 'other' && !fields.churchOther) {
			errors.churchOther = 'Пожалуйста, введите название вашей церкви.';
		}
		if (!fields.role) errors.role = 'Пожалуйста, выберите ваш статус в молодежном служении.';
		else if (fields.role === 'other' && !fields.roleOther) {
			errors.roleOther = 'Пожалуйста, укажите ваш статус.';
		}
		if (!fields.paid) errors.paid = 'Пожалуйста, подтвердите оплату.';

		if (Object.keys(errors).length) {
			console.log('Validation errors:', errors);
			return fail(400, { form: { errors, fields } });
		}

		// Determine final values
		const finalChurch = fields.church === 'other' ? fields.churchOther : fields.church;
		const finalRole = fields.role === 'other' ? fields.roleOther : fields.role;

		// Persist to database
		const formData = {
			formName: '2026-youth-leaders-seminar-ao',
			firstName: fields.firstName,
			lastName: fields.lastName,
			email: fields.email,
			phone: fields.phone,
			content: {
				church: finalChurch,
				role: finalRole,
				notes: fields.notes,
				paid: fields.paid
			}
		};

		try {
			const returnedFormData = await db
				.insert(formSubmissions)
				.values({ ...formData, createdAt: new Date(), updatedAt: new Date() })
				.returning();

			console.log('Form submitted successfully:', returnedFormData);

			return {
				message:
					'Спасибо! Мы получили вашу регистрацию. Мы свяжемся с вами по электронной почте после ручного подтверждения оплаты.',
				fields: {}
			};
		} catch (error) {
			console.error('Database error:', error);
			return fail(500, {
				form: {
					formError: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.',
					fields
				}
			});
		}
	}
};
