const { pool } = require("../config/db");

const findByEmail = async (email) => {
	const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
		email,
	]);
	return rows[0] || null;
};

const findById = async (id) => {
	const [rows] = await pool.query(
		"SELECT id, name, email, created_at FROM users WHERE id = ?",
		[id],
	);
	return rows[0] || null;
};

const create = async ({ name, email, password }) => {
	const [result] = await pool.query(
		"INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
		[name, email, password],
	);
	return { id: result.insertId, name, email };
};

const findByIdWithPassword = async (id) => {
	const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
	return rows[0] || null;
};

const updateById = async (id, { name, email }) => {
	await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
		name,
		email,
		id,
	]);
};

const updatePassword = async (id, hashedPassword) => {
	await pool.query("UPDATE users SET password = ? WHERE id = ?", [
		hashedPassword,
		id,
	]);
};

const deleteById = async (id) => {
	await pool.query("DELETE FROM users WHERE id = ?", [id]);
};

module.exports = {
	findByEmail,
	findById,
	findByIdWithPassword,
	create,
	updateById,
	updatePassword,
	deleteById,
};
