const reportModel = require("../models/reportModel");

const getAll = async () => reportModel.findAll();

const create = async (userId, data) => reportModel.create({ userId, ...data });

const remove = async (reportId, userId) => {
	const deleted = await reportModel.deleteById(reportId, userId);
	if (!deleted) {
		const err = new Error("Report not found or not yours");
		err.status = 404;
		throw err;
	}
};

module.exports = { getAll, create, remove };
