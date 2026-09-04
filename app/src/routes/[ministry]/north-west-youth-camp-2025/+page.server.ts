import { eq } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { formSubmissions } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

const FORM = '2025-youth-north-west-camp';

export const load: PageServerLoad = async ({ locals }) => {
	const [{ count: registration_count }] = await locals.db
		.select({ count: count() })
		.from(formSubmissions)
		.where(eq(formSubmissions.formName, FORM));

	return {
		registration_count
	};
};
