// src/routes/[ministry]/north-west-youth-camp-2025/registration/+page.server.ts
import { db } from '$lib/server/db';
import { formSubmissions } from '$lib/server/db/schema';
import { error } from 'console';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => ({});

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (s: FormDataEntryValue | null | undefined) =>
	(typeof s === 'string' ? s.trim() : '') || '';

export const actions: Actions = {
	default: async ({ request }) => {
		console.log('POSTING');
		const fd = await request.formData();

		// honeypot
		if (clean(fd.get('middle_name'))) {
			return { form: { message: 'Thanks! If this was submitted in error, no action is needed.' } };
		}
		console.log('Got passed middle name');

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
		if (!fields.church) errors.email = 'Please enter your church.';
		else if (!isEmail(fields.email)) errors.email = 'Please enter a valid email.';
		// if (!fields.consent) errors.consent = 'Please confirm you filled out the consent form.';
		if (!fields.paid) errors.paid = 'Please confirm that you paid with memo “camp2025”.';

		console.log('Got passed error');

		if (Object.keys(errors).length) {
			console.log({ errors });
			return fail(400, { form: { errors, fields } });
		}

		console.log('Got passed error return');

		// Persist
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

		const returned_formed_data = await db
			.insert(formSubmissions)
			.values({ ...formData, createdAt: new Date(), updatedAt: new Date() })
			.returning();

		console.log({ returned_formed_data });
		console.log('FINISHED');

		return {
			message:
				'Thank you! We received your registration. We will email you again once we have manually confirmed your payment.',
			fields: {}
		};
	}
};
