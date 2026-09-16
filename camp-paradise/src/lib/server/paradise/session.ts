import type { Cookies } from '@sveltejs/kit';

/**
 * Stateless, signed "registration session" stored in an HttpOnly cookie.
 *
 * Ties every room/bed lookup to a name + email + sex that the visitor has
 * already entered (and passed a Turnstile check for), so the room/bed
 * availability views can't be scraped by simply flipping a `?sex=` URL param.
 *
 * The payload is not encrypted (it only holds what the user just typed), but
 * it is HMAC-signed so it cannot be forged or tampered with. No DB row is
 * created until the user actually holds a bed.
 */

export const REG_COOKIE = 'cp_reg';
const TTL_MS = 30 * 60 * 1000; // 30 minutes

export type RegistrationIdentity = {
	eventId: number;
	firstName: string;
	lastName: string;
	email: string;
	sex: 'm' | 'f';
};

type SessionPayload = RegistrationIdentity & { exp: number };

const encoder = new TextEncoder();

function base64urlEncode(bytes: Uint8Array): string {
	let bin = '';
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str: string): Uint8Array {
	const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
	const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
}

async function importKey(secret: string): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
}

async function sign(data: string, secret: string): Promise<string> {
	const key = await importKey(secret);
	const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
	return base64urlEncode(new Uint8Array(sig));
}

/** Constant-time-ish comparison to avoid trivial timing leaks. */
function safeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

/** Produce the signed cookie value for an identity. */
export async function signSession(identity: RegistrationIdentity, secret: string): Promise<string> {
	const payload: SessionPayload = { ...identity, exp: Date.now() + TTL_MS };
	const body = base64urlEncode(encoder.encode(JSON.stringify(payload)));
	const sig = await sign(body, secret);
	return `${body}.${sig}`;
}

/**
 * Verify and decode the registration cookie. Returns the identity only if the
 * signature is valid, the session hasn't expired, and (when `eventId` is
 * supplied) it matches the event being viewed. Otherwise returns null.
 */
export async function readSession(
	cookies: Cookies,
	secret: string,
	eventId?: number
): Promise<RegistrationIdentity | null> {
	const raw = cookies.get(REG_COOKIE);
	if (!raw) return null;

	const dot = raw.lastIndexOf('.');
	if (dot <= 0) return null;

	const body = raw.slice(0, dot);
	const sig = raw.slice(dot + 1);

	const expected = await sign(body, secret);
	if (!safeEqual(sig, expected)) return null;

	let payload: SessionPayload;
	try {
		payload = JSON.parse(new TextDecoder().decode(base64urlDecode(body)));
	} catch {
		return null;
	}

	if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
	if (payload.sex !== 'm' && payload.sex !== 'f') return null;
	if (typeof eventId === 'number' && payload.eventId !== eventId) return null;

	return {
		eventId: payload.eventId,
		firstName: payload.firstName,
		lastName: payload.lastName,
		email: payload.email,
		sex: payload.sex
	};
}

/** Set the signed registration cookie. */
export async function setSession(
	cookies: Cookies,
	identity: RegistrationIdentity,
	secret: string
): Promise<void> {
	const value = await signSession(identity, secret);
	cookies.set(REG_COOKIE, value, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: TTL_MS / 1000
	});
}

/** Clear the registration cookie ("start over"). */
export function clearSession(cookies: Cookies): void {
	cookies.delete(REG_COOKIE, { path: '/' });
}
