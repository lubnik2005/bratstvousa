import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { churches, formSubmissions, FormSubmission } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { sendEmail } from '$lib/email';
import { email_template } from './email';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

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

		const churchId = data.get('church') !== 'other' ? Number(data.get('church')) : null;
		let church_name = null;
		if (churchId) {
			const cs = (await db.select().from(churches).where(eq(churches.id, churchId)).limit(1))[0];
			church_name = `${cs.id} - ${cs.name_line_1} ${cs.name_line_2 ?? ''}`;
		}
		const newChurch = data.get('church') === 'other' ? data.get('new_church') : null;
		church_name = church_name ?? newChurch;

		const formData = {
			formName: '2025-order-study-guides-form',
			firstName: data.get('first_name'),
			lastName: data.get('last_name'),
			middleName: data.get('middle_name'),
			email: data.get('email'),
			phone: data.get('phone'),
			church_name,
			churchId,
			content: JSON.parse(
				JSON.stringify({
					newChurch,
					books_no1: data.get('books_no1'),
					books_no2: data.get('books_no2'),
					books_no3: data.get('books_no3')
				})
			)
		};

		const form_submission = await db
			.insert(formSubmissions)
			.values({ ...formData, createdAt: new Date(), updatedAt: new Date() })
			.returning(); // Returns the inserted row (optional)
		const to = env.MAIL_INFO_USER;
		const subject = `${formData.firstName} ${formData.lastName} - Анкета Поступающего в Библейскую Школу`;
		const content = formData.content;
		const html = email_template({
			...formData,
			...content,
			church_name
		});
		const result = await sendEmail(to, subject, html);

		return { success: true };
	}
};
