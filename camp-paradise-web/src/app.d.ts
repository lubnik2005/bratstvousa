// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Platform {
			env?: {
				TURNSTILE_SECRET?: string;
				TURNSTILE_HOSTNAMES?: string;
				PUBLIC_TURNSTILE_SITE_KEY?: string;
				RESEND_API_KEY?: string;
				MAIL_FROM?: string;
				MAIL_FROM_NAME?: string;
				CONTACT_TO?: string;
			};
			cf?: IncomingRequestCfProperties;
			ctx?: ExecutionContext;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
