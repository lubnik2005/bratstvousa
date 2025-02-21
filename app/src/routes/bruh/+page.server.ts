import { env } from "$env/dynamic/private";
import { sendEmail } from "$lib/email";



export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		console.log('formdata');
		console.log({ env });
    sendEmail('info@bratstvousa.com', 'application test', 'test');

		return { success: true };
	}
};
