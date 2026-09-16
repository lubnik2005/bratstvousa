import { fail, redirect } from '@sveltejs/kit';
import {
	findAttendeeByEmail,
	upsertAttendee,
	markAttendeeLogin
} from '$lib/server/paradise/queries';
import { issueLoginCode, verifyLoginCode } from '$lib/server/paradise/auth';
import { verifyTurnstile, TURNSTILE_ERROR_MESSAGE } from '$lib/server/turnstile';
import { readSession, setSession, clearSession } from '$lib/server/paradise/session';
import type { Actions, PageServerLoad } from './$types';

const clean = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const sessionSecret = (platform: App.Platform | undefined): string =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

// Keep the post-login redirect target on-site only, to avoid open-redirects.
const safeNext = (raw: string | null): string => {
	if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
	return '/account';
};

export const load: PageServerLoad = async ({ url, locals, cookies, platform, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-cache' });
	const next = safeNext(url.searchParams.get('next'));

	// Already signed in? Skip straight to the destination.
	const identity = await readSession(cookies, sessionSecret(platform));
	if (identity) throw redirect(303, next);

	return { next };
};

export const actions: Actions = {
	// Step 1: email + Turnstile -> email a 6-digit code. Neutral response.
	requestCode: async ({ request, locals, platform }) => {
		const db = locals.db;
		const fd = await request.formData();

		const ts = await verifyTurnstile(
			fd.get('cf-turnstile-response') as string | null,
			platform?.env?.TURNSTILE_SECRET_KEY,
			request.headers.get('cf-connecting-ip'),
			'paradise_login',
			platform?.env?.TURNSTILE_HOSTNAMES
		);
		if (!ts.ok) return fail(403, { message: TURNSTILE_ERROR_MESSAGE });

		const email = clean(fd.get('email'));

		// Honeypot: pretend a code was sent.
		if (clean(fd.get('middle_name'))) return { codeSent: true, email };

		if (!isEmail(email)) return fail(400, { emailError: 'A valid email is required.', email });

		await issueLoginCode(db, email);
		return { codeSent: true, email };
	},

	// Step 2: verify the code. Known camper -> sign in; new email -> profile.
	verifyCode: async ({ request, locals, cookies, platform }) => {
		const db = locals.db;
		const fd = await request.formData();

		const email = clean(fd.get('email'));
		const code = clean(fd.get('code'));
		if (!isEmail(email)) return fail(400, { codeError: 'Something went wrong. Start again.' });
		if (!/^\d{6}$/.test(code)) return fail(400, { codeError: 'Enter the 6-digit code.', email });

		const result = await verifyLoginCode(db, email, code);
		if (!result.ok) {
			const msg =
				result.reason === 'expired'
					? 'That code has expired. Request a new one.'
					: result.reason === 'too_many_attempts'
						? 'Too many attempts. Request a new code.'
						: 'That code is incorrect.';
			return fail(400, { codeError: msg, email });
		}

		const attendee = await findAttendeeByEmail(db, email);
		if (attendee) {
			await markAttendeeLogin(db, attendee.id);
			await setSession(
				cookies,
				{
					attendeeId: attendee.id,
					firstName: attendee.firstName,
					lastName: attendee.lastName,
					email: attendee.email,
					sex: attendee.sex as 'm' | 'f'
				},
				sessionSecret(platform)
			);
			return { signedIn: true };
		}

		return { needsProfile: true, email };
	},

	// Step 3 (new campers): create the account and sign in.
	profile: async ({ request, locals, cookies, platform }) => {
		const db = locals.db;
		const fd = await request.formData();

		const email = clean(fd.get('email'));
		const firstName = clean(fd.get('firstName'));
		const lastName = clean(fd.get('lastName'));
		const sex = clean(fd.get('sex'));

		const fields = { firstName, lastName };
		const errors: Record<string, string> = {};
		if (!isEmail(email)) errors.profile = 'Something went wrong. Start again.';
		if (!firstName) errors.firstName = 'First name is required.';
		if (!lastName) errors.lastName = 'Last name is required.';
		if (sex !== 'm' && sex !== 'f') errors.sex = 'Please choose who this is for.';
		if (Object.keys(errors).length) return fail(400, { profileErrors: errors, fields, email });

		const attendee = await upsertAttendee(db, {
			email,
			firstName,
			lastName,
			sex: sex as 'm' | 'f'
		});
		await setSession(
			cookies,
			{
				attendeeId: attendee.id,
				firstName: attendee.firstName,
				lastName: attendee.lastName,
				email: attendee.email,
				sex: attendee.sex as 'm' | 'f'
			},
			sessionSecret(platform)
		);
		return { signedIn: true };
	},

	// Start the sign-in over from the email step.
	reset: async ({ cookies }) => {
		clearSession(cookies);
		return { reset: true };
	}
};
