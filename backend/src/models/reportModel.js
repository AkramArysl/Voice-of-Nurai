const { pool } = require("../config/db");

const findAll = async () => {
	const [rows] = await pool.query(
		`SELECT r.id, r.title, r.description, r.lat, r.lng, r.address, r.created_at,
            u.name AS author_name
     FROM reports r
     JOIN users u ON u.id = r.user_id
     ORDER BY r.created_at DESC`,
	);
	return rows;
};

const findById = async (id) => {
	const [rows] = await pool.query("SELECT * FROM reports WHERE id = ?", [id]);
	return rows[0] || null;
};

const create = async ({ userId, title, description, lat, lng, address }) => {
	const [result] = await pool.query(
		"INSERT INTO reports (user_id, title, description, lat, lng, address) VALUES (?, ?, ?, ?, ?, ?)",
		[userId, title, description, lat, lng, address || null],
	);
	return { id: result.insertId, title, description, lat, lng, address };
};

const deleteById = async (id, userId) => {
	const [result] = await pool.query(
		"DELETE FROM reports WHERE id = ? AND user_id = ?",
		[id, userId],
	);
	return result.affectedRows > 0;
};

module.exports = {
	findAll,
	findById,
	create,
	deleteById,
};
