// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			db: import('drizzle-orm/d1').DrizzleD1Database;
		}
		interface Platform {
			env: {
				DB: D1Database;
				R2: R2Bucket;
				MEDIA_URL?: string;
				TURNSTILE_SECRET_KEY?: string;
				TURNSTILE_HOSTNAMES?: string;
				PUBLIC_TURNSTILE_SITE_KEY?: string;
			};
		}
	}
}

export {};
