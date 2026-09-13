import { sendEmail } from '$lib/email';

/**
 * Camp registration email workflow.
 *
 * Flow:
 *   1. Registrant submits -> thank-you email (with confirmation code) + leader
 *      approval-request email (with full registrant info + magic approval link).
 *   2. Leader approves -> registrant gets the Zeffy payment email (with code).
 *   3. Leader rejects -> registrant receives nothing further.
 *
 * The confirmation code is generated at submission time so a rejection simply
 * never results in the code being used for payment.
 */

// Unambiguous uppercase alphanumerics: excludes 0/O, 1/I/L to avoid confusion
// when a registrant re-types the code into Zeffy.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Generates a confirmation code like "CAMP-7K3QF". */
export function generateConfirmationCode(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(5));
	let code = '';
	for (const b of bytes) {
		code += CODE_ALPHABET[b % CODE_ALPHABET.length];
	}
	return `CAMP-${code}`;
}

/** Generates a high-entropy hex token for the approval magic link. */
export function generateApprovalToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function layout(bodyHtml: string): string {
	return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
	<div style="max-width:560px;margin:0 auto;padding:24px;">
		<div style="background:#ffffff;border-radius:8px;padding:32px;">
			${bodyHtml}
		</div>
		<p style="text-align:center;color:#a1a1aa;font-size:12px;margin-top:16px;">
			Bratstvo USA &middot; Зимний молодёжный лагерь СЗР 2026
		</p>
	</div>
</body>
</html>`;
}

export interface RegistrantInfo {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string | null;
	church?: string | null;
	confirmationCode: string;
}

/** Email #1a: thank-you to the registrant, sent immediately at submission. */
export async function sendRegistrantThankYou(registrant: RegistrantInfo) {
	const name = escapeHtml(registrant.firstName);
	const code = escapeHtml(registrant.confirmationCode);
	const html = layout(`
		<h1 style="font-size:20px;margin:0 0 16px;">Спасибо за регистрацию, ${name}!</h1>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			Мы получили вашу заявку на участие в зимнем молодёжном лагере СЗР 2026.
			Ваш ответственный за молодёжь рассмотрит заявку и подтвердит её.
		</p>
		<p style="font-size:15px;line-height:1.6;margin:0 0 8px;">Ваш регистрационный код:</p>
		<p style="font-size:24px;font-weight:bold;letter-spacing:2px;margin:0 0 16px;color:#2563eb;">${code}</p>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			<strong>Что дальше:</strong> как только вашу заявку одобрят, вы получите
			ещё одно письмо со ссылкой для завершения регистрации и оплаты.
			Сохраните код выше — он понадобится при оплате.
		</p>
	`);
	return sendEmail(registrant.email, 'Регистрация в лагерь получена', html);
}

export interface LeaderApprovalRequest {
	leaderEmail: string;
	leaderName: string;
	registrant: RegistrantInfo;
	approvalUrl: string;
}

/** Email #1b: approval request to the assigned youth leader. */
export async function sendLeaderApprovalRequest(req: LeaderApprovalRequest) {
	const r = req.registrant;
	const rows = [
		['Имя', `${r.firstName} ${r.lastName}`],
		['Email', r.email],
		['Телефон', r.phone || '—'],
		['Церковь', r.church || '—'],
		['Код', r.confirmationCode]
	]
		.map(
			([label, value]) =>
				`<tr>
					<td style="padding:6px 12px 6px 0;color:#71717a;font-size:14px;">${escapeHtml(label)}</td>
					<td style="padding:6px 0;font-size:14px;font-weight:bold;">${escapeHtml(value)}</td>
				</tr>`
		)
		.join('');

	const html = layout(`
		<h1 style="font-size:20px;margin:0 0 16px;">Новая заявка на лагерь</h1>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			Здравствуйте, ${escapeHtml(req.leaderName)}! Поступила новая заявка на участие
			в зимнем молодёжном лагере СЗР 2026, назначенная на вас.
		</p>
		<table style="border-collapse:collapse;margin:0 0 24px;">${rows}</table>
		<a href="${escapeHtml(req.approvalUrl)}"
			style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:bold;">
			Просмотреть и одобрить
		</a>
		<p style="font-size:13px;line-height:1.6;margin:20px 0 0;color:#71717a;">
			На странице вы сможете одобрить или отклонить заявку. После одобрения
			участник получит письмо со ссылкой для оплаты.
		</p>
	`);
	return sendEmail(req.leaderEmail, 'Новая заявка на лагерь — требуется одобрение', html);
}

export interface ApprovedInfo {
	registrant: RegistrantInfo;
	zeffyUrl: string;
}

/** Email #2: sent to the registrant when the leader approves. */
export async function sendRegistrantApproved(info: ApprovedInfo) {
	const r = info.registrant;
	const name = escapeHtml(r.firstName);
	const code = escapeHtml(r.confirmationCode);
	const html = layout(`
		<h1 style="font-size:20px;margin:0 0 16px;">Ваша заявка одобрена, ${name}!</h1>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			Отличные новости — ваша заявка на зимний молодёжный лагерь СЗР 2026
			была одобрена. Остался последний шаг: завершить регистрацию оплатой.
		</p>
		<p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
			Перейдите по ссылке ниже и введите ваш регистрационный код при оплате:
		</p>
		<p style="font-size:24px;font-weight:bold;letter-spacing:2px;margin:0 0 20px;color:#2563eb;">${code}</p>
		<a href="${escapeHtml(info.zeffyUrl)}"
			style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:bold;">
			Завершить регистрацию и оплатить
		</a>
		<p style="font-size:13px;line-height:1.6;margin:20px 0 0;color:#71717a;">
			Обязательно укажите код <strong>${code}</strong> при оплате, чтобы мы
			могли связать ваш платёж с заявкой.
		</p>
	`);
	return sendEmail(r.email, 'Заявка одобрена — завершите регистрацию', html);
}
