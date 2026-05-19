const reportService = require("../services/reportService");

const getAll = async (req, res, next) => {
	try {
		const reports = await reportService.getAll();
		res.json({ reports });
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const report = await reportService.create(req.user.id, req.body);
		res.status(201).json({ message: "Report created", report });
	} catch (err) {
		next(err);
	}
};

const remove = async (req, res, next) => {
	try {
		await reportService.remove(req.params.id, req.user.id);
		res.json({ message: "Report deleted" });
	} catch (err) {
		next(err);
	}
};

module.exports = { getAll, create, remove };
