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

// OAuth2 Setup
const OAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	'https://developers.google.com/oauthplayground'
);

OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const SCOPE = 'https://www.googleapis.com/auth/gmail.send';

/**
 * Refreshes the access token and updates the OAuth2Client.
 */
async function getAccessToken() {
	try {
		const accessToken = await OAuth2Client.getAccessToken();
		if (!accessToken || !accessToken.token) {
			throw new Error('Failed to obtain access token');
		}
		return accessToken.token;
	} catch (error) {
		console.error('Error refreshing access token:', error);
		throw new Error('Failed to refresh access token');
	}
}

/**
 * Sends an email using Nodemailer with OAuth2 authentication.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 */
export async function sendEmail(to, subject, text) {
	try {
		// Get access token
		const accessToken = await getAccessToken();

		// Configure Nodemailer with OAuth2
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: EMAIL_USER,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken
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
		// Handle specific token errors
		if (error.response && error.response.data && error.response.data.error === 'invalid_grant') {
			console.error('Token expired or revoked. Retrying...');
			// Retry with a new token
			const newAccessToken = await getAccessToken();

			// Retry sending email with the new token
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: EMAIL_USER,
					clientId: CLIENT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken: REFRESH_TOKEN,
					accessToken: newAccessToken
				}
			});

			const mailOptions = {
				from: `"${EMAIL_NAME}" <${EMAIL_USER}>`,
				to,
				subject,
				text,
				html: `<p>${text}</p>`
			};

			const retryResult = await transporter.sendMail(mailOptions);
			console.log('Email sent on retry:', retryResult);
			return retryResult;
		}

		console.error('Error sending email:', error);
		throw new Error('Email sending failed');
	}
}
