const Joi = require("joi");

const createContactSchema = Joi.object({
	name: Joi.string().min(2).max(100).required(),
	surname: Joi.string().min(2).max(100).required(),
	email: Joi.string().email().required(),
});

module.exports = { createContactSchema };
