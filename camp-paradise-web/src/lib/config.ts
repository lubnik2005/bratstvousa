// Public, build-time configuration.
//
// Uses `$env/static/public` so values are inlined at build time. This keeps the
// site fully static (no runtime `/_app/env.js` request that would need a Worker)
// and fails the build loudly if a required PUBLIC_* var is missing.
//
// Values come from `.env` (see `.env.example`); wrangler.toml [vars] are only
// used by the server-side /contact action at runtime.
import { PUBLIC_BOOKING_URL, PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

export const BOOKING_URL = PUBLIC_BOOKING_URL || 'https://camp-paradise.pages.dev/';
export const TURNSTILE_SITE_KEY = PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAEzKpCgc4kC9UW8O';
