import { defineConfig } from 'drizzle-kit';
import { secret } from '@aws-amplify/backend';

const database_url =
	process.env.DATABASE_URL ?? (secret('DATABASE_URL') as unknown as string | undefined);
console.log('DATABASE_URL:', process.env.DATABASE_URL ?? secret('DATABASE_URL'));
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
