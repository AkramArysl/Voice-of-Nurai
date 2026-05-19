const Joi = require("joi");

const createReportSchema = Joi.object({
	title: Joi.string().min(3).max(255).required(),
	description: Joi.string().min(5).required(),
	lat: Joi.number().min(-90).max(90).required(),
	lng: Joi.number().min(-180).max(180).required(),
	address: Joi.string().max(255).optional().allow(""),
});

module.exports = { createReportSchema };