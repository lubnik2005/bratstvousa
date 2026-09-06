import { env } from '$env/dynamic/private';

/**
 * Sends an email using MailChannels API (Cloudflare Workers compatible).
 * @param to - Recipient's email address
 * @param subject - Email subject
 * @param html - Email body (HTML)
 */
export async function sendEmail(to: string, subject: string, html: string) {
	const fromEmail = env.MAIL_FROM ?? 'noreply@bratstvousa.org';
	const fromName = env.MAIL_FROM_NAME ?? 'Bratstvo USA';

	const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			personalizations: [
				{
					to: [{ email: to }]
				}
			],
			from: {
				email: fromEmail,
				name: fromName
			},
			subject,
			content: [
				{
					type: 'text/html',
					value: html
				}
			]
		})
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`MailChannels error ${response.status}: ${text}`);
	}

	return response;
}
