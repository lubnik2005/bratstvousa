// src/lib/email.js
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import fs from 'fs';
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

// Load the refresh token from .env
let currentRefreshToken = env.GMAIL_REFRESH_TOKEN;
OAuth2Client.setCredentials({ refresh_token: currentRefreshToken });

/**
 * Refreshes the access token and updates the .env file if a new refresh token is obtained.
 */
async function getAccessToken() {
	try {
		const tokenResponse = await OAuth2Client.refreshAccessToken();
		const { access_token, refresh_token } = tokenResponse.credentials;

		// Save new refresh token if it exists
		if (refresh_token) {
			console.log('New refresh token obtained:', refresh_token);
			await saveNewRefreshToken(refresh_token);
			currentRefreshToken = refresh_token; // Update in memory
		}

		if (!access_token) {
			throw new Error('Failed to obtain access token');
		}
		return access_token;
	} catch (error) {
		console.error('Error refreshing access token:', error);
		throw new Error('Failed to refresh access token');
	}
}

/**
 * Saves the new refresh token to the .env file.
 * Replaces the old GMAIL_REFRESH_TOKEN value.
 */
async function saveNewRefreshToken(newToken) {
	try {
		// Read the current .env file
		const envFilePath = '.env';
		let envContent = fs.readFileSync(envFilePath, 'utf-8');

		// Replace the old refresh token with the new one
		const updatedEnvContent = envContent.replace(
			/^GMAIL_REFRESH_TOKEN=.*/m,
			`GMAIL_REFRESH_TOKEN=${newToken}`
		);

		// Write the updated content back to the .env file
		fs.writeFileSync(envFilePath, updatedEnvContent);
		console.log('New refresh token saved to .env file.');
	} catch (error) {
		console.error('Failed to save new refresh token:', error);
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
				refreshToken: currentRefreshToken,
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
			console.error('Token expired or revoked. Retrying with new token...');
			
			// Get a new access token and refresh token
			const newAccessToken = await getAccessToken();

			// Retry sending email with the new token
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: EMAIL_USER,
					clientId: CLIENT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken: currentRefreshToken, // Use updated token
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
