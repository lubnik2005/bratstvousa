/**
 * Thin payment-provider abstraction. Stripe implementation uses the Stripe
 * REST API over fetch (Workers-compatible — NOT the Node SDK). Swapping to
 * Zeffy later means adding another PaymentProvider implementation.
 */

export interface CartMetadata {
	reservationId: number;
	eventId: number;
	cotId: number;
	email: string;
}

export interface CreateIntentResult {
	clientSecret: string;
	paymentIntentId: string;
}

export interface PaymentProvider {
	createPaymentIntent(amountCents: number, metadata: CartMetadata): Promise<CreateIntentResult>;
	refund(paymentIntentId: string, amountCents: number): Promise<void>;
	verifyWebhook(rawBody: string, signatureHeader: string | null): Promise<StripeEvent | null>;
}

export interface StripeEvent {
	id: string;
	type: string;
	data: { object: Record<string, unknown> };
}

const STRIPE_API = 'https://api.stripe.com/v1';

function form(params: Record<string, string>): string {
	return Object.entries(params)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&');
}

export class StripeProvider implements PaymentProvider {
	constructor(
		private secretKey: string,
		private webhookSecret: string
	) {}

	private async post(path: string, params: Record<string, string>) {
		const res = await fetch(`${STRIPE_API}${path}`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${this.secretKey}`,
				'content-type': 'application/x-www-form-urlencoded'
			},
			body: form(params)
		});
		const json = (await res.json()) as Record<string, unknown>;
		if (!res.ok) {
			const err = json.error as { message?: string } | undefined;
			throw new Error(`Stripe ${res.status}: ${err?.message ?? 'request failed'}`);
		}
		return json;
	}

	async createPaymentIntent(amountCents: number, metadata: CartMetadata): Promise<CreateIntentResult> {
		const json = await this.post('/payment_intents', {
			amount: String(amountCents),
			currency: 'usd',
			'automatic_payment_methods[enabled]': 'true',
			'metadata[reservationId]': String(metadata.reservationId),
			'metadata[eventId]': String(metadata.eventId),
			'metadata[cotId]': String(metadata.cotId),
			'metadata[email]': metadata.email
		});
		return {
			clientSecret: json.client_secret as string,
			paymentIntentId: json.id as string
		};
	}

	async refund(paymentIntentId: string, amountCents: number): Promise<void> {
		await this.post('/refunds', {
			payment_intent: paymentIntentId,
			amount: String(amountCents)
		});
	}

	/**
	 * Verify the Stripe-Signature header (t=...,v1=...) via HMAC-SHA256 of
	 * `${t}.${rawBody}` keyed with the webhook secret. Uses Web Crypto (Workers).
	 */
	async verifyWebhook(rawBody: string, signatureHeader: string | null): Promise<StripeEvent | null> {
		if (!signatureHeader) return null;
		const parts = Object.fromEntries(
			signatureHeader.split(',').map((p) => {
				const [k, ...rest] = p.split('=');
				return [k.trim(), rest.join('=')];
			})
		);
		const t = parts['t'];
		const v1 = parts['v1'];
		if (!t || !v1) return null;

		// 5-minute replay tolerance.
		const ts = Number(t);
		if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return null;

		const key = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(this.webhookSecret),
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['sign']
		);
		const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${rawBody}`));
		const expected = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');

		if (expected.length !== v1.length) return null;
		let diff = 0;
		for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
		if (diff !== 0) return null;

		try {
			return JSON.parse(rawBody) as StripeEvent;
		} catch {
			return null;
		}
	}
}

/** Build the configured provider from platform env (test or live keys). */
export function makeStripe(secretKey?: string, webhookSecret?: string): StripeProvider | null {
	if (!secretKey || !webhookSecret) return null;
	return new StripeProvider(secretKey, webhookSecret);
}
