<script lang="ts">
	import { localizeUrl, type Locale } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';

	function switchToLanguage(newLanguage: Locale) {
		window.location.href = localizeUrl(page.url, { locale: newLanguage }).href;
	}
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => switchToLanguage('en')}>en</button>
	<button onclick={() => switchToLanguage('ru')}>ru</button>
	<button onclick={() => switchToLanguage('uk')}>uk</button>
</div>
