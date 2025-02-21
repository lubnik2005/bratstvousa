// src/lib/email.js
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { env } from '$env/dynamic/private';

// Load environment variables
const CLIENT_ID = env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = env.GMAIL_REFRESH_TOKEN;
const EMAIL_USER = env.GMAIL_USER;
const EMAIL_NAME = env.GMAIL_NAME;

console.log('Environment Variables:', process.env);

// OAuth2 Setup
const OAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	'https://developers.google.com/oauthplayground'
);
const SCOPE = 'https://www.googleapis.com/auth/gmail.send';


// Function to send email
export async function sendEmail(to, subject, text) {
	try {
		// Get access token
		OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    OAuth2Client.scopes = [SCOPE];

		const accessToken = await OAuth2Client.getAccessToken();

		// Configure Nodemailer with OAuth2
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: EMAIL_USER,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken.token
			}
		});

		const mailOptions = {
			from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
			to,
			subject,
			text,
			html: `<p>${text}</p>`
		};

		// Send email
		const result = await transporter.sendMail(mailOptions);
		console.log('Email sent:', result);
		return result;
	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Email sending failed');
	}
}
