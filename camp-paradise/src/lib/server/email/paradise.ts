import { sendEmail } from '$lib/email';
import type { AppDatabase } from '$lib/server/db';

// Unambiguous alphabet (no 0/O/1/I/L) for human-friendly codes.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Generate a reservation code like PARADISE-7QK4T. */
export function generateConfirmationCode(): string {
	let s = '';
	for (let i = 0; i < 5; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
	return `PARADISE-${s}`;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function layout(title: string, body: string): string {
	return `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#1c2733">
<div style="max-width:560px;margin:0 auto;padding:24px">
	<div style="background:#00a76f;color:#fff;padding:20px 24px;font-size:20px;font-weight:700">Camp Paradise</div>
	<div style="background:#fff;padding:24px;border:1px solid #e6e8eb;border-top:none">
		<h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(title)}</h1>
		${body}
	</div>
	<p style="color:#8a94a0;font-size:12px;margin:16px 0 0;text-align:center">Camp Paradise registration</p>
</div></body></html>`;
}

/** Sent when a camper requests a one-time login code. */
export async function sendLoginCode(db: AppDatabase, email: string, code: string) {
	const body = `
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px">Use this code to sign in to Camp Paradise:</p>
		<div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f0fbf6;border:1px solid #c8fad6;color:#007867;border-radius:12px;padding:18px 0;text-align:center;margin:0 0 16px">${escapeHtml(code)}</div>
		<p style="font-size:14px;line-height:1.6;color:#6b7580;margin:0">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>`;
	return sendEmail(
		db,
		email,
		'Your Camp Paradise sign-in code',
		layout('Sign in to Camp Paradise', body)
	);
}

export interface ReservationEmailInfo {
	firstName: string;
	email: string;
	eventName: string;
	roomName: string;
	code: string;
	amount: number; // dollars
}

/** Sent after a payment succeeds and the bed is confirmed. */
export async function sendReservationConfirmed(db: AppDatabase, info: ReservationEmailInfo) {
	const body = `
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hi ${escapeHtml(info.firstName)},</p>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px">Your spot at <strong>${escapeHtml(info.eventName)}</strong> is confirmed. Thank you for registering!</p>
		<table style="border-collapse:collapse;margin:0 0 16px;font-size:14px">
			<tr><td style="padding:4px 12px 4px 0;color:#6b7580">Room</td><td style="padding:4px 0;font-weight:700">${escapeHtml(info.roomName)}</td></tr>
			<tr><td style="padding:4px 12px 4px 0;color:#6b7580">Amount paid</td><td style="padding:4px 0;font-weight:700">$${info.amount.toFixed(2)}</td></tr>
			<tr><td style="padding:4px 12px 4px 0;color:#6b7580">Confirmation</td><td style="padding:4px 0;font-weight:700">${escapeHtml(info.code)}</td></tr>
		</table>
		<p style="font-size:14px;line-height:1.6;color:#6b7580;margin:0">Keep your confirmation code — you'll need it to view or cancel your reservation.</p>`;
	return sendEmail(
		db,
		info.email,
		'Your Camp Paradise reservation is confirmed',
		layout('Reservation confirmed', body)
	);
}

export interface RefundEmailInfo {
	firstName: string;
	email: string;
	eventName: string;
	code: string;
	amount: number; // dollars refunded
}

/** Sent after a reservation is refunded/cancelled. */
export async function sendReservationRefunded(db: AppDatabase, info: RefundEmailInfo) {
	const body = `
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hi ${escapeHtml(info.firstName)},</p>
		<p style="font-size:15px;line-height:1.6;margin:0 0 16px">Your reservation for <strong>${escapeHtml(info.eventName)}</strong> (${escapeHtml(info.code)}) has been cancelled and a refund of <strong>$${info.amount.toFixed(2)}</strong> has been issued.</p>
		<p style="font-size:14px;line-height:1.6;color:#6b7580;margin:0">Refunds may take a few business days to appear on your statement.</p>`;
	return sendEmail(
		db,
		info.email,
		'Your Camp Paradise reservation was cancelled',
		layout('Reservation cancelled', body)
	);
}
