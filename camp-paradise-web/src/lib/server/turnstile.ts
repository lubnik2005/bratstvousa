const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const TURNSTILE_ERROR_MESSAGE =
	'Security check failed. Please refresh the page and try again.';

export interface TurnstileResult {
	ok: boolean;
	reason?: string;
}

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Fails OPEN when no secret is configured (local dev); fails CLOSED in prod.
 */
export async function verifyTurnstile(
	token: string | null,
	secret: string | undefined,
	ip: string | null,
	expectedAction: string,
	hostnamesCsv: string | undefined
): Promise<TurnstileResult> {
	if (!secret) {
		return { ok: true, reason: 'no-secret-configured' };
	}

	if (!token || token.length < 1 || token.length > 2048) {
		return { ok: false, reason: 'missing-token' };
	}

	const hostnames = new Set(
		(hostnamesCsv ?? '')
			.split(',')
			.map((h) => h.trim())
			.filter(Boolean)
	);
	if (hostnames.size === 0) {
		return { ok: false, reason: 'no-hostnames-configured' };
	}

	const body = new URLSearchParams({ secret, response: token });
	if (ip) body.set('remoteip', ip);

	let data: {
		success?: boolean;
		action?: string;
		hostname?: string;
		'error-codes'?: string[];
	};
	try {
		const res = await fetch(SITEVERIFY_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body,
			signal: AbortSignal.timeout(10000)
		});
		data = await res.json();
	} catch {
		return { ok: false, reason: 'siteverify-unreachable' };
	}

	if (!data.success) {
		return { ok: false, reason: (data['error-codes'] ?? []).join(',') || 'verification-failed' };
	}
	if (data.action !== expectedAction) {
		return { ok: false, reason: 'action-mismatch' };
	}
	if (!data.hostname || !hostnames.has(data.hostname)) {
		return { ok: false, reason: 'hostname-mismatch' };
	}

	return { ok: true };
}
