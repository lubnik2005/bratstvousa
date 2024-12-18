// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { env } from '$env/dynamic/private';
// console.log('env DATABASE_URL:', env.DATABASE_URL);
// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// const client = postgres(env.DATABASE_URL);
// export const db = drizzle(client);
//

// WARNING: the above is the original, svelte uses env, instead of process.env

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
console.log('env DATABASE_URL:', process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

