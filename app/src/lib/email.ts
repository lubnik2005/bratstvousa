// src/routes/api/send-email/+server.ts
import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { env } from '$env/dynamic/private';

// TODO: Cleanup this function
/**
 * Sends an email using Nodemailer with OAuth2 authentication.
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 */
export async function sendEmail(to: string, subject: string, html: string) {
	// Configure Nodemailer with OAuth2
	const transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: false,
		auth: {
			user: env.SMTP_USER,
			pass: env.SMTP_PASSWORD
		}
	});

	// Email details
	const mailOptions = {
		from: env.SMTP_FROM, // Sender Name and Email
		to, // Recipient Email
		subject, // Email Subject
		// TODO: This needs to be actual text
		text: '', // Plain Text Body
		html
	};

	// Send the email
	return await transporter.sendMail(mailOptions);
}
