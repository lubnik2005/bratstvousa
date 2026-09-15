import { env } from '$env/dynamic/private';
import { emailLog } from '$lib/server/db/schema';
import type { AppDatabase } from '$lib/server/db';

/**
 * Sends an email via the Resend API and logs every attempt to the email_log
 * table so failed sends can be retried later. Throws on failure so callers
 * can treat it as best-effort.
 */
export async function sendEmail(db: AppDatabase, to: string, subject: string, html: string) {
	const fromEmail = env.MAIL_FROM ?? 'noreply@bratstvousa.com';
	const fromName = env.MAIL_FROM_NAME ?? 'Camp Paradise';
	const apiKey = env.RESEND_API_KEY;
	const now = new Date().toISOString();

	async function markLogged(status: string, lastError: string | null) {
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
			console.error('email_log insert failed:', err);
		}
	}

	try {
		if (!apiKey) {
			throw new Error('RESEND_API_KEY is not configured');
		}

		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${apiKey}`,
				'content-type': 'application/json'
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
