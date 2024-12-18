// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { env } from '$env/dynamic/private';
// console.log('env DATABASE_URL:', env.DATABASE_URL);
// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// const client = postgres(env.DATABASE_URL);
// export const db = drizzle(client);
//
//
import { secret } from '@aws-amplify/backend';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
console.log('env DATABASE_URL:', env.DATABASE_URL ?? secret('DATABASE_URL'));
const database_url = env.DATABASE_URL ?? (secret('DATABASE_URL') as unknown as string | undefined);

if (!database_url) throw new Error('DATABASE_URL is not set');
const client = postgres(database_url);
export const db = drizzle(client);
