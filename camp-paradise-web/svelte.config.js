import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter({
			// Only /contact has a server action; everything else is prerendered and
			// served as static assets. Scoping the function route avoids the
			// _routes.json exclude-limit warning and needless function invocations.
			routes: {
				include: ['/contact'],
				exclude: ['<prerendered>', '<build>']
			}
		})
	},
	extensions: ['.svelte']
};

export default config;
