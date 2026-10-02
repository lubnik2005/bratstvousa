import { fail } from '@sveltejs/kit';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';
import { sendEmail } from '$lib/server/email';
import { site } from '$lib/content/site';
import type { Actions } from './$types';

export const prerender = false;

function esc(v: string) {
	return v
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export const actions: Actions = {
	default: async ({ request, platform, getClientAddress }) => {
		const form = await request.formData();

		// Honeypot: real users never fill this.
		if ((form.get('company') as string)?.trim()) {
			return { success: true };
		}

		const fullName = ((form.get('fullName') as string) ?? '').trim();
		const groupName = ((form.get('groupName') as string) ?? '').trim();
		const email = ((form.get('email') as string) ?? '').trim();
		const phone = ((form.get('phone') as string) ?? '').trim();
		const message = ((form.get('message') as string) ?? '').trim();
		const token = (form.get('cf-turnstile-response') as string) ?? null;

		const values = { fullName, groupName, email, phone, message };

		if (!fullName || !email) {
			return fail(400, { ...values, error: 'Please provide your name and email.' });
		}
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			return fail(400, { ...values, error: 'Please provide a valid email address.' });
		}

		const env = platform?.env ?? {};
		const turnstile = await verifyTurnstile(
			token,
			env.TURNSTILE_SECRET,
			getClientAddress(),
			'contact',
			env.TURNSTILE_HOSTNAMES
		);
		if (!turnstile.ok) {
			return fail(400, { ...values, error: TURNSTILE_ERROR_MESSAGE });
		}

		const to = env.CONTACT_TO || site.email;
		const html = `
			<h2>New inquiry from camp-paradise.org</h2>
			<p><strong>Name:</strong> ${esc(fullName)}</p>
			${groupName ? `<p><strong>Group:</strong> ${esc(groupName)}</p>` : ''}
			<p><strong>Email:</strong> ${esc(email)}</p>
			${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ''}
			${message ? `<p><strong>Message:</strong></p><p>${esc(message).replace(/\n/g, '<br>')}</p>` : ''}
		`;

		try {
			await sendEmail(env, to, `Camp Paradise inquiry from ${fullName}`, html, email);
		} catch (err) {
			console.error('contact send failed:', err);
			return fail(500, {
				...values,
				error: 'Something went wrong sending your message. Please try again or call us.'
			});
		}

		return { success: true };
	}
};
