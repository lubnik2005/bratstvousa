import type { Cookies } from '@sveltejs/kit';

/**
 * Stateless, signed "camper session" stored in an HttpOnly cookie.
 *
 * Represents a verified camper account: the email has been proven via a
 * one-time login code, so every room/bed view and every reservation is tied
 * to a real, verified identity (closing the availability-scraping hole and
 * giving returning campers a persistent "My reservations" view).
 *
 * The payload is not encrypted (it only holds account profile fields), but it
 * is HMAC-signed so it cannot be forged or tampered with.
 */

export const REG_COOKIE = 'cp_session';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type CamperIdentity = {
	attendeeId: number;
	firstName: string;
	lastName: string;
	email: string;
	sex: 'm' | 'f';
};

type SessionPayload = CamperIdentity & { verified: true; exp: number };

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

/** Produce the signed cookie value for a verified camper identity. */
export async function signSession(identity: CamperIdentity, secret: string): Promise<string> {
	const payload: SessionPayload = { ...identity, verified: true, exp: Date.now() + TTL_MS };
	const body = base64urlEncode(encoder.encode(JSON.stringify(payload)));
	const sig = await sign(body, secret);
	return `${body}.${sig}`;
}

/**
 * Verify and decode the camper cookie. Returns the identity only if the
 * signature is valid and the session hasn't expired. Otherwise returns null.
 */
export async function readSession(
	cookies: Cookies,
	secret: string
): Promise<CamperIdentity | null> {
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
	if (typeof payload.attendeeId !== 'number') return null;

	return {
		attendeeId: payload.attendeeId,
		firstName: payload.firstName,
		lastName: payload.lastName,
		email: payload.email,
		sex: payload.sex
	};
}

/** Set the signed camper cookie. */
export async function setSession(
	cookies: Cookies,
	identity: CamperIdentity,
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

/** Clear the camper cookie ("sign out"). */
export function clearSession(cookies: Cookies): void {
	cookies.delete(REG_COOKIE, { path: '/' });
}
