import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// When DEV_REMOTE=true (via `npm run dev:remote`), point the dev platform proxy
// at PRODUCTION D1 + R2 through Wrangler remote bindings. Otherwise dev uses the
// default local emulated bindings from wrangler.toml.
const useRemoteBindings = process.env.DEV_REMOTE === 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
			...(useRemoteBindings && {
				platformProxy: {
					configPath: 'wrangler.remote.toml',
					remoteBindings: true
				}
			})
		})
	},

	extensions: ['.svelte', '.svx']
};

export default config;
