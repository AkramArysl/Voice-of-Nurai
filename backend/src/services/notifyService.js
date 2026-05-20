const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const sendEmail = async ({ to, subject, html }) => {
	if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
		console.warn("SMTP not configured, skipping email");
		return;
	}
	await transporter.sendMail({
		from: process.env.SMTP_USER,
		to,
		subject,
		html,
	});
};

const sendTelegram = async (chatId, text) => {
	if (!process.env.TELEGRAM_BOT_TOKEN) {
		console.warn("Telegram not configured, skipping message");
		return;
	}
	const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
	await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
	});
};

const sendSosAlerts = async ({ senderName, contacts, lat, lng, trackUrl }) => {
	const locationStr = lat && lng ? `\nLast known location: ${lat}, ${lng}` : "";

	const promises = contacts.map(async (contact) => {
		const emailHtml = `
      <h2>🚨 SOS Alert from ${senderName}</h2>
      <p>${senderName} has triggered an SOS alert and may need help.</p>
      ${locationStr ? `<p>Last known location: ${lat}, ${lng}</p>` : ""}
      <p><a href="${trackUrl}">Track live location →</a></p>
    `;

		const telegramText = `🚨 <b>SOS Alert</b>\n${senderName} needs help!${locationStr}\n\n<a href="${trackUrl}">Track live location →</a>`;

		const tasks = [];

		if (contact.email) {
			tasks.push(
				sendEmail({
					to: contact.email,
					subject: `🚨 SOS from ${senderName}`,
					html: emailHtml,
				}),
			);
		}

		if (contact.telegram_chat_id) {
			tasks.push(sendTelegram(contact.telegram_chat_id, telegramText));
		}

		await Promise.allSettled(tasks);
	});

	await Promise.allSettled(promises);
};

const sendInviteEmail = async ({ contact, inviteToken }) => {
	const inviteUrl = `${process.env.CLIENT_URL}/join?token=${inviteToken}`;
	await sendEmail({
		to: contact.email,
		subject: "You have been added as an emergency contact",
		html: `
      <h2>You're someone's trusted contact</h2>
      <p>${contact.name}, you have been added as an emergency contact on Safety App.</p>
      <p>Click the link below to confirm and optionally connect your Telegram so you can receive instant alerts:</p>
      <p><a href="${inviteUrl}">Accept & connect Telegram →</a></p>
      <p>If you don't know who added you, you can ignore this email.</p>
    `,
	});
};

module.exports = { sendSosAlerts, sendInviteEmail };
