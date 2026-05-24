const sendEmail = async ({ to, subject, html }) => {
	if (
		!process.env.GMAIL_CLIENT_ID ||
		!process.env.GMAIL_CLIENT_SECRET ||
		!process.env.GMAIL_REFRESH_TOKEN
	) {
		console.warn("Gmail OAuth2 не настроен, письмо не отправлено");
		return;
	}

	const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: process.env.GMAIL_CLIENT_ID,
			client_secret: process.env.GMAIL_CLIENT_SECRET,
			refresh_token: process.env.GMAIL_REFRESH_TOKEN,
			grant_type: "refresh_token",
		}),
	});

	const tokenData = await tokenRes.json();
	const accessToken = tokenData.access_token;

	if (!accessToken) {
		console.error("Не удалось получить access token:", tokenData);
		return;
	}

	const from = process.env.SMTP_USER;
	const encodedSubject =
		"=?UTF-8?B?" + Buffer.from(subject, "utf-8").toString("base64") + "?=";

	const messageParts = [
		`From: "Voice of Nurai" <${from}>`,
		`To: ${to}`,
		`Subject: ${encodedSubject}`,
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=utf-8",
		"Content-Transfer-Encoding: base64",
		"",
		Buffer.from(html, "utf-8").toString("base64"),
	];
	const rawMessage = messageParts.join("\r\n");
	const encodedMessage = Buffer.from(rawMessage, "utf-8")
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

	const sendRes = await fetch(
		"https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ raw: encodedMessage }),
		},
	);

	if (!sendRes.ok) {
		const err = await sendRes.json();
		console.error("Gmail API ошибка:", err);
	}
};

const sendTelegram = async (chatId, text) => {
	if (!process.env.TELEGRAM_BOT_TOKEN) {
		console.warn("TELEGRAM_BOT_TOKEN не задан, сообщение не отправлено");
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
	const locationStr =
		lat && lng ? `\nПоследние координаты: ${lat}, ${lng}` : "";

	const promises = contacts.map(async (contact) => {
		const emailHtml = `
      <h2>🚨 SOS сигнал от ${senderName}</h2>
      <p>${senderName} нажал(а) кнопку SOS и может нуждаться в помощи.</p>
      ${locationStr ? `<p>Последние координаты: ${lat}, ${lng}</p>` : ""}
      <p><a href="${trackUrl}">Следить за местоположением в реальном времени →</a></p>
    `;
		const telegramText = `🚨 <b>SOS сигнал</b>\n${senderName} нуждается в помощи!${locationStr}\n\n<a href="${trackUrl}">Следить за местоположением →</a>`;

		const tasks = [];

		if (contact.email) {
			tasks.push(
				sendEmail({
					to: contact.email,
					subject: `🚨 SOS от ${senderName}`,
					html: emailHtml,
				}),
			);
		}

		if (contact.telegram_chat_id && contact.invite_status === "accepted") {
			tasks.push(sendTelegram(contact.telegram_chat_id, telegramText));
		}

		await Promise.allSettled(tasks);
	});

	await Promise.allSettled(promises);
};

const sendResolvedAlerts = async ({ senderName, contacts }) => {
	const promises = contacts.map(async (contact) => {
		const emailHtml = `
      <h2>✅ ${senderName} в безопасности</h2>
      <p>${senderName} завершил(а) SOS сигнал и находится в безопасности.</p>
    `;
		const telegramText = `✅ <b>${senderName} в безопасности</b>\nSOS сигнал завершён.`;

		const tasks = [];

		if (contact.email) {
			tasks.push(
				sendEmail({
					to: contact.email,
					subject: `✅ ${senderName} в безопасности`,
					html: emailHtml,
				}),
			);
		}

		if (contact.telegram_chat_id && contact.invite_status === "accepted") {
			tasks.push(sendTelegram(contact.telegram_chat_id, telegramText));
		}

		await Promise.allSettled(tasks);
	});

	await Promise.allSettled(promises);
};

const sendInviteEmail = async ({ contact, inviteToken }) => {
	const botUsername = process.env.TELEGRAM_BOT_USERNAME;
	const inviteUrl = `https://t.me/${botUsername}?start=${inviteToken}`;

	await sendEmail({
		to: contact.email,
		subject: "Вас добавили как доверенное лицо",
		html: `
      <h2>Вы — доверенное лицо</h2>
      <p>${contact.name}, вас добавили как доверенное лицо в приложении безопасности Nurai.</p>
      <p>Нажмите на ссылку ниже, чтобы подключить Telegram и получать мгновенные уведомления, если человек нажмёт кнопку SOS:</p>
      <p><a href="${inviteUrl}">Подключить Telegram →</a></p>
      <p>Если вы не знаете, кто вас добавил, просто проигнорируйте это письмо.</p>
    `,
	});
};

module.exports = { sendSosAlerts, sendResolvedAlerts, sendInviteEmail };
