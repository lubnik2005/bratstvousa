import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		// The Threlte scene components intentionally read props once at init to
		// generate static geometry; the state_referenced_locally hint does not apply.
		files: ['src/lib/three/**/*.svelte'],
		rules: {
			'svelte/valid-compile': ['error', { ignoreWarnings: true }]
		}
	},
	{
		ignores: ['.svelte-kit/', 'build/', 'static/', 'node_modules/']
	}
);
