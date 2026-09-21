import { sendEmail } from '$lib/email';
import type { AppDatabase } from '$lib/server/db';

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
			Bratstvo USA &middot; Осенний молодёжный лагерь СЗР 2026
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
export async function sendRegistrantThankYou(db: AppDatabase, registrant: RegistrantInfo) {
	const name = escapeHtml(registrant.firstName);
	const code = escapeHtml(registrant.confirmationCode);
	const html = layout(`
		<h1 style="font-size:20px;margin:0 0 16px;">Спасибо за регистрацию, ${name}!</h1>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			Мы получили вашу заявку на участие в осеннем молодёжном лагере СЗР 2026.
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
	return sendEmail(db, registrant.email, 'Регистрация в лагерь получена', html);
}

export interface LeaderApprovalRequest {
	leaderEmail: string;
	leaderName: string;
	registrant: RegistrantInfo;
	approvalUrl: string;
}

/** Email #1b: approval request to the assigned youth leader. */
export async function sendLeaderApprovalRequest(db: AppDatabase, req: LeaderApprovalRequest) {
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
			в осеннем молодёжном лагере СЗР 2026, назначенная на вас.
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
	return sendEmail(db, req.leaderEmail, 'Новая заявка на лагерь — требуется одобрение', html);
}

/**
 * Builds the Zeffy checkout URL, appending the registration code as a query
 * parameter so Zeffy can pre-populate the "Registration Code" field where
 * supported (spec §9). Manual entry is still requested in the email body as a
 * fallback, since custom-question prefill is not guaranteed by Zeffy — the
 * webhook recovers the code from the submitted answers regardless.
 */
export function buildZeffyUrl(baseUrl: string, confirmationCode: string): string {
	if (!baseUrl || baseUrl === '#') return baseUrl || '#';
	try {
		const u = new URL(baseUrl);
		// Common Zeffy prefill params; harmless if Zeffy ignores unknown keys.
		u.searchParams.set('registrationCode', confirmationCode);
		u.searchParams.set('code', confirmationCode);
		return u.toString();
	} catch {
		// baseUrl isn't a valid absolute URL — return unchanged.
		return baseUrl;
	}
}

export interface ApprovedInfo {
	registrant: RegistrantInfo;
	zeffyUrl: string;
	/** When true, the registrant pays cash at check-in (Zeffy total will be $0). */
	cashEligible?: boolean;
	/**
	 * Price snapshot from the registration (cents). For cash-eligible
	 * registrants this is the amount owed in cash at the door; otherwise it is
	 * what they pay on Zeffy. Omitted => no amount is shown.
	 */
	eventPriceCents?: number | null;
}

/** Email #2: sent to the registrant when the leader approves. */
export async function sendRegistrantApproved(db: AppDatabase, info: ApprovedInfo) {
	const r = info.registrant;
	const name = escapeHtml(r.firstName);
	const code = escapeHtml(r.confirmationCode);
	// Prefill the code into the Zeffy link (best-effort); manual entry still asked.
	const zeffyUrl = buildZeffyUrl(info.zeffyUrl, r.confirmationCode);
	const price =
		info.eventPriceCents != null && Number.isFinite(info.eventPriceCents)
			? formatUsd(info.eventPriceCents)
			: null;

	// Cash-eligible registrants get a $0 Zeffy checkout and pay the full price
	// at the event. Everyone else pays their (possibly church-subsidised) amount
	// online, so we just state the amount and never mention "$0".
	let paymentNote: string;
	if (info.cashEligible) {
		const owed = price ? `<strong>${price}</strong> вы оплатите` : 'оплату за лагерь вы внесёте';
		paymentNote = `<p style="font-size:15px;line-height:1.6;margin:0 0 16px;padding:12px 16px;background:#fef9c3;border-radius:6px;">
				<strong>Оплата на месте:</strong> при оформлении сумма составит <strong>$0</strong> —
				${owed} наличными при регистрации на месте. Билет с QR-кодом
				придёт вам от Zeffy после оформления.
			</p>`;
	} else if (price) {
		paymentNote = `<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
				<strong>К оплате:</strong> ${price}
			</p>`;
	} else {
		paymentNote = '';
	}
	const buttonLabel = info.cashEligible
		? 'Получить билет (оплата на месте)'
		: 'Завершить регистрацию и оплатить';

	const html = layout(`
		<h1 style="font-size:20px;margin:0 0 16px;">Ваша заявка одобрена, ${name}!</h1>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			Отличные новости — ваша заявка на осенний молодёжный лагерь СЗР 2026
			была одобрена. Остался последний шаг: завершить регистрацию.
		</p>
		${paymentNote}
		<p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
			Перейдите по ссылке ниже и укажите ваш регистрационный код при оформлении:
		</p>
		<p style="font-size:24px;font-weight:bold;letter-spacing:2px;margin:0 0 20px;color:#2563eb;">${code}</p>
		<a href="${escapeHtml(zeffyUrl)}"
			style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:bold;">
			${buttonLabel}
		</a>
		<p style="font-size:13px;line-height:1.6;margin:20px 0 0;color:#71717a;">
			Обязательно укажите код <strong>${code}</strong> при оформлении, чтобы мы
			могли связать вашу заявку с билетом.
		</p>
	`);
	return sendEmail(db, r.email, 'Заявка одобрена — завершите регистрацию', html);
}

export interface UnmatchedPaymentInfo {
	email: string;
	firstName?: string | null;
}

/**
 * Sent when a Zeffy payment cannot be linked to any camp registration.
 * The payer WAS charged, so this is not a "payment failed" message — it tells
 * them we couldn't link the payment and that they must have a registration to
 * attend, directing them to contact Vadim Neyman.
 */
export async function sendUnmatchedPayment(db: AppDatabase, info: UnmatchedPaymentInfo) {
	const name = escapeHtml(info.firstName || '').trim();
	const greeting = name ? `Здравствуйте, ${name}!` : 'Здравствуйте!';
	const html = layout(`
		<h1 style="font-size:20px;margin:0 0 16px;">Не удалось связать ваш платёж с регистрацией</h1>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			Мы получили вашу оплату за Осенний молодёжный лагерь СЗР 2026, но не смогли
			связать её ни с одной регистрацией. Без действующей регистрации участие в
			лагере невозможно.
		</p>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			Пожалуйста, свяжитесь с Вадимом Нейманом, написав на
			<a href="mailto:youth@bratstvousa.com">youth@bratstvousa.com</a>, чтобы мы
			помогли разобраться и оформить вашу регистрацию.
		</p>
	`);
	return sendEmail(db, info.email, 'Проблема с оплатой — Осенний молодёжный лагерь СЗР 2026', html);
}

export interface DuplicatePaymentInfo {
	buyerEmail: string | null;
	buyerFirstName?: string | null;
	registrationId: number;
	confirmationCode: string | null;
	/** Amount of the EXTRA (duplicate) Zeffy payment, in cents. */
	amountCents: number;
	zeffyPaymentId: string;
	existingZeffyPaymentId: string;
}

const ORGANIZER_EMAIL = 'youth@bratstvousa.com';

function formatUsd(cents: number): string {
	return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Sent when a second Zeffy payment/ticket arrives for a registration that is
 * already linked to another payment (spec §23). Two emails:
 *   - buyer: only one ticket is valid; the extra payment will be refunded.
 *   - organizers: someone needs to refund the extra payment in Zeffy.
 * Neither failure blocks the other.
 */
export async function sendDuplicatePaymentNotice(db: AppDatabase, info: DuplicatePaymentInfo) {
	const code = escapeHtml(info.confirmationCode ?? '—');
	const amount = formatUsd(info.amountCents);
	const results: Array<{ ok: boolean }> = [];

	if (info.buyerEmail) {
		const name = escapeHtml(info.buyerFirstName || '').trim();
		const greeting = name ? `Здравствуйте, ${name}!` : 'Здравствуйте!';
		const paidLine =
			info.amountCents > 0
				? `Второй платёж на сумму <strong>${amount}</strong> будет возвращён на ту же карту в течение нескольких дней.`
				: 'Второй билет был оформлен бесплатно (со скидочным кодом); возвращать ничего не нужно.';
		const html = layout(`
			<h1 style="font-size:20px;margin:0 0 16px;">Получен повторный билет</h1>
			<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
			<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
				Мы получили <strong>второй</strong> билет Zeffy для регистрации с кодом
				<strong>${code}</strong> на Осенний молодёжный лагерь СЗР 2026.
				Ваша регистрация уже была привязана к первому билету — действителен только он.
			</p>
			<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${paidLine}</p>
			<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
				Если вы хотели зарегистрировать <em>другого</em> человека, ему нужно
				заполнить отдельную заявку на сайте и получить свой собственный код.
				Вопросы — на <a href="mailto:${ORGANIZER_EMAIL}">${ORGANIZER_EMAIL}</a>.
			</p>
		`);
		results.push(
			await sendEmail(
				db,
				info.buyerEmail,
				'Повторный билет — Осенний молодёжный лагерь СЗР 2026',
				html
			)
		);
	}

	const orgHtml = layout(`
		<h1 style="font-size:20px;margin:0 0 16px;">Duplicate Zeffy payment</h1>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
			A second Zeffy payment arrived for registration <strong>#${info.registrationId}</strong>
			(code <strong>${code}</strong>). The registration stays linked to the first payment;
			the new one was recorded as <strong>duplicate</strong> and NOT applied.
		</p>
		<table style="font-size:14px;line-height:1.6;border-collapse:collapse;">
			<tr><td style="padding:2px 12px 2px 0;color:#555;">Buyer</td><td>${escapeHtml(info.buyerEmail ?? '—')}</td></tr>
			<tr><td style="padding:2px 12px 2px 0;color:#555;">Extra amount</td><td>${amount}</td></tr>
			<tr><td style="padding:2px 12px 2px 0;color:#555;">Duplicate payment</td><td>${escapeHtml(info.zeffyPaymentId)}</td></tr>
			<tr><td style="padding:2px 12px 2px 0;color:#555;">Original payment</td><td>${escapeHtml(info.existingZeffyPaymentId)}</td></tr>
		</table>
		<p style="font-size:15px;line-height:1.6;margin:16px 0 0;">
			${
				info.amountCents > 0
					? 'Action: refund the duplicate payment in Zeffy. The registration will not be affected by that refund.'
					: 'No money to refund ($0 checkout). Consider voiding the extra ticket in Zeffy so it cannot be scanned.'
			}
			In the admin panel see Camp Registrations → #${info.registrationId} → Zeffy Payments.
		</p>
	`);
	results.push(
		await sendEmail(
			db,
			ORGANIZER_EMAIL,
			`[Camp] Duplicate payment for ${info.confirmationCode ?? `registration #${info.registrationId}`}`,
			orgHtml
		)
	);

	return { ok: results.every((r) => r.ok) };
}
