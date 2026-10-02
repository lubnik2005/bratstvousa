/**
 * Admin preview mode: a secret token (PARADISE_PREVIEW_TOKEN) passed as
 * `?preview=<token>` (or a `preview` form field) unlocks draft events so admins
 * can view and book them before they are published.
 */

/** Returns the token if it matches the configured secret, otherwise null. */
export function validPreviewToken(
	platform: App.Platform | undefined,
	candidate: FormDataEntryValue | string | null | undefined
): string | null {
	const secret = platform?.env?.PARADISE_PREVIEW_TOKEN;
	if (!secret || typeof candidate !== 'string' || candidate.length !== secret.length) return null;
	let diff = 0;
	for (let i = 0; i < secret.length; i++) diff |= secret.charCodeAt(i) ^ candidate.charCodeAt(i);
	return diff === 0 ? candidate : null;
}
