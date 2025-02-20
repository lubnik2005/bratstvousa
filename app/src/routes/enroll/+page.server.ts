import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { churches, formSubmissions, FormSubmission } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	return {
		churches: (await db.select().from(churches).orderBy(desc(churches.state))).sort((a, b) => {
			const stateA = a.city.split(', ')[1];
			const stateB = b.city.split(', ')[1];

			if (stateA < stateB) return -1;
			if (stateA > stateB) return 1;

			// If states are the same, compare cities
			const cityA = a.city.split(', ')[0];
			const cityB = b.city.split(', ')[0];
			return cityA.localeCompare(cityB);
		}),
		media_url: env.MEDIA_URL
	};
}

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		console.log('formdata');
		console.log({ data });

		const form_submission = await db
			.insert(formSubmissions)
			.values({
				formName: '2025-bible-school-application',
				firstName: data.get('first_name'),
				lastName: data.get('last_name'),
				middleName: data.get('middle_name'),
				email: data.get('email'),
				phone: data.get('phone'),
				dateOfBirth: data.get('date_of_birth')
					? new Date(data.get('date_of_birth')).toISOString().split('T')[0]
					: null,
				churchId: data.get('church') !== 'other' ? Number(data.get('church')) : null,
				content: JSON.parse(
					JSON.stringify({
						age: data.get('age') ? Number(data.get('age')) : null,
						educationHistory: data.get('education_history'),
						newChurch: data.get('church') === 'other' ? data.get('new_church') : null,
						ministry: data.get('ministry'),
						recommendation: data.get('recommendation'),
						responsibleMinister: data.get('responsible_minister')
					})
				),
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning(); // Returns the inserted row (optional)
		console.log({ form_submission });
	}
};
