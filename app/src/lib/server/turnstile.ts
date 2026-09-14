// Cloudflare Turnstile server-side verification.
//
// "Gate, don't replace": each form action calls verifyTurnstile() BEFORE its
// existing logic and rejects on failure.
//
// Fail-open vs fail-closed:
//   - If no secret is configured (e.g. local `npm run dev`), verification
//     passes so development is not blocked.
//   - In production the secret IS set (Cloudflare Pages secret), so a missing
//     or invalid token is rejected (fail-closed).

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
	ok: boolean;
	reason?: string;
}

interface SiteverifyResponse {
	success: boolean;
	action?: string;
	hostname?: string;
	'error-codes'?: string[];
}

/**
 * Verify a Turnstile token against Cloudflare's siteverify API.
 *
 * @param token         The 'cf-turnstile-response' value from the form.
 * @param secret        TURNSTILE_SECRET_KEY (undefined => fail-open for local dev).
 * @param ip            Client IP (cf-connecting-ip), optional.
 * @param expectedAction The data-action set on the widget for this form.
 * @param hostnamesCsv  Comma-separated allowed hostnames (TURNSTILE_HOSTNAMES).
 */
export async function verifyTurnstile(
	token: string | null | undefined,
	secret: string | undefined,
	ip: string | null | undefined,
	expectedAction: string,
	hostnamesCsv: string | undefined
): Promise<TurnstileResult> {
	// Fail-open when unconfigured (local dev).
	if (!secret) {
		return { ok: true, reason: 'no-secret-configured' };
	}

	if (!token || typeof token !== 'string' || token.length < 1 || token.length > 2048) {
		return { ok: false, reason: 'missing-token' };
	}

	const allowedHostnames = new Set(
		(hostnamesCsv ?? '')
			.split(',')
			.map((h) => h.trim())
			.filter(Boolean)
	);
	if (allowedHostnames.size === 0) {
		// Misconfiguration: refuse rather than trust an unbounded hostname.
		return { ok: false, reason: 'no-hostnames-configured' };
	}

	const body = new URLSearchParams();
	body.set('secret', secret);
	body.set('response', token);
	if (ip) body.set('remoteip', ip);

	let data: SiteverifyResponse;
	try {
		const res = await fetch(SITEVERIFY_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body,
			signal: AbortSignal.timeout(10000)
		});
		data = (await res.json()) as SiteverifyResponse;
	} catch {
		return { ok: false, reason: 'siteverify-unreachable' };
	}

	if (!data.success) {
		return { ok: false, reason: (data['error-codes'] ?? []).join(',') || 'verification-failed' };
	}
	if (data.action !== expectedAction) {
		return { ok: false, reason: 'action-mismatch' };
	}
	if (!data.hostname || !allowedHostnames.has(data.hostname)) {
		return { ok: false, reason: 'hostname-mismatch' };
	}

	return { ok: true };
}

/** Russian error message shown to users when the check fails. */
export const TURNSTILE_ERROR_MESSAGE =
	'Проверка безопасности не пройдена. Обновите страницу и попробуйте ещё раз.';
