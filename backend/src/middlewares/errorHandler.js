const errorHandler = (err, req, res, next) => {
	console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);

	if (err.code === "ER_DUP_ENTRY") {
		return res.status(409).json({ error: "Already exists" });
	}

	if (err.isJoi) {
		return res
			.status(400)
			.json({ error: "Validation error", details: err.message });
	}

	const status = err.status || 500;
	const message = err.message || "Internal server error";

	res.status(status).json({ error: message });
};

module.exports = errorHandler;
