const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const SALT_ROUNDS = 12;

const getProfile = async (userId) => {
	const user = await userModel.findById(userId);
	if (!user) {
		const err = new Error("User not found");
		err.status = 404;
		throw err;
	}
	return user;
};

const updateProfile = async (userId, { name, email }) => {
	const existing = await userModel.findByEmail(email);
	if (existing && existing.id !== userId) {
		const err = new Error("Email already in use");
		err.status = 409;
		throw err;
	}

	await userModel.updateById(userId, { name, email });
	return userModel.findById(userId);
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
	const user = await userModel.findByIdWithPassword(userId);
	if (!user) {
		const err = new Error("User not found");
		err.status = 404;
		throw err;
	}

	const match = await bcrypt.compare(currentPassword, user.password);
	if (!match) {
		const err = new Error("Current password is incorrect");
		err.status = 401;
		throw err;
	}

	const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
	await userModel.updatePassword(userId, hashed);
};

const deleteAccount = async (userId) => {
	await userModel.deleteById(userId);
};

module.exports = {
	getProfile,
	updateProfile,
	updatePassword,
	deleteAccount,
};
