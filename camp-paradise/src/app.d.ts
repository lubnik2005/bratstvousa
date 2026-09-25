// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			db: import('drizzle-orm/d1').DrizzleD1Database;
		}
		interface Platform {
			env: {
				DB: D1Database;
				MEDIA_URL?: string;
				TURNSTILE_SECRET_KEY?: string;
				TURNSTILE_HOSTNAMES?: string;
				PUBLIC_TURNSTILE_SITE_KEY?: string;
				ZEFFY_API_KEY?: string;
				ZEFFY_WEBHOOK_SECRET?: string;
				SESSION_SECRET?: string;
			};
		}
	}
}

export {};
