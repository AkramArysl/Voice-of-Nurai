const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");

const SALT_ROUNDS = 12;
const TOKEN_TTL_DAYS = 30;

const register = async ({ name, email, password }) => {
	const existing = await userModel.findByEmail(email);
	if (existing) {
		const err = new Error("Email already registered");
		err.status = 409;
		throw err;
	}

	const hashed = await bcrypt.hash(password, SALT_ROUNDS);
	const user = await userModel.create({ name, email, password: hashed });
	return user;
};

const login = async ({ email, password }) => {
	const user = await userModel.findByEmail(email);
	if (!user) {
		const err = new Error("Invalid email or password");
		err.status = 401;
		throw err;
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		const err = new Error("Invalid email or password");
		err.status = 401;
		throw err;
	}

	const token = nanoid(64);
	const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

	await tokenModel.create({ userId: user.id, token, expiresAt });

	return {
		token,
		expiresAt,
		user: { id: user.id, name: user.name, email: user.email },
	};
};

const logout = async (token) => {
	await tokenModel.deleteByToken(token);
};

module.exports = { register, login, logout };
