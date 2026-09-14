import { fail } from '@sveltejs/kit';
import { formSubmissions } from '$lib/server/db/schema';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({});

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (s: FormDataEntryValue | null | undefined) =>
	(typeof s === 'string' ? s.trim() : '') || '';

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const db = locals.db;
		const fd = await request.formData();

		// Cloudflare Turnstile gate (before honeypot/validation)
		const ts = await verifyTurnstile(
			fd.get('cf-turnstile-response') as string | null,
			platform?.env?.TURNSTILE_SECRET_KEY,
			request.headers.get('cf-connecting-ip'),
			'camp_2025',
			platform?.env?.TURNSTILE_HOSTNAMES
		);
		if (!ts.ok) {
			return fail(403, { form: { message: TURNSTILE_ERROR_MESSAGE } });
		}

		// honeypot
		if (clean(fd.get('middle_name'))) {
			return { form: { message: 'Thanks! If this was submitted in error, no action is needed.' } };
		}

		const fields = {
			firstName: clean(fd.get('firstName')),
			lastName: clean(fd.get('lastName')),
			phone: clean(fd.get('phone')),
			email: clean(fd.get('email')),
			church: clean(fd.get('church')),
			emergency: clean(fd.get('emergency')),
			notes: clean(fd.get('notes')),
			consent: fd.get('consent') === 'on' ? 'on' : '',
			paid: fd.get('paid') === 'on' ? 'on' : ''
		};

		const errors: Record<string, string> = {};
		if (!fields.firstName) errors.firstName = 'Please enter your first name.';
		if (!fields.lastName) errors.lastName = 'Please enter your last name.';
		if (!fields.phone) errors.phone = 'Please enter your phone.';
		if (!fields.email) errors.email = 'Please enter your email.';
		if (!fields.church) errors.church = 'Please enter your church.';
		else if (!isEmail(fields.email)) errors.email = 'Please enter a valid email.';
		if (!fields.paid) errors.paid = 'Please confirm that you paid with memo "camp2025".';

		if (Object.keys(errors).length) {
			return fail(400, { form: { errors, fields } });
		}

		const now = new Date().toISOString();
		const formData = {
			formName: '2025-youth-north-west-camp',
			firstName: fields.firstName,
			lastName: fields.lastName,
			email: fields.email,
			phone: fields.phone,
			content: {
				church: fields.church,
				notes: fields.notes,
				consent: fields.consent,
				emergency: fields.emergency
			}
		};

		await db.insert(formSubmissions).values({ ...formData, createdAt: now, updatedAt: now });

		return {
			message:
				'Thank you! We received your registration. We will email you again once we have manually confirmed your payment.',
			fields: {}
		};
	}
};
