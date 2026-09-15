import { env } from '$env/dynamic/private';
import { emailLog } from '$lib/server/db/schema';
import type { AppDatabase } from '$lib/server/db';

/**
 * Sends an email using the Resend API (Cloudflare Workers compatible via fetch).
 *
 * Uses the same verified sending domain (bratstvousa.com) and RESEND_API_KEY as
 * the Laravel Nova admin panel.
 *
 * Every attempt is recorded in the shared `email_log` D1 table so the Laravel
 * admin's hourly scheduler can retry rows that ended up 'failed' (transient
 * Resend errors / free-tier rate limits). On failure this still throws, so
 * existing best-effort callers behave exactly as before.
 *
 * @param db - D1 database handle (locals.db / createDb(platform.env.DB))
 * @param to - Recipient's email address
 * @param subject - Email subject
 * @param html - Email body (HTML)
 */
export async function sendEmail(db: AppDatabase, to: string, subject: string, html: string) {
	const fromEmail = env.MAIL_FROM ?? 'noreply@bratstvousa.com';
	const fromName = env.MAIL_FROM_NAME ?? 'Bratstvo USA';
	const apiKey = env.RESEND_API_KEY;

	const now = new Date().toISOString();

	const markLogged = async (status: 'sent' | 'failed', lastError: string | null) => {
		try {
			await db.insert(emailLog).values({
				toEmail: to,
				subject,
				html,
				status,
				attempts: 1,
				lastError,
				createdAt: now,
				updatedAt: now
			});
		} catch (err) {
			// Logging must never break the send path.
			console.error('email_log insert failed:', err);
		}
	};

	try {
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

		await markLogged('sent', null);
		return response;
	} catch (err) {
		await markLogged('failed', err instanceof Error ? err.message : String(err));
		throw err;
	}
}
