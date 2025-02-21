// src/lib/email.js
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { env } from '$env/dynamic/private';

// Load environment variables
const CLIENT_ID = env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = env.GMAIL_CLIENT_SECRET;
const EMAIL_USER = env.GMAIL_USER;
const EMAIL_NAME = env.GMAIL_NAME;

// OAuth2 Setup
const OAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	'https://developers.google.com/oauthplayground'
);

/**
 * Gets a new access token using the refresh token.
 */
async function getAccessToken() {
	try {
		// Get a new access token using the refresh token
		const tokenResponse = await OAuth2Client.getAccessToken();
		const accessToken = tokenResponse?.token;

		if (!accessToken) {
			throw new Error('Failed to obtain access token');
		}

		return accessToken;
	} catch (error) {
		console.error('Error getting access token:', error);
		throw new Error('Failed to get access token');
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
		// Get a new access token
		const accessToken = await getAccessToken();

		// Configure Nodemailer with OAuth2
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: EMAIL_USER,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
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
		console.error('Error sending email:', error);
		throw new Error('Email sending failed');
	}
}
