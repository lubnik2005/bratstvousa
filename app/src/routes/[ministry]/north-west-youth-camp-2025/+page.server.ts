// +page.server.ts (or wherever you need it)
import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { formSubmissions } from '$lib/server/db/schema';

// Option A: using Drizzle's count() helper (if your version exports it)
import { count } from 'drizzle-orm';

const FORM = '2025-youth-north-west-camp';

// +page.server.ts
export const load = async () => {
	const [{ count: registration_count }] = await db
		.select({ count: count() })
		.from(formSubmissions)
		.where(eq(formSubmissions.formName, FORM));

	return {
		registration_count
	};
};

// registration_count is a number
