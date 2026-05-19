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

module.exports = { findByEmail, findById, create };
