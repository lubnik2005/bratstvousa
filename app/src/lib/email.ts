// src/routes/api/send-email/+server.ts
import nodemailer from 'nodemailer';
import { getSecret } from './server/secrets';

// TODO: Cleanup this function
/**
 * Sends an email using Nodemailer with OAuth2 authentication.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 */
export async function sendEmail(to: string, subject: string, html) {
	// Configure Nodemailer with OAuth2
  const Secret = getSecret();
	const transporter = nodemailer.createTransport({
		host: Secret.smtp.host,
		port: Secret.smtp.port,
		secure: false,
		auth: {
			user: Secret.smtp.user,
			pass: Secret.smtp.password
		}
	});

	// const filePath = path.resolve('static/templates/email/bibleSchoolFormNotification.hbs');
	// const source = fs.readFileSync(filePath, 'utf8');
	// const html = template(formData);

	// Email details
	const mailOptions = {
		from: Secret.smtp.from, // Sender Name and Email
		to, // Recipient Email
		subject, // Email Subject
		// TODO: This needs to be actual text
		text: '', // Plain Text Body
		html
	};

	// Send the email
	return await transporter.sendMail(mailOptions);
}
