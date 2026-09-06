import { env } from '$env/dynamic/private';
import { churches, formSubmissions } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { sendEmail } from '$lib/email';
import { email_template } from './email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const allChurches = await locals.db.select().from(churches).orderBy(desc(churches.state));
	return {
		churches: allChurches.sort((a, b) => {
			const stateA = a.city?.split(', ')[1] ?? '';
			const stateB = b.city?.split(', ')[1] ?? '';

			if (stateA < stateB) return -1;
			if (stateA > stateB) return 1;

			const cityA = a.city?.split(', ')[0] ?? '';
			const cityB = b.city?.split(', ')[0] ?? '';
			return cityA.localeCompare(cityB);
		}),
		media_url: env.MEDIA_URL
	};
};

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const db = locals.db;
		const data = await request.formData();

		// Handle photo upload to R2
		const personalPhoto = data.get('personal_photo') as File | null;
		let photoUrl = null;

		if (personalPhoto && personalPhoto.size > 0 && platform?.env?.R2) {
			const fileExtension = personalPhoto.name.split('.').pop();
			const fileName = `${crypto.randomUUID()}.${fileExtension}`;
			const key = `upfiles/photos/form/${fileName}`;

			try {
				await platform.env.R2.put(key, await personalPhoto.arrayBuffer(), {
					httpMetadata: { contentType: personalPhoto.type }
				});
				photoUrl = `${env.MEDIA_URL}${key}`;
			} catch (err) {
				console.error('Error uploading to R2:', err);
				return { success: false, error: 'Photo upload failed' };
			}
		}

		const churchId = data.get('church') !== 'other' ? Number(data.get('church')) : null;
		let church_name = null;
		if (churchId) {
			const cs = (await db.select().from(churches).where(eq(churches.id, churchId)).limit(1))[0];
			church_name = `${cs.id} - ${cs.name_line_1} ${cs.name_line_2 ?? ''}`;
		}
		const newChurch = data.get('church') === 'other' ? data.get('new_church') : null;
		church_name = church_name ?? (newChurch as string | null);

		const now = new Date().toISOString();
		const formData = {
			formName: '2026-bible-school-application',
			firstName: data.get('first_name') as string | null,
			lastName: data.get('last_name') as string | null,
			middleName: data.get('middle_name') as string | null,
			email: data.get('email') as string | null,
			phone: data.get('phone') as string | null,
			dateOfBirth: data.get('date_of_birth')
				? new Date(data.get('date_of_birth') as string).toISOString().split('T')[0]
				: null,
			churchId,
			content: JSON.parse(
				JSON.stringify({
					age: data.get('age') ? Number(data.get('age')) : null,
					educationHistory: data.get('education_history'),
					newChurch,
					ministry: data.get('ministry'),
					recommendation: data.get('recommendation'),
					responsibleMinister: data.get('responsible_minister'),
					photoUrl
				})
			)
		};

		await db.insert(formSubmissions).values({ ...formData, createdAt: now, updatedAt: now });

		const to = env.MAIL_INFO_USER ?? '';
		const subject = `${formData.firstName} ${formData.lastName} - Анкета Поступающего в Библейскую Школу`;
		const content = formData.content;
		const html = email_template({
			...formData,
			...content,
			church_name
		});
		await sendEmail(to, subject, html);

		return { success: true };
	}
};
