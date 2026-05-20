const sosService = require("../services/sosService");

const trigger = async (req, res, next) => {
	try {
		const { lat, lng } = req.body;
		const result = await sosService.trigger(req.user.id, req.user.name, {
			lat,
			lng,
		});
		res
			.status(201)
			.json({ message: "SOS triggered", sessionId: result.sessionId });
	} catch (err) {
		next(err);
	}
};

const getTrackInfo = async (req, res, next) => {
	try {
		const event = await sosService.getTrackInfo(req.params.sessionId);
		res.json({ event });
	} catch (err) {
		next(err);
	}
};

const resolve = async (req, res, next) => {
	try {
		await sosService.resolve(req.body.sessionId, req.user.id);
		res.json({ message: "SOS resolved" });
	} catch (err) {
		next(err);
	}
};

module.exports = { trigger, getTrackInfo, resolve };
