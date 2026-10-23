import { defineConfig } from 'vitest/config';
import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Unit tests do not compile translations; the legacy plugin keeps network handles open.
		...(process.env.VITEST
			? []
			: [
					paraglide({
						project: './project.inlang',
						outdir: './src/lib/paraglide'
					})
				])
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
