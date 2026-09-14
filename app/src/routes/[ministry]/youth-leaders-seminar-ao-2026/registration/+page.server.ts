import { formSubmissions, churches } from '$lib/server/db/schema';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const churchesList = await locals.db.select().from(churches).orderBy(desc(churches.state));

	const sortedChurches = churchesList.sort((a, b) => {
		const stateA = a.city?.split(', ')[1] ?? '';
		const stateB = b.city?.split(', ')[1] ?? '';

		if (stateA < stateB) return -1;
		if (stateA > stateB) return 1;

		const cityA = a.city?.split(', ')[0] ?? '';
		const cityB = b.city?.split(', ')[0] ?? '';
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
	default: async ({ request, locals, platform }) => {
		const db = locals.db;
		console.log('Seminar 2026 registration submission started');
		const fd = await request.formData();

		// Cloudflare Turnstile gate (before honeypot/validation)
		const ts = await verifyTurnstile(
			fd.get('cf-turnstile-response') as string | null,
			platform?.env?.TURNSTILE_SECRET_KEY,
			request.headers.get('cf-connecting-ip'),
			'seminar_2026',
			platform?.env?.TURNSTILE_HOSTNAMES
		);
		if (!ts.ok) {
			return fail(403, { form: { formError: TURNSTILE_ERROR_MESSAGE, fields: {} } });
		}

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

		const finalChurch = fields.church === 'other' ? fields.churchOther : fields.church;
		const finalRole = fields.role === 'other' ? fields.roleOther : fields.role;

		const now = new Date().toISOString();
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
			await db.insert(formSubmissions).values({ ...formData, createdAt: now, updatedAt: now });
			console.log('Form submitted successfully');

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
