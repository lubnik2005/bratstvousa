import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth.js';
import { createDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { getTextDirection } from '$lib/paraglide/runtime';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) =>
		resolve(
			{ ...event, request },
			{
				transformPageChunk: ({ html }) =>
					html.replace('%lang%', locale).replace('%dir%', getTextDirection(locale))
			}
		)
	);

const handleDb: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env?.DB) {
		throw new Error('D1 database binding (DB) not found. Check wrangler.toml configuration.');
	}
	event.locals.db = createDb(event.platform.env.DB);
	return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(event.locals.db, sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	// Authenticated responses must never enter shared or offline caches.
	if (event.cookies.get(auth.sessionCookieName)) {
		response.headers.set('Cache-Control', 'private, no-store');
	}

	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
	response.headers.set('Strict-Transport-Security', 'max-age=86400; includeSubDomains');
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

	return response;
};

export const handle: Handle = sequence(
	handleParaglide,
	handleDb,
	handleAuth,
	handleSecurityHeaders
);
