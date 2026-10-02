// DB-less Resend email helper for the marketing site (no D1 here).
// Throws on failure so the caller can surface a friendly error.
export async function sendEmail(
	env: { RESEND_API_KEY?: string; MAIL_FROM?: string; MAIL_FROM_NAME?: string },
	to: string,
	subject: string,
	html: string,
	replyTo?: string
) {
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

	const fromEmail = env.MAIL_FROM ?? 'noreply@bratstvousa.com';
	const fromName = env.MAIL_FROM_NAME ?? 'Camp Paradise';

	const body: Record<string, unknown> = {
		from: `${fromName} <${fromEmail}>`,
		to: [to],
		subject,
		html
	};
	if (replyTo) body.reply_to = replyTo;

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			authorization: `Bearer ${apiKey}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Resend error ${response.status}: ${text}`);
	}
	return response;
}
