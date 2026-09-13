import { env } from '$env/dynamic/private';

/**
 * Sends an email using the Resend API (Cloudflare Workers compatible via fetch).
 *
 * Uses the same verified sending domain (bratstvousa.com) and RESEND_API_KEY as
 * the Laravel Nova admin panel. The signature is unchanged so existing callers
 * (enroll, order-form) keep working.
 *
 * @param to - Recipient's email address
 * @param subject - Email subject
 * @param html - Email body (HTML)
 */
export async function sendEmail(to: string, subject: string, html: string) {
	const fromEmail = env.MAIL_FROM ?? 'noreply@bratstvousa.com';
	const fromName = env.MAIL_FROM_NAME ?? 'Bratstvo USA';
	const apiKey = env.RESEND_API_KEY;

	if (!apiKey) {
		throw new Error('RESEND_API_KEY is not configured');
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			from: `${fromName} <${fromEmail}>`,
			to: [to],
			subject,
			html
		})
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Resend error ${response.status}: ${text}`);
	}

	return response;
}
