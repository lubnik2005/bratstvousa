import { defineConfig } from 'vitest/config';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Translation compilation is needed for builds, not the database/email unit suite.
		...(process.env.VITEST
			? []
			: [
					paraglideVitePlugin({
						project: './project.inlang',
						outdir: './src/lib/paraglide',
						emitTsDeclarations: true,
						strategy: ['url', 'baseLocale']
					})
				])
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
