<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { env } from '$env/dynamic/public';

	export let action: string;

	const siteKey = env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAEzKpCgc4kC9UW8O';
	const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

	let container: HTMLDivElement;
	let widgetId: string | undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function getApi(): any {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (globalThis as any).turnstile;
	}

	function loadScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (getApi()) return resolve();
			const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
			if (existing) {
				existing.addEventListener('load', () => resolve());
				existing.addEventListener('error', () => reject(new Error('turnstile script failed')));
				return;
			}
			const script = document.createElement('script');
			script.src = SCRIPT_SRC;
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('turnstile script failed'));
			document.head.appendChild(script);
		});
	}

	export function reset() {
		const api = getApi();
		if (api && widgetId !== undefined) api.reset(widgetId);
	}

	onMount(async () => {
		try {
			await loadScript();
			const api = getApi();
			if (api && container) {
				widgetId = api.render(container, { sitekey: siteKey, action });
			}
		} catch (err) {
			console.error(err);
		}
	});

	onDestroy(() => {
		const api = getApi();
		if (api && widgetId !== undefined) api.remove(widgetId);
	});
</script>

<div bind:this={container} class="cf-turnstile-widget"></div>
