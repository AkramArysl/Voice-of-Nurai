const contactService = require("../services/contactService");

const getContacts = async (req, res, next) => {
	try {
		const contacts = await contactService.getContacts(req.user.id);
		res.json({ contacts });
	} catch (err) {
		next(err);
	}
};

const addContact = async (req, res, next) => {
	try {
		const contact = await contactService.addContact(req.user.id, req.body);
		res
			.status(201)
			.json({ message: "Contact added. Invite email sent.", contact });
	} catch (err) {
		next(err);
	}
};

const getInviteInfo = async (req, res, next) => {
	try {
		const info = await contactService.getInviteInfo(req.params.token);
		res.json(info);
	} catch (err) {
		next(err);
	}
};

const removeContact = async (req, res, next) => {
	try {
		await contactService.removeContact(req.params.id, req.user.id);
		res.json({ message: "Contact removed" });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getContacts,
	addContact,
	getInviteInfo,
	removeContact,
};
