import { defineConfig } from 'drizzle-kit';

import { env } from '$env/dynamic/private';
const database_url = env.DATABASE_URL;
if (!database_url) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: database_url
	},

	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
