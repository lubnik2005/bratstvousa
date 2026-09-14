<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { env } from '$env/dynamic/public';

	// data-action for this widget (1-32 chars, [A-Za-z0-9_-]); ties the token
	// to a specific form so the server can verify result.action.
	export let action: string;

	// Public site key. Prefer the build/runtime env var; fall back to the known
	// public key so the widget still renders if the var is missing.
	const siteKey = env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAEzKpCgc4kC9UW8O';

	const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

	let container: HTMLDivElement;
	let widgetId: string | undefined;

	interface TurnstileApi {
		render: (el: HTMLElement, opts: Record<string, unknown>) => string;
		reset: (id?: string) => void;
		remove: (id?: string) => void;
	}
	function getApi(): TurnstileApi | undefined {
		return (globalThis as unknown as { turnstile?: TurnstileApi }).turnstile;
	}

	function loadScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (getApi()) return resolve();
			const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
			if (existing) {
				existing.addEventListener('load', () => resolve(), { once: true });
				existing.addEventListener('error', () => reject(new Error('turnstile load failed')), {
					once: true
				});
				return;
			}
			const s = document.createElement('script');
			s.src = SCRIPT_SRC;
			s.async = true;
			s.defer = true;
			s.addEventListener('load', () => resolve(), { once: true });
			s.addEventListener('error', () => reject(new Error('turnstile load failed')), { once: true });
			document.head.appendChild(s);
		});
	}

	/** Reset the widget so it issues a fresh token (tokens are single-use). */
	export function reset() {
		const api = getApi();
		if (api && widgetId !== undefined) api.reset(widgetId);
	}

	onMount(async () => {
		try {
			await loadScript();
			const api = getApi();
			if (!api || !container) return;
			widgetId = api.render(container, {
				sitekey: siteKey,
				action
			});
		} catch {
			// If the script fails to load, the hidden input simply won't be
			// present; server-side verification will then reject the submit.
		}
	});

	onDestroy(() => {
		const api = getApi();
		if (api && widgetId !== undefined) {
			try {
				api.remove(widgetId);
			} catch {
				// ignore
			}
		}
	});
</script>

<div bind:this={container} class="cf-turnstile-widget"></div>
