import { sequence } from '@sveltejs/kit/hooks';
import { createDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

const handleDb: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env?.DB) {
		throw new Error('D1 database binding (DB) not found. Check wrangler.toml / platform bindings.');
	}
	event.locals.db = createDb(event.platform.env.DB);
	return resolve(event);
};

const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
	response.headers.set('Strict-Transport-Security', 'max-age=86400; includeSubDomains');
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	return response;
};

export const handle = sequence(handleDb, handleSecurityHeaders);
